import React, { useState } from 'react';
import { Loader2, CheckCircle, XCircle, HelpCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { Subject, Difficulty, Question } from '../types';
import { generatePracticeQuestions } from '../services/geminiService';

const PracticeZone: React.FC = () => {
  const [config, setConfig] = useState({
    subject: Subject.QUANT,
    difficulty: Difficulty.MODERATE,
    topic: '',
    count: 5
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: number}>({});
  const [showExplanation, setShowExplanation] = useState<{[key: number]: boolean}>({});

  const handleGenerate = async () => {
    if (!config.topic) {
      alert("Please enter a specific topic (e.g., 'Number Series' or 'Blood Relations')");
      return;
    }
    setLoading(true);
    setQuestions([]);
    setUserAnswers({});
    setShowExplanation({});
    
    const generatedQuestions = await generatePracticeQuestions(config.subject, config.difficulty, config.topic, config.count);
    setQuestions(generatedQuestions);
    setLoading(false);
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (userAnswers[questionIdx] !== undefined) return; // Prevent changing answer
    setUserAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
    setShowExplanation(prev => ({ ...prev, [questionIdx]: true }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <RefreshCcw className="mr-2 text-indigo-600" />
          Question Generator
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={config.subject}
              onChange={(e) => setConfig({...config, subject: e.target.value as Subject})}
            >
              {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty Level</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={config.difficulty}
              onChange={(e) => setConfig({...config, difficulty: e.target.value as Difficulty})}
            >
              {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Specific Topic</label>
            <input 
              type="text" 
              placeholder="e.g., Quadratic Equations, Floor Puzzles, RBI Functions..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={config.topic}
              onChange={(e) => setConfig({...config, topic: e.target.value})}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-70 transition-colors flex items-center"
          >
            {loading ? <><Loader2 className="animate-spin mr-2" /> Generating...</> : 'Generate Questions'}
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                   <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">
                     Q{qIdx + 1} • {q.difficulty}
                   </span>
                </div>
                <p className="text-lg font-medium text-slate-800 mb-6">{q.questionText}</p>
                
                <div className="space-y-3">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userAnswers[qIdx] === oIdx;
                    const isCorrect = q.correctAnswerIndex === oIdx;
                    const showResult = userAnswers[qIdx] !== undefined;

                    let btnClass = "border-slate-200 hover:bg-slate-50";
                    if (showResult) {
                      if (isCorrect) btnClass = "bg-green-50 border-green-500 text-green-800";
                      else if (isSelected && !isCorrect) btnClass = "bg-red-50 border-red-500 text-red-800";
                      else btnClass = "border-slate-100 opacity-50";
                    } else if (isSelected) {
                       btnClass = "border-indigo-500 bg-indigo-50";
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(qIdx, oIdx)}
                        disabled={showResult}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {showResult && isCorrect && <CheckCircle size={20} className="text-green-600" />}
                        {showResult && isSelected && !isCorrect && <XCircle size={20} className="text-red-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {showExplanation[qIdx] && (
                <div className="bg-slate-50 p-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                   <div className="flex items-center space-x-2 text-indigo-700 font-semibold mb-2">
                     <HelpCircle size={18} />
                     <span>Explanation</span>
                   </div>
                   <p className="text-slate-600 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PracticeZone;
