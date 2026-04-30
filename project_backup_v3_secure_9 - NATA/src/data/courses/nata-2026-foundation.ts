export type CourseModule = {
  id: string;
  title: string;
  description?: string;
  items: { id: string; title: string; type: 'lecture' | 'worksheet' | 'practice' | 'test'; durationMin?: number }[];
};

export const nata2026FoundationCourse = {
  id: 'nata_2026_foundation',
  title: 'NATA 2026 Foundation Course',
  subtitle: 'Course dashboard + mock test templates (no questions)',
  modules: [
    {
      id: 'nata_pattern',
      title: 'NATA 2026 Pattern & Strategy',
      description: 'Understand marks, duration, sections, and how to attempt.',
      items: [
        { id: 'nata_overview', title: 'Exam overview: Part A (Offline) + Part B (Online)', type: 'lecture', durationMin: 20 },
        { id: 'nata_time', title: 'Time strategy: 90 + 90 minutes, 108 sec/question (Part B)', type: 'lecture', durationMin: 15 },
        { id: 'nata_checklist', title: 'Attempt checklist (before/during/after)', type: 'worksheet', durationMin: 10 },
      ],
    },
    {
      id: 'drawing_composition',
      title: 'Drawing & Composition (Part A)',
      description: 'Build fundamentals for A1/A2/A3 tasks.',
      items: [
        { id: 'a1_color', title: 'A1: Composition & color fundamentals', type: 'practice', durationMin: 60 },
        { id: 'a2_bw', title: 'A2: Sketching in B&W (tones, perspective)', type: 'practice', durationMin: 60 },
        { id: 'a3_3d', title: 'A3: 3D composition using kit pieces', type: 'practice', durationMin: 60 },
      ],
    },
    {
      id: 'cbt_adaptive',
      title: 'Computer Based Adaptive Test (Part B)',
      description: 'MCQ + numerical practice structure.',
      items: [
        { id: 'b1_mcq', title: 'B1: 42 MCQs (template practice)', type: 'practice', durationMin: 45 },
        { id: 'b2_ncq', title: 'B2: 8 NCQs (template practice)', type: 'practice', durationMin: 25 },
        { id: 'full_mock_template', title: 'Full mock template (pattern-only)', type: 'test', durationMin: 180 },
      ],
    },
  ] satisfies CourseModule[],
};

