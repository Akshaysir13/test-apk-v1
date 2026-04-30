import { supabase } from './supabase';

export async function createAttempt(testId: string, studentId: string) {
  const { data, error } = await supabase
    .from('test_attempts')
    .insert([
      {
        test_id: testId,
        student_id: studentId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function submitAttempt(attemptId: string, totalMarks: number, maxMarks: number) {
  const { error } = await supabase
    .from('test_attempts')
    .update({
      submitted_at: new Date().toISOString(),
      total_marks: totalMarks,
      max_marks: maxMarks,
    })
    .eq('id', attemptId);

  if (error) throw error;
}

export async function getAttempt(attemptId: string) {
  const { data, error } = await supabase
    .from('test_attempts')
    .select('*')
    .eq('id', attemptId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getStudentAttempts(studentId: string) {
  const { data, error } = await supabase
    .from('test_attempts')
    .select('*, tests(*)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveAnswer(
  attemptId: string,
  questionId: string,
  selectedOption: string | null,
  markedForReview: boolean = false
) {
  const { data: existing, error: fetchError } = await supabase
    .from('student_answers')
    .select('id')
    .eq('attempt_id', attemptId)
    .eq('question_id', questionId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { error } = await supabase
      .from('student_answers')
      .update({
        selected_option: selectedOption,
        marked_for_review: markedForReview,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('student_answers')
      .insert([
        {
          attempt_id: attemptId,
          question_id: questionId,
          selected_option: selectedOption,
          marked_for_review: markedForReview,
        },
      ]);

    if (error) throw error;
  }
}

export async function getAttemptAnswers(attemptId: string) {
  const { data, error } = await supabase
    .from('student_answers')
    .select('*')
    .eq('attempt_id', attemptId);

  if (error) throw error;
  return data;
}

export async function recordViolation(
  attemptId: string,
  violationType: string,
  message: string
) {
  const { error } = await supabase
    .from('violations')
    .insert([
      {
        attempt_id: attemptId,
        violation_type: violationType,
        violation_message: message,
      },
    ]);

  if (error) throw error;
}

export async function getAttemptViolations(attemptId: string) {
  const { data, error } = await supabase
    .from('violations')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('detected_at', { ascending: true });

  if (error) throw error;
  return data;
}
