
import React, { useState } from 'react';
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
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle, logout } from './services/auth';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Navigation props to pass data between tabs (e.g. Dashboard -> Practice with specific difficulty)
  const [navProps, setNavProps] = useState<any>({});
  const [user, loading, error] = useAuthState(auth);

  const handleNavigate = (tab: string, props?: any) => {
    if (props) setNavProps(props);
    setActiveTab(tab);
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      // Display the error in an alert box
      alert(`Error signing in: ${error.message}`);
      console.error("Sign-in error:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }


  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {user ? (
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
                <div className="flex justify-end">
                    <button onClick={logout} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Logout</button>
                </div>
                {renderContent()}
              </div>
            </div>
          </main>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <button onClick={handleSignIn} className="bg-indigo-600 text-white px-4 py-2 rounded-md">Login with Google</button>
        </div>
      )}
    </div>
  );
};

export default App;
