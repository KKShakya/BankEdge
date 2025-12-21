
import React, { useState } from 'react';
import { Youtube, PlayCircle, ChevronRight, ChevronLeft, User, Layers, ExternalLink, Search } from 'lucide-react';

// Types
interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail?: string;
}

interface Playlist {
  id: string;
  title: string;
  videoCount: string;
  videos: Video[];
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  color: string;
  avatarInitial: string;
  channelName: string;
  playlists: Playlist[];
}

// Mock Data - Simulating specific teachers as requested
const TEACHERS_DATA: Teacher[] = [
  {
    id: 'shantanu',
    name: 'Shantanu Shukla',
    subject: 'Quantitative Aptitude',
    color: 'bg-blue-600',
    avatarInitial: 'S',
    channelName: 'Adda247 / BankExams',
    playlists: [
      {
        id: 'speed_math',
        title: 'Speed Maths & Calculation Tricks',
        videoCount: '25+ Videos',
        videos: [
          { id: '1', title: 'Vedic Maths Tricks for Fast Calculation', duration: '15:20' },
          { id: '2', title: 'Square Root & Cube Root in 5 Seconds', duration: '12:45' },
          { id: '3', title: 'Multiplication Tricks for Big Numbers', duration: '18:10' },
          { id: '4', title: 'Fraction to Percentage Complete Table', duration: '22:30' },
          { id: '5', title: 'Approximation Best Approach', duration: '20:15' }
        ]
      },
      {
        id: 'di_mastery',
        title: 'Data Interpretation (DI) Mastery',
        videoCount: '50+ Videos',
        videos: [
          { id: '6', title: 'Pie Chart DI Basic to High Level', duration: '35:00' },
          { id: '7', title: 'Missing DI Caselet Problems', duration: '40:20' },
          { id: '8', title: 'Arithmetic Based DI for Mains', duration: '45:10' }
        ]
      },
      {
        id: 'arithmetic',
        title: 'Arithmetic Word Problems',
        videoCount: '40+ Videos',
        videos: [
          { id: '9', title: 'Time and Work: Efficiency Method', duration: '28:00' },
          { id: '10', title: 'Profit & Loss Dishonest Shopkeeper', duration: '32:15' }
        ]
      }
    ]
  },
  {
    id: 'ashish',
    name: 'Ashish Gautam',
    subject: 'General Awareness',
    color: 'bg-emerald-600',
    avatarInitial: 'A',
    channelName: 'Adda247',
    playlists: [
      {
        id: 'daily_ca',
        title: 'Daily Current Affairs Show',
        videoCount: 'Daily Live',
        videos: [
          { id: '11', title: '7:00 AM | Daily Current Affairs Today', duration: '55:00' },
          { id: '12', title: 'Weekly Revision MCQs', duration: '1:15:00' },
          { id: '13', title: 'Monthly CA Capsule Analysis', duration: '2:30:00' }
        ]
      },
      {
        id: 'banking_warrior',
        title: 'Banking Awareness (Warrior)',
        videoCount: '30+ Videos',
        videos: [
          { id: '14', title: 'RBI Monetary Policy Explained', duration: '40:00' },
          { id: '15', title: 'Types of Bank Accounts (NRA/NRO)', duration: '25:30' },
          { id: '16', title: 'Inflation & WPI/CPI', duration: '30:15' }
        ]
      },
      {
        id: 'static_gk',
        title: 'Static GK Series',
        videoCount: '15+ Videos',
        videos: [
          { id: '17', title: 'National Parks in India Tricks', duration: '18:00' },
          { id: '18', title: 'International Organizations HQ', duration: '15:45' }
        ]
      }
    ]
  },
  {
    id: 'saurav',
    name: 'Saurav Singh',
    subject: 'Reasoning Ability',
    color: 'bg-purple-600',
    avatarInitial: 'R',
    channelName: 'Reasoning By Saurav Sir',
    playlists: [
      {
        id: 'puzzles',
        title: '1000 Puzzle Series',
        videoCount: '100+ Videos',
        videos: [
          { id: '19', title: 'Box Based Puzzles Best Approach', duration: '25:00' },
          { id: '20', title: 'Flat and Floor Based Puzzle', duration: '28:30' }
        ]
      },
      {
        id: 'misc',
        title: 'Syllogism & Inequality',
        videoCount: '20+ Videos',
        videos: [
          { id: '21', title: 'Only a Few Concept Syllogism', duration: '35:00' },
          { id: '22', title: 'Coded Inequality Tricks', duration: '20:00' }
        ]
      }
    ]
  }
];

