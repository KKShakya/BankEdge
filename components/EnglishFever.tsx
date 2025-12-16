
import React, { useState } from 'react';
import { Clock, GitMerge, Box, Scissors, Hash, AlertTriangle, Feather, Star, CheckCircle2, ChevronLeft, BookOpen, GraduationCap } from 'lucide-react';

// Data Structure
const ENGLISH_MODULES = [
  {
    id: 'm1',
    title: "MODULE 1: THE ENGINE (Subject-Verb Agreement)",
    icon: Box,
    color: "blue",
    points: [
      {
        title: "The 'Group vs. Specific' Trap",
        content: "• A Number of (Many) → Plural Verb\n• The Number of (Count) → Singular Verb\n\n❌ Wrong: A number of boys is absent.\n✅ Right: A number of boys are absent.\n✅ Right: The number of boys is 50."
      },
      {
        title: "The 'One of...' Matrix",
        content: "• One of + Plural Noun → Singular Verb\n• One of + Plural + WHO/THAT → Plural Verb\n• ONLY One of + Plural + WHO → Singular Verb\n\n✅ Right: One of the boys is smart.\n✅ Right: He is one of the boys who are smart.\n✅ Right: He is the only one of the boys who is smart."
      },
      {
        title: "Connector Logic",
        content: "• Distance (As well as, Along with) → Match 1st Subject.\n• Proximity (Neither..Nor, Or) → Match Nearest Subject.\n\n✅ Right: The Captain, along with players, was present.\n✅ Right: Neither the captain nor the players were present."
      },
      {
        title: "The Ghost Subject",
        content: "• Gerunds (V-ing start) → Singular Verb.\n\n❌ Wrong: Smoking cigarettes cause cancer.\n✅ Right: Smoking cigarettes causes cancer."
      }
    ]
  },
  {
    id: 'm2',
    title: "MODULE 2: THE TIMELINE (Tenses & Time)",
    icon: Clock,
    color: "amber",
    points: [
      {
        title: "The 'Past' Showdown",
        content: "• Simple Past (V2) → Dead Time (Yesterday, In 2010).\n• Present Perfect (Has/Have+V3) → Alive/Recent Impact.\n\n❌ Wrong: I have met him yesterday.\n✅ Right: I met him yesterday.\n✅ Right: I have just met him."
      },
      {
        title: "The 'Math' of Time",
        content: "• Since → Start Point.\n• For → Duration.\n• Rule: Must use Perfect Tense (Has been). Never 'is working'.\n\n❌ Wrong: He is working here since 2010.\n✅ Right: He has been working here since 2010."
      },
      {
        title: "The 'Fake Past' Idiom",
        content: "• It is time / High time → Always V2 (Simple Past).\n\n❌ Wrong: It is high time we start.\n✅ Right: It is high time we started."
      }
    ]
  },
  {
    id: 'm3',
    title: "MODULE 3: LOGIC & CONNECTORS",
    icon: GitMerge,
    color: "purple",
    points: [
      {
        title: "Conditional Formulas",
        content: "• Real Future: If + Present ... Will.\n• Unreal Present: If + V2 ... Would.\n• Impossible Past: If + Had + V3 ... Would Have + V3.\n\n✅ Right: If I were a bird, I would fly.\n✅ Right: If he had studied, he would have passed."
      },
      {
        title: "The 'Certainty' Scale",
        content: "• That → Fact/Certainty.\n• Whether → Doubt/Choice.\n• 'Or not' at end? → Strictly 'Whether'.\n\n❌ Wrong: I doubt that he will come.\n✅ Right: I doubt whether he will come."
      },
      {
        title: "Negative Purpose (Lest)",
        content: "• Lest + Subject + SHOULD.\n• Never use 'Not' or 'Will' with Lest.\n\n❌ Wrong: Work hard lest you will fail.\n✅ Right: Work hard lest you should fail."
      }
    ]
  },
  {
    id: 'm4',
    title: "MODULE 4: PREPOSITIONS (Geometry)",
    icon: Box,
    color: "emerald",
    points: [
      {
        title: "Motion vs Position",
        content: "• IN (Static) vs INTO (Motion).\n• ON (Static) vs ONTO (Motion).\n\n✅ Right: He is in the room.\n✅ Right: He walked into the room."
      },
      {
        title: "Dimensions",
        content: "• Across → 2D Surface/Bridge.\n• Through → 3D Tunnel/Medium.\n\n✅ Right: Walk across the road.\n✅ Right: Train passed through the tunnel."
      },
      {
        title: "Verb Connections",
        content: "• Transitive (Discuss, Enter) → NO Prep.\n• Intransitive (Listen to, Agree with) → NEEDS Prep.\n\n❌ Wrong: Discuss about the matter.\n✅ Right: Discuss the matter."
      },
      {
        title: "Agent Rule & Beside/s",
        content: "• By (Living) vs With (Tool).\n• Beside → Location.\n• Besides → Addition (+).\n\n✅ Right: Killed by Ram with a knife.\n✅ Right: Beside me (Location).\n✅ Right: Besides English (In addition to)."
      }
    ]
  },
  {
    id: 'm5',
    title: "MODULE 5: MODIFIERS & TRAPS",
    icon: Scissors,
    color: "rose",
    points: [
      {
        title: "Inversion (Emphasis)",
        content: "• Starts with Hardly/Scarcely/Never? → Helper Verb comes before Subject.\n\n❌ Wrong: Never I have seen him.\n✅ Right: Never have I seen him."
      },
      {
        title: "Compound Adjectives",
        content: "• Number-Noun adjectives are never plural.\n\n❌ Wrong: A five-stars hotel.\n✅ Right: A five-star hotel."
      },
      {
        title: "Dangling Modifiers",
        content: "• V-ing starts? Subject after comma must be doer.\n\n❌ Wrong: Being rainy, I stayed home. (I am not rainy)\n✅ Right: It being rainy, I stayed home."
      },
      {
        title: "Comparison & Possessives",
        content: "• Same Group → 'Than any other'.\n• Latin (Senior/Junior) → take 'TO'.\n• Non-living → 'Of'.\n\n✅ Right: Better than any other boy.\n✅ Right: Senior to me.\n❌ Wrong: Table's leg. ✅ Right: Leg of table."
      }
    ]
  },
  {
    id: 'm6',
    title: "MODULE 6: ARTICLES",
    icon: Hash,
    color: "cyan",
    points: [
      {
        title: "Basics",
        content: "• A/An → General. The → Specific.\n• Abstract Nouns (Honesty) → Zero Article.\n\n❌ Wrong: The honesty is best policy.\n✅ Right: Honesty is the best policy.\n✅ Right: The honesty of this man is known."
      }
    ]
  },
  {
    id: 'm7',
    title: "MODULE 7: FREQUENT TRAPS",
    icon: AlertTriangle,
    color: "red",
    description: "The 'Killer' 5 - Most common error detection traps in Mains.",
    points: [
      {
        title: "1. WHO vs. WHOM (The 'M' Test)",
        content: "• WHO → Subject (He).\n• WHOM → Object (Him).\n\n❌ Wrong: The boy whom is coming.\n✅ Right: The boy who is coming. (He is coming)\n✅ Right: The boy whom I met. (I met Him)"
      },
      {
        title: "2. The 'Enough' Position",
        content: "• With Adjective/Adverb → Enough comes AFTER.\n• With Noun → Enough comes BEFORE.\n\n❌ Wrong: He is enough smart.\n✅ Right: He is smart enough.\n✅ Right: I have enough money."
      },
      {
        title: "3. Used to vs. Be Used to",
        content: "• Past Habit: 'Used to' + V1.\n• Addiction/Habit: 'Is/Am/Are used to' + V-ing.\n\n✅ Right: I used to drive. (Past)\n✅ Right: I am used to driving. (Habit)"
      },
      {
        title: "4. The 'Make' Passive Trap",
        content: "• Active: No 'to'.\n• Passive: Needs 'to'.\n\n✅ Active: He made me cry.\n✅ Passive: I was made to cry."
      },
      {
        title: "5. Pronoun Consistency",
        content: "• One... One's\n• Everyone... His\n\n❌ Wrong: One must do his duty.\n✅ Right: One must do one's duty."
      }
    ]
  }
];

