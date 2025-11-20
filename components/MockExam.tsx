import React, { useState, useEffect, useMemo } from 'react';
import { Clock, ChevronRight, Flag, X, CheckCircle2, RotateCcw, Tag, Save } from 'lucide-react';
import { MockQuestion, AnalysisTag, ExamResult } from '../types';
import { generateMockExam, parseMockFromText } from '../services/geminiService';

const MockExam: React.FC = () => {
  // Modes: 'landing' | 'loading' | 'exam' | 'result'
  const [mode, setMode] = useState<'landing' | 'loading' | 'exam' | 'result'>('landing');
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentSection, setCurrentSection] = useState<'Reasoning' | 'Quantitative Aptitude'>('Reasoning');
  const [currentQIndex, setCurrentQIndex] = useState(0); // Relative to section
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [pasteText, setPasteText] = useState('');
  const [examId, setExamId] = useState<string>('');

  // Derived state for current section questions to handle navigation
  const sectionQuestions = useMemo(() => {
    return questions.filter(q => q.section === currentSection);
  }, [questions, currentSection]);

  const currentQuestion = sectionQuestions[currentQIndex];
  
  // Find the actual global index in the main 'questions' array
  const globalIndex = useMemo(() => {
    if (!currentQuestion) return -1;
    return questions.indexOf(currentQuestion);
  }, [questions, currentQuestion]);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (mode === 'exam' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, timeLeft]);

  const handleStartAI = async (type: 'PO' | 'Clerk') => {
    setMode('loading');
    const qs = await generateMockExam(type);
    if (qs.length > 0) {
      setQuestions(qs);
      setMode('exam');
      setTimeLeft(20 * 60); // Mini mock, 20 mins
      setExamId(Date.now().toString());
    } else {
      setMode('landing');
      alert("Failed to generate mock. Please try again.");
    }
  };

  const handleParseText = async () => {
    if (!pasteText.trim()) return;
    setMode('loading');
    const qs = await parseMockFromText(pasteText);
    if (qs.length > 0) {
      setQuestions(qs);
      setMode('exam');
      setTimeLeft(45 * 60);
      setExamId(Date.now().toString());
    } else {
      setMode('landing');
      alert("Could not parse questions from text. Ensure the text is clear.");
    }
  };

  const updateStatus = (idx: number, status: MockQuestion['status'], answer?: number) => {
    setQuestions(prev => {
      const newQs = [...prev];
      newQs[idx] = { 
        ...newQs[idx], 
        status: status,
        userAnswer: answer !== undefined ? answer : newQs[idx].userAnswer
      };
      return newQs;
    });
  };

  const handleSaveAndNext = () => {
    if (globalIndex === -1) return;
    // If option selected, mark answered. Else just visited (if not already visited)
    const q = questions[globalIndex];
    if (q.userAnswer !== undefined) {
       updateStatus(globalIndex, 'answered');
    } else if (q.status === 'not_visited') {
       updateStatus(globalIndex, 'not_answered');
    }
    goNext();
  };

  const handleMarkAndNext = () => {
    if (globalIndex === -1) return;
    const q = questions[globalIndex];
    if (q.userAnswer !== undefined) {
      updateStatus(globalIndex, 'marked_answered');
    } else {
      updateStatus(globalIndex, 'marked');
    }
    goNext();
  };

  const handleClearResponse = () => {
    if (globalIndex === -1) return;
    setQuestions(prev => {
      const newQs = [...prev];
      newQs[globalIndex].userAnswer = undefined;
      newQs[globalIndex].status = 'not_answered'; // Revert to not answered
      return newQs;
    });
  };

  const goNext = () => {
    if (currentQIndex < sectionQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    }
  };

  const changeSection = (sec: 'Reasoning' | 'Quantitative Aptitude') => {
    setCurrentSection(sec);
    setCurrentQIndex(0);
  };

  const handleSubmit = () => {
    // Calculate Score
    let correct = 0;
    let wrong = 0;
    questions.forEach(q => {
      if (q.userAnswer !== undefined) {
        if (q.userAnswer === q.correctAnswerIndex) correct++;
        else wrong++;
      }
    });
    const score = correct * 1 - wrong * 0.25;

    // Save to Local Storage
    const result: ExamResult = {
      id: examId,
      timestamp: Date.now(),
      score: score,
      totalQuestions: questions.length,
      questions: questions
    };

    const existingHistory = localStorage.getItem('bankedge_exam_history');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    localStorage.setItem('bankedge_exam_history', JSON.stringify([result, ...history]));

    setMode('result');
  };

  const handleTagUpdate = (qIndex: number, tag: AnalysisTag) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].analysisTag = tag;
    setQuestions(updatedQuestions);

    // Update in local storage as well
    const existingHistory = localStorage.getItem('bankedge_exam_history');
    if (existingHistory) {
      const history: ExamResult[] = JSON.parse(existingHistory);
      const examIndex = history.findIndex(h => h.id === examId);
      if (examIndex > -1) {
        history[examIndex].questions = updatedQuestions;
        localStorage.setItem('bankedge_exam_history', JSON.stringify(history));
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // -- Renders --

  if (mode === 'landing') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">IBPS RRB Exam Simulator</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Experience the real exam interface. Practice with AI-generated mocks or upload previous year papers to simulate the pressure environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Generator Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 hover:border-indigo-300 transition-all">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
              <Clock size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">AI Generated Mock</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Instantly generate a balanced mini-mock (Reasoning + Quant) based on latest patterns.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => handleStartAI('PO')}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Start PO Mock
              </button>
              <button 
                onClick={() => handleStartAI('Clerk')}
                className="flex-1 bg-white text-indigo-600 border border-indigo-200 py-2.5 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Start Clerk Mock
              </button>
            </div>
          </div>

          {/* Upload/Paste Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-slate-300 transition-all">
             <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
              <Save size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Analyze Past Paper</h3>
            <p className="text-slate-500 mb-4 text-sm">
              Paste text from a PDF or website. AI will parse it into a live mock test.
            </p>
            <textarea 
              className="w-full h-24 p-3 text-sm border border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Paste question paper text here..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <button 
              onClick={handleParseText}
              disabled={!pasteText.trim()}
              className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              Parse & Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-600 font-medium">Preparing your exam environment...</p>
      </div>
    );
  }

  if (mode === 'result') {
    // Calculate Score Display
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    questions.forEach(q => {
      if (q.userAnswer === undefined) unattempted++;
      else if (q.userAnswer === q.correctAnswerIndex) correct++;
      else wrong++;
    });
    const score = correct * 1 - wrong * 0.25;

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Exam Analysis</h2>
          <div className="text-5xl font-bold text-emerald-400 my-6">{score} <span className="text-lg text-slate-400">/ {questions.length}</span></div>
          <div className="flex justify-center gap-8 text-sm mb-6">
             <div className="text-center">
               <div className="text-emerald-400 font-bold text-xl">{correct}</div>
               <div className="text-slate-400">Correct</div>
             </div>
             <div className="text-center">
               <div className="text-red-400 font-bold text-xl">{wrong}</div>
               <div className="text-slate-400">Wrong</div>
             </div>
             <div className="text-center">
               <div className="text-slate-200 font-bold text-xl">{unattempted}</div>
               <div className="text-slate-400">Skipped</div>
             </div>
          </div>
          <p className="text-slate-400 text-sm bg-slate-800/50 inline-block px-4 py-2 rounded-full border border-slate-700">
            <Tag size={14} className="inline mr-2" />
            Tag your mistakes below to help AI identify your weak areas.
          </p>
        </div>
        <div className="p-8 bg-slate-50">
           <h3 className="font-bold text-slate-800 mb-6 text-xl flex items-center gap-2">
             Detailed Solutions & Analysis
           </h3>
           <div className="space-y-6">
             {questions.map((q, i) => {
               const isCorrect = q.userAnswer === q.correctAnswerIndex;
               const isSkipped = q.userAnswer === undefined;
               
               return (
                 <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                   <div className="flex justify-between items-start mb-4">
                     <div className="flex gap-3">
                        <span className={`
                          flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                          ${isCorrect ? 'bg-emerald-100 text-emerald-700' : isSkipped ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'}
                        `}>
                          {i+1}
                        </span>
                        <div>
                           <p className="font-medium text-slate-800 text-lg">{q.questionText}</p>
                           <div className="flex gap-2 mt-1">
                             <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{q.section}</span>
                             <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{q.topic}</span>
                           </div>
                        </div>
                     </div>
                   </div>

                   <div className="ml-11 space-y-2 text-sm mb-4">
                     {q.options.map((opt, idx) => (
                       <div key={idx} className={`
                          flex items-center gap-2 p-2 rounded border
                          ${idx === q.correctAnswerIndex ? 'border-green-200 bg-green-50 text-green-800 font-medium' : ''}
                          ${idx === q.userAnswer && idx !== q.correctAnswerIndex ? 'border-red-200 bg-red-50 text-red-800 line-through' : 'border-transparent text-slate-600'}
                       `}>
                         {idx === q.correctAnswerIndex && <CheckCircle2 size={16} />}
                         {idx === q.userAnswer && idx !== q.correctAnswerIndex && <X size={16} />}
                         {opt}
                       </div>
                     ))}
                   </div>

                   <div className="ml-11 bg-slate-50 p-4 rounded-lg text-sm text-slate-700 border border-slate-100 mb-4">
                     <span className="font-bold block mb-1 text-indigo-900">Explanation:</span> 
                     {q.explanation}
                   </div>

                   {/* Tagging Section */}
                   <div className="ml-11 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Analysis Tag</p>
                      <div className="flex flex-wrap gap-2">
                        {['Silly Mistake', 'Conceptual Error', 'Time Management', 'Guessed', 'Skipped Strategically'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagUpdate(i, tag as AnalysisTag)}
                            className={`
                              px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                              ${q.analysisTag === tag 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}
                            `}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                   </div>
                 </div>
               );
             })}
           </div>
           <button 
             onClick={() => setMode('landing')}
             className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 shadow-lg transition-all"
           >
             Save Analysis & Return to Dashboard
           </button>
        </div>
      </div>
    );
  }

  // --- EXAM UI ---
  
  const paletteStatusColor = (status: MockQuestion['status'], current: boolean) => {
    if (current) return 'ring-2 ring-black ring-offset-1'; 
    switch(status) {
      case 'answered': return 'bg-green-500 text-white clip-polygon-flat';
      case 'not_answered': return 'bg-red-500 text-white clip-polygon-flat-top';
      case 'marked': return 'bg-purple-600 text-white rounded-full';
      case 'marked_answered': return 'bg-purple-600 text-white relative after:content-["✔"] after:absolute after:bottom-0 after:right-0 after:text-[8px] after:bg-green-500 after:rounded-full after:px-0.5';
      default: return 'bg-slate-100 text-slate-700 border border-slate-300'; 
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans">
      <header className="bg-[#2c3e50] text-white h-14 px-4 flex justify-between items-center shadow-md">
         <div className="font-bold text-lg tracking-wide">IBPS RRB Online Exam</div>
         <div className="flex items-center space-x-4">
           <div className="text-sm hidden md:block">Candidate Name: <span className="font-bold">Krishna</span></div>
           <div className="bg-black/30 px-3 py-1 rounded flex items-center gap-2">
             <Clock size={16} className="text-white" />
             <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
           </div>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-white border-b border-slate-300 flex px-4 pt-2 gap-1">
             <button 
              onClick={() => changeSection('Reasoning')}
              className={`px-6 py-2 rounded-t-lg text-sm font-bold border-t border-l border-r ${currentSection === 'Reasoning' ? 'bg-[#3498db] text-white border-[#3498db]' : 'bg-slate-100 text-slate-600 border-slate-300'}`}
             >
               Reasoning
             </button>
             <button 
               onClick={() => changeSection('Quantitative Aptitude')}
               className={`px-6 py-2 rounded-t-lg text-sm font-bold border-t border-l border-r ${currentSection === 'Quantitative Aptitude' ? 'bg-[#3498db] text-white border-[#3498db]' : 'bg-slate-100 text-slate-600 border-slate-300'}`}
             >
               Quantitative Aptitude
             </button>
          </div>

          <div className="bg-[#3498db] text-white px-4 py-1 flex justify-between items-center text-sm shadow-sm z-10">
            <span className="font-semibold">Question Type: Multiple Choice Question</span>
            <div className="flex gap-4">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold text-green-300">+1 | -0.25</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-white">
             {currentQuestion ? (
               <div className="max-w-4xl">
                 <div className="flex gap-2 mb-4">
                   <span className="font-bold text-slate-800 text-lg">Q.{currentQIndex + 1}</span>
                   <p className="text-lg text-slate-800 leading-relaxed font-medium font-serif border-b border-slate-100 pb-4 w-full">
                     {currentQuestion.questionText}
                   </p>
                 </div>
                 
                 <div className="space-y-3 ml-8">
                   {currentQuestion.options.map((opt, idx) => (
                     <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                       <input 
                         type="radio" 
                         name={`q-${globalIndex}`}
                         checked={currentQuestion.userAnswer === idx}
                         onChange={() => {
                           setQuestions(prev => {
                             const n = [...prev];
                             n[globalIndex].userAnswer = idx;
                             return n;
                           });
                         }}
                         className="mt-1.5 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                       />
                       <span className="text-slate-700 text-base group-hover:text-slate-900">{opt}</span>
                     </label>
                   ))}
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-400">
                 <p>No questions in this section.</p>
               </div>
             )}
          </div>

          <div className="h-16 border-t border-slate-300 bg-slate-50 px-4 flex items-center justify-between">
             <div className="flex gap-2">
               <button 
                 onClick={handleMarkAndNext}
                 className="px-4 py-2 bg-indigo-100 text-indigo-800 border border-indigo-300 rounded hover:bg-indigo-200 text-sm font-semibold flex items-center gap-2"
               >
                 <Flag size={16} /> Mark for Review & Next
               </button>
               <button 
                 onClick={handleClearResponse}
                 className="px-4 py-2 bg-slate-200 text-slate-700 border border-slate-300 rounded hover:bg-slate-300 text-sm font-semibold flex items-center gap-2"
               >
                 <RotateCcw size={16} /> Clear Response
               </button>
             </div>
             
             <button 
               onClick={handleSaveAndNext}
               className="px-6 py-2 bg-[#3498db] text-white rounded hover:bg-blue-600 font-bold text-sm shadow-sm flex items-center gap-2"
             >
               Save & Next <ChevronRight size={18} />
             </button>
          </div>
        </div>

        <div className="w-80 bg-[#eef2f5] border-l border-slate-300 flex flex-col shadow-inner hidden lg:flex">
           <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                 <span className="text-xs text-slate-500">Photo</span>
              </div>
              <span className="font-bold text-slate-700">Krishna</span>
           </div>

           <div className="p-4 grid grid-cols-2 gap-y-2 gap-x-4 text-xs border-b border-slate-300 bg-white">
              <div className="flex items-center gap-2"><span className="w-6 h-6 bg-green-500 text-white flex items-center justify-center rounded-sm">0</span> Answered</div>
              <div className="flex items-center gap-2"><span className="w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-sm">0</span> Not Answered</div>
              <div className="flex items-center gap-2"><span className="w-6 h-6 bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center rounded-sm">0</span> Not Visited</div>
              <div className="flex items-center gap-2"><span className="w-6 h-6 bg-purple-600 text-white flex items-center justify-center rounded-full">0</span> Marked</div>
           </div>

           <div className="bg-[#3498db] text-white p-2 font-bold text-center text-sm">
             {currentSection}
           </div>

           <div className="p-4 flex-1 overflow-y-auto">
              <h4 className="font-bold text-slate-700 text-sm mb-4">Choose a Question:</h4>
              <div className="grid grid-cols-4 gap-3">
                {sectionQuestions.map((q, idx) => {
                   const isCurrent = currentQuestion === q;
                   return (
                     <button
                       key={idx}
                       onClick={() => setCurrentQIndex(idx)}
                       className={`
                         w-10 h-9 flex items-center justify-center text-sm font-bold rounded shadow-sm transition-all
                         ${paletteStatusColor(q.status, isCurrent)}
                       `}
                     >
                       {idx + 1}
                     </button>
                   )
                })}
              </div>
           </div>

           <div className="p-4 bg-white border-t border-slate-300">
             <button 
               onClick={handleSubmit}
               className="w-full bg-[#2ecc71] hover:bg-green-600 text-white py-3 rounded font-bold shadow-md transition-colors"
             >
               Submit Exam
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MockExam;