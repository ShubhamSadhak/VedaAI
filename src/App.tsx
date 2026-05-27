import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import AssignmentsList from './components/AssignmentsList';
import AssignmentWizard from './components/AssignmentWizard';
import GeneratedPaperView from './components/GeneratedPaperView';
import { useAssessmentStore } from './store';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  Wand2, 
  GraduationCap, 
  CheckCircle, 
  BarChart2, 
  Star, 
  ShieldAlert, 
  Menu,
  ArrowLeft,
  ChevronDown,
  LayoutGrid,
  Bell,
  Plus,
  FileText
} from 'lucide-react';

export default function App() {
  const { 
    activeTab, 
    setActiveTab, 
    isCreating, 
    setIsCreating, 
    activeAssignmentId, 
    setActiveAssignmentId 
  } = useAssessmentStore();
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div 
      style={{ background: 'linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)' }}
      className="min-h-screen text-[#1a1a1a] flex font-sans leading-normal overflow-x-hidden p-0 md:p-1"
    >
      {/* Mobile Top Navigation bar: Capsule design floating on gray */}
      <div className="md:hidden flex items-center justify-between px-5 h-16 bg-white border border-[#e5e5e0]/60 rounded-2xl fixed top-3 left-3 right-3 z-30 no-print font-sans select-none shadow-sm">
        <div className="flex items-center gap-2.5">
          <div 
            style={{ background: 'linear-gradient(180deg, #E56820 0%, #D45E3E 100%)' }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-sm border border-[#ffedd5]/30"
          >
            V
          </div>
          <span className="font-sans font-extrabold text-[17px] tracking-tight text-[#1a1a1a]">
            VedaAI
          </span>
        </div>
        
        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Bell status */}
          <div className="relative">
            <button className="p-1 px-1.5 text-slate-500 hover:text-black">
              <Bell className="w-4 h-4" />
            </button>
            <span 
              style={{ backgroundColor: '#FF5623' }}
              className="absolute top-0.5 right-1 w-2 h-2 rounded-full"
            ></span>
          </div>

          <img
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
            alt="User Profile"
            className="w-7 h-7 rounded-full object-cover border border-[#e5e5e0]"
          />

          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="p-1.5 text-[#1a1a1a] hover:bg-[#f5f5f2] border border-[#e5e5e0] bg-[#fafaf7] rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Sidebar Container (hidden during printing) */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Background overlay when sidebar is open on mobile */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/45 z-35 md:hidden no-print transition-opacity" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area (Fitted inside the gray layout frame) */}
      <main className="flex-1 min-w-0 md:pl-76 p-4 md:p-6 pt-24 md:pt-6 pb-28 md:pb-6">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Top Bar Floating Bar Capsule - Desktop Perfect Clone */}
          <div className="hidden md:flex bg-white/95 backdrop-blur-sm border border-[#e5e5e0]/60 rounded-full px-6 py-2 shadow-sm items-center justify-between h-14 no-print select-none">
            {/* Left controller: Circle back arrow + grid icon */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (isCreating) {
                    setIsCreating(false);
                  } else if (activeAssignmentId) {
                    setActiveAssignmentId(null);
                  } else {
                    setActiveTab('home');
                  }
                }}
                className="p-1.5 text-[#1a1a1a] hover:bg-slate-100 rounded-full transition-colors cursor-pointer border border-[#e5e5e0]/40 flex items-center justify-center bg-white"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              {/* Divider */}
              <div className="h-5 w-[1.5px] bg-[#e5e5e0]" />

              <div className="flex items-center gap-2.5 text-[#1a1a1a] font-sans font-bold text-sm tracking-normal">
                <LayoutGrid className="w-4.5 h-4.5 text-slate-500" />
                <span>Assignment</span>
              </div>
            </div>

            {/* Right details: Bell + dropdown John Doe */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <button className="p-2 text-slate-500 hover:text-black rounded-full cursor-pointer transition-colors bg-[#fdfdfc] border border-[#e5e5e0]/30 hover:border-[#e5e5e0]/80">
                  <Bell className="w-[18px] h-[18px]" />
                </button>
                <span 
                  style={{ backgroundColor: '#FF5623' }}
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-white"
                ></span>
              </div>

              {/* John Doe Profile Pill */}
              <div className="flex items-center gap-2.5 bg-[#fbfbfa] hover:bg-[#efefe9] border border-[#e0e0da] pl-1.5 pr-4 py-1 rounded-full cursor-pointer transition-all select-none">
                <img
                  referrerPolicy="no-referrer"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop"
                  alt="John Doe"
                  className="w-7 h-7 rounded-full object-cover border border-[#e5e5e0]"
                />
                <span className="text-xs font-extrabold text-[#1a1a1a]">John Doe</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#71717a]" />
              </div>
            </div>
          </div>

          {/* Active Navigation Control Matrix */}
          <div className="relative">
            {isCreating ? (
              <AssignmentWizard />
            ) : activeAssignmentId ? (
              <GeneratedPaperView />
            ) : (
              <div className="pt-2">
                {/* Render by Menu Selection Tabs */}
                {activeTab === 'assignments' && <AssignmentsList />}

                {activeTab === 'home' && <HomeView />}

                {activeTab === 'my-groups' && <GroupsView />}

                {activeTab === 'toolkit' && <ToolkitView />}

                {activeTab === 'library' && <LibraryView />}

                {activeTab === 'settings' && <SettingsView />}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Floating action button on mobile bottom right */}
      <button
        onClick={() => {
          setIsCreating(true);
          setMobileSidebarOpen(false);
        }}
        className="md:hidden fixed bottom-24 right-5 z-25 w-12 h-12 bg-gradient-to-tr from-[#ea580c] to-[#f59e0b] shadow-lg rounded-full flex items-center justify-center text-white font-extrabold cursor-pointer active:scale-90 transition-all no-print"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>

      {/* Mobile Floating Dark Navigation Bar (Figma Exact Style) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-30 bg-[#121212] border border-stone-850/60 text-[#71717A] rounded-full py-3.5 px-4 shadow-xl flex items-center justify-around no-print mix-blend-normal">
        {[
          { id: 'home', label: 'Home', icon: LayoutGrid },
          { id: 'assignments', label: 'Assignments', icon: FileText },
          { id: 'library', label: 'Library', icon: BookOpen },
          { id: 'toolkit', label: 'AI Toolkit', icon: Wand2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = !isCreating && !activeAssignmentId && activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setIsCreating(false);
                setActiveAssignmentId(null);
                setActiveTab(tab.id as any);
              }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                isActive ? 'text-white font-extrabold scale-102' : 'hover:text-stone-200'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-white' : 'text-[#71717a]'}`} />
              <span className="text-[10px] tracking-wide select-none">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// 🌸 Home / Dashboard Tab Viewer
function HomeView() {
  const { fetchAssignments, assignments } = useAssessmentStore();
  const setIsCreating = useAssessmentStore(state => state.setIsCreating);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Banner Card */}
      <div className="bg-[#1a1a1a] text-[#fdfdfc] rounded-sm p-8 md:p-10 shadow-sm border border-[#2e2e2c] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 text-left max-w-2xl">
          <span className="bg-white/10 text-[#fdfdfc] text-[9px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest font-mono border border-white/20">
            Examiner Workspace • Live Syncing
          </span>
          <h1 className="text-3xl md:text-4xl font-sans font-bold tracking-tight">
            Welcome back, Dr. John Doe
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            AI assessment design parameters are synchronized. Synthesize curriculum-focused questions sections, digest textbook transcripts, and export authoritative CBSE exam leaflets instantly.
          </p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-[#fdfdfc] text-[#1a1a1a] hover:bg-slate-100 font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-sm border border-transparent shadow-sm transition-all duration-200 shrink-0 cursor-pointer active:scale-95"
        >
          Draft New Exam &rarr;
        </button>
      </div>

      {/* Editorial Grid Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-sm border border-[#e5e5e0] shadow-sm flex items-center gap-4">
          <div className="bg-[#f5f5f2] text-[#1a1a1a] p-3 rounded-sm border border-[#e5e5e0]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Classes Active</p>
            <p className="text-2xl font-bold font-sans text-[#1a1a1a] mt-0.5">6 Groups</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-[#e5e5e0] shadow-sm flex items-center gap-4">
          <div className="bg-[#f5f5f2] text-[#1a1a1a] p-3 rounded-sm border border-[#e5e5e0]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Papers Created</p>
            <p className="text-2xl font-bold font-sans text-[#1a1a1a] mt-0.5">{assignments.length} Drafts</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-[#e5e5e0] shadow-sm flex items-center gap-4">
          <div className="bg-[#f5f5f2] text-[#1a1a1a] p-3 rounded-sm border border-[#e5e5e0]">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">AI Accuracy</p>
            <p className="text-2xl font-bold font-sans text-[#1a1a1a] mt-0.5">99.8%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-[#e5e5e0] shadow-sm flex items-center gap-4">
          <div className="bg-[#f5f5f2] text-[#1a1a1a] p-3 rounded-sm border border-[#e5e5e0]">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Avg Score</p>
            <p className="text-2xl font-bold font-sans text-[#1a1a1a] mt-0.5">74.5%</p>
          </div>
        </div>
      </div>

      {/* Roster lists of active Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class divisions lists */}
        <div className="bg-white border border-[#e5e5e0] rounded-sm p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e5e5e0] pb-3 uppercase tracking-widest font-mono flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" /> Managed Classrooms
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Class 5th - Division A', count: '45 Students', perf: 'Excellent (78%)' },
              { name: 'Class 6th - General', count: '38 Students', perf: 'Moderate (69%)' },
              { name: 'Class 10th - Secondary Science', count: '42 Students', perf: 'Exemplary (84%)' },
              { name: 'Class 8th - Social Studies', count: '35 Students', perf: 'Steady (71%)' }
            ].map((cl, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 bg-[#fcfcf9] border border-[#e5e5e0] rounded-sm">
                <div>
                  <h4 className="text-xs font-bold text-[#1a1a1a]">{cl.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide font-mono">{cl.count}</p>
                </div>
                <span className="text-[9px] font-bold text-[#1a1a1a] font-mono bg-[#f5f5f2] border border-[#e5e5e0] px-2 py-0.5 rounded-sm">
                  {cl.perf}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI curation guide */}
        <div className="bg-white border border-[#e5e5e0] rounded-sm p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e5e5e0] pb-3 uppercase tracking-widest font-mono flex items-center gap-2">
            <Star className="w-4 h-4 text-slate-500" /> Assessment Guides
          </h3>
          <div className="space-y-4 font-normal text-xs text-slate-600 leading-relaxed">
            <div className="flex gap-3 p-3 bg-[#fcfcf9] border border-[#e5e5e0] rounded-sm">
              <span className="font-sans font-bold text-base text-[#1a1a1a] shrink-0 leading-none">01.</span>
              <p>For Math equations and calculation grids, assign the **Numerical Problems** row block. Gemini structures steps mapping with extreme typographic precision.</p>
            </div>
            <div className="flex gap-3 p-3 bg-[#fcfcf9] border border-[#e5e5e0] rounded-sm">
              <span className="font-sans font-bold text-base text-[#1a1a1a] shrink-0 leading-none">02.</span>
              <p>When loading textbook worksheets, use drag-and-drop. Contextual material gets parsed instantly to synthesize relevant syllabus chapters.</p>
            </div>
            <div className="flex gap-3 p-3 bg-[#fcfcf9] border border-[#e5e5e0] rounded-sm">
              <span className="font-sans font-bold text-base text-[#1a1a1a] shrink-0 leading-none">03.</span>
              <p>To print, click **Print / Export**. Activate "Background Graphics" in the printing configuration panel to render correct margins and school emblems.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🌸 School groups view
function GroupsView() {
  const prepopulateForm = useAssessmentStore(state => state.prepopulateForm);

  const groups = [
    { 
      code: 'SCI-5A', 
      name: 'Class 5th - A (Science)', 
      students: '45', 
      rate: '92% Submission Rate', 
      color: 'border-t-[#1a1a1a]', 
      subject: 'Science', 
      classVal: 'Class 5th',
      roster: ['Aditya Kumar', 'Bhavya Sharma', 'Chirag Singh', 'Divya Patel', 'Eshaan Dutt']
    },
    { 
      code: 'ENG-6B', 
      name: 'Class 6th - B (English)', 
      students: '38', 
      rate: '88% Submission Rate', 
      color: 'border-t-slate-450', 
      subject: 'English', 
      classVal: 'Class 6th',
      roster: ['Ishita Gupta', 'Kabir Mehta', 'Meera Rao', 'Nitin Sen', 'Pranav Mishra']
    },
    { 
      code: 'MAT-10S', 
      name: 'Class 10th - Secondary (Math)', 
      students: '42', 
      rate: '96% Submission Rate', 
      color: 'border-t-slate-700', 
      subject: 'Mathematics', 
      classVal: 'Class 10th',
      roster: ['Rohan Verma', 'Siddharth Jain', 'Tanvi Goel', 'Utkarsh Paul', 'Yash Chaturvedi']
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-sans font-bold text-[#1a1a1a] tracking-tight">
          My Groups
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-[#1a1a1a]/60 mt-1">
          Coordinate rosters and examination templates for assigned classes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((g, i) => (
          <div key={i} className={`bg-[#fdfdfc] border-t-4 ${g.color} border-x border-b border-[#e5e5e0] rounded-sm p-6 shadow-sm space-y-4 flex flex-col justify-between`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] bg-[#f5f5f2] border border-[#e5e5e0] text-slate-650 px-2.5 py-1 rounded-sm font-bold font-mono uppercase tracking-widest">{g.code}</span>
                <span className="text-[9px] text-green-700 font-bold uppercase tracking-wider font-mono">● Active</span>
              </div>
              <div>
                <h3 className="text-lg font-sans font-bold text-[#1a1a1a] mt-2">{g.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{g.students} registered students</p>
              </div>

              {/* Sample Roster List */}
              <div className="bg-[#fafaf7] border border-[#e5e5e0] p-3 rounded-sm space-y-1.5">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Sample Student Roster</p>
                <div className="text-[11px] text-slate-600 space-y-1">
                  {g.roster.map((student, sIdx) => (
                    <div key={sIdx} className="flex justify-between">
                      <span>{student}</span>
                      <span className="text-slate-400">ID: {(2400 + sIdx + i * 10).toString()}</span>
                    </div>
                  ))}
                  <div className="text-slate-400 italic text-[10px] pt-1">and {parseInt(g.students) - 5} others...</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#e5e5e0]">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span className="font-mono text-[10px] uppercase tracking-wider">Class Record</span>
                <span className="text-[#1a1a1a] font-mono font-bold text-[11px]">{g.rate}</span>
              </div>

              <button 
                onClick={() => {
                  prepopulateForm({
                    title: `${g.classVal} - Custom AI ${g.subject} Assessment`,
                    subject: g.subject,
                    className: g.classVal,
                    additionalInfo: `Construct high fidelity exam papers covering CBSE syllabus goals for ${g.name}.`
                  });
                }}
                className="w-full bg-[#1a1a1a] hover:bg-slate-800 text-white font-bold text-[9px] uppercase tracking-widest py-2.5 rounded-sm transition-all duration-200 cursor-pointer text-center block"
              >
                Draft Exam Paper &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🌸 Toolkit Tab
function ToolkitView() {
  const [activeTool, setActiveTool] = useState<any>(null);
  const [topic, setTopic] = useState('Photosynthesis & Cellular Structures');
  const [grade, setGrade] = useState('Class 5th');
  const [extraInstructions, setExtraInstructions] = useState('Include 3 questions focusing on stomatal openings.');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const tools = [
    { title: "Question Bank Generator", desc: "Synthesize 50 customized questions according to CBSE guidelines for review.", icon: Wand2, status: 'Ready', promptTemplate: 'Generate a comprehensive set of exam preparation questions covering: \n- Topic: [TOPIC]\n- Standard: [GRADE]\n- Layout: Multiple Choice and Short Answer questions.\n- Mapped Board directives: CBSE India.' },
    { title: "Rubric Builder", desc: "Instantly create diagnostic rubric grids mapped directly to assignment text.", icon: LayoutDashboard, status: 'Beta', promptTemplate: 'Construct a classroom-ready evaluative marking rubric for: \n- Classroom Goal: Assessment of [TOPIC] for [GRADE].\n- Criteria levels: Exemplary, Proficient, Basic, Novice.\n- Ensure alignment with board standards.' },
    { title: "AI Grading Co-Pilot", desc: "Scan student answers sheets, map points, and extract feedback draft options.", icon: Users, status: 'Beta', promptTemplate: 'Formulate an AI Grading checklist and feed option map for grading a student answer regarding [TOPIC] inside [GRADE].' },
    { title: "Syllabus Deconstructor", desc: "Upload syllabus PDF and construct segmented lesson schedules.", icon: BookOpen, status: 'Beta', promptTemplate: 'Create an organized, weekly lesson schedule layout deconstructing the [TOPIC] syllabus unit for [GRADE] over 4 weeks.' }
  ];

  const handleRunToolkit = async () => {
    setLoading(true);
    setResult('');
    try {
      const promptText = activeTool.promptTemplate
        .replace('[TOPIC]', topic)
        .replace('[GRADE]', grade) + `\n\nAdditional Directives: ${extraInstructions}`;
      
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      const data = await response.json();
      setResult(data.text || 'Could not yield textbook curation blocks. Try re-sending guidelines.');
    } catch (err: any) {
      setResult(`Generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (activeTool) {
    return (
      <div className="space-y-6 animate-fade-in text-left">
        {/* Back navigation */}
        <div className="flex items-center gap-2 text-[10px] text-slate-450 font-bold uppercase tracking-widest font-mono">
          <button 
            onClick={() => { setActiveTool(null); setResult(''); }}
            className="hover:text-[#1a1a1a] transition-colors cursor-pointer"
          >
            &larr; Back to toolkit shortcuts
          </button>
          <span>/</span>
          <span className="text-[#1a1a1a]">{activeTool.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs Section */}
          <div className="lg:col-span-2 bg-white border border-[#e5e5e0] rounded-sm p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-[#e5e5e0] pb-4">
              <div className="bg-[#1a1a1a] text-white p-2.5 rounded-sm">
                <activeTool.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">{activeTool.title}</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{activeTool.status} Tool Workspace</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest font-mono">Topic / Focus Unit</label>
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e5e0] text-xs bg-[#fafaf7] focus:bg-white text-[#1a1a1a] rounded-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest font-mono">Class Grade / Level</label>
                <select 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e5e5e0] text-xs bg-[#fafaf7] focus:bg-white text-[#1a1a1a] rounded-sm font-medium h-9"
                >
                  <option value="Class 5th">Class 5th</option>
                  <option value="Class 6th">Class 6th</option>
                  <option value="Class 8th">Class 8th</option>
                  <option value="Class 10th">Class 10th</option>
                  <option value="Class 11th">Class 11th</option>
                  <option value="Class 12th">Class 12th</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest font-mono">Custom Directives</label>
                <textarea 
                  rows={3}
                  value={extraInstructions}
                  onChange={(e) => setExtraInstructions(e.target.value)}
                  placeholder="E.g., Map directly to NCERT chapters..."
                  className="w-full px-3 py-2 border border-[#e5e5e0] text-xs bg-[#fafaf7] focus:bg-white text-[#1a1a1a] rounded-sm font-light leading-relaxed"
                />
              </div>

              <button 
                onClick={handleRunToolkit}
                disabled={loading}
                className="w-full bg-[#1a1a1a] hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-sm shadow-sm transition-all duration-200 cursor-pointer text-center block"
              >
                {loading ? 'AI Curation in Progress...' : 'Run Real-Time AI Generation'}
              </button>
            </div>
          </div>

          {/* Outputs / Results Section */}
          <div className="lg:col-span-3 bg-white border border-[#e5e5e0] rounded-sm p-6 shadow-sm flex flex-col justify-between min-h-[420px]">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e5e5e0] pb-3 uppercase tracking-widest font-mono">
                Generated Workspace Output
              </h3>

              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-6 h-6 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-sans italic">Synthesizing DPS CBSE diagnostic markers...</p>
                </div>
              ) : result ? (
                <div className="p-4 bg-[#fafaf7] border border-[#e5e5e0] rounded-sm max-h-[480px] overflow-y-auto">
                  <pre className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <Wand2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-sans italic">Inputs ready. Process the playground to generate custom curriculum matrix leaflets.</p>
                </div>
              )}
            </div>

            {result && !loading && (
              <div className="pt-4 border-t border-[#e5e5e0] flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Source Check: DPS Verified</span>
                <button 
                  onClick={() => {
                    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(result);
                    const dl = document.createElement('a');
                    dl.setAttribute("href", dataStr);
                    dl.setAttribute("download", `${activeTool.title.toLowerCase().replace(/\s+/g, '_')}_output.txt`);
                    dl.click();
                  }}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#1a1a1a] hover:underline cursor-pointer"
                >
                  Download Output Text &darr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h1 className="text-2xl font-sans font-bold text-[#1a1a1a] tracking-tight">
          AI Teacher's Toolkit
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-450 mt-1">
          Shortcuts to speed up standard teacher and curriculum management tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tools.map((t, i) => (
          <div 
            key={i} 
            onClick={() => setActiveTool(t)}
            className="bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm p-6 hover:border-[#1a1a1a] hover:bg-[#fafaf7] transition-all flex gap-4 shadow-sm group cursor-pointer"
          >
            <div className="bg-[#f5f5f2] text-[#1a1a1a] group-hover:bg-[#1a1a1a] group-hover:text-[#fdfdfc] p-3.5 rounded-sm h-12 w-12 flex items-center justify-center shrink-0 border border-[#e5e5e0] transition-colors">
              <t.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#1a1a1a] truncate">{t.title}</h3>
                <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm font-mono bg-[#1a1a1a] text-[#fdfdfc]">{t.status}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🌸 Library Tab Viewer
function LibraryView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sans font-bold text-[#1a1a1a] tracking-tight">
          My Library
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-slate-450 mt-1">
          Archive repository of historical assessments and questions banks templates
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-16 bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm shadow-sm text-center">
        <BookOpen className="w-10 h-10 text-slate-400 mb-4" />
        <h3 className="text-base font-sans font-bold text-[#1a1a1a]">No archived collections</h3>
        <p className="text-slate-400 text-xs mt-2 max-w-sm font-light leading-relaxed">
          Create assessments first. Once completed, you can move them to your private library for reuse in subsequent school terms.
        </p>
      </div>
    </div>
  );
}

// 🌸 Settings Tab Viewer
function SettingsView() {
  const apiKey = 'process.env.GEMINI_API_KEY';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-sans font-bold text-[#1a1a1a] tracking-tight">
          Settings
        </h1>
        <p className="text-xs font-mono uppercase tracking-widest text-[#1a1a1a]/60 mt-1">
          Configure academic identifiers and keep credentials secure
        </p>
      </div>

      <div className="bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm p-6 shadow-sm space-y-6 max-w-2xl">
        <div className="flex items-start gap-4 p-5 bg-[#f9f9f6] rounded-sm border border-[#e5e5e0]">
          <ShieldAlert className="w-5 h-5 text-slate-650 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-widest font-mono">
              API Secrets Configuration
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              The AI assessment engine relies on a server-side Gemini credential configured on the platform.
            </p>
            <p className="text-[11px] text-slate-505 leading-relaxed font-light">
              If your secrets panel is blank, the backend automatically intercepts calls using our **local fallback curriculum layout synthesis**. This ensures you can fully interact, add question blocks and counter tags, and print structured DPS-branded sheets instantly.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e5e5e0] pb-2 uppercase tracking-widest font-mono">
            Credentials Status
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 bg-[#f5f5f2] rounded-sm border border-[#e5e5e0]">
              <span className="font-mono text-slate-500 font-bold tracking-wide">GEMINI_API_KEY Binding</span>
              <span className="text-[9px] font-extrabold uppercase font-mono bg-white border border-[#e5e5e0] text-[#1a1a1a] px-2.5 py-1 rounded-sm">
                Server Verified
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#f5f5f2] rounded-sm border border-[#e5e5e0]">
              <span className="font-mono text-slate-500 font-bold tracking-wide">Active Engine Platform</span>
              <span className="text-[9px] font-extrabold uppercase font-mono text-[#1a1a1a] bg-white border border-[#e5e5e0] px-2.5 py-1 rounded-sm text-right">
                gemini-3.5-flash / Deep Curation
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e5e5e0] pb-2 uppercase tracking-widest font-mono">
            School Configuration Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest font-mono">School Heading Name</label>
              <input 
                type="text" 
                defaultValue="Delhi Public School, Sector-4, Bokaro" 
                disabled 
                className="w-full px-3.5 py-2.5 bg-[#f5f5f2] border border-[#e5e5e0] text-[#1a1a1a] text-xs rounded-sm select-none cursor-not-allowed font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-450 uppercase tracking-widest font-mono">Affiliation Board</label>
              <input 
                type="text" 
                defaultValue="CBSE Affiliate Board, India" 
                disabled 
                className="w-full px-3.5 py-2.5 bg-[#f5f5f2] border border-[#e5e5e0] text-[#1a1a1a] text-xs rounded-sm select-none cursor-not-allowed font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
