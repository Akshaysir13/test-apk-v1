# Project Documentation

## Overview

This is a React + TypeScript test platform for architecture entrance preparation.  
It supports multiple course flows and dashboards in one app:

- `foundation` (JEE B.Arch style)
- `rank_booster`
- `advance_2026`
- `nata_2026`
- `dheya` / `free_tests`

The same test engine (`/test`) is used across all courses, with course-specific behavior controlled by test metadata.

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase (`user_sessions`, `user_devices`, `test_results`)

Main providers:

- `AuthProvider` -> authentication, device lock, route decisions
- `TestProvider` -> test selection, timer, answer state, scoring, attempt history

---

## Run Locally

## 1) Install

```bash
npm install
```

## 2) Environment

Create `.env` (or set env values in your environment):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 3) Start dev server

```bash
npm run dev
```

## 4) Production build check

```bash
npm run build
```

---

## Application Routing

Defined in `src/App.tsx`:

- `/login`
- `/free-tests`
- `/dashboard/foundation`
- `/dashboard/rank-booster`
- `/dashboard/advance-2026`
- `/dashboard/nata-2026`
- `/dashboard/dheya`
- `/test`
- `/admin`

---

## Data Organization

## Tests

Test definitions live in `src/data/tests/`:

- `foundation-tests.ts`
- `foundation-topic-tests.ts`
- `full-tests-2025.ts`
- `rank-booster-tests.ts`
- `advance-2026-tests.ts`
- `nata-2026-tests.ts`
- `dheya-tests.ts`

All tests are combined in `src/contexts/TestContext.tsx`.

## Questions

Question banks live in `src/data/questions/`:

- Foundation/JEE sets
- NATA 2026 bank: `src/data/questions/nata-2026/bank.ts`

## Students

Student account lists live in `src/data/students/`:

- `foundation-students.ts`
- `rank-booster-students.ts`
- `advance-2026-students.ts`
- `nata-2026-students.ts`
- `dheya-students.ts`
- `multi-course-students.ts` (single source for dual/multi access)

---

## Current Access Model (Important)

`UserAccount` contains:

- `email`
- `password`
- `role`
- `approved`
- `courses: string[]`

Multi-course users should be added in:

- `src/data/students/multi-course-students.ts`

Example:

```ts
{
  email: 'student300@gmail.com',
  password: 'pass123',
  role: 'student',
  approved: true,
  courses: ['foundation', 'nata_2026'],
}
```

This is the recommended long-term method for "one login, multiple courses".

---

## Auth and Session Flow

Implemented in `src/contexts/AuthContext.tsx`.

Features:

- Course-aware login
- Supabase session restore (`user_sessions`)
- Device lock / anti sharing (`user_devices`)
- Paid course validation rules
- Route redirection based on enrolled courses

Current priority for student redirect:

1. `foundation`
2. `advance_2026`
3. `nata_2026`
4. `rank_booster`
5. fallback dashboard / free flow

This allows dual-access users (`foundation + nata_2026`) to land on foundation dashboard first.

---

## Test Engine Behavior

Implemented in:

- `src/contexts/TestContext.tsx`
- `src/pages/Test.tsx`

Core support:

- Shuffled options
- Answer/save/review states
- Full timer + NATA per-question timer
- Auto-save + resume
- Violation tracking (tab switch/fullscreen/screenshot shortcuts)
- Scoring with per-question marks

---

## JEE Rules Implemented

JEE-style tests include Foundation, Rank Booster, Full Tests 2025, Topic tests, and most PYQ sets.

## Standard Section Pattern (B.Arch style)

Common section structure used by many full mocks:

- Aptitude: 50 questions
- Mathematics MCQ: 20 questions
- Mathematics Numeric: 5 questions
- Drawing: 2 questions

Some curated tests may have fewer sections depending on source set.

## Marking Scheme

Default scoring logic in the engine:

- MCQ: `+4` correct, `-1` incorrect
- Numeric: `+4` correct, `0` incorrect (no negative)
- Drawing/manual: no auto score; evaluated separately (default max can be from `marks`)

Per-question custom marks are supported through:

- `positiveMarks`
- `negativeMarks`
- `noNegative`
- `marks` (manual/drawing max)

## Navigation & Timing

- Standard JEE tests use total test timer (`duration`)
- Free navigation between questions is allowed (unless explicitly disabled for a test)
- `Mark for Review`, `Save & Next`, `Clear` are active in normal flow
- No per-question auto-advance for JEE tests

