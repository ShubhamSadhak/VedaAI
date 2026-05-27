import { LayoutGrid, Users, FileText, Settings, X, Bell, Sparkles, Tablet, Clock } from 'lucide-react';
import { useAssessmentStore } from '../store';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { activeTab, setActiveTab, assignments, isCreating, setIsCreating } = useAssessmentStore();

  const pendingCount = assignments.filter(a => a.status === 'pending' || a.status === 'processing').length;
  const totalCount = assignments.length;

  interface MenuItem {
    id: 'home' | 'my-groups' | 'assignments' | 'toolkit' | 'library';
    label: string;
    icon: any;
    badge?: string | number;
  }

  const menuItems: MenuItem[] = [
    { id: 'home', label: 'Home', icon: LayoutGrid },
    { id: 'my-groups', label: 'My Groups', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText, badge: totalCount || undefined },
    { id: 'toolkit', label: "AI Teacher's Toolkit", icon: Tablet, badge: pendingCount > 0 ? "Live" : undefined },
    { id: 'library', label: 'My Library', icon: Clock },
  ];

  return (
    <aside 
      id="sidebar-panel" 
      className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white flex flex-col justify-between m-4 rounded-[32px] shadow-[0_10px_35px_-8px_rgba(0,0,0,0.06)] border border-[#e5e5e0]/60 no-print font-sans select-none transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-[110%]'
      } h-[calc(100vh-2rem)]`}
    >
      {/* Top Part: Branding + Create Button + Menu links */}
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Brand Logo Header (No bottom border, clean floating design) */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4">
          <div className="flex items-center gap-3.5">
            {/* High visual fidelity shiny sunset-gradient branded logo V */}
            <div 
              style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #FF3D00 100%)' }}
              className="w-[42px] h-[42px] rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-[0_4px_12px_-2px_rgba(255,23,0,0.25)] border border-[#ffedd5]/20 shrink-0"
            >
              {/* Elegant custom italic-style white V shape */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 3H7.8L12 15.6L16.2 3H21.5L14.8 21H9.2L2.5 3Z" />
              </svg>
            </div>
            <div>
              <span className="font-sans font-extrabold text-2xl tracking-tight text-[#1c1c1e]">
                VedaAI
              </span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-500 hover:bg-[#f5f5f2] border border-[#e5e5e0] rounded-lg bg-white cursor-pointer active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Brand New Reddish-Orange Glowing Create Assignment Button */}
        <div className="px-5 py-4 pb-4">
          <div 
            style={{ background: 'linear-gradient(135deg, #FF7950 0%, #E63D08 100%)' }}
            className="p-[2px] rounded-full shadow-[0_6px_20px_-4px_rgba(230,61,8,0.28)]"
          >
            <button 
              id="sidebar-create-btn"
              onClick={() => {
                setIsCreating(true);
                onClose?.();
              }}
              style={{ background: '#252628' }}
              className="w-full text-white font-bold text-[14.5px] py-3 px-5 rounded-full flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all duration-200 cursor-pointer text-center hover:bg-[#1a1b1d]"
            >
              <Sparkles className="w-4.5 h-4.5 text-white stroke-[2.2]" />
              <span className="font-sans font-semibold">Create Assignment</span>
            </button>
          </div>
        </div>

        {/* Navigation Items (Sentence Case, comfortable grid sizing) */}
        <nav className="px-4.5 py-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = !isCreating && activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose?.();
                }}
                className={`w-full flex items-center justify-between px-4.5 py-3 rounded-2xl font-medium text-[15.5px] transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-[#efeff2] text-[#1c1c1e] font-bold'
                    : 'text-[#8e8e93] hover:bg-[#efeff2]/40 hover:text-[#1c1c1e]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#1c1c1e] stroke-[2.2]' : 'text-[#8e8e93] group-hover:text-[#1c1c1e]'}`} />
                  <span className="tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <span 
                    style={{ backgroundColor: '#FF5623' }}
                    className="text-[9.5px] font-extrabold px-2.5 py-0.5 rounded-full font-mono text-white shadow-sm"
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: Settings + Profile Card / School Affiliation (Seamlessly connected) */}
      <div className="p-4 bg-white rounded-b-[32px]">
        {/* Settings Button */}
        <div className="px-1.5 mb-4">
          <button
            id="sidebar-nav-settings"
            onClick={() => {
              setActiveTab('settings');
              onClose?.();
            }}
            className={`w-full flex items-center gap-4 px-4.5 py-3 rounded-2xl font-medium text-[15.5px] transition-all text-left cursor-pointer group ${
              !isCreating && activeTab === 'settings'
                ? 'bg-[#efeff2] text-[#1c1c1e] font-bold'
                : 'text-[#8e8e93] hover:bg-[#efeff2]/40 hover:text-[#1c1c1e]'
            }`}
          >
            <Settings className={`w-5 h-5 transition-colors ${!isCreating && activeTab === 'settings' ? 'text-[#1c1c1e] stroke-[2.2]' : 'text-[#8e8e93] group-hover:text-[#1c1c1e]'}`} />
            <span className="tracking-wide">Settings</span>
          </button>
        </div>

        {/* Delhi Public School Banner Box (Beautiful flat-tone card containing detailed monkey mascot) */}
        <div className="flex items-center gap-4 p-4 bg-[#ededf2] rounded-[24px] select-none hover:bg-[#ededf2]/80 transition-colors">
          {/* Bored Ape style detailed mascot illustration */}
          <div className="shrink-0">
            <svg className="w-12 h-12 rounded-full shrink-0 select-none shadow-sm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Warm Peach circle background base */}
              <circle cx="50" cy="50" r="50" fill="#fedccf" />
              
              {/* Cap (Backwards, light grey dome with a vibrant yellow brim) */}
              <path d="M 23 38 C 21 24, 42 15, 60 17 C 74 19, 79 28, 77 41 L 23 38 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              <path d="M 25 38 C 15 37, 10 44, 8 47 C 10 51, 23 46, 27 38" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
              <circle cx="50" cy="19" r="1.5" fill="#94a3b8" />
              
              {/* Ears */}
              <circle cx="19" cy="56" r="10.5" fill="#783c1d" stroke="#451a03" strokeWidth="0.8" />
              <circle cx="19" cy="56" r="5" fill="#eed0b5" />
              <circle cx="81" cy="56" r="10.5" fill="#783c1d" stroke="#451a03" strokeWidth="0.8" />
              <circle cx="81" cy="56" r="5" fill="#eed0b5" />
              
              {/* Head / Body Base */}
              <path d="M 26 67 C 26 51, 31 43, 50 43 C 69 43, 74 51, 74 67 C 74 77, 69 87, 50 87 C 31 87, 26 77, 26 67 Z" fill="#783c1d" stroke="#451a03" strokeWidth="0.8" />
              
              {/* Face Skin Overlay */}
              <path d="M 37 66 C 37 58, 41 54, 50 54 C 59 54, 63 58, 63 66 C 63 73, 59 76, 50 76 C 41 76, 37 73, 37 66 Z" fill="#eed0b5" />
              
              {/* Sunglasses with gold frames and dark black gradient lenses */}
              <path d="M 26 50 H 74 V 58 C 74 62, 71 64, 68 64 H 61 C 58 64, 56 62, 56 58V 54H 44V 58 C 44 62, 42 64, 39 64 H 32 C 29 64, 26 62, 26 58 Z" fill="#1e293b" />
              <path d="M 26 50 L 74 50" stroke="#facc15" strokeWidth="1.5" />
              <circle cx="34" cy="56" r="4.5" fill="#0f172a" />
              <circle cx="66" cy="56" r="4.5" fill="#0f172a" />
              {/* White sunburst lens highlights */}
              <line x1="32" y1="53" x2="36" y2="57" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
              <line x1="64" y1="53" x2="68" y2="57" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />

              {/* Nose */}
              <path d="M 47 63 C 47 61, 53 61, 53 63 C 53 65, 47 65, 47 63 Z" fill="#451a03" />

              {/* Mouth with a tiny red line/smile */}
              <path d="M 43 69 Q 50 73, 57 69" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
              
              {/* Clothes: Grey/White Sport Sweatshirt */}
              <path d="M 29 85 C 29 85, 37 79, 50 79 C 63 79, 71 85, 71 85 L 67 100 H 33 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
              <path d="M 40 79 C 40 79, 46 83, 50 83 C 54 83, 60 79, 60 79" stroke="#ffffff" strokeWidth="1.2" fill="none" />

              {/* Golden chain with custom square medallion */}
              <path d="M 37 88 C 41 93, 59 93, 63 88" stroke="#facc15" strokeWidth="1.4" fill="none" />
              <rect x="46.5" y="89.5" width="7" height="9" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
              <circle cx="50" cy="94" r="1.5" fill="#eab308" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[15.5px] font-bold text-[#1c1c1e] leading-tight tracking-tight font-sans">
              Delhi Public School
            </h4>
            <p className="text-[13px] text-[#8e8e93] font-medium leading-none mt-1 font-sans">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
