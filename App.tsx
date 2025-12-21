
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatternAnalyzer from './components/PatternAnalyzer';
import MockExam from './components/MockExam';
import SpeedMath from './components/SpeedMath';
import SmartNotes from './components/SmartNotes';
import YouTubeZone from './components/YouTubeZone';
import EnglishFever from './components/EnglishFever';
import GkMania from './components/GkMania';
import ComputerSePyaar from './components/ComputerSePyaar';
import ChatInterface from './components/ChatInterface';
import InterviewSimulator from './components/InterviewSimulator';
import DescriptiveChecker from './components/DescriptiveChecker';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle, logout } from './services/auth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [navProps, setNavProps] = useState<any>({});
  
  // Auth state from Firebase hooks (might be undefined if auth is missing)
  const [user, loading, error] = auth ? useAuthState(auth) : [null, false, null];
  
  // Local state for Guest Mode
  const [isGuest, setIsGuest] = useState(false);

  const handleNavigate = (tab: string, props?: any) => {
    if (props) setNavProps(props);
    setActiveTab(tab);
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      // If result is returned but auth is null, it means we are in mock/guest mode from services/auth.ts
      if (result) {
         setIsGuest(true);
      }
    } catch (error: any) {
      alert(`Error signing in: ${error.message}`);
      console.error("Sign-in error:", error);
    }
  };

  const handleGuestAccess = () => {
    setIsGuest(true);
  };

  const handleLogout = async () => {
    if (auth) {
      await logout();
    }
    setIsGuest(false);
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'chat':
        return <ChatInterface />;
      case 'interview':
        return <InterviewSimulator />;
      case 'descriptive':
        return <DescriptiveChecker />;
      case 'mock':
        return <MockExam />;
      case 'speed':
        return <SpeedMath />;
      case 'english':
        return <EnglishFever />;
      case 'gk':
        return <GkMania />;
      case 'computer':
        return <ComputerSePyaar />;
      case 'notes':
        return <SmartNotes />;
      case 'video':
        return <YouTubeZone />;
      case 'analysis':
        return <PatternAnalyzer />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

 if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-500">Loading BankEdge...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const isLoggedIn = user || isGuest;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {isLoggedIn ? (
        <>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />

          <main className="flex-1 flex flex-col h-full relative">
            {/* Mobile Header */}
            <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-10">
              <div className="font-bold text-indigo-900 text-lg">BankEdge</div>
              <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
                <Menu size={24} />
              </button>
            </header>

            {/* Main Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-end mb-4">
                    <button onClick={handleLogout} className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors">
                       Logout {isGuest ? '(Guest)' : ''}
                    </button>
                </div>
                {renderContent()}
              </div>
            </div>
          </main>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-md w-full text-center">
             <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg shadow-indigo-200">
               B
             </div>
             <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to BankEdge</h1>
             <p className="text-slate-500 mb-8">Your AI-Powered Banking Exam Coach</p>
             
             <div className="space-y-3">
               <button onClick={handleSignIn} className="w-full bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2">
                  Sign in with Google
               </button>
               <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                  <div className="relative flex justify-center"><span className="bg-white px-2 text-xs text-slate-400 font-medium">OR</span></div>
               </div>
               <button onClick={handleGuestAccess} className="w-full bg-white text-indigo-600 border-2 border-indigo-100 px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                  Continue as Guest
               </button>
             </div>
          </div>
          <p className="text-slate-400 text-xs mt-6">Firebase not configured? Use Guest Mode to access all features.</p>
        </div>
      )}
    </div>
  );
};

export default App;
