@extends('emails.layout')

@section('title', 'Top-up Successful')

@section('content')
    <span class="success-badge">✓ Payment Confirmed</span>

    <h1>Payment Received, {{ $user->name }}! 💳</h1>
    <p>Great news — your top-up has been processed and credited to your MightyShare account.</p>

    <div style="background: linear-gradient(135deg, #eff6ff, #f0fdf4); border-radius: 12px; padding: 20px 24px; margin: 24px 0; text-align: center;">
        <p style="margin:0 0 4px; font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Amount Credited</p>
        <p style="margin:0; font-size:32px; font-weight:800; color:#1e3a8a;">{{ number_format($transaction->amount, 2) }} <span style="font-size:18px; color:#6b7280;">NGN</span></p>
    </div>

    <table class="details-table">
        <tr>
            <th>Transaction ID</th>
            <td style="font-family:monospace; font-size:13px; color:#374151;">{{ $transaction->reference }}</td>
        </tr>
        <tr>
            <th>Amount Paid</th>
            <td><strong style="color:#059669;">{{ number_format($transaction->amount, 2) }} NGN</strong></td>
        </tr>
        <tr>
            <th>New Balance</th>
            <td><strong style="color:#1e3a8a;">{{ number_format($user->staticAccount->balance, 2) }} NGN</strong></td>
        </tr>
        <tr>
            <th>Date &amp; Time</th>
            <td>{{ $transaction->created_at->format('F j, Y \a\t g:i A') }}</td>
        </tr>
    </table>

    <div class="info-box">
        <p><strong>ℹ️ Note:</strong> Any pending registration fees will be automatically deducted from this balance and your account updated accordingly.</p>
    </div>

    <a href="{{ config('app.url') }}/dashboard" class="button">View Dashboard</a>

    <p style="margin-top:28px; color:#6b7280; font-size:14px;">
        Thank you for using MightyShare!<br>
        <strong style="color:#111827;">The MightyShare Team</strong>
    </p>
@endsection
