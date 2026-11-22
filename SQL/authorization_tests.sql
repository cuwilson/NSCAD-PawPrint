
-- -----------------------------------------------------
-- PawPrint Cross-Account Authorization Tests
-- -----------------------------------------------------
-- Run through Supabase SQL Editor.
-- Replace the UUID and pet IDs with test values!!!!
--
-- Expected result: 0 for all three counts.
-- The simulated user must NOT own the selected pets.
-- -----------------------------------------------------

BEGIN;

-- Simulate an authenticated user.
SET LOCAL ROLE authenticated;

SELECT set_config(
    'request.jwt.claim.sub',
    'REPLACE_WITH_SECOND_TEST_USER_UUID',
    true
);

-- Attempt to access another owner's pets.
SELECT COUNT(*) AS visible_pets
FROM public.pets
WHERE pet_id IN (5, 6);

-- Attempt to access another owner's appointments.
SELECT COUNT(*) AS visible_appointments
FROM public.appointments
WHERE pet_id IN (5, 6);

-- Attempt to access another owner's reminders.
SELECT COUNT(*) AS visible_reminders
FROM public.reminders
WHERE pet_id IN (5, 6);

ROLLBACK;
