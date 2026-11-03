-- Supabase Auth users must be created separately.

-- Remove views before dropping their underlying tables.
DROP VIEW IF EXISTS current_pet_foods;
DROP VIEW IF EXISTS owner_dashboard_stats;
DROP VIEW IF EXISTS pet_medical_history;
DROP VIEW IF EXISTS owner_pet_summary;
DROP VIEW IF EXISTS upcoming_appointments;
DROP VIEW IF EXISTS upcoming_reminders;

DROP TABLE IF EXISTS food_logs;
DROP TABLE IF EXISTS reminders;
DROP TABLE IF EXISTS care_records;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS owners;

DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS reminder_types;
DROP TABLE IF EXISTS care_record_types;
DROP TABLE IF EXISTS security_questions;

-- -----------------------------------------------------
-- Table security_questions
-- -----------------------------------------------------
CREATE TABLE security_questions (
    security_question_id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL
);

-- -----------------------------------------------------
-- Table owners
-- -----------------------------------------------------

-- Owner profiles.
-- Passwords are managed separately by Supabase Auth.
CREATE TABLE owners (
    owner_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    auth_user_id UUID UNIQUE
        REFERENCES auth.users(id)
        ON DELETE SET NULL
);


-- -----------------------------------------------------
-- Table pets
-- -----------------------------------------------------
CREATE TABLE pets (
    pet_id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL,
    name TEXT NOT NULL,
    species TEXT CHECK (species IN ('Dog', 'Cat', 'Other')),
    breed TEXT,
    birth_date DATE CHECK (birth_date IS NULL OR birth_date <= CURRENT_DATE), -- allow null or must be in the past
    adoption_date DATE CHECK (adoption_date IS NULL OR adoption_date <= CURRENT_DATE), -- allow null or must be in the past
    weight NUMERIC CHECK (weight IS NULL or weight >= 0),
    photo_url TEXT,

    CONSTRAINT fk_owner
        FOREIGN KEY (owner_id)
        REFERENCES owners(owner_id)
        ON DELETE CASCADE --if an owner is deleted, their pets will also be deleted
);


-- -----------------------------------------------------
-- Table reminder_types
-- -----------------------------------------------------
CREATE TABLE reminder_types (
    reminder_type_id SERIAL PRIMARY KEY,
    type_name TEXT UNIQUE NOT NULL
);

-- -----------------------------------------------------
-- Table care_record_types
-- -----------------------------------------------------
CREATE TABLE care_record_types (
    care_record_type_id SERIAL PRIMARY KEY,
    type_name TEXT UNIQUE NOT NULL
);

-- -----------------------------------------------------
-- Table foods
-- -----------------------------------------------------
CREATE TABLE foods (
    food_id SERIAL PRIMARY KEY,
    food_brand TEXT NOT NULL,
    food_name TEXT NOT NULL,
    food_type TEXT,
    species TEXT CHECK (species IN ('Dog', 'Cat', 'Other')),
    UNIQUE (food_brand, food_name)
);

-- -----------------------------------------------------
-- Table care_records
-- -----------------------------------------------------
CREATE TABLE care_records (
    care_record_id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL,
    care_record_type_id INT NOT NULL,
    record_date DATE NOT NULL CHECK (record_date <= CURRENT_DATE),
    title TEXT,
    description TEXT,
    provider_name TEXT,
    next_due_date DATE CHECK (next_due_date IS NULL OR next_due_date >= record_date),

    CONSTRAINT fk_pet_care
        FOREIGN KEY (pet_id)
        REFERENCES pets(pet_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_care_record_type
        FOREIGN KEY (care_record_type_id)
        REFERENCES care_record_types(care_record_type_id)
);

-- -----------------------------------------------------
-- Table reminders
-- -----------------------------------------------------
CREATE TABLE reminders (
    reminder_id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL,
    reminder_title TEXT NOT NULL,
    reminder_type_id INT NOT NULL,
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,

    CONSTRAINT fk_pet_reminder
        FOREIGN KEY (pet_id)
        REFERENCES pets(pet_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reminder_type
        FOREIGN KEY (reminder_type_id)
        REFERENCES reminder_types(reminder_type_id)
);

-- -----------------------------------------------------
-- Table appointments
-- -----------------------------------------------------
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL,
    appointment_title TEXT NOT NULL,
    appointment_date TIMESTAMP NOT NULL CHECK (appointment_date > '2000-01-01'),
    provider_name TEXT,
    location TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Scheduled' NOT NULL
        CHECK (status IN ('Scheduled', 'Completed', 'Canceled')),

    CONSTRAINT fk_pet_appointment
        FOREIGN KEY (pet_id)
        REFERENCES pets(pet_id)
        ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table food_logs
-- -----------------------------------------------------
CREATE TABLE food_logs (
    food_log_id SERIAL PRIMARY KEY,
    pet_id INT NOT NULL,
    food_id INT NOT NULL,
    bag_size TEXT,
    start_date DATE NOT NULL,
    end_date DATE CHECK (end_date IS NULL OR end_date >= start_date),
    notes TEXT,

    CONSTRAINT fk_pet_food
        FOREIGN KEY (pet_id)
        REFERENCES pets(pet_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_food
        FOREIGN KEY (food_id)
        REFERENCES foods(food_id)
);