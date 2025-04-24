-- Create tables in the public schema if they don't exist
CREATE TABLE IF NOT EXISTS public.roles (
  id int4 DEFAULT nextval('claro_noire.user_types_id_seq'::regclass) NOT NULL,
  "name" varchar(50) NOT NULL,
  CONSTRAINT user_types_name_key UNIQUE (name),
  CONSTRAINT user_types_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.courses (
  id serial4 NOT NULL,
  "name" varchar(100) NOT NULL,
  description text NULL,
  created_by int4 NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  CONSTRAINT courses_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.modules (
  id serial4 NOT NULL,
  course_id int4 NOT NULL,
  title varchar(100) NOT NULL,
  description text NULL,
  "position" int4 NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  CONSTRAINT modules_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id serial4 NOT NULL,
  module_id int4 NOT NULL,
  title varchar(100) NOT NULL,
  "content" text NOT NULL,
  "position" int4 NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  CONSTRAINT lessons_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.assessments (
  id serial4 NOT NULL,
  module_id int4 NOT NULL,
  title varchar(100) NOT NULL,
  description text NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  CONSTRAINT assessments_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.questions (
  id serial4 NOT NULL,
  assessment_id int4 NOT NULL,
  question_text text NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  CONSTRAINT questions_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.choices (
  id serial4 NOT NULL,
  question_id int4 NOT NULL,
  choice_text text NOT NULL,
  is_correct bool NOT NULL,
  CONSTRAINT choices_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.user_groups (
  id serial4 NOT NULL,
  "name" varchar(50) NOT NULL,
  manager_id int4 NULL,
  CONSTRAINT user_groups_pk PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.users (
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

CREATE TABLE IF NOT EXISTS public.enrollments (
  id serial4 NOT NULL,
  user_id int4 NOT NULL,
  course_id int4 NOT NULL,
  enrolled_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
  CONSTRAINT enrollments_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.progress (
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

-- Insert sample data for courses
INSERT INTO public.courses (name, description, created_at)
VALUES 
  ('Understanding Anxiety', 'Learn about the different types of anxiety disorders, their symptoms, and effective coping strategies.', CURRENT_TIMESTAMP),
  ('Mindfulness Basics', 'Discover the fundamentals of mindfulness practice and how it can improve your mental wellbeing.', CURRENT_TIMESTAMP),
  ('Stress Management', 'Practical techniques and strategies to manage stress in your daily life and improve resilience.', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert sample data for modules
INSERT INTO public.modules (course_id, title, description, position, created_at)
VALUES 
  (1, 'Introduction to Anxiety', 'Understanding what anxiety is and how it affects us', 1, CURRENT_TIMESTAMP),
  (1, 'Types of Anxiety Disorders', 'Exploring different anxiety disorders and their symptoms', 2, CURRENT_TIMESTAMP),
  (1, 'Coping Strategies', 'Effective methods to manage anxiety', 3, CURRENT_TIMESTAMP),
  (2, 'What is Mindfulness?', 'Introduction to mindfulness concepts', 1, CURRENT_TIMESTAMP),
  (2, 'Mindfulness Practices', 'Daily practices to incorporate mindfulness', 2, CURRENT_TIMESTAMP),
  (3, 'Understanding Stress', 'The science behind stress and its effects', 1, CURRENT_TIMESTAMP),
  (3, 'Stress Reduction Techniques', 'Practical methods to reduce stress', 2, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert sample data for lessons
INSERT INTO public.lessons (module_id, title, content, position, created_at)
VALUES 
  (1, 'What is Anxiety?', 'Anxiety is a normal emotion that everyone experiences at times. Many people feel anxious, or nervous, when faced with a problem at work, before taking a test, or making an important decision...', 1, CURRENT_TIMESTAMP),
  (1, 'Physical Symptoms of Anxiety', 'Anxiety can cause various physical symptoms including increased heart rate, rapid breathing, restlessness, trouble concentrating, and difficulty falling asleep...', 2, CURRENT_TIMESTAMP),
  (2, 'Generalized Anxiety Disorder', 'Generalized Anxiety Disorder (GAD) is characterized by persistent and excessive worry about a variety of different things...', 1, CURRENT_TIMESTAMP),
  (4, 'Defining Mindfulness', 'Mindfulness is the basic human ability to be fully present, aware of where we are and what we're doing, and not overly reactive or overwhelmed by what's going on around us...', 1, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert default roles if they don't exist
INSERT INTO public.roles (name) VALUES ('admin'), ('instructor'), ('student')
ON CONFLICT DO NOTHING;
