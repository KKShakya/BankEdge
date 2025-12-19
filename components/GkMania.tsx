
import React, { useState } from 'react';
import { Globe, Building2, MapPin, Newspaper, ChevronLeft, Landmark, Plane, Users, Swords, Briefcase, Award, Zap, CalendarDays, Trophy, Laptop, Gavel, Scale, AlertTriangle, FileWarning, ClipboardList, Sparkles, Flower2, Music } from 'lucide-react';

// Data Structures

const BANKING_AWARENESS = [
  {
    title: "Financial Markets (Concepts)",
    content: [
      "**Money Market:** Short-term funds (< 1 Year). Regulated by RBI. <br/><span class='text-xs text-slate-500 ml-4'>Instruments: T-Bills, Certificate of Deposit (CD), Commercial Paper.</span>",
      "**Capital Market:** Long-term funds (> 1 Year). Regulated by SEBI. <br/><span class='text-xs text-slate-500 ml-4'>Instruments: Shares, Debentures, Bonds.</span>"
    ]
  },
  {
    title: "Accounts: NRE vs NRO (Tax Rule)",
    content: [
      "**NRE Account (External):** Money earned *Outside* India. <span class='text-green-600 font-bold bg-green-50 px-1 rounded'>Tax-Free</span> in India.",
      "**NRO Account (Ordinary):** Money earned *Inside* India (e.g., Rent, Dividends). <span class='text-red-600 font-bold bg-red-50 px-1 rounded'>Taxable</span>."
    ]
  },
  {
    title: "Acts & Limits (Crucial Traps)",
    content: [
      "**Payments Bank:** Max Deposit **₹2 Lakh**. Cannot lend. <span class='text-amber-600 text-xs font-bold ml-1 bg-amber-50 px-1 rounded border border-amber-100'>🔥 Trap: SFB has NO limit</span>",
      "**SARFAESI Act (2002):** Banks can seize assets for NPA. <span class='text-amber-600 text-xs font-bold ml-1'>Exemption: Agricultural Land</span>.",
      "**NPCI:** Retail Payments Umbrella (UPI/RuPay). Est 2008.",
      "**PFRDA:** Pension Regulator. HQ: New Delhi."
    ]
  }
];

