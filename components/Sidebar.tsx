
import React from 'react';
import { LayoutDashboard, BookOpen, BarChart2, Menu, X, MonitorPlay, Zap, FileText, Youtube, Feather, Globe, Monitor, Bot, Mic, PenTool, Sparkles, GraduationCap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  
  const navGroups = [
    {
      label: null, // Top level
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'AI Simulation',
      items: [
        { id: 'descriptive', label: 'Descriptive Writing', icon: PenTool },
        { id: 'interview', label: 'Interview Sim', icon: Mic }
      ]
    },
    {
      label: 'Practice Mania',
      items: [
        { id: 'speed', label: 'Speed Math', icon: Zap },
        { id: 'english', label: 'English Fever', icon: Feather },
        { id: 'gk', label: 'GK Mania', icon: Globe },
        { id: 'computer', label: 'Computer Se Pyaar', icon: Monitor }
      ]
    },
    {
      label: 'Study Tools',
      items: [
        { id: 'chat', label: 'AI Tutor', icon: Bot },
        { id: 'notes', label: 'Smart Notes', icon: FileText },
        { id: 'mock', label: 'Drill Engine', icon: MonitorPlay },
        { id: 'video', label: 'Video Classes', icon: Youtube },
        { id: 'analysis', label: 'Pattern Analysis', icon: BarChart2 }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 z-30 transform transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg">B</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">BankEdge</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-hide h-[calc(100vh-140px)]">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {group.label && (
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {group.label}
                </div>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                        ${isActive 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                          : 'hover:bg-slate-800 hover:text-white'}
                      `}
                    >
                      <Icon size={18} className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Sparkles size={14} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Gemini Pro</p>
              <p className="text-[10px] text-slate-400">AI Tutor Active</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