const YouTubeZone: React.FC = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [activePlaylistId, setActivePlaylistId] = useState<string>('');

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    // Default to first playlist
    if (teacher.playlists.length > 0) {
      setActivePlaylistId(teacher.playlists[0].id);
    }
  };

  const activePlaylist = selectedTeacher?.playlists.find(p => p.id === activePlaylistId);

  // Simulated YouTube Thumbnail URL (using a placeholder here, but logic mimics real structure)
  const getThumbnailUrl = (id: string) => {
    // In a real app, we'd use the video ID. Using a generic math/study placeholder for the demo.
    return `https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`;
  };

  // --- View 1: Teacher Selection ---
  if (!selectedTeacher) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
            <Youtube className="text-red-600" size={40} />
            Video Classroom
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Curated playlists from India's top banking educators. Select a mentor to begin your subject mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEACHERS_DATA.map((teacher) => (
            <div 
              key={teacher.id}
              onClick={() => handleTeacherSelect(teacher)}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className={`${teacher.color} h-24 relative`}>
                <div className="absolute -bottom-8 left-6 border-4 border-white rounded-full overflow-hidden bg-slate-100 w-20 h-20 flex items-center justify-center shadow-sm">
                   <span className={`text-2xl font-bold ${teacher.color.replace('bg-', 'text-')}`}>
                     {teacher.avatarInitial}
                   </span>
                </div>
              </div>
              <div className="pt-10 pb-6 px-6">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {teacher.name}
                </h3>
                <p className="text-sm font-medium text-slate-500 mb-1">{teacher.channelName}</p>
                <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-md font-medium mt-2">
                  {teacher.subject}
                </span>
                
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Layers size={16} />
                    <span>{teacher.playlists.length} Playlists</span>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- View 2: Classroom (Playlists & Videos) ---
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-in fade-in">
      {/* Sidebar - Playlists */}
      <div className="md:w-80 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
           <button 
             onClick={() => setSelectedTeacher(null)}
             className="flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
           >
             <ChevronLeft size={16} className="mr-1" /> Back to Faculty
           </button>
           <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${selectedTeacher.color} flex items-center justify-center text-white font-bold`}>
                {selectedTeacher.avatarInitial}
              </div>
              <div>
                <h2 className="font-bold text-slate-800 leading-tight">{selectedTeacher.name}</h2>
                <p className="text-xs text-slate-500">{selectedTeacher.subject}</p>
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
           {selectedTeacher.playlists.map(playlist => (
             <button
               key={playlist.id}
               onClick={() => setActivePlaylistId(playlist.id)}
               className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between
                 ${activePlaylistId === playlist.id 
                   ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                   : 'text-slate-600 hover:bg-slate-50 border border-transparent'}
               `}
             >
               <span>{playlist.title}</span>
               {activePlaylistId === playlist.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content - Videos */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {activePlaylist ? (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <PlayCircle size={24} className="text-indigo-600" />
                  {activePlaylist.title}
                </h2>
                <p className="text-slate-500 text-sm mt-1">{activePlaylist.videoCount} • Curated for Banking Exams</p>
              </div>
              <button className="hidden md:flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors">
                <Youtube size={16} />
                OPEN ON YOUTUBE
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activePlaylist.videos.map((video) => (
                  <div key={video.id} className="group block">
                    <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all border border-slate-100">
                      <img 
                        src={getThumbnailUrl(video.id)} 
                        alt={video.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                         <a 
                           href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title + " " + selectedTeacher.name)}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="bg-red-600 text-white rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform"
                         >
                           <PlayCircle size={32} fill="currentColor" />
                         </a>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm group-hover:text-indigo-600 transition-colors leading-snug">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                <p className="text-slate-500 text-sm mb-4">Looking for more videos in this playlist?</p>
                <a 
                   href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activePlaylist.title + " " + selectedTeacher.name)}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
                >
                  Browse full playlist on YouTube <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </>
        ) : (
           <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <Layers size={48} className="mb-4 opacity-50" />
             <p>Select a playlist from the sidebar</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeZone;
