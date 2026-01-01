/*
  # JEE B.Arch Mock Test Portal - Initial Schema

  1. New Tables
    - `profiles` - User profiles extending auth.users
    - `tests` - Mock test definitions
    - `questions` - Test questions with multiple choice options
    - `test_attempts` - Track student test attempts
    - `student_answers` - Store individual question answers
    - `violations` - Track security violations during tests

  2. Security
    - Enable RLS on all tables
    - Admin-only access to test management
    - Students can only view their own data
    - Proper ownership checks

  3. Data Integrity
    - Foreign keys to maintain referential integrity
    - Timestamps for audit trails
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration integer NOT NULL DEFAULT 3600,
  total_questions integer NOT NULL DEFAULT 0,
  created_by uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tests visible to authenticated users"
  ON tests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can create tests"
  ON tests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admin creators can update tests"
  ON tests FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Only admin creators can delete tests"
  ON tests FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES tests ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'normal' CHECK (question_type IN ('normal', 'match-pair', 'statement')),
  image_url text,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_option text NOT NULL CHECK (correct_option IN ('a', 'b', 'c', 'd')),
  column_a_items jsonb,
  column_b_items jsonb,
  statement_1 text,
  statement_2 text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions visible to authenticated users"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only test creators can manage questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tests
      WHERE id = test_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Only test creators can update questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tests
      WHERE id = test_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Only test creators can delete questions"
  ON questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tests
      WHERE id = test_id AND created_by = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES tests ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  submitted_at timestamptz,
  total_marks integer,
  max_marks integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own attempts"
  ON test_attempts FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all attempts"
  ON test_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Students can create attempts"
  ON test_attempts FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE TABLE IF NOT EXISTS student_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES test_attempts ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions ON DELETE CASCADE,
  selected_option text,
  marked_for_review boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own answers"
  ON student_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM test_attempts
      WHERE id = attempt_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Students can create answers"
  ON student_answers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM test_attempts
      WHERE id = attempt_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own answers"
  ON student_answers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM test_attempts
      WHERE id = attempt_id AND student_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES test_attempts ON DELETE CASCADE,
  violation_type text NOT NULL,
  violation_message text,
  detected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own violations"
  ON violations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM test_attempts
      WHERE id = attempt_id AND student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all violations"
  ON violations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can create violations"
  ON violations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_tests_created_by ON tests(created_by);
CREATE INDEX idx_questions_test_id ON questions(test_id);
CREATE INDEX idx_test_attempts_student_id ON test_attempts(student_id);
CREATE INDEX idx_test_attempts_test_id ON test_attempts(test_id);
CREATE INDEX idx_student_answers_attempt_id ON student_answers(attempt_id);
CREATE INDEX idx_violations_attempt_id ON violations(attempt_id);
