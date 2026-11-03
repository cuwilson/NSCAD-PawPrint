
-- -----------------------------------------------------
-- PawPrint Sample User
-- -----------------------------------------------------
-- Prerequisites:
-- 1. Run creating_tables.sql.
-- 2. Run views.sql.
-- 3. Configure the required RLS policies.
-- 4. Create pawprint.demo@example.com in
--    Supabase Authentication > Users.
--
-- This script creates a fictional owner profile
-- and two pets: Biscuit and Mochi.
--
-- Passwords are managed by Supabase Auth.
-- This script does not create authentication users.
-- -----------------------------------------------------

BEGIN;

-- Create the owner profile linked to Supabase Auth.
INSERT INTO public.owners (
    first_name,
    last_name,
    email,
    phone,
    auth_user_id
)
SELECT
    'Sample',
    'User',
    email,
    NULL,
    id
FROM auth.users
WHERE email = 'pawprint.demo@example.com'
ON CONFLICT (email) DO NOTHING;

-- Create Biscuit.
INSERT INTO public.pets (
    owner_id,
    name,
    species,
    breed,
    birth_date,
    weight
)
SELECT
    owner_id,
    'Biscuit',
    'Dog',
    'Golden Retriever',
    DATE '2021-04-15',
    65
FROM public.owners
WHERE email = 'pawprint.demo@example.com'
  AND auth_user_id = (
      SELECT id
      FROM auth.users
      WHERE email = 'pawprint.demo@example.com'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM public.pets
      WHERE owner_id = public.owners.owner_id
        AND name = 'Biscuit'
  );

-- Create Mochi.
INSERT INTO public.pets (
    owner_id,
    name,
    species,
    breed,
    birth_date,
    weight
)
SELECT
    owner_id,
    'Mochi',
    'Cat',
    'Domestic Shorthair',
    DATE '2023-08-10',
    11
FROM public.owners
WHERE email = 'pawprint.demo@example.com'
  AND auth_user_id = (
      SELECT id
      FROM auth.users
      WHERE email = 'pawprint.demo@example.com'
  )
  AND NOT EXISTS (
      SELECT 1
      FROM public.pets
      WHERE owner_id = public.owners.owner_id
        AND name = 'Mochi'
  );

COMMIT;

-- Verify the sample account and pets.
SELECT
    owners.first_name,
    owners.last_name,
    owners.email,
    pets.pet_id,
    pets.name,
    pets.species,
    pets.breed
FROM public.owners AS owners
JOIN public.pets AS pets
    ON owners.owner_id = pets.owner_id
WHERE owners.email = 'pawprint.demo@example.com'
ORDER BY pets.name;
