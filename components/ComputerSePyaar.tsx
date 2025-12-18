
import React, { useState } from 'react';
import { Monitor, Cpu, Wifi, Database, Shield, HardDrive, ChevronDown, Binary, History, FileText, Keyboard, Layers, MousePointer2, Info, Clock, Terminal, Hash, Activity, Zap, ShieldCheck, Star, Box, ZapOff, Globe, Lock, ListChecks } from 'lucide-react';

const COMPUTER_MODULES = [
  {
    id: 'hardware',
    title: 'Hardware & Architecture',
    icon: Cpu,
    color: 'cyan',
    description: "CPU logic, Internal Ports (ATX/SATA), and Generations.",
    points: [
      {
        title: "CPU: The Trio (ALU, CU, MU)",
        content: "• **ALU:** Arithmetic & Logical operations.\n• **CU:** The 'Traffic Cop' - manages execution order.\n• **Clock Speed:** Measured in **Hertz (Hz)**.\n• **Registers:** Fastest internal storage. The **Accumulator** stores intermediate results."
      },
      {
        title: "History & Landmarks",
        content: "• **Tim Berners-Lee:** Father of World Wide Web (WWW).\n• **Siddharth:** First computer manufactured indigenously in India.\n• **ISI Kolkata:** Location where India's first computer was installed."
      },
      {
        title: "Printers: Impact vs Non-Impact",
        content: "• **Impact:** Physical strike on ribbon (Dot Matrix, Chain). Can use carbon paper for copies.\n• **Non-Impact:** Cartridge/Laser based (Laser, Inkjet, Thermal). Quieter and higher quality."
      },
      {
        title: "FORTRAN",
        content: "• **Formula Translation:** The first high-level language, primarily used for complex mathematical calculations."
      }
    ]
  },
  {
    id: 'memory',
    title: 'Memory & Storage Hierarchy',
    icon: HardDrive,
    color: 'blue',
    description: "Volatile vs Non-volatile, ROM types, and Units.",
    points: [
      {
        title: "Storage Geometry (Magnetic)",
        content: "• **Platter:** Circular disk.\n• **Track:** Concentric circles on platter.\n• **Sector:** Subdivision of a track.\n• **Cluster:** Group of sectors.\n• **Cylinder:** Vertical alignment of tracks across multiple platters."
      },
      {
        title: "Volatile vs Non-Volatile",
        content: "• **Volatile:** Loses data on power-off (**RAM**, Cache, Registers).\n• **Non-Volatile:** Retains data (**ROM**, HDD, SSD, CD/DVD)."
      },
      {
        title: "Storage Capacities",
        content: "• **CD-ROM:** 750-850 MB.\n• **DVD:** 4.7-17 GB.\n• **Blu-ray:** ~100 GB.\n• **Speed Hierarchy:** Register > Cache > RAM > SSD > HDD."
      }
    ]
  },
  {
    id: 'networking',
    title: 'Networking & Protocols',
    icon: Wifi,
    color: 'indigo',
    description: "IP Classes, Email sync, and Internet History.",
    points: [
      {
        title: "Communication Standards",
        content: "• **Bluetooth:** IEEE **802.15** standard for wireless file transfer.\n• **HDMI:** Interface for high-definition audio and video transmission.\n• **Modem:** Device that converts Digital signals to Analog (and vice versa)."
      },
      {
        title: "Device Intelligence",
        content: "• **Hub:** Broadcasts data to all ports (Indiscriminate).\n• **Switch:** Sends data only to destination (Intelligent).\n• **Repeater:** Boosts weak signals to extend range."
      },
      {
        title: "Email Nuances",
        content: "• **@ Symbol:** Separates username from domain.\n• **CC vs BCC:** CC is visible to all; BCC hides recipients from others."
      }
    ]
  },
  {
    id: 'software',
    title: 'Software & Productivity',
    icon: FileText,
    color: 'purple',
    description: "OS Types, Middleware, and MS Office Mastery.",
    points: [
      {
        title: "Software Categories",
        content: "• **System:** OS, Compilers, Interpreters (Runs the hardware).\n• **Utility:** Antivirus, Disk Defragmenter (Enhances performance).\n• **Application:** MS Office, Browser, Spotify (User tasks).\n• **Open Source:** Linux (Free and modifiable)."
      },
      {
        title: "MS Excel Master",
        content: "• **Freeze Pane:** Keeps specific rows/columns visible while scrolling.\n• **Active Cell:** The specific cell currently being edited (highlighted by a dark border)."
      },
      {
        title: "System Crashes",
        content: "• **System Hang:** CPU overload freezing everything.\n• **BSOD (Blue Screen of Death):** Occurs when the Operating System itself crashes."
      }
    ]
  },
  {
    id: 'security',
    title: 'Security & Malware',
    icon: Shield,
    color: 'rose',
    description: "Viruses, Trojans, and Phishing variants.",
    points: [
      {
        title: "Malware Behavior",
        content: "• **Worm:** Self-replicates WITHOUT a host program.\n• **Virus:** Self-replicates but REQUIRES a host program.\n• **Trojan:** Does NOT self-replicate; hides inside legitimate software."
      },
      {
        title: "Threat Landscape",
        content: "• **Phishing:** Deception/Lure (fake lottery/bank calls) to steal info.\n• **Spoofing:** Pretending to be someone else by cloning IP or Phone Numbers.\n• **Firewall:** Hardware or Software used to block unauthorized network access."
      },
      {
        title: "Data Protection",
        content: "• **Digital Signature:** Verifies sender identity and data integrity.\n• **Identity Theft:** Stealing a person's online identity/credentials."
      }
    ]
  },
  {
    id: 'future',
    title: 'Future Tech & Logic',
    icon: Zap,
    color: 'amber',
    description: "Quantum computing, VR/AR, and Base conversions.",
    points: [
      {
        title: "Blockchain & UPI",
        content: "• **Blockchain:** Distributed ledger for decentralized security.\n• **UPI Apps:** BHIM, GPay, PhonePe, Paytm (AOP Photo is NOT a UPI app)."
      },
      {
        title: "Binary Logic",
        content: "• **Bit:** 0 or 1.\n• **Nibble:** 4 Bits (Half a Byte).\n• **Byte:** 8 Bits."
      }
    ]
  }
];

