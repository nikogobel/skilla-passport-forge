# Skilla - Enterprise Skill Passport Platform

Skilla is a comprehensive enterprise platform for creating, managing, and tracking professional skill assessments and digital skill passports.

## Features

- **User Authentication**: Email/password and OAuth (Google, Microsoft, LinkedIn) authentication
- **Skill Assessment**: Multi-step onboarding wizard with voice and text input capabilities
- **Skill Passport**: Digital passport displaying skills, proficiency levels, and decay timelines
- **Admin Dashboard**: Administrative interface for tracking team onboarding progress
- **Voice Recognition**: Web Speech API integration for hands-free responses
- **Responsive Design**: Mobile-first design supporting screens down to 375px width

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **State Management**: TanStack Query v5
- **Authentication**: Supabase Auth with RLS
- **Voice Input**: Web Speech API
- **Testing**: Vitest, Playwright

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skilla
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the provided SQL migrations in your Supabase dashboard
   - Update the environment variables

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   # Unit tests
   npm run test
   
   # E2E tests
   npm run test:e2e
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── ProtectedRoute.tsx
│   ├── SkillCard.tsx
│   └── VoiceTextInput.tsx
├── hooks/              # Custom React hooks
│   ├── use-auth.tsx
│   ├── use-voice-recognition.tsx
│   └── use-toast.ts
├── pages/              # Application pages
│   ├── Index.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Onboarding.tsx
│   ├── Passport.tsx
│   └── AdminOnboardingStatus.tsx
├── integrations/       # Third-party integrations
│   └── supabase/
└── lib/               # Utility functions
```

## Database Schema

### Tables

- **profiles**: User profile information
- **user_roles**: User role management (admin/user)
- **onboarding_questions**: Predefined assessment questions
- **onboarding_responses**: User responses to questions
- **skill_passports**: Generated skill passport data

### Key Features

- Row Level Security (RLS) policies for data protection
- Automatic user profile creation on signup
- Role-based access control for admin features
- Trigger-based timestamp management

## Routes

- `/` - Dashboard (protected)
- `/login` - User login
- `/signup` - User registration
- `/onboarding` - Skill assessment wizard (protected)
- `/passport` - Skill passport dashboard (protected)
- `/admin/onboarding-status` - Admin team tracking (protected, admin only)

## Edge Functions

### create-passport

Located at `supabase/functions/create-passport/index.ts`

This function processes onboarding responses and generates skill passport data. Currently contains placeholder logic for skill extraction and proficiency calculation.

**TODO**: Implement actual AI/ML-based skill analysis:
- Parse responses for skill mentions
- Calculate proficiency levels from experience descriptions
- Determine skill decay timelines
- Generate comprehensive skill profiles

## Testing

### E2E Test Coverage

The Playwright test suite covers the complete user journey:

1. User registration and login
2. Onboarding wizard completion
3. Skill passport generation and viewing
4. Admin dashboard functionality

Run tests with:
```bash
npx playwright test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.