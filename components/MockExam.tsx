
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Flag, X, CheckCircle2, RotateCcw, Target, LayoutGrid, FileText, ArrowRight, Play } from 'lucide-react';
import { MockQuestion, ExamResult } from '../types';
import { parseMockFromText } from '../services/geminiService';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const MockExam: React.FC = () => {
  // Modes: 'setup' | 'config' | 'loading' | 'exam' | 'result'
  const [mode, setMode] = useState<'setup' | 'config' | 'loading' | 'exam' | 'result'>('setup');
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  
  // Setup State
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [targetTime, setTargetTime] = useState(30); // Default 30s
  
  // Exam State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [examId, setExamId] = useState<string>('');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  // Timer Refs
  const questionStartTimeRef = useRef<number>(Date.now());
  const [currentQTimer, setCurrentQTimer] = useState(0);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (mode === 'exam') {
      // Reset timer visual when question changes to reflect time spent SO FAR on this question
      // This is the "Bank" logic: if I spent 5s earlier, it starts at 5s.
      setCurrentQTimer(questions[currentQIndex]?.timeSpent || 0);
      questionStartTimeRef.current = Date.now();

      interval = setInterval(() => {
        const now = Date.now();
        // Visual update
        setCurrentQTimer(prev => prev + 1);
        
        // Data update: Increment the existing timeSpent for the current question
        setQuestions(prev => {
           const newQs = [...prev];
           // Safety check
           if (newQs[currentQIndex]) {
             newQs[currentQIndex].timeSpent += 1;
           }
           return newQs;
        });
        
        questionStartTimeRef.current = now;
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, currentQIndex]);


  const handleParseText = async () => {
    if (!questionText.trim()) {
      alert("Please paste the questions first.");
      return;
    }
    setMode('loading');
    const qs = await parseMockFromText(questionText, answerText);
    if (qs.length > 0) {
      setQuestions(qs);
      setMode('config');
    } else {
      setMode('setup');
      alert("Could not parse questions. Please ensure text is readable.");
    }
  };

  const startExam = () => {
    setMode('exam');
    setExamId(Date.now().toString());
    setCurrentQIndex(0);
    questionStartTimeRef.current = Date.now();
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

  const changeQuestion = (newIndex: number) => {
    setCurrentQIndex(newIndex);
  };

  const handleSaveAndNext = () => {
    const q = questions[currentQIndex];
    if (q.userAnswer !== undefined) {
       updateStatus(currentQIndex, 'answered');
    } else if (q.status === 'not_visited') {
       updateStatus(currentQIndex, 'not_answered');
    }
    if (currentQIndex < questions.length - 1) {
      changeQuestion(currentQIndex + 1);
    }
  };

  const handleMarkAndNext = () => {
    const q = questions[currentQIndex];
    if (q.userAnswer !== undefined) {
      updateStatus(currentQIndex, 'marked_answered');
    } else {
      updateStatus(currentQIndex, 'marked');
    }
    if (currentQIndex < questions.length - 1) {
      changeQuestion(currentQIndex + 1);
    }
  };

  const handleClearResponse = () => {
    setQuestions(prev => {
      const newQs = [...prev];
      newQs[currentQIndex].userAnswer = undefined;
      newQs[currentQIndex].status = 'not_answered';
      return newQs;
    });
  };

  const handleSubmitExam = () => {
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

    const result: ExamResult = {
      id: examId,
      timestamp: Date.now(),
      score: score,
      totalQuestions: questions.length,
      targetTimePerQuestion: targetTime,
      questions: questions
    };

    const existingHistory = localStorage.getItem('bankedge_exam_history');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    localStorage.setItem('bankedge_exam_history', JSON.stringify([result, ...history]));

    setMode('result');
  };

  const getTimerColor = (time: number) => {
    if (time <= targetTime) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (time <= targetTime + 10) return 'text-amber-600 bg-amber-50 border-amber-200 animate-pulse';
    return 'text-red-600 bg-red-50 border-red-200 animate-pulse';
  };

  // --- Renders ---

  if (mode === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Drill Engine</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Paste your questions, set a target time, and build speed. 
            <br/>AI will auto-solve if you don't have an answer key.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block font-bold text-slate-700 flex items-center gap-2">
              <div className="bg-indigo-100 p-1.5 rounded text-indigo-600"><FileText size={18} /></div>
              Input Questions (Required)
            </label>
            <textarea 
              className="w-full h-64 p-4 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm"
              placeholder="Paste the raw text of questions here...&#10;1. A train moving at speed...&#10;2. Ratio of ages..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <label className="block font-bold text-slate-700 flex items-center gap-2">
              <div className="bg-emerald-100 p-1.5 rounded text-emerald-600"><CheckCircle2 size={18} /></div>
              Input Answer Key (Optional)
            </label>
            <textarea 
              className="w-full h-64 p-4 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-sm"
              placeholder="If you have the key, paste it here.&#10;1. B&#10;2. C&#10;3. A&#10;&#10;If left empty, AI will solve the questions for you."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleParseText}
            disabled={!questionText.trim()}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
             Next Step <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-800">Processing Exam Data</h3>
          <p className="text-slate-500 mt-2">
            {answerText.trim() ? "Mapping questions to provided key..." : "AI is solving your questions..."}
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'config') {
    return (
      <div className="max-w-xl mx-auto text-center animate-in zoom-in-95 mt-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
           <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
             <Target size={32} />
           </div>
           <h2 className="text-2xl font-bold text-slate-800 mb-2">Set Your Target</h2>
           <p className="text-slate-500 mb-8">
             How many seconds should each question take?
             <br/><span className="text-xs text-amber-600 font-bold">The timer will turn RED if you exceed this.</span>
           </p>
           
           <div className="mb-10 px-8">
             <input 
               type="range" 
               min="10" 
               max="120" 
               step="5"
               value={targetTime}
               onChange={(e) => setTargetTime(parseInt(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
             />
             <div className="mt-4 text-4xl font-bold text-indigo-600 font-mono">
               {targetTime} <span className="text-lg text-slate-400">sec/ques</span>
             </div>
           </div>

           <div className="flex gap-4">
             <button onClick={() => setMode('setup')} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">Back</button>
             <button onClick={startExam} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2">
               <Play size={20} fill="currentColor" /> Start Drill
             </button>
           </div>
        </div>
      </div>
    );
  }

  if (mode === 'result') {
    let correct = 0, wrong = 0, skipped = 0;
    
    // Quadrant Analysis Counts
    let sniper = 0, struggle = 0, gambler = 0, timeWaster = 0;

    questions.forEach(q => {
      const isCorrect = q.userAnswer === q.correctAnswerIndex;
      const isFast = q.timeSpent <= targetTime;
      const attempted = q.userAnswer !== undefined;

      if (!attempted) {
        skipped++;
      } else {
        if (isCorrect) correct++; else wrong++;
        
        if (isCorrect && isFast) sniper++;
        else if (isCorrect && !isFast) struggle++;
        else if (!isCorrect && isFast) gambler++;
        else if (!isCorrect && !isFast) timeWaster++;
      }
    });

    const score = correct * 1 - wrong * 0.25;
    
    // Prepare Data for Chart
    const quadrantData = [
      { name: 'Sniper (Fast & Correct)', value: sniper, color: '#10b981' }, // Emerald
      { name: 'Struggle (Slow & Correct)', value: struggle, color: '#f59e0b' }, // Amber
      { name: 'Gambler (Fast & Wrong)', value: gambler, color: '#6366f1' }, // Indigo
      { name: 'Time Waster (Slow & Wrong)', value: timeWaster, color: '#ef4444' } // Red
    ].filter(d => d.value > 0);

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg md:col-span-1">
            <h2 className="text-lg font-bold text-slate-300 mb-4">Exam Summary</h2>
            <div className="text-5xl font-bold text-white mb-2">{score}</div>
            <div className="text-sm text-slate-400 mb-6">out of {questions.length}</div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/10 p-2 rounded">
                <span className="text-emerald-400 font-bold">Correct</span>
                <span className="font-mono">{correct}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-2 rounded">
                <span className="text-red-400 font-bold">Wrong</span>
                <span className="font-mono">{wrong}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-2 rounded">
                <span className="text-slate-300 font-bold">Skipped</span>
                <span className="font-mono">{skipped}</span>
              </div>
            </div>
          </div>

          {/* Quadrant Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2 flex flex-col items-center justify-center relative">
             <h3 className="absolute top-6 left-6 font-bold text-slate-800">Time-Accuracy Matrix</h3>
             {quadrantData.length > 0 ? (
               <div className="flex flex-col md:flex-row items-center w-full">
                 <div className="h-64 w-64">
                   <ResponsiveContainer>
                     <PieChart>
                       <Pie data={quadrantData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                         {quadrantData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <Tooltip />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="flex-1 grid grid-cols-1 gap-4 ml-4">
                    {quadrantData.map(d => (
                      <div key={d.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor: d.color}} />
                        <div>
                          <p className="font-bold text-slate-800">{d.value} Qs</p>
                          <p className="text-xs text-slate-500">{d.name}</p>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
             ) : (
               <div className="text-slate-400">No attempts made.</div>
             )}
          </div>
        </div>

        {/* Detailed Review */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800">Question Analysis</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {questions.map((q, i) => {
               const isCorrect = q.userAnswer === q.correctAnswerIndex;
               const isFast = q.timeSpent <= targetTime;
               let badge = "Unattempted";
               let badgeColor = "bg-slate-100 text-slate-600";
               
               if (q.userAnswer !== undefined) {
                 if (isCorrect && isFast) { badge = "Sniper"; badgeColor = "bg-emerald-100 text-emerald-700"; }
                 else if (isCorrect && !isFast) { badge = "Struggle"; badgeColor = "bg-amber-100 text-amber-700"; }
                 else if (!isCorrect && isFast) { badge = "Gambler"; badgeColor = "bg-indigo-100 text-indigo-700"; }
                 else { badge = "Time Waster"; badgeColor = "bg-red-100 text-red-700"; }
               }

               return (
                 <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-700' : q.userAnswer === undefined ? 'bg-slate-200 text-slate-600' : 'bg-red-100 text-red-700'}`}>
                           {i+1}
                         </span>
                         <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${badgeColor}`}>
                           {badge}
                         </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                         <div className={`flex items-center gap-1 font-mono font-bold ${q.timeSpent > targetTime ? 'text-red-500' : 'text-slate-400'}`}>
                           <Clock size={16} /> {q.timeSpent}s
                         </div>
                         <div className="text-slate-400 font-mono text-xs">Target: {targetTime}s</div>
                      </div>
                   </div>
                   
                   <p className="text-slate-800 font-medium mb-4">{q.questionText}</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                     {q.options.map((opt, idx) => (
                       <div key={idx} className={`p-2 rounded border text-sm flex items-center gap-2 ${idx === q.correctAnswerIndex ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : idx === q.userAnswer ? 'border-red-500 bg-red-50 text-red-800' : 'border-slate-200 text-slate-600'}`}>
                          {idx === q.correctAnswerIndex && <CheckCircle2 size={16} />}
                          {idx === q.userAnswer && idx !== q.correctAnswerIndex && <X size={16} />}
                          {opt}
                       </div>
                     ))}
                   </div>
                   
                   <div className="bg-slate-50 p-3 rounded text-sm text-slate-600 border border-slate-200">
                     <span className="font-bold text-slate-700">Explanation: </span> {q.explanation}
                   </div>
                 </div>
               );
            })}
          </div>
        </div>

        <button onClick={() => setMode('setup')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 shadow-lg mb-8">Start New Drill</button>
      </div>
    );
  }

  // --- Exam Interface ---

  const currentQ = questions[currentQIndex];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-20">
         <div className="flex items-center gap-4">
            <span className="font-bold text-xl text-slate-800 tracking-tight">Drill Mode</span>
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
              <Target size={14} /> Target: {targetTime}s
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button 
             onClick={() => setIsPaletteOpen(!isPaletteOpen)}
             className="md:hidden bg-slate-100 p-2 rounded text-slate-600"
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={handleSubmitExam}
              className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              Finish Drill
            </button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
           
           {/* Timer Bar */}
           <div className="bg-white/80 backdrop-blur-md p-4 flex justify-center border-b border-slate-200 sticky top-0 z-10">
              <div className={`px-8 py-3 rounded-2xl border-2 font-mono text-4xl font-bold shadow-sm transition-colors duration-500 flex items-center gap-4 ${getTimerColor(currentQTimer)}`}>
                 <Clock size={32} />
                 {currentQTimer}s
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
                 <div className="flex justify-between items-start mb-6">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentQIndex + 1}</span>
                    {currentQ.status === 'marked' || currentQ.status === 'marked_answered' ? (
                       <Flag size={20} className="text-purple-600 fill-purple-600" />
                    ) : null}
                 </div>
                 
                 <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-8 font-serif">
                   {currentQ.questionText}
                 </p>

                 <div className="space-y-3">
                   {currentQ.options.map((opt, idx) => (
                     <label key={idx} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all group ${currentQ.userAnswer === idx ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}`}>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${currentQ.userAnswer === idx ? 'border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                          {currentQ.userAnswer === idx && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                       </div>
                       <span className={`text-lg ${currentQ.userAnswer === idx ? 'text-indigo-900 font-medium' : 'text-slate-600'}`}>{opt}</span>
                       <input 
                         type="radio" 
                         className="hidden"
                         name={`q-${currentQIndex}`}
                         checked={currentQ.userAnswer === idx}
                         onChange={() => {
                           setQuestions(prev => {
                             const n = [...prev];
                             n[currentQIndex].userAnswer = idx;
                             return n;
                           });
                         }}
                       />
                     </label>
                   ))}
                 </div>
              </div>
           </div>

           {/* Footer Control */}
           <div className="h-20 bg-white border-t border-slate-200 px-8 flex items-center justify-between z-10">
              <div className="flex gap-4">
                 <button onClick={handleMarkAndNext} className="flex flex-col items-center text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors gap-1">
                    <Flag size={20} /> Mark
                 </button>
                 <button onClick={handleClearResponse} className="flex flex-col items-center text-xs font-bold text-slate-500 hover:text-red-600 transition-colors gap-1">
                    <RotateCcw size={20} /> Clear
                 </button>
              </div>

              <div className="flex gap-4">
                 <button 
                   onClick={() => changeQuestion(Math.max(0, currentQIndex - 1))}
                   disabled={currentQIndex === 0}
                   className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                 >
                   Previous
                 </button>
                 <button 
                   onClick={handleSaveAndNext}
                   className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                 >
                   {currentQIndex === questions.length - 1 ? 'Finish' : 'Save & Next'}
                 </button>
              </div>
           </div>
        </div>

        {/* Right Palette */}
        <div className={`
          fixed inset-y-0 right-0 w-80 bg-slate-50 border-l border-slate-200 shadow-2xl transform transition-transform duration-300 z-30 flex flex-col
          md:static md:translate-x-0 md:shadow-none
          ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
           <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center md:hidden">
              <span className="font-bold text-slate-800">Question Palette</span>
              <button onClick={() => setIsPaletteOpen(false)}><X size={24} /></button>
           </div>
           
           <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Jump to Question</h3>
              <div className="grid grid-cols-4 gap-3">
                 {questions.map((q, idx) => {
                    let bg = "bg-white border-slate-200 text-slate-600";
                    if (idx === currentQIndex) bg = "ring-2 ring-indigo-600 border-transparent bg-indigo-50 text-indigo-700";
                    else if (q.status === 'answered') bg = "bg-emerald-500 text-white border-transparent";
                    else if (q.status === 'not_answered') bg = "bg-red-500 text-white border-transparent";
                    else if (q.status === 'marked') bg = "bg-purple-500 text-white border-transparent";
                    else if (q.status === 'marked_answered') bg = "bg-purple-600 text-white border-transparent ring-2 ring-emerald-400";

                    return (
                      <button 
                        key={idx}
                        onClick={() => changeQuestion(idx)}
                        className={`h-10 rounded-lg font-bold text-sm shadow-sm border transition-all ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    )
                 })}
              </div>
           </div>
           
           <div className="p-6 bg-white border-t border-slate-200">
              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-500">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Answered</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Skipped</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Marked</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-slate-300 rounded-sm"></div> Not Visited</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MockExam;
