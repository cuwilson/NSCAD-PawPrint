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
| `security_policies.sql` | Planned script for recreating database permissions and Row Level Security policies. |
| `sample_user.sql` | Creates the Sample User owner profile and two fictional pets after the Supabase Auth account has been created |
| `auth_trigger.sql` | Automatically crates an owner profie when a new Supabase Auth user registers |

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

PawPrint originally used custom authentication with passwords stored in the `owners` table.

During AD371 Update #4, the login process was changed to use Supabase Auth.

- Supabase Auth manages account credentials and login sessions.
- The `owners.auth_user_id` column connects owner profiles to authenticated users.
- The existing numeric `owner_id` remains in use for relationships with pets.
- Row Level Security is being implemented to restrict access to an owner's own information.
- Database views are configured with `security_invoker = true` to respect underlying table permissions and RLS policies.

**Security migration is still in progress.** Registration, password recovery, remaining table policies, and legacy credential removal must be completed before the application is ready for public access.

## Rebuilding the Database

**Warning:** `creating_tables.sql` is intended to reset the PawPrint application tables. Running it against an existing database will permanently delete the affected application data.

For a new or intentionally reset Supabase project:

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run `creating_tables.sql` to create the tables and relationships.
4. Run `views.sql` to create the database views.
5. Apply the required grants and Row Level Security policies.
6. Create the demonstration account through Supabase Authentication.
7. Link the Auth account to an owner record and insert fictional sample data.
8. Configure the application's environment variables with the new Supabase project URL and publishable key.
9. Test login, owner-specific retrieval, appointments, and reminders.

The security policy script and updated sample data script are not yet complete, so these instructions are a recovery plan rather than a fully tested one-command restoration process.

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