const EnglishFever: React.FC = () => {
    const [view, setView] = useState<'menu' | 'rules'>('menu');

    if (view === 'menu') {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
                        <Feather className="text-pink-600" size={40} />
                        English Fever
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Master the language section with curated rules, vocabulary, and logic traps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* English Rules Card */}
                    <div 
                        onClick={() => setView('rules')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-pink-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-pink-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-pink-600 transition-colors">English Rules</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                The "Master Cheat Sheet". Grammar modules, connector logic, and specific exam traps organized for revision.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-pink-50 text-pink-600 py-3 rounded-xl font-bold text-sm hover:bg-pink-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            Open Rules <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* Placeholder: Vocab Vault */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 opacity-60 cursor-not-allowed h-full flex flex-col justify-between">
                         <div className="relative z-10">
                            <div className="w-14 h-14 bg-slate-200 text-slate-400 rounded-xl flex items-center justify-center mb-6">
                                <GraduationCap size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-400 mb-2">Vocab Vault</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Root words, phrasal verbs, and confusion pairs.
                            </p>
                         </div>
                         <button className="w-full bg-slate-200 text-slate-400 py-3 rounded-xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2">
                            Coming Soon
                         </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 pb-10">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-4">
                <button 
                    onClick={() => setView('menu')} 
                    className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <BookOpen className="text-pink-600" size={24} />
                        English Rules
                    </h1>
                    <p className="text-slate-500 text-sm">The Master Cheat Sheet</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {ENGLISH_MODULES.map((module, idx) => {
                    const Icon = module.icon;
                    const isTrap = module.id === 'm7';
                    
                    // Dynamic classes based on color prop
                    const getColors = (c: string) => {
                       switch(c) {
                          case 'blue': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-500' };
                          case 'amber': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' };
                          case 'purple': return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-500' };
                          case 'emerald': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' };
                          case 'rose': return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' };
                          case 'cyan': return { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', dot: 'bg-cyan-500' };
                          case 'red': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-500' };
                          default: return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', dot: 'bg-indigo-500' };
                       }
                    }
                    const theme = getColors(module.color);

                    return (
                        <div key={idx} className={`rounded-3xl shadow-sm border overflow-hidden ${isTrap ? 'bg-red-50/30 border-red-200 ring-1 ring-red-100' : 'bg-white border-slate-200'}`}>
                             <div className={`p-6 border-b flex items-center gap-4 ${isTrap ? 'border-red-100 bg-red-100/40' : `${theme.border} ${theme.bg}`}`}>
                                <div className={`p-3 rounded-xl ${isTrap ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white shadow-sm'} ${!isTrap && theme.text}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isTrap ? 'text-red-900' : 'text-slate-800'}`}>{module.title}</h2>
                                    {module.description && <p className="text-sm text-red-700 mt-1 font-medium">{module.description}</p>}
                                </div>
                             </div>

                             <div className="p-8">
                                <div className={`grid grid-cols-1 ${isTrap ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                                    {module.points.map((pt, pIdx) => (
                                        <div key={pIdx} className={`rounded-2xl p-5 border transition-all hover:shadow-md ${isTrap ? 'bg-white border-red-100 hover:border-red-300' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-indigo-200'}`}>
                                            <h3 className={`font-bold text-base mb-3 flex items-start gap-2 ${isTrap ? 'text-red-700' : 'text-slate-700'}`}>
                                                {isTrap && <AlertTriangle size={16} className="mt-1 flex-shrink-0 fill-red-100 text-red-500" />}
                                                {!isTrap && <span className={`w-2 h-2 rounded-full ${theme.dot} mt-2 flex-shrink-0`}></span>}
                                                {pt.title}
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">
                                                {pt.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-12 bg-slate-900 text-slate-300 rounded-2xl p-8 text-center">
               <h3 className="text-white font-bold text-lg mb-2">How to use this Master Sheet?</h3>
               <p className="text-sm max-w-2xl mx-auto leading-relaxed">
                 1. <span className="text-white font-bold">Tagging:</span> Mark questions you get wrong with these Module headers (e.g., "Error: Module 2").<br/>
                 2. <span className="text-white font-bold">Review:</span> Scroll through just the bold formulas before every mock.<br/>
                 3. <span className="text-white font-bold">Traps:</span> Module 7 is your "Safety Net". Read it twice.
               </p>
            </div>
        </div>
    );
};

export default EnglishFever;
