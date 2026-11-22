# PawPrint Database

This folder contains the SQL scripts used to create and manage PawPrint's PostgreSQL database hosted on Supabase.

The goal is to maintain the database structure and supporting scripts in GitHub so the application can be rebuilt if the Supabase project needs to be replaced.

## SQL Files

| File | Purpose |
|---|---|
| `creating_tables.sql` | Drops existing PawPrint tables and views, then recreates the application tables and relationships. |
| `views.sql` | Creates views used by the dashboards and other application features. |
| `insert_data.sql` | Contains original sample data from the database coursework. Requires updating for Supabase Auth before reuse. |
| `owner_queries.sql` | Example SQL queries for owner-related data. |
| `common_joins.sql` | Example queries demonstrating relationships between tables. |
| `security_policies.sql` | Configures database permissions and Row Level Security policies. |
| `sample_user.sql` | Creates the Sample User owner profile and two fictional pets after the Supabase Auth account has been created |
| `auth_trigger.sql` | Automatically crates an owner profie when a new Supabase Auth user registers |
| `authorization_tests_sql` | Tests whether one authenticated user can access another owner's records |

## Database Structure

PawPrint uses the following primary tables:

- `owners` — Owner profiles linked to Supabase Authentication.
- `pets` — Pet information associated with each owner.
- `appointments` — Scheduled pet appointments.
- `reminders` — Pet care reminders and completion status.
- `care_records` — Medical and care history.
- `food_logs` — Pet food history.

Supporting tables include `foods`, `reminder_types`, and `care_record_types`.

The database also uses several views to simplify retrieving dashboard information.

## Authentication and Security

PawPrint uses Supabase Authentication to manage user accounts and passwords. A PostgreSQL trigger automatically creates an owner profile when a new Auth user registers.

### Row Level Security

Row Level Security (RLS) restricts access to database records based on the authenticated user's identity.

The database uses the following permissions:

- **Owners:** Users can read their own profile.
- **Pets:** Users can read pets belonging to their account.
- **Appointments:** Users can view and create appointments for their pets.
- **Reminders:** Users can view, create, update, and delete reminders for their pets.
- **Medical records:** Users can read medical records belonging to their pets.
- **Food logs:** Users can read food logs belonging to their pets.
- **Lookup tables:** Authenticated users have read-only access to shared food and care categories.

Database views use `security_invoker = true` to respect the underlying table permissions and RLS policies.

The policies and permissions are documented in `security_policies.sql`.

### Authorization Testing

Cross-account authorization tests verify that users cannot retrieve records belonging to another owner.

The tests simulate a different authenticated user and attempt to access another account's pets, appointments, and reminders.

All three read-access tests returned zero records, confirming that the tested RLS policies restricted access appropriately.

The test queries are documented in `authorization_tests.sql`.

### Remaining Security Work

The security configuration is still being finalized. Remaining work includes testing unauthorized write operations, reviewing database permissions, removing legacy authentication fields, and testing the full password recovery process.

The Vercel deployment remains protected while this work is completed.

## Rebuilding the Database

**Warning:** `creating_tables.sql` is intended to reset the PawPrint application tables. Running it against an existing database will permanently delete the affected application data.

For a new or intentionally reset Supabase project:

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run `creating_tables.sql` to create the tables and relationships.
4. Run `views.sql` to create the database views.
5. Run `security_policies.sql` to configure database permissions and Row Level Security policies.
6. Run `auth_trigger.sql` to enable automatic owner profile creation during registration.
7. Create the demonstration account through Supabase Authentication.
8. Run `sample_user.sql` to link the Auth account to an owner record and insert fictional sample pets.
9. Configure the application's environment variables with the new Supabase project URL and publishable key.
10. Test login, owner-specific retrieval, appointments, and reminders.
11. Run `authorization_tests.sql` to verify that users cannot retrieve another owner's records.

**Note:** This is the intended recovery process. The full setup has not yet been tested against a fresh Supabase project, and additional security verification is still needed before public deployment.

## Sample User Setup

PawPrint includes a fictional Sample User account for testing and demonstrations. The account contains two pets:

| Pet | Species | Breed |
|---|---|---|
| Biscuit | Dog | Golden Retriever |
| Mochi | Cat | Domestic Shorthair |

### Setup Instructions

1. Open **Supabase → Authentication → Users**.
2. Select **Add User → Create New User**.
3. Create an account using `pawprint.demo@example.com`, or update the email in `sample_user.sql` if using a different address.
4. Set a unique password and confirm the account.
5. Open **Supabase → SQL Editor**.
6. Run `sample_user.sql` to create the PawPrint owner profile and both pets.
7. Verify that the resulting query returns Biscuit and Mochi.
8. Open PawPrint and log in using the Supabase Auth account.

### How It Works

The script retrieves the Auth user's UUID and stores it in `owners.auth_user_id`. The pets are then associated with the newly created owner's numeric `owner_id`.

The script can be run again without creating duplicate sample pets, although it does not update existing pet information.

### Requirements

- The PawPrint database tables must already exist.
- Required RLS policies and database permissions must be configured.
- The Sample User must already exist in Supabase Authentication.
- The database must use the updated schema without legacy password and security-answer requirements.

Passwords and authentication secrets are never stored in this script.

See [`sample_user.sql`](sample_user.sql) for the complete setup SQL.

## Future Improvements

- Complete RLS configuration for all applicable tables.
- Record database privileges and security policies in `security_policies.sql`.
- Replace legacy inserts in `insert_data.sql` with Auth-compatible sample data.
- Remove plaintext password and security-answer columns from the live database after completing migration.
- Test the entire database recovery process using a separate Supabase project.

This documentation will be updated as the application's architecture and security features evolve.