@extends('emails.layout')

@section('title', 'Welcome to MightyShare')

@section('content')
    <span class="success-badge">✓ Registration Successful</span>

    <h1>Welcome aboard, {{ $user->name }}! 🎉</h1>
    <p>We're thrilled to have you join the MightyShare family — a smarter, community-powered way to grow your savings.</p>
    <p>Your account is ready. Below are your account details:</p>

    <table class="details-table">
        <tr>
            <th>Full Name</th>
            <td>{{ $user->name }}</td>
        </tr>
        <tr>
            <th>Email Address</th>
            <td>{{ $user->email }}</td>
        </tr>
        <tr>
            <th>Referral ID</th>
            <td><strong style="color:#1e3a8a; letter-spacing:1px;">{{ $user->referral_id }}</strong></td>
        </tr>
        <tr>
            <th>Registered On</th>
            <td>{{ $user->created_at->format('F j, Y') }}</td>
        </tr>
    </table>

    <div class="info-box">
        <p><strong>💡 Next Step:</strong> Top up your account to cover the one-time registration fee and unlock your thrift package benefits.</p>
    </div>

    <a href="{{ config('app.url') }}/login" class="button">Log In &amp; Get Started</a>

    <p style="margin-top:28px; color:#6b7280; font-size:14px;">
        Questions? Our support team is happy to help — just reply to this email.<br>
        <strong style="color:#111827;">The MightyShare Team</strong>
    </p>
@endsection