const IP_CLASSES = [
  { class: "Class A", range: "1 - 126" },
  { class: "Loopback", range: "127.x.x.x" },
  { class: "Class B", range: "128 - 191" },
  { class: "Class C", range: "192 - 223" },
  { class: "Class D", range: "224 - 239 (Multicast)" },
  { class: "Class E", range: "240 - 255 (Exp.)" }
];

const DATA_UNITS = [
  { unit: "Bit", val: "0 or 1" },
  { unit: "Nibble", val: "4 Bits" },
  { unit: "Byte", val: "8 Bits" },
  { unit: "Kilobyte (KB)", val: "1024 Bytes" },
  { unit: "Megabyte (MB)", val: "1024 KB" },
  { unit: "Gigabyte (GB)", val: "1024 MB" },
  { unit: "Terabyte (TB)", val: "1024 GB" },
  { unit: "Petabyte (PB)", val: "1024 TB" }
];

const MOST_ASKED_CONTENT = [
  { q: "Ctrl + K", a: "Hyperlink shortcut" },
  { q: "F7 Key", a: "Spelling and Grammar check" },
  { q: "Ctrl + Space", a: "Remove character formatting" },
  { q: "HTTP Port", a: "Port 80 (Standard Web)" },
  { q: "HTTPS Port", a: "Port 443 (Secure Web)" }
];

