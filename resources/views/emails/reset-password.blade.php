<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - MightyShare</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f3f4f6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            padding: 40px 20px;
            text-align: center;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
        }
        
        .logo-text {
            color: #ffffff;
            font-size: 32px;
            font-weight: 700;
            margin: 0;
        }
        
        .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin: 8px 0 0 0;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 20px 0;
        }
        
        .message {
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
            margin: 0 0 30px 0;
        }
        
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .reset-button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease;
        }
        
        .reset-button:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .info-box {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 16px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .info-box p {
            margin: 0;
            font-size: 14px;
            color: #1e40af;
        }
        
        .security-notice {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .security-notice p {
            margin: 0;
            font-size: 14px;
            color: #92400e;
        }
        
        .alternative-link {
            margin-top: 30px;
            padding: 20px;
            background-color: #f9fafb;
            border-radius: 8px;
        }
        
        .alternative-link p {
            margin: 0 0 10px 0;
            font-size: 13px;
            color: #6b7280;
        }
        
        .alternative-link a {
            color: #2563eb;
            word-break: break-all;
            font-size: 12px;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer p {
            margin: 8px 0;
            font-size: 14px;
            color: #6b7280;
        }
        
        .footer-links {
            margin: 20px 0;
        }
        
        .footer-links a {
            color: #2563eb;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
        }
        
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            
            .greeting {
                font-size: 20px;
            }
            
            .reset-button {
                padding: 14px 24px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                  <img
                  src="{{asset('images/logo.jpg')}}"
                  alt="MightyShare Logo"
                  className="h-12 w-12 rounded-full"
              />
            </div>
            <h1 class="logo-text">MightyShare</h1>
            <p class="tagline">Your Trusted Thrift Partner</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <h2 class="greeting">{{ $greeting ?? 'Hello!' }}</h2>
            
            <p class="message">
                You are receiving this email because we received a password reset request for your MightyShare account.
            </p>
            
            <!-- Reset Button -->
            <div class="button-container">
                <a href="{{ $actionUrl }}" class="reset-button">Reset Password</a>
            </div>
            
            <!-- Info Box -->
            <div class="info-box">
                <p><strong>⏱️ Time Sensitive:</strong> This password reset link will expire in {{ $expireTime ?? '60' }} minutes for your security.</p>
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
                <p><strong>🔒 Security Notice:</strong> If you did not request a password reset, no further action is required. Your account remains secure.</p>
            </div>
            
            <!-- Alternative Link -->
            <div class="alternative-link">
                <p>If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:</p>
                <a href="{{ $actionUrl }}">{{ $actionUrl }}</a>
            </div>
            
            <p class="message" style="margin-top: 30px;">
                Best regards,<br>
                <strong>The MightyShare Team</strong><br>
                <span style="color: #9ca3af; font-size: 14px;">Your Trusted Thrift Partner 💰</span>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p style="font-weight: 600; color: #111827;">MightyShare</p>
            <p>Secure. Reliable. Growing Together.</p>
            
            <div class="footer-links">
                <a href="{{ url('/') }}">Visit Website</a>
                <a href="{{ url('/login') }}">Login</a>
                <a href="{{ url('/register') }}">Sign Up</a>
            </div>
            
            <div style="margin: 20px 0; padding: 20px 0; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #9ca3af;">
                    This is an automated email. Please do not reply to this message.
                </p>
                <p style="font-size: 12px; color: #9ca3af;">
                    © {{ date('Y') }} MightyShare. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
