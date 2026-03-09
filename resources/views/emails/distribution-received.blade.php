@extends('emails.layout')

@section('title', 'Monthly Share Received')

@section('content')
    <span class="success-badge">✓ Distribution Processed</span>

    <h1>Your Monthly Share is Here, {{ $user->name }}! 🎊</h1>
    <p>Great news! Your monthly distribution for <strong>{{ $month }}</strong> has been successfully processed and credited to your accounts.</p>

    <div style="background: linear-gradient(135deg, #1e3a8a, #111827); border-radius: 14px; padding: 24px; margin: 24px 0; text-align: center; position: relative; overflow: hidden;">
        <div style="position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:rgba(34,211,238,0.15);border-radius:50%;"></div>
        <div style="position:absolute;bottom:-20px;left:-20px;width:60px;height:60px;background:rgba(244,114,182,0.15);border-radius:50%;"></div>
        <p style="margin:0 0 4px; font-size:13px; color:#bfdbfe; text-transform:uppercase; letter-spacing:0.5px; font-weight:600; position:relative; z-index:1;">Total Distributed</p>
        <p style="margin:0 0 4px; font-size:36px; font-weight:800; color:#ffffff; position:relative; z-index:1;">{{ number_format($totalDistributed, 2) }} <span style="font-size:18px; color:#93c5fd;">NGN</span></p>
        <p style="margin:0; font-size:13px; color:#22d3ee; font-weight:600; position:relative; z-index:1;">{{ $month }}</p>
    </div>

    <table class="details-table">
        <tr>
            <th>Package</th>
            <td><strong style="color:#1e3a8a;">{{ $package->name }}</strong></td>
        </tr>
        <tr>
            <th>Total Distributed</th>
            <td><strong style="color:#059669;">{{ number_format($totalDistributed, 2) }} NGN</strong></td>
        </tr>
        <tr>
            <th>Accounts Funded</th>
            <td>{{ $accountsProcessed }}</td>
        </tr>
        <tr>
            <th>Distribution Month</th>
            <td>{{ $month }}</td>
        </tr>
    </table>

    <div class="info-box">
        <p><strong>💰 Keep Growing:</strong> Your accounts have been updated. Stay consistent with your savings to maximise future distributions.</p>
    </div>

    <a href="{{ config('app.url') }}/dashboard" class="button">View Distribution Details</a>

    <p style="margin-top:28px; color:#6b7280; font-size:14px;">
        Thank you for being a valued member of MightyShare!<br>
        <strong style="color:#111827;">The MightyShare Team</strong>
    </p>
@endsection
