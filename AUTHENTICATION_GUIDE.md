# Authentication Guide

## Overview
The KesaContainer ICT system now includes a complete authentication system with individual user sign-in and sign-up capabilities.

## Features

### User Registration (Sign Up)
- **Default Role**: All new users are automatically assigned the 'EMPLOYEE' role
- **Required Fields**: Name, Email, Password
- **Optional Fields**: Department, Section
- **Password Requirements**: Minimum 6 characters
- **Validation**: Email uniqueness, password confirmation

### User Authentication (Sign In)
- **Credentials**: Email and Password
- **Security**: Password hashing with bcrypt
- **Session Management**: User state maintained in React Context
- **Access Control**: Protected routes for authenticated users only

## Default Users (for testing)

After running the seed script, the following users are available with the password `password123`:

| Email | Role | Status | Department |
|-------|------|--------|------------|
| admin@example.com | ADMIN | ACTIVE | - |
| hod@example.com | HOD | ACTIVE | Technology |
| hos@example.com | HOS | ACTIVE | Technology |
| tech1@example.com | TECHNICIAN | ACTIVE | Technology |
| tech2@example.com | TECHNICIAN | SUSPENDED | Technology |
| employee1@example.com | EMPLOYEE | ACTIVE | Sales |

## How to Use

### 1. First Time Setup
1. Start the development server: `npm run dev`
2. Navigate to `/signup` to create your first account
3. You'll be automatically assigned the EMPLOYEE role
4. After successful registration, you'll be redirected to the dashboard

### 2. Sign In
1. Navigate to `/signin`
2. Enter your email and password
3. Upon successful authentication, you'll be redirected to the dashboard

### 3. Sign Out
1. Click on your avatar in the top-right corner
2. Select "Log out" from the dropdown menu
3. You'll be redirected to the sign-in page

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
- **Protected Routes**: All app routes require authentication
- **Role-Based Access**: Different user roles have different permissions
- **Session Management**: User state is maintained securely in React Context

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration

### User Management
- `GET /api/users` - List all users
- `GET /api/users/[id]` - Get specific user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## File Structure

```
src/
├── app/
│   ├── signin/page.tsx          # Sign in page
│   ├── signup/page.tsx          # Sign up page
│   └── api/auth/
│       ├── signin/route.ts      # Sign in API
│       └── signup/route.ts      # Sign up API
├── components/
│   └── auth/
│       └── protected-route.tsx  # Route protection component
├── context/
│   └── auth.tsx                 # Authentication context
└── lib/
    └── models/
        └── User.ts              # User model with password
```

## Troubleshooting

### Common Issues

1. **"User not found" error**
   - Ensure the user exists in the database
   - Check if the email is correct

2. **"Invalid password" error**
   - Verify the password is correct
   - For seeded users, use `password123`

3. **Authentication loop**
   - Clear browser cache and cookies
   - Check if the database connection is working

4. **Role assignment issues**
   - New signups automatically get EMPLOYEE role
   - Only admins can change user roles

### Development Notes

- The system uses MongoDB for user storage
- Passwords are hashed using bcryptjs
- Authentication state is managed in React Context
- All app routes are protected by default
- Users can switch between different seeded accounts for testing

## Future Enhancements

- JWT token-based authentication
- Password reset functionality
- Email verification
- Two-factor authentication
- Session timeout management
- Audit logging for authentication events
