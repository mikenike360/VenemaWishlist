# Supabase Setup Instructions

## 1. Environment Variables

Create a `.env` file in the root directory with:

```
REACT_APP_SUPABASE_URL=https://txcrezgwwuoxqhanjnls.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Y3Jlemd3d3VveHFoYW5qbmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzY4MDEsImV4cCI6MjA3ODU1MjgwMX0.UsUJfTIE88E3fLaTLiAF39hNyFhcDbOuldKy_93lzRQ
```

## 2. Run Database Migration

1. Go to your Supabase Dashboard (https://supabase.com/dashboard)
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-migration.sql`
4. Click "Run" to execute the script
5. Verify tables were created: `profiles` and `user_approvals`

## 2b. Seed Initial Profiles (IMPORTANT!)

**You must do this before registering!**

1. In Supabase SQL Editor, create a new query
2. Copy and paste the contents of `seed-profiles.sql`
3. Click "Run" to execute the script
4. Verify profiles were created (should see 28 profiles)
5. Now you can register!

## 3. Verify Email/Password Authentication

1. Go to Authentication > Providers in Supabase Dashboard
2. Verify **Email** provider is enabled (should be enabled by default)
3. That's it! Email/password authentication is ready to use.

## 4. Register Admin Account

1. Start the app: `yarn start`
2. Go to `/register`
3. Register with email: `mikenike360@outlook.com`
4. Select any profile name from the dropdown
5. Set your password
6. After registration, manually approve yourself in Supabase (see ADMIN_SETUP.md)
7. Log in and access `/admin` dashboard

## 5. Test the Application

1. Register a new user account
2. As admin, approve the registration request in `/admin`
3. User can then claim their profile at `/claim`
4. User can edit their profile at `/profile`

## Notes

- Admin email is hardcoded as `mikenike360@outlook.com` in `src/contexts/AuthContext.tsx`
- To change admin, update the `ADMIN_EMAIL` constant in that file
- Profile images are stored in Supabase Storage bucket `profile-images`
- Users can only claim profiles after admin approval

