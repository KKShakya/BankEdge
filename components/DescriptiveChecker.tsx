
import React, { useState } from 'react';
import { PenTool, CheckCircle, Loader2, AlertCircle, BookOpen, Hash, BarChart3, ChevronRight, RefreshCw, FileType, AlignLeft } from 'lucide-react';
import { evaluateDescriptiveWriting } from '../services/geminiService';
import { EssayAnalysis } from '../types';

const WRITING_TYPES = [
  "Essay",
  "Letter (Formal)",
  "Letter (Informal)",
  "Application",
  "Report Writing",
  "Precis Writing",
  "Comprehension Answer"
];

const COMMON_TOPICS = [
  "Impact of Artificial Intelligence on Indian Banking",
  "Climate Change and Green Banking Initiatives",
  "Role of Regional Rural Banks in Financial Inclusion",
  "Digital Rupee (e₹) vs. Cryptocurrency",
  "Privatization of Public Sector Banks: Pros & Cons",
  "Women Empowerment Schemes in India",
  "Cybersecurity Challenges in Digital Payments"
];

const DescriptiveChecker: React.FC = () => {
  const [writingType, setWritingType] = useState('Essay');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);

  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleAnalyze = async () => {
    if (!topic || !content) {
      alert("Please enter both a topic and your content.");
      return;
    }
    if (wordCount < 30) {
      alert("Submission is too short. Please write at least 30 words.");
      return;
    }

    setLoading(true);
    setAnalysis(null);
    const result = await evaluateDescriptiveWriting(writingType, topic, content);
    setAnalysis(result);
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 5) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-12">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-fuchsia-100 text-fuchsia-700 rounded-2xl mb-2">
           <PenTool size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900">Descriptive Writing</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Master the art of Essays, Letters, and Reports for PO Mains. AI checks your Grammar, Format, and Relevance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
             
             {/* Type Selection */}
             <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 flex items-center gap-2">
                  <FileType size={16} className="text-fuchsia-600" /> Writing Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {WRITING_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setWritingType(type)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${writingType === type ? 'bg-fuchsia-600 text-white border-fuchsia-600 shadow-lg shadow-fuchsia-200' : 'bg-white text-slate-600 border-slate-200 hover:border-fuchsia-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
             </div>

             <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 flex items-center gap-2">
                  <AlignLeft size={16} className="text-fuchsia-600" /> Topic / Question
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={writingType === 'Letter (Formal)' ? "e.g., Write a letter to Branch Manager regarding..." : "Enter topic or select from below..."}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 outline-none font-medium text-slate-800 transition-all"
                  />
                </div>
                {writingType === 'Essay' && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                     {COMMON_TOPICS.map((t, i) => (
                       <button 
                         key={i} 
                         onClick={() => setTopic(t)}
                         className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-fuchsia-400 hover:text-fuchsia-700 transition-colors"
                       >
                         {t}
                       </button>
                     ))}
                  </div>
                )}
             </div>

             <div className="relative">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 flex justify-between">
                   <span>Your Submission</span>
                   <span className={`text-xs ${wordCount > 250 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{wordCount} Words</span>
                </label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Start typing your ${writingType.toLowerCase()} here... Ensure correct format if applicable.`}
                  className="w-full h-96 p-6 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-fuchsia-100 focus:border-fuchsia-400 outline-none resize-none font-serif text-lg leading-relaxed text-slate-700 placeholder-slate-300 transition-all"
                />
             </div>

             <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                   {loading ? <><Loader2 className="animate-spin" size={18} /> Grading...</> : <><CheckCircle size={18} /> Evaluate {writingType.split(' ')[0]}</>}
                </button>
             </div>
          </div>
        </div>

        {/* Right: Analysis Dashboard */}
        <div className="lg:col-span-1">
           {analysis ? (
             <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
                {/* Score Cards */}
                <div className="grid grid-cols-3 gap-3">
                   {[
                     { label: 'Grammar', score: analysis.grammarScore },
                     { label: 'Relevance', score: analysis.relevanceScore },
                     { label: 'Vocab', score: analysis.vocabScore }
                   ].map((s, i) => (
                     <div key={i} className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreColor(s.score)}`}>
                        <span className="text-3xl font-black">{s.score}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">{s.label}</span>
                     </div>
                   ))}
                </div>

                {/* Feedback */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                      <BarChart3 size={20} className="text-fuchsia-600" /> Examiner's Feedback
                   </h3>
                   <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {analysis.feedback}
                   </p>
                   
                   {analysis.missingKeywords.length > 0 && (
                     <div className="mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Missing Elements</span>
                        <div className="flex flex-wrap gap-2">
                           {analysis.missingKeywords.map((kw, i) => (
                             <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md border border-red-100">
                               {kw}
                             </span>
                           ))}
                        </div>
                     </div>
                   )}

                   {analysis.improvements.length > 0 && (
                     <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Improvements</span>
                        <ul className="space-y-2">
                           {analysis.improvements.map((imp, i) => (
                             <li key={i} className="text-xs text-slate-600 flex gap-2">
                                <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" /> {imp}
                             </li>
                           ))}
                        </ul>
                     </div>
                   )}
                </div>

                {/* Rewrite */}
                <div className="bg-fuchsia-50 p-6 rounded-2xl border border-fuchsia-100">
                   <h3 className="font-bold text-fuchsia-800 flex items-center gap-2 mb-3">
                      <RefreshCw size={20} /> Pro-Version Snippet
                   </h3>
                   <p className="text-sm text-fuchsia-900 italic font-serif leading-relaxed border-l-4 border-fuchsia-300 pl-3">
                      "{analysis.sampleParagraph}"
                   </p>
                </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200 min-h-[400px]">
                <BookOpen size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Ready to Grade</p>
                <p className="text-sm max-w-xs mt-2">Select a type, enter a topic, and type your content to receive detailed AI feedback.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DescriptiveChecker;
