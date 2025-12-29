# Email Configuration Guide

To enable real email sending for Lab Reports, you need to configure the SMTP settings in your `.env` file.

## 1. Get SMTP Credentials

You can use any email provider (Gmail, Outlook, SendGrid, etc.).

### Option A: Using Gmail
1.  Go to your Google Account > Security.
2.  Enable "2-Step Verification".
3.  Go to "App Passwords" (search for it in the account search bar).
4.  Create a new App Password (select "Mail" and "Other (Custom name)").
5.  Copy the 16-character password.

**Settings:**
- Host: `smtp.gmail.com`
- Port: `587`
- User: `your-email@gmail.com`
- Pass: `your-16-char-app-password`
- Secure: `false`

### Option B: Using Ethereal (Fake Email for Testing)
1.  Go to [ethereal.email](https://ethereal.email).
2.  Click "Create Ethereal Account".
3.  Use the provided Host, Port, User, and Pass.

## 2. Update .env File

Open the `.env` file in your project root and add/update these lines:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=no-reply@labsystem.com
```

## 3. Restart Server

After updating `.env`, you MUST restart the server for changes to take effect:

1.  Stop the server (Ctrl+C).
2.  Run `npm run dev`.
