export interface QuestionTypeConfig {
  type: string;
  count: number;
  marks: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInfo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progressMsg: string;
  error?: string;
  fileName?: string;
  fileContent?: string;
  totalQuestions: number;
  totalMarks: number;
  createdAt: string;
  generatedPaper?: GeneratedPaper;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  marks: number;
}

export interface PaperSection {
  title: string;
  instruction: string;
  questions: Question[];
}

export interface AnswerItem {
  questionNumber: string;
  questionText: string;
  answerText: string;
}

export interface GeneratedPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  sections: PaperSection[];
  answerKey: AnswerItem[];
}

export interface JobState {
  id: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress: number;
  progressMsg: string;
  result?: any;
  error?: string;
}
