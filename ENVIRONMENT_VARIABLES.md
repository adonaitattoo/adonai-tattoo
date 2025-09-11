# Environment Variables Setup

Create a `.env.local` file in the root directory (adonai-tattoo/) with these variables:

```bash
# Firebase Configuration (from Firebase Console → Project Settings → General)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Admin Authentication (the email address that will have admin access)
ADMIN_EMAIL=your_admin_email@domain.com

# Security (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your_super_secure_random_string_here

# URLs
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## How to get these values:

1. **Firebase Configuration**: Go to Firebase Console > Project Settings > General tab > Your apps section
2. **Firebase Admin SDK**: Go to Project Settings > Service accounts > Generate new private key
3. **ADMIN_EMAIL**: The email address that will have admin access
4. **NEXTAUTH_SECRET**: Generate a secure random string (you can use: `openssl rand -base64 32`)

## Security Notes:

- Never commit `.env.local` to version control
- Keep your Firebase private key secure
- Use a strong, random NEXTAUTH_SECRET