const STATIC_GK = [
  {
    category: "Indian Festivals & Heritage",
    icon: Sparkles,
    items: [
      { k: "UNESCO Heritage", v: "Durga Puja, Diwali (Latest), Garba, Chhau, Kumbh" },
      { k: "Hornbill Festival", v: "Nagaland (Partners: UK, Denmark, Ireland)" },
      { k: "Ambubachi Mela", v: "Kamakhya Temple, Assam" },
      { k: "New Year (Losar)", v: "Ladakh, Sikkim, Himachal (Tibetan Buddhist)" },
      { k: "New Year (Vishu)", v: "Kerala" },
      { k: "Floral Festival", v: "Bathukamma (Telangana)" },
      { k: "Buddhist Festivals", v: "Saga Dawa & Losung (Sikkim)" },
      { k: "Parsi New Year", v: "Navroz" }
    ]
  },
  {
    category: "Temple & Regional Fairs",
    icon: Landmark,
    items: [
      { k: "Pushkar Fair", v: "Rajasthan (Lord Brahma & Camel Fair)" },
      { k: "Karni Mata Fair", v: "Deshnok, Rajasthan (Famous for Rats)" },
      { k: "Odisha Harvest", v: "Nuakhai, Dhanuyatra, Bali Jatra, Raj Parv" },
      { k: "Meghalaya", v: "Cherry Blossom Festival (Oct-Nov)" },
      { k: "Mizoram", v: "Chapchar Kut" },
      { k: "Tripura", v: "Tripura (Kharchi Puja)" },
      { k: "Surajkund Mela", v: "Faridabad, Haryana (Sun God linked)" }
    ]
  },
  {
    category: "GK Tricks & Mnemonics",
    icon: Zap,
    items: [
      { k: "Bihu (Assam)", v: "Mnemonic: 'Assam ki Bahu' (Harvest)" },
      { k: "O-P Pair", v: "O = Onam (Kerala) | P = Pongal (Tamil Nadu)" },
      { k: "PESO Countries", v: "MACD CPU (Mex, Arg, Chile, Dom, Col, Phil, Uru)" },
      { k: "RUPEE Countries", v: "Maldives, Maur, SL, Nepal, Ind, Indo, Sey, Pak" },
      { k: "Dinar (Click-Sabt)", v: "Kuwait, Libya, Iraq, Jordan, Serb, Alg, Bah, Tun" }
    ]
  },
  {
    category: "Intl. Orgs & HQs (Grouped)",
    icon: Building2,
    items: [
      { k: "Vienna (Energy/Ind)", v: "UNIDO, OPEC, IAEA" },
      { k: "Montreal", v: "WADA (Anti-Doping)" },
      { k: "Lausanne", v: "FIDE (Chess)" },
      { k: "Jakarta", v: "ASEAN" },
      { k: "Kuala Lumpur", v: "Asian Hockey Federation" },
      { k: "New York", v: "UNFPA (Note: UNEP is Nairobi)" }
    ]
  },
  {
    category: "Power Plants & Nature",
    icon: Globe,
    items: [
      { k: "Kaiga Atomic", v: "Karnataka (Record 962 Days)" },
      { k: "Mundra Thermal", v: "Gujarat (Adani) 🔥 Not Atomic" },
      { k: "Ramsar Sites", v: "Chilika (1st), Bhitarkanika (OD). Total: 96" },
      { k: "Tiger State", v: "Madhya Pradesh (Nauradehi TR)" },
      { k: "Floating Solar", v: "Omkareshwar, MP" }
    ]
  }
];

const CURRENT_AFFAIRS = [
  {
    month: "Feb 2026 Strategy (Static Linked)",
    sections: [
      {
        type: "🚨 Critical Corrections",
        icon: AlertTriangle,
        color: "red",
        points: [
          "**Dinar Mnemonic:** **K-L-I-J-S-A-B-T** (Click-Sabt).",
          "**Countries:** Kuwait, Libya, Iraq, Jordan, Serbia, Algeria, Bahrain, Tunisia.",
          "**Correction:** 'Bisquit' is incorrect. Iran uses Rial. 'U' is invalid.",
          "**Typo Alert:** **Daporijo** Airport (Arunachal), not 'Poriju'."
        ]
      },
      {
        type: "Stream B: News-Linked Static",
        icon: Zap,
        color: "blue",
        points: [
          "**Tiroda Thermal Plant:** **Gondia, Maharashtra** (Adani). News: ADB Funding.",
          "**Green Hydrogen Ports:** Deendayal (GJ), Paradip (OD), VOC (TN).",
          "**Bhoj Wetland:** **Bhopal, MP**. News: De-notification threat.",
          "**Rana Pratap Sagar Dam:** **Chambal River**, Rajasthan.",
          "**Airports in News:** Daporijo & Tezu (Arunachal), Devi Ahilyabai (Indore)."
        ]
      }
    ]
  }
];

