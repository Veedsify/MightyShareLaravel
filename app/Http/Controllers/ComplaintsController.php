<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\ComplaintReply;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ComplaintsController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $complaints = $user->complaints()
            ->with(['replies' => fn($query) => $query->with('user')->orderBy('created_at', 'desc')])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($complaint) {
                return [
                    'id' => $complaint->id,
                    'ticketNo' => $complaint->ticket_number,
                    'subject' => $complaint->title,
                    'description' => $complaint->description,
                    'category' => ucfirst(str_replace('_', ' ', $complaint->category)),
                    'status' => str_replace('_', '-', $complaint->status),
                    'priority' => $complaint->priority,
                    'date' => $complaint->created_at->format('M d, Y'),
                    'replies' => $complaint->replies->map(fn($reply) => [
                        'id' => $reply->id,
                        'message' => $reply->message,
                        'type' => $reply->type,
                        'user' => $reply->user->name,
                        'date' => $reply->created_at->format('M d, Y g:i A'),
                    ]),
                ];
            });

        return Inertia::render('complaints/Complaints', [
            'complaints' => $complaints,
        ]);
    }

    public function store()
    {
        $data = request()->validate([
            'subject' => 'required|string|max:255',
            'category' => 'required|string|in:account,transaction,service,other',
            'description' => 'required|string',
        ]);

        $user = Auth::user();

        $complaint = $user->complaints()->create([
            'title' => $data['subject'],
            'category' => $data['category'],
            'description' => $data['description'],
            'status' => 'open',
            'priority' => 'normal',
            'ticket_number' => Complaint::generateTicketNumber(),
        ]);

        return back()->with('success', "Complaint #{$complaint->ticket_number} created successfully!");
    }

    public function addReply($complaintId)
    {
        $complaint = Auth::user()->complaints()->find($complaintId);

        if (!$complaint) {
            return back()->with('error', 'Complaint not found');
        }

        $data = request()->validate([
            'message' => 'required|string',
        ]);

        ComplaintReply::create([
            'complaint_id' => $complaint->id,
            'user_id' => Auth::id(),
            'message' => $data['message'],
            'type' => 'reply',
        ]);

        return back()->with('success', 'Reply added successfully!');
    }
}
