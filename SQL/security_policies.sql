
-- -----------------------------------------------------
-- PawPrint Row Level Security
-- -----------------------------------------------------
-- Run after creating_tables.sql.
-- Database policies are based on Supabase Auth.
-- -----------------------------------------------------

BEGIN;

-- -----------------------------------------------------
-- Owners
-- -----------------------------------------------------

ALTER TABLE public.owners
ENABLE ROW LEVEL SECURITY;

-- Remove existing table-level permissions.
REVOKE ALL ON public.owners FROM anon, authenticated;

-- Allow authenticated users to read non-sensitive columns.
GRANT SELECT (
    owner_id,
    first_name,
    last_name,
    email,
    phone,
    auth_user_id
)
ON public.owners TO authenticated;

-- Recreate the policy if it already exists.
DROP POLICY IF EXISTS "Owners can view their own profile"
ON public.owners;

CREATE POLICY "Owners can view their own profile"
ON public.owners
FOR SELECT
TO authenticated
USING (
    auth_user_id = (SELECT auth.uid())
);

-- -----------------------------------------------------
-- Pets
-- -----------------------------------------------------

ALTER TABLE public.pets
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.pets FROM anon, authenticated;

GRANT SELECT ON public.pets TO authenticated;

DROP POLICY IF EXISTS "Owners can view their own pets"
ON public.pets;

CREATE POLICY "Owners can view their own pets"
ON public.pets
FOR SELECT
TO authenticated
USING (
    owner_id IN (
        SELECT owner_id
        FROM public.owners
        WHERE auth_user_id = (SELECT auth.uid())
    )
);


-- -----------------------------------------------------
-- Appointments
-- -----------------------------------------------------

ALTER TABLE public.appointments
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.appointments
FROM anon, authenticated;

GRANT SELECT, INSERT ON public.appointments
TO authenticated;

GRANT USAGE ON SEQUENCE public.appointments_appointment_id_seq
TO authenticated;

DROP POLICY IF EXISTS "Owners can view their pet appointments"
ON public.appointments;

CREATE POLICY "Owners can view their pet appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
    pet_id IN (SELECT pet_id FROM public.pets)
);

DROP POLICY IF EXISTS "Owners can create their pet appointments"
ON public.appointments;

CREATE POLICY "Owners can create their pet appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (
    pet_id IN (SELECT pet_id FROM public.pets)
);

-- -----------------------------------------------------
-- Reminders
-- -----------------------------------------------------

ALTER TABLE public.reminders
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.reminders
FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.reminders TO authenticated;

GRANT USAGE ON SEQUENCE public.reminders_reminder_id_seq
TO authenticated;

DROP POLICY IF EXISTS "Owners can view their pet reminders"
ON public.reminders;

CREATE POLICY "Owners can view their pet reminders"
ON public.reminders
FOR SELECT
TO authenticated
USING (
    pet_id IN (SELECT pet_id FROM public.pets)
);

DROP POLICY IF EXISTS "Owners can create their pet reminders"
ON public.reminders;

CREATE POLICY "Owners can create their pet reminders"
ON public.reminders
FOR INSERT
TO authenticated
WITH CHECK (
    pet_id IN (SELECT pet_id FROM public.pets)
);

DROP POLICY IF EXISTS "Owners can update their pet reminders"
ON public.reminders;

CREATE POLICY "Owners can update their pet reminders"
ON public.reminders
FOR UPDATE
TO authenticated
USING (
    pet_id IN (SELECT pet_id FROM public.pets)
)
WITH CHECK (
    pet_id IN (SELECT pet_id FROM public.pets)
);

DROP POLICY IF EXISTS "Owners can delete their pet reminders"
ON public.reminders;

CREATE POLICY "Owners can delete their pet reminders"
ON public.reminders
FOR DELETE
TO authenticated
USING (
    pet_id IN (SELECT pet_id FROM public.pets)
);

-- -----------------------------------------------------
-- Medical Records
-- -----------------------------------------------------

ALTER TABLE public.care_records
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.care_records
FROM anon, authenticated;

GRANT SELECT ON public.care_records
TO authenticated;

DROP POLICY IF EXISTS "Owners can view their pet medical records"
ON public.care_records;

CREATE POLICY "Owners can view their pet medical records"
ON public.care_records
FOR SELECT
TO authenticated
USING (
    pet_id IN (SELECT pet_id FROM public.pets)
);


-- -----------------------------------------------------
-- Food Logs
-- -----------------------------------------------------

ALTER TABLE public.food_logs
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.food_logs
FROM anon, authenticated;

GRANT SELECT ON public.food_logs
TO authenticated;

DROP POLICY IF EXISTS "Owners can view their pet food logs"
ON public.food_logs;

CREATE POLICY "Owners can view their pet food logs"
ON public.food_logs
FOR SELECT
TO authenticated
USING (
    pet_id IN (
        SELECT pet_id
        FROM public.pets
    )
);


-- -----------------------------------------------------
-- Shared Lookup Tables
-- -----------------------------------------------------
-- All authenticated users can read lookup values.
-- Editing lookup data is restricted.

-- Reminder Types
ALTER TABLE public.reminder_types
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.reminder_types
FROM anon, authenticated;

GRANT SELECT ON public.reminder_types
TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can view reminder types"
ON public.reminder_types;

CREATE POLICY "Authenticated users can view reminder types"
ON public.reminder_types
FOR SELECT
TO authenticated
USING (true);


-- Care Record Types
ALTER TABLE public.care_record_types
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.care_record_types
FROM anon, authenticated;

GRANT SELECT ON public.care_record_types
TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can view care record types"
ON public.care_record_types;

CREATE POLICY "Authenticated users can view care record types"
ON public.care_record_types
FOR SELECT
TO authenticated
USING (true);


-- Foods
ALTER TABLE public.foods
ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.foods
FROM anon, authenticated;

GRANT SELECT ON public.foods
TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can view foods"
ON public.foods;

CREATE POLICY "Authenticated users can view foods"
ON public.foods
FOR SELECT
TO authenticated
USING (true);

COMMIT;
