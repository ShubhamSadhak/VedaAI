import React, { useState, useRef } from 'react';
import { useAssessmentStore } from '../store';
import { ArrowLeft, Plus, Trash2, FileText, Upload, Check, AlertTriangle, Loader2, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AssignmentWizard() {
  const { 
    form, 
    updateForm, 
    addQuestionTypeRow, 
    removeQuestionTypeRow, 
    updateQuestionTypeRow,
    createAssignment,
    setIsCreating,
    isSaving,
    jobProgress,
    setActiveAssignmentId
  } = useAssessmentStore();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Totals calculations
  const totalQuestions = form.questionTypes.reduce((acc, curr) => acc + Number(curr.count), 0);
  const totalMarks = form.questionTypes.reduce((acc, curr) => acc + (Number(curr.count) * Number(curr.marks)), 0);

  // File Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      updateForm({
        fileName: file.name,
        // If it's pure text read it, otherwise mock / capture meta!
        fileContent: text || `Reference dataset extracted from document binary of size ${file.size} bytes`
      });
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    updateForm({ fileName: '', fileContent: '' });
  };

  // Metric Adjusters
  const adjustCount = (index: number, val: number) => {
    const current = form.questionTypes[index].count;
    const nextVal = Math.max(1, current + val);
    updateQuestionTypeRow(index, { count: nextVal });
  };

  const adjustMarks = (index: number, val: number) => {
    const current = form.questionTypes[index].marks;
    const nextVal = Math.max(1, current + val);
    updateQuestionTypeRow(index, { marks: nextVal });
  };

  // Form Submission
  const handleGenerate = async () => {
    // Form verification
    setValidationError(null);

    if (!form.title.trim()) {
      setValidationError('Please enter an assignment title.');
      return;
    }

    if (!form.dueDate) {
      setValidationError('Please specify a due date for the assessment.');
      return;
    }

    if (form.questionTypes.length === 0) {
      setValidationError('Please add at least one question type row in the specifications.');
      return;
    }

    for (const qt of form.questionTypes) {
      if (qt.count < 1 || qt.marks < 1) {
        setValidationError('Each question type must have at least 1 question and at least 1 mark.');
        return;
      }
    }

    // Call API handler
    const result = await createAssignment();
    if (!result) {
      // Errors handled inside store
    }
  };

  const handleViewGeneratedPaper = (id: string) => {
    setActiveAssignmentId(id);
  };

  const questionOptions = [
    'Multiple Choice Questions',
    'Short Questions',
    'Diagram/Graph-Based Questions',
    'Numerical Problems',
    'Long Answer Questions'
  ];

  // If we are actively saving or waiting for background queue WS responses, show custom loading board
  if (isSaving || jobProgress) {
    const progress = jobProgress?.progress || 0;
    const progressMsg = jobProgress?.msg || 'Pushing assignment parameters into queue scheduler...';
    const status = jobProgress?.status || 'pending';

    return (
      <div id="wizard-loading-overlay" className="bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm p-8 max-w-2xl mx-auto shadow-sm min-h-[460px] flex flex-col justify-between font-sans">
        <h2 className="text-lg font-sans font-bold text-[#1a1a1a] text-center flex items-center justify-center gap-2">
          <Wand2 className="w-4 h-4 text-slate-500 animate-pulse" />
          AI Creator Room
        </h2>

        <div className="my-8 text-center flex flex-col items-center">
          {status === 'completed' ? (
            <div className="bg-[#f4f8f4] text-[#157030] rounded-sm p-4 mb-4 border border-[#d1e8d1] flex items-center justify-center h-14 w-14">
              <Check className="w-8 h-8 font-extrabold" />
            </div>
          ) : status === 'failed' ? (
            <div className="bg-[#fdf2f2] text-[#b91c1c] rounded-sm p-4 mb-4 border border-[#f8afaf] flex items-center justify-center h-14 w-14">
              <AlertTriangle className="w-8 h-8" />
            </div>
          ) : (
            <div className="relative mb-6">
              <Loader2 className="w-14 h-14 text-[#1a1a1a] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold font-mono text-[#1a1a1a]">{progress}%</span>
              </div>
            </div>
          )}

          <p className="text-xs font-bold text-[#1a1a1a] tracking-widest uppercase font-mono">
            {status === 'completed' ? 'Generation Complete' : status === 'failed' ? 'Process Halted' : 'Synthesis Active'}
          </p>
          <p className="text-slate-500 text-xs font-normal mt-2 max-w-md mx-auto leading-relaxed h-[40px] flex items-center justify-center">
            {progressMsg}
          </p>

          {/* Active Logs Ticker */}
          {status !== 'completed' && status !== 'failed' && (
            <div className="w-full max-w-md mt-6 bg-[#f5f5f2] p-4 rounded-sm border border-[#e5e5e0] text-left">
              <span className="text-[9px] font-bold tracking-widest text-slate-400 block font-mono border-b border-[#e5e5e0] pb-1">WS SOCKET FEED</span>
              <div className="mt-2 h-20 overflow-y-auto space-y-1 text-slate-505 font-mono text-[10px] select-none">
                <div className="text-green-700">✓ Connection socket upgraded to protocol level ws://</div>
                <div className="text-green-700">✓ Job scheduled successfully inside in-memory queue</div>
                {progress >= 25 && <div>✓ Context formulations prepared</div>}
                {progress >= 60 && <div>✓ Connecting with Gemini 3.5 engine...</div>}
                {progress >= 75 && <div>✓ Mapping sectional arrays for Section A & B...</div>}
                {progress >= 90 && <div>✓ Finalizing answers indexes...</div>}
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div className="mt-4 p-3 bg-red-50 rounded-sm border border-red-150 text-[11px] text-[#b91c1c] font-medium leading-relaxed">
              Check process parameters. Ensure that process.env.GEMINI_API_KEY contains a valid key, or let the worker fall back.
            </div>
          )}
        </div>

        {/* Action button once completed */}
        <div className="flex gap-3 justify-end pt-4 border-t border-[#e5e5e0] select-none no-print">
          {status === 'failed' && (
            <button
              onClick={() => setIsCreating(false)}
              className="bg-white text-slate-655 hover:bg-[#faf9f6] px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest border border-[#e5e5e0] cursor-pointer transition-all"
            >
              Cancel & Back
            </button>
          )}
          {status === 'completed' && (
            <button
              onClick={() => setIsCreating(false)}
              className="bg-white text-slate-655 hover:bg-[#faf9f6] px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest border border-[#e5e5e0] cursor-pointer transition-all"
            >
              Back to List
            </button>
          )}
          {status === 'completed' && (
            <button
              id="wizard-view-complete-btn"
              onClick={() => {
                const currentList = useAssessmentStore.getState().assignments;
                if (currentList && currentList.length > 0) {
                  // The new one is first
                  handleViewGeneratedPaper(currentList[0].id);
                }
              }}
              className="bg-[#1a1a1a] text-white hover:bg-slate-800 px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm transition-all"
            >
              View Generated Paper &rarr;
            </button>
          )}
        </div>
      </div>
    );
  }

  // Primary Setup Wizard Screen
  return (
    <div id="create-assignment-screen" className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          id="wizard-back-arrow"
          onClick={() => setIsCreating(false)}
          className="p-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-sm border border-transparent hover:border-[#e5e5e0] transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-sans font-bold text-[#1a1a1a] tracking-tight">
            Create Assignment Blueprint
          </h2>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wide mt-0.5">
            Configure evaluation parameters and feed textbooks materials into Gemini
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Columns - Form Configurations */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e5e5e0] pb-3 uppercase tracking-widest font-mono">
              Assignment Details
            </h3>

            {validationError && (
              <div className="p-3.5 bg-[#fdf2f2] text-[#b91c1c] text-xs font-semibold rounded-sm flex items-center gap-2 border border-[#f8afaf]">
                <AlertTriangle className="w-4 h-4 text-[#b91c1c] shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Inputs Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">Assignment Title *</label>
              <input
                id="form-input-title"
                type="text"
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                placeholder="e.g. End of Term Science Examination"
                className="w-full px-3.5 py-2.5 bg-[#f5f5f2] border border-[#e5e5e0] rounded-sm text-[#1a1a1a] text-xs focus:outline-none focus:border-black focus:bg-white transition-all font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Grid Subject + Grade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">Subject *</label>
                <select
                  id="form-select-subject"
                  value={form.subject}
                  onChange={(e) => updateForm({ subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f5f5f2] border border-[#e5e5e0] rounded-sm text-[#1a1a1a] text-xs focus:outline-none focus:border-black focus:bg-white transition-all font-bold"
                >
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="History">History</option>
                  <option value="Social Studies">Social Studies</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">Class/Grade *</label>
                <select
                  id="form-select-class"
                  value={form.className}
                  onChange={(e) => updateForm({ className: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#f5f5f2] border border-[#e5e5e0] rounded-sm text-[#1a1a1a] text-xs focus:outline-none focus:border-black focus:bg-white transition-all font-bold"
                >
                  <option value="Class 5th">Class 5th</option>
                  <option value="Class 6th">Class 6th</option>
                  <option value="Class 7th">Class 7th</option>
                  <option value="Class 8th">Class 8th</option>
                  <option value="Class 9th">Class 9th</option>
                  <option value="Class 10th">Class 10th</option>
                </select>
              </div>
            </div>

            {/* Due Date Picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">Due Date *</label>
              <input
                id="form-input-duedate"
                type="date"
                value={form.dueDate}
                onChange={(e) => updateForm({ dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#f5f5f2] border border-[#e5e5e0] rounded-sm text-[#1a1a1a] text-xs focus:outline-none focus:border-black focus:bg-white transition-all font-bold"
              />
            </div>
          </div>

          {/* Question Configuration array rows */}
          <div className="bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e5e5e0] pb-3 uppercase tracking-widest font-mono">
              Question Formulation Structure
            </h3>

            <div className="space-y-3">
              {form.questionTypes.map((qt, index) => (
                <div 
                  key={index} 
                  id={`config-row-${index}`}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-[#fcfcf9] border border-[#e5e5e0] rounded-sm"
                >
                  {/* Select Dropdown Type */}
                  <div className="flex-1">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest font-mono">Question Type</label>
                    <select
                      id={`row-type-${index}`}
                      value={qt.type}
                      onChange={(e) => updateForm({
                        questionTypes: form.questionTypes.map((item, i) => i === index ? { ...item, type: e.target.value } : item)
                      })}
                      className="w-full bg-transparent font-bold text-slate-700 text-xs focus:outline-none mt-1 py-1"
                    >
                      {questionOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Count Stepper */}
                  <div className="w-full sm:w-28 shrink-0">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest font-mono">Questions</label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button 
                        onClick={() => adjustCount(index, -1)}
                        className="bg-white border border-[#e5e5e0] text-[#1a1a1a] font-bold text-xs rounded-sm h-7 w-7 flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-sm select-none"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-700 font-mono w-6 text-center">{qt.count}</span>
                      <button 
                        onClick={() => adjustCount(index, 1)}
                        className="bg-white border border-[#e5e5e0] text-[#1a1a1a] font-bold text-xs rounded-sm h-7 w-7 flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-sm select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Marks Stepper */}
                  <div className="w-full sm:w-24 shrink-0">
                    <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest font-mono">Marks / Q</label>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button 
                        onClick={() => adjustMarks(index, -1)}
                        className="bg-white border border-[#e5e5e0] text-[#1a1a1a] font-bold text-xs rounded-sm h-7 w-7 flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-sm select-none"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-700 font-mono w-6 text-center">{qt.marks}</span>
                      <button 
                        onClick={() => adjustMarks(index, 1)}
                        className="bg-white border border-[#e5e5e0] text-[#1a1a1a] font-bold text-xs rounded-sm h-7 w-7 flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-sm select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Delete row */}
                  <button 
                    onClick={() => removeQuestionTypeRow(index)}
                    className="self-end sm:self-center p-1.5 text-slate-400 hover:text-red-650 hover:bg-[#faf9f6] border border-transparent hover:border-[#e5e5e0] rounded-sm transition-colors cursor-pointer mt-2 sm:mt-0"
                    title="Delete specification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              id="wizard-add-type-row-btn"
              onClick={addQuestionTypeRow}
              className="w-full border border-dashed border-[#e5e5e0] hover:border-black hover:bg-[#fafaf7] text-[#1a1a1a] font-bold py-3.5 px-4 rounded-sm flex items-center justify-center gap-1.5 transition-all text-xs cursor-pointer select-none"
            >
              <Plus className="w-3.5 h-3.5" /> ADD QUESTION TYPE ROW
            </button>

            {/* Sum metrics board */}
            <div className="bg-[#f5f5f2] p-4 rounded-sm flex items-center justify-between text-[11px] font-bold text-slate-500 border border-[#e5e5e0]">
              <span>Questions blueprint: <span className="text-[#1a1a1a] font-mono">{totalQuestions} Rows</span></span>
              <span>Examination score total: <span className="text-[#1a1a1a] font-mono">{totalMarks} Marks</span></span>
            </div>
          </div>
        </div>

        {/* Right Columns - Uploads & Prompt additions */}
        <div className="space-y-6">
          {/* File uploader component */}
          <div className="bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e5e5e0] pb-3 uppercase tracking-widest font-mono">
              Upload Context Materials
            </h3>

            {form.fileName ? (
              <div className="p-3.5 bg-[#f4f8f4] border border-[#d1e8d1] rounded-sm flex items-start justify-between gap-2.5">
                <FileText className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{form.fileName}</p>
                  <p className="text-[10px] text-green-700 font-extrabold font-mono mt-0.5 uppercase tracking-wide">100% Extracted</p>
                </div>
                <button
                  onClick={removeFile}
                  className="text-slate-400 hover:text-red-500 p-0.5 hover:bg-[#faf9f6] rounded border border-[#e5e5e0] bg-white h-7 w-7 flex items-center justify-center"
                  title="Remove document context"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-sm p-6 text-center transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-black bg-[#fafaf7]' 
                    : 'border-[#e5e5e0] hover:border-black bg-[#fcfcf9]'
                }`}
              >
                <div className="mx-auto flex items-center justify-center h-10 w-10 text-slate-400 mb-3 bg-white border border-[#e5e5e0] rounded-sm shadow-sm">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-[#1a1a1a]">Choose text spreadsheet or drag & drop</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold uppercase tracking-widest">PDF, TXT, DOCX</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.docx"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Prompt customizations box */}
          <div className="bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-[#1a1a1a] border-b border-[#e5e5e0] pb-3 uppercase tracking-widest font-mono">
              AI Instructor Prompts
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-widest font-mono">
                Additional Instructions (for better output)
              </label>
              <textarea
                id="form-textarea-info"
                value={form.additionalInfo}
                onChange={(e) => updateForm({ additionalInfo: e.target.value })}
                rows={4}
                placeholder="e.g. Generate a Question Paper for 1.5 hour exam, focus on electricity concepts, make questions analytical..."
                className="w-full bg-[#f5f5f2] border border-[#e5e5e0] rounded-sm text-slate-800 text-xs focus:outline-none focus:border-black focus:bg-white p-3.5 transition-all font-medium placeholder:text-slate-400 resize-none leading-relaxed"
              ></textarea>
              <p className="text-[10px] text-slate-450 leading-relaxed mt-1">
                Add curriculum Focus (e.g. NCERT, ICSE chapters) or specific evaluation formulas to direct the model.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer navigation bar */}
      <div className="pt-4 border-t border-[#e5e5e0] flex items-center justify-between no-print select-none">
        <button
          id="wizard-cancel-btn"
          onClick={() => setIsCreating(false)}
          className="px-5 py-2.5 rounded-sm border border-[#e5e5e0] bg-white text-slate-655 font-bold text-xs uppercase tracking-widest hover:bg-[#fafaf7] cursor-pointer transition-all shadow-sm"
        >
          Cancel
        </button>

        <button
          id="wizard-generate-btn"
          onClick={handleGenerate}
          style={{ backgroundColor: '#181818' }}
          className="hover:bg-black text-[#fdfdfc] font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <span>Generate with AI &rarr;</span>
        </button>
      </div>
    </div>
  );
}
