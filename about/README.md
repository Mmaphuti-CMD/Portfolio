# Backend Developer Portfolio - Contact Page

A professional contact page for a backend developer portfolio with email functionality using Nodemailer.

## Features

- Black background design with green accent colors
- Contact form with validation
- Email notifications sent to CodeWithMmaphuti@gmail.com
- Responsive design for all devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Step Verification if not already enabled
3. Go to "App passwords" (https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 3. Create .env File

Create a `.env` file in the root directory:

```env
EMAIL_USER=CodeWithMmaphuti@gmail.com
EMAIL_PASS=your_16_character_app_password_here
PORT=3000
```

### 4. Run the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

## Project Structure

```
.
├── contact.html          # Contact page HTML
├── css/
│   └── contact.css      # Styling for contact page
├── script/
│   └── contact.js       # Frontend form handling
├── server.js            # Express server with Nodemailer
├── package.json         # Dependencies
└── .env                 # Environment variables (not in git)
```

## API Endpoint

- **POST** `/api/contact` - Sends contact form data via email

## Notes

- Make sure to use a Gmail App Password, not your regular Gmail password
- The `.env` file should never be committed to version control
- All form submissions will be sent to CodeWithMmaphuti@gmail.com

