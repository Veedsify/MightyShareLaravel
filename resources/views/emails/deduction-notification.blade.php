@extends('emails.layout')

@section('title', 'Registration Fee Deduction')

@section('content')
    <span style="display:inline-block; background:linear-gradient(135deg,#fff7ed,#fef3c7); color:#92400e; font-size:12px; font-weight:700; padding:4px 12px; border-radius:99px; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:12px;">Account Deduction</span>

    <h1>Fee Deduction Notice, {{ $user->name }}</h1>
    <p>This is to inform you that a registration fee has been deducted from your MightyShare balance as part of your account setup.</p>

    <div style="background: linear-gradient(135deg, #fff7ed, #fef9f0); border-radius: 12px; padding: 20px 24px; margin: 24px 0; text-align: center; border: 1px solid #fed7aa;">
        <p style="margin:0 0 4px; font-size:13px; color:#9a3412; text-transform:uppercase; letter-spacing:0.5px; font-weight:600;">Amount Deducted</p>
        <p style="margin:0; font-size:32px; font-weight:800; color:#c2410c;">{{ number_format($amount, 2) }} <span style="font-size:18px; color:#9a3412;">NGN</span></p>
    </div>

    <table class="details-table">
        <tr>
            <th>Type</th>
            <td>Registration Fee Deduction</td>
        </tr>
        <tr>
            <th>Amount Deducted</th>
            <td><strong style="color:#c2410c;">{{ number_format($amount, 2) }} NGN</strong></td>
        </tr>
        <tr>
            <th>Remaining Balance</th>
            <td><strong style="color:#1e3a8a;">{{ number_format($user->staticAccount->balance, 2) }} NGN</strong></td>
        </tr>
        <tr>
            <th>Description</th>
            <td>{{ $description }}</td>
        </tr>
        <tr>
            <th>Date &amp; Time</th>
            <td>{{ now()->format('F j, Y \a\t g:i A') }}</td>
        </tr>
    </table>

    <div class="warning-box">
        <p><strong>🔒 Why was I charged?</strong> This is a mandatory one-time setup fee for your thrift package and associated accounts. No further deductions of this type will occur.</p>
    </div>

    <p>If you believe this deduction was made in error, please contact our support team immediately.</p>

    <a href="{{ config('app.url') }}/dashboard" class="button">View Your Account</a>

    <p style="margin-top:28px; color:#6b7280; font-size:14px;">
        <strong style="color:#111827;">The MightyShare Team</strong>
    </p>
@endsection