const ComputerSePyaar: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>('hardware');

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 pb-12 px-4">
      {/* Header */}
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
          <Monitor className="text-cyan-600" size={40} />
          Computer Se Pyaar
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Mains Targeted Master Guide. Merged Vivek Pandey Session Sync & 2025 Memory Based Data.
        </p>
        <div className="flex justify-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold border border-cyan-200 shadow-sm">
                <Terminal size={14} /> Exam Targeted
            </span>
             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200 shadow-sm">
                <History size={14} /> 2024-25 Sync
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 shadow-sm">
                <Activity size={14} /> High Weightage
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Modules (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {COMPUTER_MODULES.map((module) => {
            const Icon = module.icon;
            const isExpanded = expandedModule === module.id;
            
            const colorMap: Record<string, string> = {
                cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
                blue: "bg-blue-50 text-blue-700 border-blue-100",
                indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
                purple: "bg-purple-50 text-purple-700 border-purple-100",
                rose: "bg-rose-50 text-rose-700 border-rose-100",
                amber: "bg-amber-50 text-amber-700 border-amber-100",
            };
            const themeClass = colorMap[module.color] || colorMap.cyan;

            return (
              <div key={module.id} className={`rounded-2xl border transition-all ${isExpanded ? 'shadow-md ring-1 ring-opacity-50' : 'shadow-sm'} ${themeClass}`}>
                <button 
                  onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white bg-opacity-60"><Icon size={24} /></div>
                    <div>
                      <h3 className="font-bold text-lg">{module.title}</h3>
                      <p className="text-xs opacity-80 mt-1 font-medium">{module.description}</p>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div className={`transition-all overflow-hidden ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-6 pt-2 space-y-4">
                    <div className="h-px w-full bg-current opacity-10 mb-4"></div>
                    {module.points.map((point, idx) => (
                      <div key={idx} className="bg-white bg-opacity-60 rounded-xl p-4 border border-white border-opacity-50">
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                          {point.title}
                        </h4>
                        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed pl-3.5 border-l-2 border-slate-300 border-opacity-30">
                          <span dangerouslySetInnerHTML={{ __html: point.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Reference Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* IP ADDRESS CLASSES */}
           <div className="bg-indigo-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-700 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-white/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-6 border-b border-indigo-700 pb-4">
                 <Hash className="text-amber-400" size={24} />
                 <h3 className="font-bold text-lg">IP Address Classes</h3>
              </div>
              <div className="space-y-3">
                 {IP_CLASSES.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white/10 transition-colors">
                       <span className="font-bold text-indigo-300">{item.class}</span>
                       <span className="text-white font-mono text-xs">{item.range}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* DATA UNITS */}
           <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-700 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl -ml-12 -mb-12 group-hover:bg-emerald-400/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                 <Binary className="text-emerald-400" size={24} />
                 <h3 className="font-bold text-lg">Data Units Guide</h3>
              </div>
              <div className="space-y-3">
                 {DATA_UNITS.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                       <span className="font-bold text-indigo-300">{item.unit}</span>
                       <span className="text-emerald-400 font-mono text-xs">{item.val}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* FLASHCARDS SECTION */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 px-2">
           <div className="h-px bg-slate-200 flex-1"></div>
           <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
             <Layers className="text-indigo-600" /> Flashcards
           </h2>
           <div className="h-px bg-slate-200 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           {/* MAINS FLASH CARDS */}
           <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                   <Info size={24} />
                 </div>
                 <h3 className="font-bold text-slate-800 text-xl">Mains '25 Flashcards</h3>
              </div>
              <ul className="space-y-4 text-sm text-slate-600 flex-1">
                <li className="flex gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>Worm:</strong> Replicates without a host.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>BSOD:</strong> Blue Screen of Death (OS crash).</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>FORTRAN:</strong> Formula Translation (Math).</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>IEEE 802.15:</strong> Bluetooth Standard.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span><strong>Spoofing:</strong> Cloning IP/Phone Number.</span>
                </li>
              </ul>
           </div>

           {/* RAPID EXAM TIPS */}
           <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                   <Zap size={24} />
                 </div>
                 <h3 className="font-bold text-slate-800 text-xl">Rapid Exam Tips</h3>
              </div>
              <ul className="space-y-5 flex-1">
                 <li className="flex gap-3">
                    <div className="p-1 bg-green-100 text-green-600 rounded-full h-fit mt-0.5"><ShieldCheck size={16} /></div>
                    <div className="text-sm">
                       <span className="font-bold block text-slate-900">Freeze Pane</span>
                       <p className="text-slate-500">Keeps Excel rows/cols visible while scrolling.</p>
                    </div>
                 </li>
                 <li className="flex gap-3">
                    <div className="p-1 bg-green-100 text-green-600 rounded-full h-fit mt-0.5"><ShieldCheck size={16} /></div>
                    <div className="text-sm">
                       <span className="font-bold block text-slate-900">Storage Unit</span>
                       <p className="text-slate-500">Sector is the smallest subdivision of a track.</p>
                    </div>
                 </li>
                 <li className="flex gap-3">
                    <div className="p-1 bg-green-100 text-green-600 rounded-full h-fit mt-0.5"><ShieldCheck size={16} /></div>
                    <div className="text-sm">
                       <span className="font-bold block text-slate-900">Utility Software</span>
                       <p className="text-slate-500">Antivirus & Defragmenter (Performance enhancers).</p>
                    </div>
                 </li>
              </ul>
           </div>

           {/* MOST ASKED TOPICS AND QUESTIONS */}
           <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                   <ListChecks size={24} />
                 </div>
                 <h3 className="font-bold text-slate-800 text-xl">Most Asked Q&A</h3>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                 {MOST_ASKED_CONTENT.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                       <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">{item.q}</div>
                       <div className="text-sm text-slate-700 font-medium">{item.a}</div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default ComputerSePyaar;
