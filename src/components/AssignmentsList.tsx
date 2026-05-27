import React, { useEffect } from 'react';
import { useAssessmentStore } from '../store';
import { Search, Filter, Trash2, BookOpen, Clock, Loader2, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AssignmentsList() {
  const { 
    assignments, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    filterSubject, 
    setFilterSubject,
    setIsCreating,
    setActiveAssignmentId,
    deleteAssignment,
    regenerateAssignment,
    fetchAssignments,
    connectWS
  } = useAssessmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const uniqueSubjects = ['All', 'Science', 'English', 'Mathematics', 'History', 'Social Studies'];

  // Filter lists
  const filteredAssignments = assignments.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.className.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === 'All' || 
                           item.subject.toLowerCase() === filterSubject.toLowerCase();
    
    return matchesSearch && matchesSubject;
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (assignments.length === 0 && !loading) {
    return (
      <div id="no-assignments-empty-state" className="flex flex-col items-center justify-center p-4 md:p-12 text-center font-sans tracking-tight max-w-2xl mx-auto py-12 md:py-24 animate-fade-in bg-transparent">
        {/* Perfect Figma Vector Diagram Replica */}
        <div className="relative w-80 h-72 flex items-center justify-center mx-auto select-none scale-100 mb-1">
          {/* Circular shadow background element */}
          <div className="absolute w-[240px] h-[240px] rounded-full bg-[#E5E5E0] bg-opacity-40 border border-[#d4d4d8]/40 shadow-inner flex items-center justify-center">
            <div className="w-[180px] h-[180px] rounded-full bg-white bg-opacity-30 blur-md"></div>
          </div>

          {/* Loop Line on Left */}
          <svg className="absolute left-[20px] top-[40px] w-24 h-24 text-slate-800 opacity-80" viewBox="0 0 100 100" fill="none">
            <path d="M80 20C60 30 20 40 40 65C58 80 75 60 50 45C25 30 5 40 25 60C38 72 65 50 85 35" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>

          {/* Tiny Blue Dot Right */}
          <div className="absolute right-[54px] top-[148px] w-2.5 h-2.5 rounded-full bg-[#1e40af]"></div>

          {/* Cyan Sparkle Star Bottom Left */}
          <svg className="absolute left-[45px] bottom-[55px] w-6 h-6 text-[#1d4ed8]" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
          </svg>

          {/* Top Right Floating Badge */}
          <div className="absolute right-[33px] top-[60px] bg-white border border-[#e5e5e0] rounded-xl p-2.5 shadow-sm flex items-center gap-2 select-none z-10 w-20">
            <div className="w-3.5 h-3.5 rounded-full bg-indigo-300"></div>
            <div className="w-8 h-2 bg-slate-200 rounded-full"></div>
          </div>

          {/* Paper Document under Magnifying Glass */}
          <div className="absolute bg-white border border-[#e5e5e0] rounded-2xl w-[116px] h-[155px] p-4.5 shadow-md flex flex-col justify-between z-10 -rotate-[4deg]">
            <div className="space-y-2.5">
              {/* Simulated heading block */}
              <div className="w-10 h-3 bg-slate-900 rounded-md"></div>
              <div className="space-y-1.5 pt-1.5">
                <div className="w-full h-1.5 bg-slate-200 rounded-sm"></div>
                <div className="w-5/6 h-1.5 bg-slate-200 rounded-sm"></div>
                <div className="w-11/12 h-1.5 bg-slate-200 rounded-sm"></div>
                <div className="w-3/4 h-1.5 bg-slate-100 rounded-sm"></div>
              </div>
            </div>

            {/* Red Crossed mark over paper */}
            <div className="absolute inset-0 flex items-center justify-center pt-8">
              <svg className="w-[40px] h-[40px] text-[#ef4444]" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-sm"></div>
          </div>

          {/* Magnifying Glass looking over X */}
          <div className="absolute right-[4px] bottom-[38px] z-20 flex flex-col items-center rotate-[22deg] origin-center select-none scale-100 drop-shadow-lg">
            {/* Glass Frame Ring */}
            <div className="w-[85px]. h-[85px] rounded-full border-[7px] border-[#dad9e9] bg-[#eef2ff]/20 backdrop-blur-[0.5px] flex items-center justify-center shadow-inner relative">
              {/* Shiny reflex glow edge */}
              <div className="absolute top-1.5 left-2.5 w-4 h-2.5 bg-white bg-opacity-70 rounded-full rotate-45"></div>
            </div>
            {/* Handle stick */}
            <div className="w-[11px] h-11 bg-gradient-to-b from-[#cbd5e1] to-[#64748b] rounded-full -mt-2 -rotate-[45deg] origin-top border border-indigo-100/30"></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#191919] font-sans tracking-tight">
          No assignments yet
        </h2>
        <p className="text-[#71717A] text-[13px] md:text-[14px] leading-relaxed max-w-lg mx-auto mt-2.5 font-normal">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>

        <button
          id="empty-create-btn"
          onClick={() => setIsCreating(true)}
          className="mt-6 bg-[#1a1a1a] hover:bg-black text-white font-bold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full transition-all duration-200 cursor-pointer shadow-lg active:scale-95 animate-pulse-subtle"
        >
          + Create Your First Assignment
        </button>
      </div>
    );
  }

  return (
    <div id="assignments-root-view" className="space-y-6">
      {/* Top Breadcrumb and Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-[#1a1a1a]">Assessments</span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-[#1a1a1a] tracking-tight mt-1.5 animate-fade-in">
            Assignments List
          </h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-mono">
            Manage and synthesize custom printed question sheets for examinations
          </p>
        </div>

        <button
          id="list-create-new-btn"
          onClick={() => setIsCreating(true)}
          style={{ backgroundColor: '#181818' }}
          className="hover:bg-black text-white font-bold text-xs uppercase tracking-widest py-3 px-5 rounded-sm flex items-center justify-center gap-2 transition-all cursor-pointer self-start md:self-auto shadow-sm"
        >
          <span>+</span> Create Assignment
        </button>
      </div>

      {/* Filter Rail & Search */}
      <div className="bg-[#fdfdfc] p-4 border border-[#e5e5e0] rounded-sm flex flex-col md:flex-row gap-4 items-center justify-between no-print shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            id="assignment-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assignments or subjects..."
            className="w-full pl-9 pr-4 py-2 bg-[#f5f5f2] border border-[#e5e5e0] rounded-sm text-[#1a1a1a] text-xs focus:outline-none focus:border-black focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Subjects Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mr-1.5 flex items-center gap-1 font-mono">
            <Filter className="w-3 h-3" /> Filer:
          </span>
          <div className="flex flex-wrap gap-1">
            {uniqueSubjects.map((subject) => (
              <button
                key={subject}
                id={`filter-subject-${subject.toLowerCase()}`}
                onClick={() => setFilterSubject(subject)}
                className={`px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all border ${
                  filterSubject === subject
                    ? 'bg-[#1a1a1a] text-[#fdfdfc] border-[#1a1a1a] shadow-sm'
                    : 'bg-[#f5f5f2] text-slate-655 border-[#e5e5e0] hover:bg-slate-100 hover:text-black'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid display or empty state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm shadow-sm">
          <Loader2 className="w-6 h-6 text-[#1a1a1a] animate-spin" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4 font-mono">Synchronizing database models...</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        // Screen 1: No assignments yet Empty State (Figma Mockup Perfect Alignment)
        <div id="no-assignments-empty-state" className="flex flex-col items-center justify-center p-8 md:p-12 text-center font-sans tracking-tight max-w-2xl mx-auto py-16 animate-fade-in">
          {/* Perfect Figma Vector Diagram Replica */}
          <div className="relative w-80 h-72 flex items-center justify-center mx-auto select-none scale-100 mb-1">
            {/* Circular shadow background element */}
            <div className="absolute w-[240px] h-[240px] rounded-full bg-[#E5E5E0] bg-opacity-40 border border-[#d4d4d8]/40 shadow-inner flex items-center justify-center">
              <div className="w-[180px] h-[180px] rounded-full bg-white bg-opacity-30 blur-md"></div>
            </div>

            {/* Loop Line on Left */}
            <svg className="absolute left-[20px] top-[40px] w-24 h-24 text-slate-800 opacity-80" viewBox="0 0 100 100" fill="none">
              <path d="M80 20C60 30 20 40 40 65C58 80 75 60 50 45C25 30 5 40 25 60C38 72 65 50 85 35" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>

            {/* Tiny Blue Dot Right */}
            <div className="absolute right-[54px] top-[148px] w-2.5 h-2.5 rounded-full bg-[#1e40af]"></div>

            {/* Cyan Sparkle Star Bottom Left */}
            <svg className="absolute left-[45px] bottom-[55px] w-6 h-6 text-[#1d4ed8]" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
            </svg>

            {/* Top Right Floating Badge */}
            <div className="absolute right-[33px] top-[60px] bg-white border border-[#e5e5e0] rounded-xl p-2.5 shadow-sm flex items-center gap-2 select-none z-10 w-20">
              <div className="w-3.5 h-3.5 rounded-full bg-indigo-300"></div>
              <div className="w-8 h-2 bg-slate-200 rounded-full"></div>
            </div>

            {/* Paper Document under Magnifying Glass */}
            <div className="absolute bg-white border border-[#e5e5e0] rounded-2xl w-[116px] h-[155px] p-4.5 shadow-md flex flex-col justify-between z-10 -rotate-[4deg]">
              <div className="space-y-2.5">
                {/* Simulated heading block */}
                <div className="w-10 h-3 bg-slate-900 rounded-md"></div>
                <div className="space-y-1.5 pt-1.5">
                  <div className="w-full h-1.5 bg-slate-200 rounded-sm"></div>
                  <div className="w-5/6 h-1.5 bg-slate-200 rounded-sm"></div>
                  <div className="w-11/12 h-1.5 bg-slate-200 rounded-sm"></div>
                  <div className="w-3/4 h-1.5 bg-slate-100 rounded-sm"></div>
                </div>
              </div>

              {/* Red Crossed mark over paper */}
              <div className="absolute inset-0 flex items-center justify-center pt-8">
                <svg className="w-[40px] h-[40px] text-[#ef4444]" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#ef4444" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-sm"></div>
            </div>

            {/* Magnifying Glass looking over X */}
            <div className="absolute right-[4px] bottom-[38px] z-20 flex flex-col items-center rotate-[22deg] origin-center select-none scale-100 drop-shadow-lg">
              {/* Glass Frame Ring */}
              <div className="w-[85px] h-[85px] rounded-full border-[7px] border-[#dad9e9] bg-[#eef2ff]/20 backdrop-blur-[0.5px] flex items-center justify-center shadow-inner relative">
                {/* Shiny reflex glow edge */}
                <div className="absolute top-1.5 left-2.5 w-4 h-2.5 bg-white bg-opacity-70 rounded-full rotate-45"></div>
              </div>
              {/* Handle stick */}
              <div className="w-[11px] h-11 bg-gradient-to-b from-[#cbd5e1] to-[#64748b] rounded-full -mt-2 -rotate-[45deg] origin-top border border-indigo-100/30"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#191919] font-sans tracking-tight">
            No assignments yet
          </h2>
          <p className="text-[#71717A] text-[13px] md:text-[14px] leading-relaxed max-w-lg mx-auto mt-2.5 font-normal">
            Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
          </p>

          <button
            id="empty-create-btn"
            onClick={() => setIsCreating(true)}
            className="mt-6 bg-[#1a1a1a] hover:bg-black text-white font-bold text-xs uppercase tracking-wider py-3.5 px-7 rounded-full transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          >
            + Create Your First Assignment
          </button>
        </div>
      ) : (
        // Grid display of assignments cards
        <div id="assignments-grid-display" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in">
          {filteredAssignments.map((item) => {
            const isProcessing = item.status === 'pending' || item.status === 'processing';
            const isCompleted = item.status === 'completed';
            const isFailed = item.status === 'failed';

            return (
              <motion.div
                key={item.id}
                id={`assignment-card-${item.id}`}
                layoutId={`card-layout-${item.id}`}
                className="bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm p-6 hover:shadow-md hover:border-[#1a1a1a] transition-all flex flex-col justify-between relative group shadow-sm"
              >
                {/* Card Main details */}
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-[#f5f5f2] text-slate-700 border border-[#e5e5e0]">
                      <BookOpen className="w-3 h-3" />
                      {item.subject}
                    </span>

                    {/* Badge details */}
                    <div className="flex items-center gap-1.5">
                      {isCompleted && (
                        <span 
                          style={{ backgroundColor: '#4BC26D', borderColor: '#4BC26D66' }}
                          className="px-2 py-0.5 rounded-sm text-[9px] font-bold text-white uppercase tracking-widest leading-none border shadow-xs"
                        >
                          Ready
                        </span>
                      )}
                      {item.fileName && (
                        <span className="px-2 py-0.5 rounded-sm text-[9px] font-bold bg-[#fffdf0] text-[#a16207] uppercase tracking-widest leading-none border border-[#fef3c7] max-w-24 truncate font-mono">
                          💾 Ref Doc
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-sans font-bold text-[#1a1a1a] hover:text-[#52524d] transition-colors mt-4">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-505 font-mono uppercase tracking-wide mt-1">
                    Class level: {item.className}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-[#e5e5e0]">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono">Assigned</p>
                        <p className="font-semibold text-slate-705 mt-1 font-mono text-[11px]">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono">Due Date</p>
                        <p className="font-semibold text-slate-705 mt-1 font-mono text-[11px]">{formatDate(item.dueDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loading / Interactive Status Bar */}
                <div className="mt-5 pt-4 border-t border-[#e5e5e0] flex flex-col gap-3">
                  {isProcessing && (
                    <div className="space-y-2 bg-[#f5f5f2] p-4 rounded-sm border border-[#e5e5e0]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-655 font-semibold flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 text-[#1a1a1a] animate-spin" />
                          {item.progressMsg || 'Generating prompt schemas...'}
                        </span>
                        <span className="text-slate-400 font-mono text-[8px] uppercase tracking-widest">QUEUE ACTIVE</span>
                      </div>
                      {/* progress loader bar */}
                      <div className="w-full bg-[#e5e5e0] h-1 rounded-sm overflow-hidden">
                        <div 
                          className="bg-[#1a1a1a] h-full rounded-sm transition-all duration-500 animate-pulse" 
                          style={{ 
                            width: item.progressMsg ? 
                              (item.progressMsg.includes('Contacting') ? '40%' : 
                               item.progressMsg.includes('Parsing') ? '75%' : 
                               item.progressMsg.includes('answer') ? '90%' : '15%') : '10%' 
                          }}
                        ></div>
                      </div>
                      <button 
                        onClick={() => connectWS(item.id)}
                        className="text-[9px] font-bold text-[#1a1a1a] uppercase tracking-wider block w-full text-center mt-1 cursor-pointer underline hover:text-slate-700"
                      >
                        Monitor Active Socket Feed
                      </button>
                    </div>
                  )}

                  {isFailed && (
                    <div className="p-4 bg-[#fdf2f2] rounded-sm border border-[#f8afaf] flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-[#b91c1c] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#b91c1c] uppercase tracking-wider font-mono">Assessment queue failed</p>
                        <p className="text-[11px] text-slate-600 truncate leading-relaxed">
                          {item.error || 'Check local credentials & server queue status.'}
                        </p>
                        <button 
                          onClick={() => regenerateAssignment(item.id)}
                          className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-[#1a1a1a] uppercase tracking-wider hover:underline cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" /> Retry Generation
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 font-mono">
                      {item.totalQuestions} Q • {item.totalMarks} Marks
                    </span>

                    <div className="flex items-center gap-2">
                      {/* View Button */}
                      {isCompleted && (
                        <button
                          id={`view-btn-${item.id}`}
                          onClick={() => setActiveAssignmentId(item.id)}
                          style={{ backgroundColor: '#181818', borderColor: '#181818' }}
                          className="text-[#fdfdfc] hover:bg-black text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-sm flex items-center gap-1 shadow-sm transition-all cursor-pointer border"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Paper
                        </button>
                      )}

                      {/* Delete actions */}
                      <button
                        id={`delete-btn-${item.id}`}
                        onClick={() => deleteAssignment(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-[#faf9f6] border border-transparent hover:border-[#e5e5e0] rounded-sm transition-colors cursor-pointer"
                        title="Delete Assignment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