const RBI_DATA = [
  {
    title: "Module 1: RBI History & Structure",
    content: [
      "**Foundation:** Hilton Young Commission (**1926**). RBI Act, **1934**.",
      "**Establishment:** **April 1, 1935** (Private entity, ₹5 Cr capital). Nationalized: **Jan 1, 1949**.",
      "**Governors:** 1st: **Sir Osborne Smith**. 1st Indian: **C.D. Deshmukh**.",
      "**Central Board:** **21 Members**. (1 Gov + 4 Deputy Govs + 4 Local Boards + 10 Govt Nominees + 2 Fin Min Officials).",
      "**Currency Rights:** **Section 22** (Sole right to issue). **Minimum Reserve System** ( MRS, 1957) requires ₹200 Cr Assets (₹115 Cr Gold + ₹85 Cr Forex).",
      "**Denominations:** Max **₹10,000** (Section 24). Languages on note: **17**."
    ]
  },
  {
    title: "RBI Subsidiaries & Framework",
    content: [
      "**Fully Owned:** DICGC, BRBNMPL, ReBIT, IFTAS, RBIH (CEO: Rajesh Bansal).",
      "**Note:** **NHB is NO LONGER** a subsidiary (100% Govt owned now).",
      "**Associate:** **NCFE** (30% stake)."
    ]
  },
  {
    title: "Module 2: Monetary Policy Framework",
    content: [
      "**MPC (Committee):** **Section 45ZB**. 6 Members (3 RBI + 3 Govt). Quorum: 4.",
      "**CRR:** **Section 42(1)** of RBI Act. Held with RBI in **CASH**. No interest paid.",
      "**SLR:** **Section 24** of BR Act 1949. Held by Bank in **Liquid Assets**. **Equity NOT allowed**.",
      "**Rates:** Repo (Lends), Rev Repo (Absorbs), MSF (Emergency SLR), SDF (Absorb without collateral), OMO (G-Sec Trading)."
    ]
  },
  {
    title: "Module 3: Banking Structure & RRBs",
    content: [
      "**Imperial Bank (1921):** Renamed **SBI** on **July 1, 1955** (Gorwala Committee).",
      "**Nationalization:** **1969** (14 Banks > ₹50 Cr), **1980** (6 Banks > ₹200 Cr).",
      "**RRBs:** Est **Oct 2, 1975** (**Narasimham Committee**). Ownership: Central (**50%**) : Sponsor (**35%**) : State (**15%**). Reg: RBI. Super: **NABARD**.",
      "**Payments Banks:** **Nachiket Mor**. Max Dep: **₹2 Lakh**. Cannot Lend.",
      "**Small Finance Banks:** **Usha Thorat**. PSL Target: **75%**. Min Capital: **₹200 Cr**."
    ]
  },
  {
    title: "Module 4: Financial Markets",
    content: [
      "**Money Market:** Short Term (< 1Y). Reg: **RBI**. (Call: 1D, Notice: 2-14D, Term: >14D).",
      "**Capital Market:** Long Term (> 1Y). Reg: **SEBI**. (Primary: IPO, Secondary: Exchange).",
      "**T-Bills:** Issued by Govt. **91, 182, 364 days**. Min: **₹25,000**.",
      "**CMB:** Temporary cash flow (< 91 days).",
      "**CP & CD:** Min Amount: **₹5 Lakh**.",
      "**Exchanges:** BSE (**1875**, Oldest), NSE (**1992**)."
    ]
  },
  {
    title: "Module 5: Operations, Cheques & NPCI",
    content: [
      "**Accounts:** CASA (Interest on Daily Product). RAFA (Term). RD tenure: 6M to 10Y.",
      "**BSBDA:** No min balance. Max Credit ₹1L/yr. Max 4 withdrawals/month.",
      "**Cheques:** CTS (2010). Validity: **3 Months**.",
      "**ATM Types:** White (Non-Bank), Brown (Shared), Green (Agri), Pink (Women).",
      "**NPCI (2008):** Section 8 (Not-for-Profit). Products: UPI, IMPS, RuPay, NACH."
    ]
  },
  {
    title: "Module 6: Inclusion & Social Security",
    content: [
      "**PMJDY (2014):** OD: **₹10,000**. Accident Cover: **₹2 Lakh** (RuPay).",
      "**PMSBY:** ₹20/yr. Cover: ₹2 Lakh. Age: 18-70.",
      "**PMJJBY:** ₹436/yr. Cover: ₹2 Lakh. Age: 18-50.",
      "**APY:** Age: 18-40. Pension: ₹1k-5k after 60.",
      "**MUDRA:** Shishu (50k), Kishore (50k-5L), Tarun (5L-10L).",
      "**Small Savings:** PPF (15Y, EEE), KVP (Double in 115M), Sukanya (Girl < 10yr)."
    ]
  },
  {
    title: "Module 7: Intl Groups & Budget",
    content: [
      "**World Bank (DC):** IBRD, IFC, IDA, MIGA (India is member). **ICSID (India NOT a member)**.",
      "**Budget:**James Wilson (1860). Railway merge: **2017**.",
      "**Constitutional Funds:** Consolidated (**Art 266-1**), Contingency (**Art 267-1**)."
    ]
  },
  {
    title: "Module 8: Master Committee Cheat Sheet",
    content: [
      "**NABARD Formation:** CRAFICARD (B. Sivaraman)",
      "**RRB Formation:** Narasimham Committee",
      "**Financial Inclusion:** C. Rangarajan Committee",
      "**Small Finance Banks:** Usha Thorat Committee",
      "**Payments Banks:** Nachiket Mor Committee",
      "**Universal Banking:** R.H. Khan Committee",
      "**CIBIL / Credit Info:** Siddiqui Committee",
      "**Banking Reforms:** Narasimham Committee (I & II)"
    ]
  }
];

