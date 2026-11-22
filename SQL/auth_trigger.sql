
BEGIN;

-- Keep privileged helper functions outside the public API.
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private
FROM PUBLIC, anon, authenticated;

-- Create an owner profile when Supabase Auth creates a user.
CREATE OR REPLACE FUNCTION private.create_owner_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    new_first_name TEXT;
    new_last_name TEXT;
    new_phone TEXT;
BEGIN
    new_first_name :=
        btrim(NEW.raw_user_meta_data ->> 'first_name');

    new_last_name :=
        btrim(NEW.raw_user_meta_data ->> 'last_name');

    new_phone :=
        NULLIF(btrim(NEW.raw_user_meta_data ->> 'phone'), '');

    -- Check registration data before creating the profile.
    IF NEW.email IS NULL
       OR new_first_name IS NULL
       OR new_last_name IS NULL
       OR length(new_first_name) NOT BETWEEN 1 AND 100
       OR length(new_last_name) NOT BETWEEN 1 AND 100
       OR length(COALESCE(new_phone, '')) > 30
    THEN
        RAISE EXCEPTION 'Invalid owner registration details';
    END IF;

    INSERT INTO public.owners (
        auth_user_id,
        first_name,
        last_name,
        email,
        phone
    )
    VALUES (
        NEW.id,
        new_first_name,
        new_last_name,
        NEW.email,
        new_phone
    );

    RETURN NEW;
END;
$$;

-- Prevent direct API execution of the privileged function.
REVOKE ALL ON FUNCTION private.create_owner_profile()
FROM PUBLIC, anon, authenticated;

-- Remove the existing trigger before recreating it.
DROP TRIGGER IF EXISTS on_pawprint_user_created
ON auth.users;

-- Register the trigger.
CREATE TRIGGER on_pawprint_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION private.create_owner_profile();

COMMIT;
