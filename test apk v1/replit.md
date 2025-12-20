# JEE B.Arch Mock Test Portal

## Overview
A comprehensive mock test platform for JEE B.Arch exam preparation with advanced security features including violation tracking, fullscreen enforcement, and anti-cheating measures.

**Current State**: Fully functional in development environment. Ready for production deployment.

## Recent Changes
- **2024-12-03**: Added student approval system and test state persistence
  - Students can sign up but require admin approval before accessing the portal
  - Admin panel shows pending students with approve/reject buttons
  - Login page shows appropriate message for pending accounts
  - Test state is automatically saved every 5 seconds during active tests
  - Test state persists through page refresh, browser close, and network disconnections
  - Resume modal shows when returning with an interrupted test
  - Students can choose to resume their test or start fresh

- **2024-12-01**: Major refactoring with React Router and component architecture
  - Added React Router with 6 routes: /login, /signup, /leaderboard, /test, /admin, /analytics
  - Split monolithic App.tsx (~1420 lines) into separate page components
  - Created AuthContext and TestContext for state management across routes
  - Added mobile-only question panel button (right side, md:hidden)
  - Enhanced screenshot blocker with black overlay and fullscreen recovery button
  - All routes verified working correctly

- **2024-12-01**: Initial project import and Replit environment setup
  - Moved project files from subdirectory to root
  - Configured Vite dev server for Replit (port 5000, host 0.0.0.0)
  - Fixed HTML parsing error in index.html (missing closing quote in title tag)
  - Set up development workflow
  - Configured deployment for production (autoscale with npm run preview)
  - Created .gitignore for Node.js project

## Project Architecture

### Technology Stack
- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

### Key Features
1. **Authentication System**
   - Admin and student roles
   - Email/password authentication
   - Role-based access control
   - Student approval workflow (admin must approve new signups)

2. **Test Management**
   - Multiple test categories (White, Blue, Grey, PYQ, Latest Pattern)
   - Dynamic question shuffling with option randomization
   - Timer-based test duration
   - Question navigation and review marking

3. **Security Features**
   - Fullscreen enforcement (auto-submit after 3 exits)
   - Screenshot prevention (PrintScreen, keyboard shortcuts)
   - Context menu blocking (right-click prevention)
   - Copy/paste prevention
   - DevTools access blocking
   - Tab switch detection and violation logging
   - Focus loss tracking

4. **Admin Panel**
   - Student account management (add/delete)
   - Pending student approval/rejection
   - Test creation and management
   - Test deletion capabilities

5. **Test State Persistence**
   - Auto-saves test progress every 5 seconds
   - Saves on page visibility change and before page unload
   - Resumes test with same questions, answers, and remaining time
   - Works across browser refreshes and network disconnections

### Database Schema
Located in: `supabase/migrations/20251128142138_001_create_initial_schema.sql`

Tables:
- `profiles` - User profiles with admin/student roles
- `tests` - Mock test definitions
- `questions` - Test questions with multiple choice options
- `test_attempts` - Student test attempt tracking
- `student_answers` - Individual question answers
- `violations` - Security violation logs

All tables use Row Level Security (RLS) for data protection.

### Project Structure
```
.
├── src/
│   ├── components/
│   │   ├── ScreenshotBlocker.tsx  # Screenshot prevention with black overlay
│   │   └── MobileQuestionPanel.tsx # Mobile question navigation panel
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication state management
│   │   └── TestContext.tsx        # Test state management
│   ├── lib/
│   │   ├── attempts.ts            # Test attempt management
│   │   ├── auth.ts                # Authentication logic
│   │   ├── supabase.ts            # Supabase client setup
│   │   ├── tests.ts               # Test data management
│   │   └── users.ts               # User management
│   ├── pages/
│   │   ├── Login.tsx              # Login page
│   │   ├── Signup.tsx             # Signup page
│   │   ├── Test.tsx               # Test taking interface
│   │   ├── Admin.tsx              # Admin panel
│   │   ├── Analytics.tsx          # Student analytics
│   │   └── Leaderboard.tsx        # Leaderboard display
│   ├── App.tsx                    # Main router component
│   ├── main.tsx                   # Application entry point
│   ├── types.ts                   # TypeScript type definitions
│   └── index.css                  # Global styles
├── supabase/
│   └── migrations/                # Database migration files
├── vite.config.ts                 # Vite configuration (Replit-optimized)
├── tailwind.config.js             # Tailwind CSS configuration
└── package.json                   # Dependencies and scripts
```

## Environment Variables Required

### Supabase Configuration
The application requires the following environment variables to connect to Supabase:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Setup Instructions**:
1. Create a Supabase project at https://supabase.com
2. Run the migration file located in `supabase/migrations/20251128142138_001_create_initial_schema.sql` in your Supabase SQL editor
3. Get your project URL and anon key from Supabase project settings (Settings > API)
   - Project URL: `https://your-project-ref.supabase.co`
   - Anon key: Found in "Project API keys" section
4. In Replit, add these as Secrets (Tools > Secrets):
   - Key: `VITE_SUPABASE_URL`, Value: your Supabase URL
   - Key: `VITE_SUPABASE_ANON_KEY`, Value: your Supabase anon key
5. Restart the development workflow after adding the secrets

**Without Supabase Setup**:
The app currently runs with in-memory storage for testing purposes. Test credentials:
- Admin: admin@jee.com / admin123
- Student: test@gmail.com / test123

**With Supabase Setup**:
Once environment variables are configured, the app will use the full database backend with proper data persistence and security.

## Development

### Available Scripts
- `npm run dev` - Start development server (0.0.0.0:5000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build (0.0.0.0:5000)
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check without emitting files

### Workflow Configuration
- **Workflow Name**: "Start application"
- **Command**: `npm run dev`
- **Port**: 5000 (webview)
- **Host**: 0.0.0.0 (configured for Replit proxy)

## Deployment

### Vercel Deployment (Recommended - Permanent)
The project is now fully configured for Vercel deployment with unlimited uptime.

**Quick Start:**
1. Push code to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
4. Deploy!

**See VERCEL_DEPLOYMENT.md for detailed instructions.**

### Replit Deployment (Limited to 7 days)
- **Target**: Autoscale (stateless web application)
- **Build Command**: `npm run build`
- **Run Command**: `npm run preview`
- **Port**: 5000

The application is configured for autoscale deployment, which is ideal for this stateless frontend application.

## Default Credentials

### For Testing (Local Development)
The application includes default accounts for testing:
- **Admin**: admin@jee.com / admin123
- **Student**: test@gmail.com / test123

**Note**: These are hardcoded credentials for development only. In production, use Supabase authentication.

## Notes

### Current Implementation
- The app currently uses in-memory state for accounts and tests (see App.tsx)
- Database integration code exists but requires Supabase environment variables to be activated
- Once Supabase is configured, the app can use the full database backend

### Replit-Specific Configuration
- Vite is configured to bind to 0.0.0.0:5000 for Replit's proxy system
- The preview command also uses port 5000 for consistency
- Note: HMR (Hot Module Replacement) websocket connections may show as "lost" in browser console due to Replit's proxy architecture, but this doesn't affect functionality - the app works correctly and page reloads will show updates

### Future Enhancements
- Migrate from in-memory storage to full Supabase integration
- Add result analytics and reporting
- Implement test scheduling
- Add bulk question import functionality
- Enhanced violation reporting dashboard