const MINISTRY_DATA = {
    static: [
        { portfolio: "Defense", name: "Rajnath Singh" },
        { portfolio: "Home Affairs & Cooperation", name: "Amit Shah" },
        { portfolio: "Finance & Corporate Affairs", name: "Nirmala Sitharaman" },
        { portfolio: "External Affairs", name: "Dr. S. Jaishankar" },
        { portfolio: "Road Transport & Highways", name: "Nitin Gadkari" },
        { portfolio: "Railways, I&B, IT", name: "Ashwini Vaishnaw" },
        { portfolio: "Education & Skill Dev", name: "Dharmendra Pradhan" },
        { portfolio: "Commerce, Industry & Consumer", name: "Piyush Goyal" },
        { portfolio: "Agriculture", name: "Shivraj Singh Chouhan (Verify)" }
    ],
    news: [
        "**Ministry of Steel:** Launched **SARAL SIMS** portal for import monitoring.",
        "**Ministry of Agriculture:** Released **PM Kisan 21st Installment** (₹18k Cr) in Coimbatore.",
        "**Ministry of Defense:** Achieved record defense production of **₹1.54 Lakh Cr** in FY25.",
        "**Ministry of Finance:** GST collections consistently crossing ₹1.7 Lakh Cr mark.",
        "**Ministry of Cooperation:** Amit Shah inaugurated 'Bharat Organics' cooperative."
    ]
};

// RECOVERY DATA SET
const RECOVERY_DATA = [
  {
    title: "📂 Recovery Set 1: Marathon Details",
    icon: Zap,
    color: "amber",
    items: [
      {
        topic: "Appointments (Tenures & Specifics)",
        points: [
          "**Sandeep Pradhan:** SEBI WTM for **3 Years**.",
          "**Justice Vikram Nath:** Exec Chairman of **NALSA**.",
          "**Rahul Dravid:** Brand Amb for **Paradip Phosphates**.",
          "**Rohit Sharma:** Amb for **ICC T20 WC 2026**."
        ]
      }
    ]
  }
];

