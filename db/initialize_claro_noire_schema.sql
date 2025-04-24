-- Create the claro_noire schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS claro_noire;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS claro_noire.assessments_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.choices_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.courses_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.enrollments_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.lessons_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.modules_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.progress_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.questions_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.user_groups_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.user_types_id_seq;
CREATE SEQUENCE IF NOT EXISTS claro_noire.users_id_seq;

-- Create roles table
CREATE TABLE IF NOT EXISTS claro_noire.roles (
	id int4 DEFAULT nextval('claro_noire.user_types_id_seq'::regclass) NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT user_types_name_key UNIQUE (name),
	CONSTRAINT user_types_pkey PRIMARY KEY (id)
);

-- Create courses table
CREATE TABLE IF NOT EXISTS claro_noire.courses (
	id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	created_by int4 NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT courses_pkey PRIMARY KEY (id)
);

-- Create modules table
CREATE TABLE IF NOT EXISTS claro_noire.modules (
	id serial4 NOT NULL,
	course_id int4 NOT NULL,
	title varchar(100) NOT NULL,
	description text NULL,
	"position" int4 NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT modules_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_course_id ON claro_noire.modules USING btree (course_id);

-- Create lessons table
CREATE TABLE IF NOT EXISTS claro_noire.lessons (
	id serial4 NOT NULL,
	module_id int4 NOT NULL,
	title varchar(100) NOT NULL,
	"content" text NOT NULL,
	"position" int4 NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT lessons_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_module_id_lessons ON claro_noire.lessons USING btree (module_id);

-- Create assessments table
CREATE TABLE IF NOT EXISTS claro_noire.assessments (
	id serial4 NOT NULL,
	module_id int4 NOT NULL,
	title varchar(100) NOT NULL,
	description text NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT assessments_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_module_id_assessments ON claro_noire.assessments USING btree (module_id);

-- Create questions table
CREATE TABLE IF NOT EXISTS claro_noire.questions (
	id serial4 NOT NULL,
	assessment_id int4 NOT NULL,
	question_text text NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT questions_pkey PRIMARY KEY (id)
);

-- Create choices table
CREATE TABLE IF NOT EXISTS claro_noire.choices (
	id serial4 NOT NULL,
	question_id int4 NOT NULL,
	choice_text text NOT NULL,
	is_correct bool NOT NULL,
	CONSTRAINT choices_pkey PRIMARY KEY (id)
);

-- Create user_groups table
CREATE TABLE IF NOT EXISTS claro_noire.user_groups (
	id serial4 NOT NULL,
	"name" varchar(50) NOT NULL,
	manager_id int4 NULL,
	CONSTRAINT user_groups_pk PRIMARY KEY (id)
);

-- Create users table
CREATE TABLE IF NOT EXISTS claro_noire.users (
	id serial4 NOT NULL,
	username varchar(50) NOT NULL,
	email varchar(100) NOT NULL,
	password_hash varchar(255) NOT NULL,
	role_id int4 NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	user_groups_id int4 NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_username_key UNIQUE (username)
);
CREATE INDEX IF NOT EXISTS idx_user_type_id ON claro_noire.users USING btree (role_id);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS claro_noire.enrollments (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	course_id int4 NOT NULL,
	enrolled_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT enrollments_pkey PRIMARY KEY (id)
);

-- Create progress table
CREATE TABLE IF NOT EXISTS claro_noire.progress (
	id serial4 NOT NULL,
	user_id int4 NOT NULL,
	module_id int4 NULL,
	lesson_id int4 NULL,
	assessment_id int4 NULL,
	is_completed bool DEFAULT false NULL,
	score numeric(5, 2) NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT progress_pkey PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS idx_assessment_id_progress ON claro_noire.progress USING btree (assessment_id);
CREATE INDEX IF NOT EXISTS idx_user_id_progress ON claro_noire.progress USING btree (user_id);

-- Add foreign key constraints
ALTER TABLE claro_noire.modules ADD CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES claro_noire.courses(id);
ALTER TABLE claro_noire.lessons ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES claro_noire.modules(id);
ALTER TABLE claro_noire.assessments ADD CONSTRAINT assessments_module_id_fkey FOREIGN KEY (module_id) REFERENCES claro_noire.modules(id);
ALTER TABLE claro_noire.questions ADD CONSTRAINT questions_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES claro_noire.assessments(id);
ALTER TABLE claro_noire.choices ADD CONSTRAINT choices_question_id_fkey FOREIGN KEY (question_id) REFERENCES claro_noire.questions(id);
ALTER TABLE claro_noire.users ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES claro_noire.roles(id);
ALTER TABLE claro_noire.users ADD CONSTRAINT users_user_groups_fk FOREIGN KEY (user_groups_id) REFERENCES claro_noire.user_groups(id);
ALTER TABLE claro_noire.user_groups ADD CONSTRAINT users_id_fkey FOREIGN KEY (manager_id) REFERENCES claro_noire.users(id);
ALTER TABLE claro_noire.enrollments ADD CONSTRAINT enrollments_user_id_fkey FOREIGN KEY (user_id) REFERENCES claro_noire.users(id);
ALTER TABLE claro_noire.enrollments ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES claro_noire.courses(id);
ALTER TABLE claro_noire.progress ADD CONSTRAINT progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES claro_noire.users(id);
ALTER TABLE claro_noire.progress ADD CONSTRAINT progress_module_id_fkey FOREIGN KEY (module_id) REFERENCES claro_noire.modules(id);
ALTER TABLE claro_noire.progress ADD CONSTRAINT progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES claro_noire.lessons(id);
ALTER TABLE claro_noire.progress ADD CONSTRAINT progress_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES claro_noire.assessments(id);
ALTER TABLE claro_noire.courses ADD CONSTRAINT courses_created_by_fkey FOREIGN KEY (created_by) REFERENCES claro_noire.users(id);

-- Insert default roles
INSERT INTO claro_noire.roles (name) VALUES ('admin'), ('instructor'), ('student')
ON CONFLICT DO NOTHING;
