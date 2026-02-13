<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    /**
     * Store a newly created contact message in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
        ]);

        try {
            $contact = Contact::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'message' => $validated['message'],
                'status' => 'new',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thank you for your message. We will get back to you soon.',
                'data' => $contact,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while submitting your message. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all contact messages (for admin dashboard).
     */
    public function index(): JsonResponse
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $contacts,
        ]);
    }

    /**
     * Get a specific contact message.
     */
    public function show(Contact $contact): JsonResponse
    {
        $contact->markAsRead();

        return response()->json([
            'success' => true,
            'data' => $contact,
        ]);
    }

    /**
     * Delete a contact message.
     */
    public function destroy(Contact $contact): JsonResponse
    {
        try {
            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contact message deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contact message.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