const GkMania: React.FC = () => {
    const [view, setView] = useState<'menu' | 'banking' | 'static' | 'current' | 'rbi' | 'ministries' | 'recovery'>('menu');

    if (view === 'menu') {
        return (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
                        <Globe className="text-blue-600" size={40} />
                        GK Mania
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Your repository for Banking Awareness, Static Facts, RBI Frameworks, and Current Affairs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Recovery Card */}
                    <div 
                        onClick={() => setView('recovery')}
                        className="bg-red-50 rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl hover:border-red-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-red-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <ClipboardList size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-red-800 mb-2 group-hover:text-red-900 transition-colors">Master Recovery Sheet</h3>
                            <p className="text-red-600 text-sm leading-relaxed mb-6 font-medium">
                                The missing details. Specific dates, tenures, and "gap-fillers" from Marathon sessions.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-white text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm border border-red-200">
                            Review Missing Data <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* Banking Awareness */}
                    <div 
                        onClick={() => setView('banking')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-indigo-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Landmark size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Banking Awareness</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Acts, Headquarters, Limits, and History. The core of Mains.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-indigo-50 text-indigo-600 py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            Open Vault <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* RBI Vault */}
                    <div 
                        onClick={() => setView('rbi')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-amber-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-amber-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Scale size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">RBI Vault</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                The complete Banking Awareness & RBI syllabus. 8 Master Modules.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-amber-50 text-amber-600 py-3 rounded-xl font-bold text-sm hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            View Master Data <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* Ministries */}
                    <div 
                        onClick={() => setView('ministries')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-purple-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-purple-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Gavel size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">Indian Ministries</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Cabinet Portfolios, Latest Schemes, Portals & Actions.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-purple-50 text-purple-600 py-3 rounded-xl font-bold text-sm hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            Check Cabinet <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* Static GK */}
                    <div 
                        onClick={() => setView('static')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-emerald-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MapPin size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">Static GK</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                National Parks, Airports, Dances, and International HQs.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-emerald-50 text-emerald-600 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            Explore Map <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>

                    {/* Current Affairs */}
                    <div 
                        onClick={() => setView('current')}
                        className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:border-rose-300 transition-all cursor-pointer group relative overflow-hidden h-full flex flex-col justify-between"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-rose-200 transition-all"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Newspaper size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-rose-600 transition-colors">Current Affairs</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Monthly timelines categorized by Appointments, Defense, and Sports.
                            </p>
                        </div>
                        <button className="relative z-10 w-full bg-rose-50 text-rose-600 py-3 rounded-xl font-bold text-sm hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2">
                            Read News <ChevronLeft className="rotate-180" size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- SUB-VIEWS ---

    if (view === 'recovery') {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                            <ClipboardList className="text-red-600" size={24} />
                            Master Recovery Sheet
                        </h1>
                        <p className="text-slate-500 text-sm">Detailed stats & corrections missed in previous summaries.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {RECOVERY_DATA.map((section, idx) => {
                        const Icon = section.icon;
                        const colors = {
                            amber: "bg-amber-50 border-amber-200 text-amber-900",
                            red: "bg-red-50 border-red-200 text-red-900",
                            blue: "bg-blue-50 border-blue-200 text-blue-900"
                        }[section.color] || "bg-slate-50 border-slate-200 text-slate-900";

                        return (
                            <div key={idx} className={`rounded-2xl p-6 border shadow-sm ${colors}`}>
                                <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
                                    <Icon size={24} className="opacity-75" />
                                    <h3 className="text-xl font-bold">{section.title}</h3>
                                </div>
                                <div className="space-y-6">
                                    {section.items.map((item, i) => (
                                        <div key={i}>
                                            <h4 className="text-sm font-bold opacity-70 uppercase tracking-wider mb-2">{item.topic}</h4>
                                            <ul className="space-y-2">
                                                {item.points.map((pt, p) => (
                                                    <li key={p} className="text-sm leading-relaxed flex gap-2">
                                                        <span className="opacity-50 mt-1.5">•</span>
                                                        <span dangerouslySetInnerHTML={{ __html: pt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (view === 'banking') {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Landmark className="text-indigo-600" size={24} />
                        Banking Awareness
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {BANKING_AWARENESS.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-indigo-900 mb-4 border-b border-slate-100 pb-2">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.content.map((point, pIdx) => (
                                    <li key={pIdx} className="flex gap-3 text-slate-700 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                                        <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-900">$1</span>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'rbi') {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Scale className="text-amber-600" size={24} />
                        RBI & Banking Vault
                    </h1>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {RBI_DATA.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                            <h3 className="text-lg font-bold text-amber-700 mb-4 border-b border-slate-100 pb-2">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.content.map((point, pIdx) => (
                                    <li key={pIdx} className="flex gap-3 text-slate-700 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
                                        <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-900">$1</span>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'ministries') {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Gavel className="text-purple-600" size={24} />
                        Indian Ministries
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center gap-3">
                           <Users className="text-purple-700" size={20} />
                           <h3 className="font-bold text-purple-800">Cabinet Portfolios (Static)</h3>
                        </div>
                        <div className="p-0">
                           {MINISTRY_DATA.static.map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-0">
                                   <div className="text-sm font-medium text-slate-500">{item.portfolio}</div>
                                   <div className="text-sm font-bold text-slate-800">{item.name}</div>
                               </div>
                           ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                        <div className="bg-rose-50 p-4 border-b border-rose-100 flex items-center gap-3">
                           <Newspaper className="text-rose-700" size={20} />
                           <h3 className="font-bold text-rose-800">Ministry Actions (Latest)</h3>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-4">
                                {MINISTRY_DATA.news.map((news, idx) => (
                                    <li key={idx} className="flex gap-3 text-slate-700 leading-relaxed text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></div>
                                        <span dangerouslySetInnerHTML={{ __html: news.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-900">$1</span>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'static') {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <MapPin className="text-emerald-600" size={24} />
                        Static GK
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {STATIC_GK.map((section, idx) => {
                        const Icon = section.icon;
                        return (
                            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">{section.category}</h3>
                                </div>
                                <div className="space-y-3">
                                    {section.items.map((item, iIdx) => (
                                        <div key={iIdx} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                            <span className="text-slate-600 font-medium text-sm">{item.k}</span>
                                            <span className="text-slate-800 font-bold text-sm text-right" dangerouslySetInnerHTML={{ __html: item.v }}></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    if (view === 'current') {
        return (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setView('menu')} className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors shadow-sm">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <Newspaper className="text-rose-600" size={24} />
                        Current Affairs Timeline
                    </h1>
                </div>

                {CURRENT_AFFAIRS.map((monthData, mIdx) => (
                    <div key={mIdx} className="space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="h-px bg-slate-300 flex-1"></div>
                            <span className="bg-slate-800 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                                <CalendarDays size={14} /> {monthData.month}
                            </span>
                            <div className="h-px bg-slate-300 flex-1"></div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {monthData.sections.map((sec, sIdx) => {
                                const Icon = sec.icon;
                                const colors = {
                                    blue: "bg-blue-50 text-blue-700 border-blue-100",
                                    red: "bg-red-50 text-red-700 border-red-100",
                                    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
                                    amber: "bg-amber-50 text-amber-700 border-amber-100",
                                    purple: "bg-purple-50 text-purple-700 border-purple-100"
                                };
                                const theme = colors[sec.color as keyof typeof colors];

                                return (
                                    <div key={sIdx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className={`px-6 py-4 border-b flex items-center gap-3 ${theme}`}>
                                            <Icon size={20} />
                                            <h3 className="font-bold">{sec.type}</h3>
                                        </div>
                                        <div className="p-6">
                                            <ul className="space-y-3">
                                                {sec.points.map((pt, pIdx) => (
                                                    <li key={pIdx} className="text-sm text-slate-600 leading-relaxed pl-3 border-l-2 border-slate-200">
                                                        <span dangerouslySetInnerHTML={{ __html: pt.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-slate-800">$1</span>') }} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                );
                            })}
                         </div>
                    </div>
                ))}
            </div>
        );
    }

    return null;
};

export default GkMania;
