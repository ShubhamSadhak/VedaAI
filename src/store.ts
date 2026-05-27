import { create } from 'zustand';
import { Assignment, QuestionTypeConfig, GeneratedPaper } from './types';

interface CreatorFormState {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  additionalInfo: string;
  questionTypes: QuestionTypeConfig[];
  fileName: string;
  fileContent: string;
}

interface AssessmentStore {
  // Navigation & Screens
  activeTab: 'home' | 'my-groups' | 'assignments' | 'toolkit' | 'library' | 'settings';
  activeAssignmentId: string | null; // For viewing a paper
  isCreating: boolean;
  
  // Data State
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  
  // Search & Filters
  searchTerm: string;
  filterSubject: string;

  // Create Wizard State
  form: CreatorFormState;
  isSaving: boolean;

  // WS Connection
  wsConnected: boolean;
  socket: WebSocket | null;
  jobProgress: {
    progress: number;
    msg: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
  } | null;

  // Actions
  setActiveTab: (tab: 'home' | 'my-groups' | 'assignments' | 'toolkit' | 'library' | 'settings') => void;
  setActiveAssignmentId: (id: string | null) => void;
  setIsCreating: (creating: boolean) => void;
  setSearchTerm: (term: string) => void;
  setFilterSubject: (subj: string) => void;
  prepopulateForm: (fields: { title: string; subject: string; className: string; additionalInfo?: string }) => void;
  
  // Form Mutations
  updateForm: (fields: Partial<CreatorFormState>) => void;
  addQuestionTypeRow: () => void;
  removeQuestionTypeRow: (index: number) => void;
  updateQuestionTypeRow: (index: number, fields: Partial<QuestionTypeConfig>) => void;
  resetForm: () => void;

  // API Requests
  fetchAssignments: () => Promise<void>;
  createAssignment: () => Promise<Assignment | null>;
  regenerateAssignment: (id: string) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;

  // Real-Time WebSockets Connect
  connectWS: (jobId: string) => void;
  disconnectWS: () => void;
}

const initialForm: CreatorFormState = {
  title: '',
  subject: 'Science',
  className: 'Class 5th',
  dueDate: '',
  additionalInfo: '',
  questionTypes: [
    { type: 'Multiple Choice Questions', count: 5, marks: 1 },
    { type: 'Short Questions', count: 3, marks: 2 }
  ],
  fileName: '',
  fileContent: ''
};

