# Setup Instructions

## Gmail App Password Configuration

To receive emails from the contact form, you need to set up a Gmail App Password:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** section
3. Enable **2-Step Verification** if not already enabled
4. Go to **App passwords**: https://myaccount.google.com/apppasswords
5. Select **Mail** as the app and **Other (Custom name)** as the device
6. Enter "Portfolio Contact Form" as the name
7. Click **Generate**
8. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

## Create .env File

Create a file named `.env` in the root directory with the following content:

```
EMAIL_USER=CodeWithMmaphuti@gmail.com
EMAIL_PASS=your_16_character_app_password_here
PORT=3000
```

Replace `your_16_character_app_password_here` with the app password you generated (remove spaces if any).

## Install and Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and go to: `http://localhost:3000`

The contact form will now send emails to CodeWithMmaphuti@gmail.com when submitted!