## Security & Attempt Rules

During test:

- Fullscreen checks
- Tab/window focus violation tracking
- Screenshot/print shortcut interception
- Auto-save and resume support

Implemented in:

- `src/contexts/TestContext.tsx`
- `src/pages/Test.tsx`

---

## NATA 2026 Rules Implemented

NATA tests use category `nata`.

## Full Mock Pattern

- 53 questions per mock:
  - 3 drawing (Part A)
  - 42 MCQ (B1)
  - 8 NCQ (B2)

## Timing and Navigation

- Part A and Part B in one flow for full mocks
- B section cannot start before Part A time rule
- Part B uses:
  - `perQuestionTimeSec: 108`
  - auto-advance
  - no revisit (`disableBackNavigation`)

## Aptitude-only Mocks

- Built by slicing same full block and skipping first 3 drawing questions
- 50 questions (`42 + 8`)
- 90 min total with 108 sec/question flow

Defined in `src/data/tests/nata-2026-tests.ts`.

---

## Dheya Integration

`src/data/tests/dheya-tests.ts` includes:

- NATA sample mini test
- NATA aptitude-only free test
- NATA full mock free test
- JEE PYQ free tests

For NATA in Dheya:

- Keep `course: 'dheya'`
- Keep `category: 'nata'`

This lets free users open NATA-style tests without paid course enrollment.

---

## Image Handling (NATA + JEE)

Question image rendering is through `ZoomableImage` in `src/components/ZoomableImage.tsx`.

For Google Drive links, fallback URL variants are auto-tried:

- `drive.google.com/thumbnail?...`
- `drive.google.com/uc?export=view&id=...`
- `drive.google.com/uc?id=...`
- `drive.usercontent.google.com/uc?...`
- `lh3.googleusercontent.com/d/...`

If all fail, UI shows `Image unavailable`.

Important:

- If Drive file is private/restricted, image still cannot load.
- Fix by changing file/folder sharing to:
  - `Anyone with the link` -> `Viewer`

---

## Where to Add New Tests

## Add new NATA mocks

Edit:

- `src/data/questions/nata-2026/bank.ts`
- `src/data/tests/nata-2026-tests.ts`

Keep bank order strict (`3 + 42 + 8` per full mock block).

## Add new JEE/Foundation tests

Edit relevant file in:

- `src/data/tests/`

Use simple range slicing style:

```ts
questions: someQuestionBank.slice(start, end)
```

---

## Where to Add New Students

## Single course access

Add to the course-specific student file.

## Multi-course access (recommended)

Add to:

- `src/data/students/multi-course-students.ts`

Set `courses` with all allowed course ids.

---

## Course IDs Reference

Use these exact strings:

- `foundation`
- `rank_booster`
- `advance_2026`
- `nata_2026`
- `dheya`
- `free_tests` (temporary/free-login flow)

---

## Troubleshooting

## User sees only one course tests

- Check `courses` array in user record
- Check route priority in `AuthContext.tsx`
- Re-login after changes (old session may persist)

## NATA images not visible

- Confirm Drive link accessibility in browser incognito
- Change share permission to `Anyone with link`
- Normalize link to `uc?export=view&id=...`

## Student login not found

- Verify exact email/password match in student list
- Ensure no hidden spaces in credentials

## Old state causing weird behavior

- Logout/login again
- Clear local storage for the site if needed

---

## Suggested Maintenance Practices

- Keep one canonical student record per login in `multi-course-students.ts` for dual access
- Keep test banks append-only whenever possible
- Re-run `npm run build` after data changes
- Validate 1 test manually from each major course after large edits

---

## Quick File Map

- Auth logic: `src/contexts/AuthContext.tsx`
- Test engine: `src/contexts/TestContext.tsx`
- Test page UI: `src/pages/Test.tsx`
- Foundation dashboard: `src/pages/Dashboard.tsx`
- NATA dashboard: `src/pages/NataDashboard2026.tsx`
- NATA tests: `src/data/tests/nata-2026-tests.ts`
- Dheya tests: `src/data/tests/dheya-tests.ts`
- NATA question bank: `src/data/questions/nata-2026/bank.ts`
- Multi-course students: `src/data/students/multi-course-students.ts`

---

## Notes

This file is meant to be the operational guide for adding tests, fixing access, and handling course expansion without breaking existing student flows.
