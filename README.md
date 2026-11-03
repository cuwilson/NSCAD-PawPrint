# PawPrint
**Copper Wilson**

PawPrint is a pet care management application built with React Native, Expo, TypeScript, and Supabase.

The project originally began in AD351 App Design & Prototyping, where the focus was UI/UX design. It was expanded in AD350 Database Technology with a PostgreSQL database and Supabase integration. In AD371, the focus has shifted toward improving application architecture, separating database operations into services, deployment, and security.

## Project Overview

PawPrint helps pet owners organize information about their animals in one place.

The application includes owner accounts, pet profiles, appointments, reminders, and basic pet care records.

This is an ongoing academic project that uses fictional demonstration data.

## Current Features

### User Accounts
- Login through Supabase Authentication.
- Owner-specific dashboard.
- Owner profiles linked to Supabase Auth accounts.
- Sample User account for development and testing.

### Dashboard
- Personalized welcome banner.
- Display of the owner's pets.
- Upcoming appointments and reminders.
- Interactive appointment and reminder details panels.
- Loading and error feedback when retrieving dashboard information.

### Appointment Management
- Create appointments for individual pets.
- Save appointment information to Supabase.
- View appointment dates, times, providers, locations, notes, and status.

### Reminder Management
- Create reminders for individual pets.
- View reminder details.
- Mark reminders as complete.
- Delete reminders.

### Pet Management
- View pets associated with an owner.
- Display pet information on the dashboard.
- Pet-specific dashboard implementation.

Some pet management functionality is still under development.

## Architecture

PawPrint uses a React Native / Expo frontend connected to a PostgreSQL database hosted by Supabase.

Database operations are gradually being moved into service files to separate data access from the user interface.

Examples include:

- `petService.ts`
- `appointmentService.ts`
- `reminderService.ts`

This approach improves code organization, reduces repeated database queries, and makes functionality easier to maintain and test.

## Technologies

- React Native
- Expo Router
- TypeScript
- Supabase
- PostgreSQL
- Supabase Authentication
- Vercel (web deployment)
- GitHub

## Local Setup

### Requirements

- Node.js and npm
- A Supabase project
- The project's environment variables

### Installation

Clone the repository, then navigate to the Expo application:

```bash
cd pawprint-mobile
npm install
```

Create a `.env` file inside `pawprint-mobile`:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_publishable_key
```

Use the Supabase publishable key, not a service-role or secret key. Never put privileged database credentials in client-side environment variables.

Start the application:

```bash
npx expo start
```

## Database

The database uses PostgreSQL through Supabase.

SQL scripts are maintained in the [`SQL`](SQL/) directory, including table definitions, database views, and sample data.

See the [SQL README](SQL/README.md) for database structure, restoration instructions, and security documentation.

## Deployment

PawPrint has been deployed as a web application using Vercel.

The deployment is currently protected while authentication and database security are being improved.

The public application link will be added once the remaining security requirements are completed and tested.

## Security Improvements

AD371 Update #4 introduced several security changes:

- Migrated the login process to Supabase Authentication.
- Connected owner profiles to Supabase Auth user IDs.
- Enabled Row Level Security for owners, pets, appointments, reminders, and care records.
- Added owner-specific policies for supported database operations.
- Configured existing database views to use invoker permissions.
- Restricted access to legacy password and security-answer columns.
- Created a fictional Sample User for testing.

**Security work remains in progress.** The application is not yet ready for unrestricted public use.

Remaining work includes migrating account registration and password recovery, removing legacy credentials, securing the remaining database tables, and testing authorization between separate accounts.

## Future Development

Planned improvements include:

- Complete authentication and database security.
- Reusable input validation.
- Additional pet management features.
- Improved error handling and testing.
- Complete database recovery and sample-data scripts.
- Public demonstration deployment.

---

PawPrint is an ongoing academic project that continues to evolve as new architecture, database, and application development concepts are introduced.