<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f5;
            padding: 20px;
        }

        .card {
            background: #ffffff;
            padding: 24px;
            border-radius: 8px;
            max-width: 400px;
            margin: 0 auto;
        }

        .code {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #2563eb;
            margin: 16px 0;
        }
    </style>
</head>

<body>
    <div class="card">
        <h2>PulseTask Verification</h2>
        <p>Your verification code to reset your password is:</p>
        <div class="code">{{ $otp }}</div>
        <p>If you did not request this, please ignore this email.</p>
    </div>
</body>

</html>
