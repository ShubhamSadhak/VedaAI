import React, { useState } from 'react';
import { useAssessmentStore } from '../store';
import { ArrowLeft, Printer, RefreshCw, HelpCircle, GraduationCap, Download } from 'lucide-react';

export default function GeneratedPaperView() {
  const { activeAssignmentId, assignments, setActiveAssignmentId, regenerateAssignment } = useAssessmentStore();
  const [showAnswerKey, setShowAnswerKey] = useState(true);

  const assignment = assignments.find(a => a.id === activeAssignmentId);
  if (!assignment) {
    return (
      <div className="p-8 text-center bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm max-w-lg mx-auto font-sans">
        <p className="text-slate-600 font-bold">Question paper not found.</p>
        <button 
          onClick={() => setActiveAssignmentId(null)}
          className="mt-4 bg-[#1a1a1a] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-sm cursor-pointer"
        >
          Return to List
        </button>
      </div>
    );
  }

  const paper = assignment.generatedPaper;
  if (!paper) {
    return (
      <div className="p-8 text-center bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm max-w-lg mx-auto font-sans">
        <p className="text-slate-600 font-semibold font-sans italic">Paper generation has not completed or is in draft.</p>
        <button 
          onClick={() => setActiveAssignmentId(null)}
          className="mt-4 bg-[#1a1a1a] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-sm cursor-pointer"
        >
          Return to List
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!paper) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(paper, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(paper.subject || 'assessment').toLowerCase()}_exam_paper.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleRegenerate = async () => {
    if (confirm("Are you sure you want to regenerate this question paper? This will write a new job to the AI queue.")) {
      await regenerateAssignment(assignment.id);
      setActiveAssignmentId(null); // return to dashboard to monitor progress
      useAssessmentStore.getState().setIsCreating(true); // show the monitoring interface!
    }
  };

  return (
    <div id="generated-paper-workspace" className="space-y-6 font-sans text-[#1a1a1a]">
      {/* Top action header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print select-none">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">
          <button 
            id="paper-view-back-btn"
            onClick={() => setActiveAssignmentId(null)}
            className="flex items-center gap-1.5 hover:text-[#1a1a1a] transition-colors cursor-pointer text-slate-500"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to list
          </button>
          <span>/</span>
          <span className="text-[#1a1a1a]">View Question Sheet</span>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Toggle Answer key helper */}
          <button
            id="toggle-answers-btn"
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className={`px-4 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer shadow-sm ${
              showAnswerKey 
                ? 'bg-[#181818] border-[#181818] text-white hover:bg-black' 
                : 'bg-white border-[#e5e5e0] text-[#1a1a1a] hover:bg-slate-50'
            }`}
          >
            {showAnswerKey ? 'Hide Answer Key' : 'Show Answer Key'}
          </button>

          {/* Export JSON file */}
          <button
            id="action-export-json-btn"
            onClick={handleExportJSON}
            className="bg-white border border-[#e5e5e0] hover:bg-[#fafaf7] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export JSON
          </button>

          {/* Regenerate Trigger */}
          <button
            id="action-regenerate-btn"
            onClick={handleRegenerate}
            className="bg-white border border-[#e5e5e0] hover:bg-[#fafaf7] text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 hover:rotate-180 transition-transform duration-500" />
            Regenerate
          </button>

          {/* Download/Print trigger */}
          <button
            id="action-print-btn"
            onClick={handlePrint}
            style={{ backgroundColor: '#181818' }}
            className="text-white hover:bg-black text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 font-bold" />
            Download or Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Left Column - Real Document Canvas Sheets (Frame 1618872395 wrapper with #5E5E5E background) */}
        <div 
          style={{ 
            background: '#5E5E5E', 
            borderRadius: '32px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            maxWidth: '1100px'
          }}
          className="xl:col-span-3 shadow-lg print:p-0 print:bg-transparent print:shadow-none print:rounded-none"
        >
          {/* Core Toast Prompt container (Frame 1618872450) */}
          <div 
            style={{ 
              background: 'rgba(24, 24, 24, 0.8)', 
              borderRadius: '32px',
              padding: '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              width: '100%',
              maxWidth: '1060px'
            }}
            className="no-print"
          >
            <p 
              style={{
                fontFamily: "'Inter'",
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '140%',
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.04em',
                color: '#FFFFFF'
              }}
              className="max-w-[996px] select-text"
            >
              Certainly, Lakshya! Here are customized Question Paper for your {paper.className || 'CBSE Grade 5'} Classroom on {paper.subject || 'English'}:
            </p>
            {/* Download as PDF capsule button (Frame 1618872346) */}
            <button 
              onClick={handlePrint}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 24px',
                gap: '24px',
                width: '200px',
                height: '44px',
                background: '#FFFFFF',
                borderRadius: '100px'
              }}
              className="active:scale-[0.98] transition-all duration-150 cursor-pointer text-[#303030] hover:bg-slate-50 shrink-0 border-0"
            >
              <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download className="w-[17.19px] h-[19.19px] text-[#303030] stroke-[2.5]" />
              </div>
              <span 
                style={{
                  fontFamily: "'Inter'",
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  letterSpacing: '-0.04em',
                  color: '#303030'
                }}
              >
                Download as PDF
              </span>
            </button>
          </div>

          {/* Main Question Paper sheet container card (Frame 1618872449) */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '32px',
              gap: '24px',
              width: '100%',
              maxWidth: '1060px',
              background: '#FFFFFF',
              borderRadius: '32px'
            }}
            className="exam-paper-container relative overflow-hidden text-center"
          >
            {/* Stamp decorative mark */}
            <div className="absolute top-6 right-6 border border-dashed border-[#303030]/20 text-[#303030]/30 font-mono font-bold text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded-sm rotate-12 select-none no-print">
              ORIGINAL BLUEPRINT
            </div>

            {/* Print Friendly Header Banner (Delhi Public School, Sector-4, Bokaro / Subject: English / Class: 5th) */}
            <div 
              style={{
                width: '100%',
                maxWidth: '996px',
                fontFamily: "'Inter'",
                fontStyle: 'normal',
                fontWeight: 700,
                fontSize: '32px',
                lineHeight: '160%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                letterSpacing: '-0.04em',
                color: '#303030'
              }}
            >
              <span className="uppercase">{paper.schoolName || 'Delhi Public School, Sector-4, Bokaro'}</span>
              <span>Subject: {paper.subject || 'English'}</span>
              <span>Class: {paper.className || '5th'}</span>
            </div>

            {/* Subtitle details Row (Frame 1984077298) */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0px',
                gap: '10px',
                width: '100%',
                maxWidth: '996px',
                marginTop: '16px'
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '160%',
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center',
                  letterSpacing: '-0.04em',
                  color: '#303030'
                }}
              >
                Time Allowed: {paper.timeAllowed || '45 minutes'}
              </span>
              <span
                style={{
                  fontFamily: "'Inter'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '160%',
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center',
                  letterSpacing: '-0.04em',
                  color: '#303030'
                }}
              >
                Maximum Marks: {paper.maxMarks || '20'}
              </span>
            </div>

            {/* General instructions block (Frame 1984077299) */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0px',
                gap: '10px',
                width: '100%',
                maxWidth: '996px',
                height: '29px',
                marginTop: '12px'
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '160%',
                  display: 'flex',
                  alignItems: 'center',
                  letterSpacing: '-0.04em',
                  color: '#303030'
                }}
              >
                All questions are compulsory unless stated otherwise.
              </span>
            </div>

            {/* Student details box (Frame 1984077300) */}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                width: '100%',
                maxWidth: '996px',
                marginTop: '16px',
                gap: '4px'
              }}
            >
              <div 
                style={{
                  fontFamily: "'Inter'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '160%',
                  display: 'flex',
                  alignItems: 'center',
                  letterSpacing: '-0.04em',
                  color: '#303030'
                }}
              >
                Name: ______________________
              </div>
              <div 
                style={{
                  fontFamily: "'Inter'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '160%',
                  display: 'flex',
                  alignItems: 'center',
                  letterSpacing: '-0.04em',
                  color: '#303030'
                }}
              >
                Roll Number: ________________
              </div>
              <div 
                style={{
                  fontFamily: "'Inter'",
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '18px',
                  lineHeight: '160%',
                  display: 'flex',
                  alignItems: 'center',
                  letterSpacing: '-0.04em',
                  color: '#303030'
                }}
              >
                Class: {paper.className || '5th'} Section: __________
              </div>
            </div>

            {/* Compiled Section Loops (Figma Exact Styling) */}
            <div className="w-full">
              {paper.sections.map((section, sIdx) => {
                return (
                  <div key={sIdx} className="w-full">
                    {/* Frame 1984077301 - Section Label Header */}
                    <div 
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '10px',
                        width: '100%',
                        maxWidth: '996px',
                        marginTop: '24px'
                      }}
                      className="mx-auto"
                    >
                      <h3 
                        style={{
                          fontFamily: "'Inter'",
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '24px',
                          lineHeight: '160%',
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'center',
                          letterSpacing: '-0.04em',
                          color: '#303030'
                        }}
                      >
                        Section {String.fromCharCode(65 + sIdx)}
                      </h3>
                    </div>

                    {/* Frame 1984077302 - Section Subtitles */}
                    <div 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        width: '100%',
                        maxWidth: '996px',
                        marginTop: '12px'
                      }}
                      className="mx-auto text-left"
                    >
                      <h4 
                        style={{
                          fontFamily: "'Inter'",
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '18px',
                          lineHeight: '160%',
                          letterSpacing: '-0.04em',
                          color: '#303030'
                        }}
                      >
                        {section.title}
                      </h4>
                      <p 
                        style={{
                          fontFamily: "'Inter'",
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '18px',
                          lineHeight: '160%',
                          letterSpacing: '-0.04em',
                          color: '#303030',
                          opacity: 0.8
                        }}
                        className="italic"
                      >
                        {section.instruction || 'Read the questions carefully and answer.'}
                      </p>
                    </div>

                    {/* Frame 1984077303 - Question list in 240% Line Height */}
                    <div 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: '996px',
                        gap: '12px',
                        marginTop: '16px'
                      }}
                      className="text-left mx-auto"
                    >
                      {section.questions.map((q, qIdx) => {
                        return (
                          <div 
                            key={q.id} 
                            id={`question-item-${q.id}`}
                            style={{
                              fontFamily: "'Inter'",
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '240%',
                              letterSpacing: '-0.04em',
                              color: '#303030',
                              display: 'flex',
                              alignItems: 'flex-start',
                              width: '100%'
                            }}
                          >
                            <span className="shrink-0" style={{ width: '28px' }}>
                              {qIdx + 1}.
                            </span>
                            <div className="flex-1 select-text whitespace-pre-line">
                              {q.difficulty ? `[${q.difficulty}] ` : ''}{q.text} {q.marks ? `[${q.marks} Marks]` : ''}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider sign */}
            <div 
              style={{
                fontFamily: "'Inter'",
                fontWeight: 700,
                fontSize: '16px',
                color: '#303030',
                marginTop: '32px'
              }}
              className="text-center select-none w-full"
            >
              End of Question Paper
            </div>

            {/* Companion confidential Answer key sheet */}
            {showAnswerKey && paper.answerKey && paper.answerKey.length > 0 && (
              <div className="print-page-break pt-10 mt-12 space-y-6 w-full">
                <div 
                  style={{
                    fontFamily: "'Inter'",
                    fontWeight: 700,
                    fontSize: '24px',
                    color: '#303030',
                    marginTop: '32px',
                    width: '100%'
                  }}
                  className="text-left"
                >
                  Answer Key:
                </div>

                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: '996px',
                    gap: '12px',
                    marginTop: '16px'
                  }}
                  className="text-left mx-auto"
                >
                  {paper.answerKey.map((item, index) => (
                    <div 
                      key={index} 
                      style={{
                        fontFamily: "'Inter'",
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '240%',
                        letterSpacing: '-0.04em',
                        color: '#303030',
                        display: 'flex',
                        alignItems: 'flex-start',
                        width: '100%'
                      }}
                      className="select-text whitespace-pre-line"
                    >
                      <span className="shrink-0" style={{ width: '28px' }}>
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        {item.answerText}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Info pane in Desktop for help notes */}
        <div className="space-y-5 no-print select-none">
          {/* Summary */}
          <div className="bg-[#fdfdfc] border border-[#e5e5e0] rounded-sm p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-[#e5e5e0] pb-2">
              Exam Summary
            </h3>
            
            <div className="space-y-3 font-sans">
              <div className="flex justify-between items-center py-1 font-semibold text-xs text-slate-600 border-b border-[#fafaf7]">
                <span>Sections Total</span>
                <span className="text-[#1a1a1a] font-mono font-bold">{paper.sections?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1 font-semibold text-xs text-slate-600 border-b border-[#fafaf7]">
                <span>Total Questions</span>
                <span className="text-[#1a1a1a] font-mono font-bold">{assignment.totalQuestions} Questions</span>
              </div>
              <div className="flex justify-between items-center py-1 font-semibold text-xs text-slate-600 border-b border-[#fafaf7]">
                <span>Total Marks</span>
                <span className="text-[#1a1a1a] font-mono font-bold">{assignment.totalMarks} Marks</span>
              </div>
              <div className="flex justify-between items-center py-1 font-semibold text-xs text-slate-600">
                <span>Material Source</span>
                <span className="text-[#1a1a1a] truncate max-w-[120px] font-mono text-[11px]">{assignment.fileName || 'General Syllabus'}</span>
              </div>
            </div>
          </div>

          {/* Action Helper Tool Box */}
          <div className="bg-[#1a1a1a] text-white rounded-sm p-6 shadow-sm space-y-4 border border-[#2a2a28]">
            <h4 className="text-xs font-bold text-[#fdfdfc] flex items-center gap-2 font-mono uppercase tracking-widest leading-none border-b border-white/10 pb-2">
              <HelpCircle className="w-3.5 h-3.5 text-slate-300" /> Print PDF Advice
            </h4>
            <p className="text-[11px] text-slate-300 font-light leading-relaxed">
              VedaAI compiles print grids for accurate alignment. When compiling the PDF copy inside the printer window:
            </p>
            <ol className="text-[10px] text-slate-400 space-y-2 font-sans pl-4 list-decimal font-medium leading-relaxed">
              <li>Set **Destination: Save as PDF** in your local browser settings.</li>
              <li>Toggle **Background Graphics** to **ON** to render borders.</li>
              <li>Choose **None** or **Default** margins configuration to ensure precise padding.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