export const useAssessmentStore = create<AssessmentStore>((set, get) => ({
  activeTab: 'home',
  activeAssignmentId: null,
  isCreating: false,
  assignments: [],
  loading: false,
  error: null,
  searchTerm: '',
  filterSubject: 'All',
  
  form: initialForm,
  isSaving: false,
  wsConnected: false,
  socket: null,
  jobProgress: null,

  setActiveTab: (tab) => set({ activeTab: tab, isCreating: false, activeAssignmentId: null }),
  setActiveAssignmentId: (id) => set({ activeAssignmentId: id, isCreating: false }),
  setIsCreating: (creating) => {
    if (creating) {
      set({ isCreating: true, activeAssignmentId: null, jobProgress: null, form: { ...initialForm } });
    } else {
      set({ isCreating: false });
    }
  },
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterSubject: (subj) => set({ filterSubject: subj }),
  prepopulateForm: (fields) => set({
    isCreating: true,
    activeAssignmentId: null,
    jobProgress: null,
    form: { ...initialForm, ...fields }
  }),

  // Form Mutations
  updateForm: (fields) => set((state) => ({ form: { ...state.form, ...fields } })),
  
  addQuestionTypeRow: () => set((state) => ({
    form: {
      ...state.form,
      questionTypes: [
        ...state.form.questionTypes,
        { type: 'Short Questions', count: 3, marks: 2 }
      ]
    }
  })),

  removeQuestionTypeRow: (index) => set((state) => ({
    form: {
      ...state.form,
      questionTypes: state.form.questionTypes.filter((_, i) => i !== index)
    }
  })),

  updateQuestionTypeRow: (index, fields) => set((state) => {
    const types = [...state.form.questionTypes];
    types[index] = { ...types[index], ...fields };
    return {
      form: {
        ...state.form,
        questionTypes: types
      }
    };
  }),

  resetForm: () => set({ form: initialForm, jobProgress: null }),

  // API Methods
  fetchAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const resp = await fetch('/api/assignments');
      if (!resp.ok) throw new Error('Failed to load assignments');
      const data = await resp.json();
      set({ assignments: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  createAssignment: async () => {
    const { form } = get();
    set({ isSaving: true, error: null });
    try {
      const resp = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || 'Server rejected request');
      }

      const assignment: Assignment = await resp.json();
      set({ isSaving: false });
      
      // Refresh list
      get().fetchAssignments();
      
      // Immediately connect WebSocket and listen to job queue
      get().connectWS(assignment.id);

      return assignment;
    } catch (err: any) {
      set({ isSaving: false, error: err.message });
      return null;
    }
  },

  regenerateAssignment: async (id) => {
    set({ error: null });
    
    // Clear state or initialize progress
    set({
      jobProgress: {
        status: 'pending',
        progress: 0,
        msg: 'Connecting to worker and requesting Regeneration...'
      }
    });

    try {
      const resp = await fetch(`/api/assignments/${id}/regenerate`, {
        method: 'POST'
      });
      if (!resp.ok) throw new Error('Re-generation request failed.');
      
      // Hook up real-time status tracker
      get().connectWS(id);
    } catch (err: any) {
      set({
        jobProgress: {
          status: 'failed',
          progress: 0,
          msg: `Failed to trigger workspace: ${err.message}`
        }
      });
    }
  },

  deleteAssignment: async (id) => {
    try {
      const resp = await fetch(`/api/assignments/${id}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error('Failed to delete assignment');
      
      // Remove from lists
      set((state) => ({
        assignments: state.assignments.filter((a) => a.id !== id),
        activeAssignmentId: state.activeAssignmentId === id ? null : state.activeAssignmentId
      }));
    } catch (err: any) {
      console.error('Delete error:', err);
    }
  },

  // WebSockets Channel Coordinator
  connectWS: (jobId: string) => {
    // Clean up older socket
    get().disconnectWS();

    const isSecure = window.location.protocol === 'https:';
    const wsProto = isSecure ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${wsProto}//${host}/api/ws`;

    console.log(`Connecting to WebSocket progress dispatcher: ${wsUrl}`);
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WS connection established successfully');
      set({ wsConnected: true, socket });
      
      // Subscribe to this Job ID broadcasts
      socket.send(JSON.stringify({ type: 'subscribe', jobId }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WS message received on client:', data);
        
        if (data.jobId !== jobId) return;

        if (data.type === 'job:status' || data.type === 'job:progress') {
          set({
            jobProgress: {
              status: data.status,
              progress: data.progress !== undefined ? data.progress : (data.status === 'completed' ? 100 : 0),
              msg: data.progressMsg || 'Processing...'
            }
          });
          
          if (data.status === 'completed' || data.status === 'failed') {
            // Re-fetch listing records to sync statuses
            get().fetchAssignments();
          }
        } else if (data.type === 'job:completed') {
          set({
            jobProgress: {
              status: 'completed',
              progress: 100,
              msg: 'Curation complete!'
            }
          });
          get().fetchAssignments();
        }
      } catch (err) {
        console.error('Failed to parse socket stream packet:', err);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket connection error state logged:', err);
      set({ wsConnected: false });
    };

    socket.onclose = () => {
      console.log('WS connection closed');
      set({ wsConnected: false, socket: null });
    };
  },

  disconnectWS: () => {
    const { socket } = get();
    if (socket) {
      try {
        socket.close();
      } catch (e) {
        console.error('error closing WS:', e);
      }
      set({ socket: null, wsConnected: false });
    }
  }
}));
