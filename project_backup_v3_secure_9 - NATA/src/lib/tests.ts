import { supabase } from './supabase';
import { Test, Question } from '../types';

export async function createTest(
  name: string,
  description: string,
  duration: number,
  userId: string
) {
  const { data, error } = await supabase
    .from('tests')
    .insert([
      {
        name,
        description,
        duration: duration * 60,
        created_by: userId,
        total_questions: 0,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTests() {
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTestById(testId: string) {
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('id', testId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteTest(testId: string) {
  const { error } = await supabase
    .from('tests')
    .delete()
    .eq('id', testId);

  if (error) throw error;
}

export async function getTestQuestions(testId: string) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('test_id', testId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

export async function addQuestion(
  testId: string,
  question: Omit<Question, 'id'> & { orderIndex: number }
) {
  const { data, error } = await supabase
    .from('questions')
    .insert([
      {
        test_id: testId,
        question_text: question.question,
        question_type: question.type || 'normal',
        image_url: question.image,
        option_a: question.optionA,
        option_b: question.optionB,
        option_c: question.optionC,
        option_d: question.optionD,
        correct_option: question.correctOption,
        column_a_items: question.columnAItems,
        column_b_items: question.columnBItems,
        statement_1: question.statement1,
        statement_2: question.statement2,
        order_index: question.orderIndex,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateQuestion(questionId: string, updates: Partial<Question>) {
  const { error } = await supabase
    .from('questions')
    .update({
      question_text: updates.question,
      question_type: updates.type,
      image_url: updates.image,
      option_a: updates.optionA,
      option_b: updates.optionB,
      option_c: updates.optionC,
      option_d: updates.optionD,
      correct_option: updates.correctOption,
      column_a_items: updates.columnAItems,
      column_b_items: updates.columnBItems,
      statement_1: updates.statement1,
      statement_2: updates.statement2,
    })
    .eq('id', questionId);

  if (error) throw error;
}

export async function deleteQuestion(questionId: string) {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId);

  if (error) throw error;
}
