# AUTH.md – Authentication System for Clinic IMS This document defines how users (admins and patients) authenticate,
manage sessions,
and recover access. The system supports **traditional password login** and **passwordless OTP login**,
with role‑based policies. --- ## 1. Overview | User Type | Default Method | MFA Required? | Passwordless Option? | |-----------|---------------|---------------|----------------------| | **Admin** | Password+MFA (TOTP) | Yes | No (must have password) | | **Patient** | OTP (email/SMS) or optional password | No (optional) | Yes (primary method) | - **Admins** always have a password and must enroll in MFA. - **Patients** can use OTP‑only or create a password for convenience. MFA is optional. --- ## 2. Authentication Methods ### 2.1 Password Login (All users) - **Flow**: User enters `username/email`+`password` → server verifies → returns session token. - **Rate limiting**: 5 failed attempts per minute,
then lock for 15 minutes. - **Password requirements** (admins only; patients optional if they set a password): - Minimum 8 characters - At least 1 uppercase,
1 lowercase,
1 number,
1 special character - No common passwords (check against breached list) - Expiry: Admin passwords expire every 90 days;

patient passwords never expire. ### 2.2 OTP Login (Patients only, or as second factor for admins) **Primary patient flow (passwordless):** 1. Patient enters **email address** (or phone number if SMS preferred). 2. System checks if a patient account exists with that email/phone. 3. Sends a **6‑digit numeric OTP** to the registered email and/or SMS (user chooses preference in profile). 4. Patient enters OTP. 5. Server validates OTP (expires after 10 minutes, single use). 6. Creates a session (same as password login). **For admins**: OTP is used only as a second factor (MFA),
not as a standalone login. #### OTP Security Rules | Rule | Value | |------|-------| | Length | 6 digits | | TTL (time to live) | 10 minutes | | Max attempts | 3 attempts per OTP,
then invalidate | | Resend cooldown | 60 seconds | | Max daily OTP requests per user | 10 (prevents abuse) | | Storage | Hashed (bcrypt) – never stored in plaintext | ### 2.3 Magic Link (Optional, future) Not implemented in v1. If added,
will be an alternative to OTP (one‑click login from email). Same security rules as OTP. --- ## 3. Session Management ### 3.1 Session Token - **Type**: Signed JWT (or HTTP‑only secure cookie – choose based on deployment). - **Payload**: ```json {
  "user_id": "uuid",
    "role": "admin" | "patient",
    "session_id": "uuid",
    "exp": 1234567890,
    "mfa_verified": true
}