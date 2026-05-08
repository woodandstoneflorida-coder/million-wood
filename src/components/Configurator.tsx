"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Shirt, AlignJustify, ArrowDownToLine, Trash2, Maximize, LayoutTemplate } from "lucide-react";
import { trackMetaEvent } from "@/lib/metaPixel";

type Material = { id: string; name: string; color: string; border: string; image?: string };
type ModuleType = "drawers" | "hanger" | "shelves" | null;

const materials: Material[] = [
  { id: "white", name: "Satin White", color: "bg-[#f5f5f5]", border: "border-[#d0d0d0]" },
  { id: "designer", name: "Designer Colors (Lioher)", color: "bg-[#1a1a1a]", border: "border-[#0a0a0a]", image: "/textures/matte.png" },
];

export default function Configurator({ onClose }: { onClose?: () => void }) {
  const [material, setMaterial] = useState<Material>(materials[0]);
  const [layoutType, setLayoutType] = useState<string>("Single Wall");
  const [width, setWidth] = useState<number>(120);
  const [height, setHeight] = useState<number>(96);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const trackStart = () => {
    // Asegurar siempre que la URL cambie al usar el estudio (incluso si regresan de otra sección)
    if (typeof window !== 'undefined' && !window.location.search.includes('section=design-studio')) {
      window.history.pushState({}, '', '/?section=design-studio');
    }

    // El evento del Píxel solo se dispara la primera vez para no hacer spam
    if (!hasTrackedStart) {
      setHasTrackedStart(true);
      trackMetaEvent('ConfiguratorStarted', {}, true);
    }
  };

  const [sections, setSections] = useState<Record<string, ModuleType>>({
    "left-top": null, "left-mid": null, "left-bottom": null,
    "center-top": null, "center-mid": null, "center-bottom": null,
    "right-top": null, "right-mid": null, "right-bottom": null,
  });

  const handleSetModule = (sectionKey: string, mod: ModuleType) => {
    setSections((prev) => ({ ...prev, [sectionKey]: mod }));
    trackStart();
  };

  const handleQuoteClick = () => {
    const messageInput = document.getElementById("message") as HTMLTextAreaElement;
    if (messageInput) {
      
      const formatSection = (col: string) => {
        const top = sections[`${col}-top`] || "Empty";
        const mid = sections[`${col}-mid`] || "Empty";
        const bot = sections[`${col}-bottom`] || "Empty";
        if (top === "Empty" && mid === "Empty" && bot === "Empty") return "Empty";
        return `Top: ${top}, Middle: ${mid}, Bottom: ${bot}`;
      };

      let designSummary = `I used your Interactive Studio! Here is my custom closet design:

- Room Layout: ${layoutType}
- Total Dimensions: ${width}" W x ${height}" H
- Finish Material: ${material.name}

*PRIMARY WALL MODULE LAYOUT*
- Left Column: ${formatSection('left')}
- Center Column: ${formatSection('center')}
- Right Column: ${formatSection('right')}

I would like to get a quote for this exact configuration.`;

      // Check for active discount code
      const code = localStorage.getItem("mw_discount_code");
      const expiresStr = localStorage.getItem("mw_discount_expires");
      if (code && expiresStr) {
        const expiresAt = parseInt(expiresStr);
        if (expiresAt > Date.now()) {
          designSummary += `\n\n--- AUTO-APPENDED INFO ---\nDISCOUNT CODE APPLIED: ${code}\n(Valid for 10% Extra Discount)`;
        }
      }
      
      messageInput.value = designSummary;
    }
    
    // Scroll to contact section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      if (onClose) onClose();
      
      trackMetaEvent('ConfiguratorCompleted', {}, true);
      
      setTimeout(() => {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const renderModuleControls = (sectionKey: string, current: ModuleType) => {
    if (current) {
      return (
        <button 
          onClick={() => handleSetModule(sectionKey, null)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors p-1.5 bg-matte-black/90 rounded-md border border-charcoal shadow-lg z-20"
          title="Remove module"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      );
    }

    const rowPosition = sectionKey.split('-')[1]; // "top", "mid", "bottom"

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-matte-black/80 backdrop-blur-sm z-20">
        
        {/* Hanger is only allowed on top or mid */}
        {(rowPosition === "top" || rowPosition === "mid") && (
          <button onClick={() => handleSetModule(sectionKey, "hanger")} className="w-[85%] py-1.5 text-[10px] uppercase tracking-widest bg-charcoal hover:bg-metallic-gold hover:text-matte-black text-white transition-colors border border-gray-700 flex items-center justify-center gap-1.5">
            <Shirt className="w-3 h-3" /> Hanger
          </button>
        )}
        
        {/* Drawers are only allowed on bottom */}
        {rowPosition === "bottom" && (
          <button onClick={() => handleSetModule(sectionKey, "drawers")} className="w-[85%] py-1.5 text-[10px] uppercase tracking-widest bg-charcoal hover:bg-metallic-gold hover:text-matte-black text-white transition-colors border border-gray-700 flex items-center justify-center gap-1.5">
            <ArrowDownToLine className="w-3 h-3" /> Drawers
          </button>
        )}
        
        {/* Shelves are allowed anywhere */}
        <button onClick={() => handleSetModule(sectionKey, "shelves")} className="w-[85%] py-1.5 text-[10px] uppercase tracking-widest bg-charcoal hover:bg-metallic-gold hover:text-matte-black text-white transition-colors border border-gray-700 flex items-center justify-center gap-1.5">
          <AlignJustify className="w-3 h-3" /> Shelves
        </button>
      </div>
    );
  };

  const renderModuleVisual = (current: ModuleType) => {
    if (current === "drawers") {
      return (
        <div className="absolute bottom-0 w-full h-full flex flex-col border-t-2 border-black/30">
          <div className="flex-1 border-b border-black/30 flex items-center justify-center relative"><div className="w-8 h-0.5 bg-black/40 rounded-full"></div><div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20"></div></div>
          <div className="flex-1 border-b border-black/30 flex items-center justify-center relative"><div className="w-8 h-0.5 bg-black/40 rounded-full"></div><div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20"></div></div>
          <div className="flex-1 border-b border-black/30 flex items-center justify-center relative"><div className="w-8 h-0.5 bg-black/40 rounded-full"></div><div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20"></div></div>
        </div>
      );
    }
    if (current === "hanger") {
      return (
        <div className="absolute top-0 w-full h-full">
          {/* Rod */}
          <div className="absolute top-4 w-full h-1.5 bg-gradient-to-b from-gray-300 to-gray-500 shadow-md"></div>
          {/* Hangers visual */}
          <div className="absolute top-5 left-1/4 w-0.5 h-12 bg-gray-500/50"></div>
          <div className="absolute top-5 left-1/2 w-0.5 h-12 bg-gray-500/50"></div>
          <div className="absolute top-5 right-1/4 w-0.5 h-12 bg-gray-500/50"></div>
        </div>
      );
    }
    if (current === "shelves") {
      return (
        <div className="absolute inset-0 flex flex-col justify-evenly">
          <div className="w-full h-2 border-y border-black/30 shadow-sm" style={{ backgroundColor: "inherit" }}></div>
          <div className="w-full h-2 border-y border-black/30 shadow-sm" style={{ backgroundColor: "inherit" }}></div>
        </div>
      );
    }
    return <div className="absolute inset-0 flex items-center justify-center text-black/10 font-bold tracking-widest text-sm uppercase">Empty</div>;
  };

  const colWidth = (width / 3).toFixed(1);
  const rowHeight = (height / 3).toFixed(1);

  return (
    <div className="w-full relative px-6 md:px-12 py-12 bg-deep-charcoal">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Interactive <span className="text-gradient-gold">Design Studio</span>
          </h2>
          <div className="w-24 h-[1px] bg-metallic-gold opacity-50 mb-6"></div>
          <p className="text-gray-400 max-w-2xl text-lg font-light">
            Experiment with materials and 3x3 grid layouts. Build your dream custom closet and get precise estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Controls Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Room Layout */}
            <div className="bg-matte-black border border-charcoal p-6">
              <h3 className="text-sm uppercase tracking-widest text-white font-semibold mb-4 flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-metallic-gold" /> Room Layout
              </h3>
              <select 
                value={layoutType} 
                onChange={(e) => {
                  setLayoutType(e.target.value);
                  trackStart();
                }}
                className="w-full bg-charcoal border border-gray-700 text-white px-3 py-2 text-sm focus:border-metallic-gold outline-none transition-colors"
              >
                <option value="Single Wall">Single Wall (Linear)</option>
                <option value="L-Shape">L-Shape (Corner)</option>
                <option value="Walk-in (U-Shape)">Walk-in (U-Shape)</option>
              </select>
            </div>

            {/* Dimensions */}
            <div className="bg-matte-black border border-charcoal p-6">
              <h3 className="text-sm uppercase tracking-widest text-white font-semibold mb-4 flex items-center gap-2">
                <Maximize className="w-4 h-4 text-metallic-gold" /> Dimensions
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Total Width (inches)</label>
                  <input type="number" value={width} onChange={(e) => { setWidth(Number(e.target.value)); trackStart(); }} className="w-full bg-charcoal border border-gray-700 text-white px-3 py-2 text-sm focus:border-metallic-gold outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Total Height (inches)</label>
                  <input type="number" value={height} onChange={(e) => { setHeight(Number(e.target.value)); trackStart(); }} className="w-full bg-charcoal border border-gray-700 text-white px-3 py-2 text-sm focus:border-metallic-gold outline-none transition-colors" />
                </div>
              </div>
            </div>

            {/* Material */}
            <div>
              <h3 className="text-sm uppercase tracking-widest text-white font-semibold mb-4">Select Finish</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {materials.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMaterial(m);
                      trackStart();
                      trackMetaEvent('ViewMaterial', { material_name: m.name }, true);
                    }}
                    className={`flex flex-col items-center justify-center p-2 border transition-all duration-300 ${
                      material.id === m.id ? "border-metallic-gold bg-charcoal shadow-[0_0_10px_rgba(212,175,55,0.2)]" : "border-gray-800 hover:border-gray-600 bg-matte-black"
                    }`}
                  >
                    <div 
                      className={`w-full h-10 mb-2 ${m.color} shadow-inner`}
                      style={m.image ? { backgroundImage: `url('${m.image}')`, backgroundSize: 'cover' } : {}}
                    ></div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-300 text-center">{m.name}</span>
                  </button>
                ))}
              </div>
              
              {material.id === "designer" && (
                <motion.a 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  href="/catalogs/Lioher_Collection.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-2 px-4 bg-gray-800 hover:bg-metallic-gold hover:text-matte-black text-gray-300 text-xs text-center uppercase tracking-widest transition-colors border border-gray-600 hover:border-metallic-gold"
                >
                  View Lioher Catalog (PDF)
                </motion.a>
              )}
            </div>
          </div>

          {/* 2D Canvas Area */}
          <div className="lg:col-span-9 flex flex-col items-center justify-center relative pt-8 pl-8">
            
            {/* Top Dimension Line */}
            <div className="absolute top-0 left-8 right-0 flex items-center justify-center text-gray-500 text-xs font-mono">
              <div className="w-full border-t border-gray-500 absolute top-1/2"></div>
              <div className="w-2 h-2 border-l border-b border-gray-500 rotate-45 absolute left-0 bg-deep-charcoal"></div>
              <span className="bg-deep-charcoal px-2 z-10">{width}" Total Width</span>
              <div className="w-2 h-2 border-r border-t border-gray-500 rotate-45 absolute right-0 bg-deep-charcoal"></div>
            </div>

            {/* Left Dimension Line */}
            <div className="absolute top-8 bottom-0 left-0 flex flex-col items-center justify-center text-gray-500 text-xs font-mono">
              <div className="h-full border-l border-gray-500 absolute left-1/2"></div>
              <div className="w-2 h-2 border-l border-t border-gray-500 rotate-45 absolute top-0 bg-deep-charcoal"></div>
              <span className="bg-deep-charcoal py-2 z-10 rotate-180" style={{ writingMode: 'vertical-rl' }}>{height}" Total Height</span>
              <div className="w-2 h-2 border-r border-b border-gray-500 rotate-45 absolute bottom-0 bg-deep-charcoal"></div>
            </div>

            {/* The Outer Frame of the Closet */}
            <div className={`w-full aspect-[1.2] border-[12px] sm:border-[16px] shadow-2xl flex flex-row relative ${material.color} ${material.border} transition-colors duration-700`}
                 style={material.image ? { backgroundImage: `url('${material.image}')`, backgroundSize: 'cover' } : {}}>
              
              {["left", "center", "right"].map((col, cIdx) => (
                <div key={col} className={`flex-1 flex flex-col relative ${cIdx < 2 ? 'border-r-[8px] sm:border-r-[12px]' : ''}`} style={{ borderColor: 'inherit' }}>
                  
                  {/* Column Dimension Header */}
                  <div className="absolute -top-6 w-full text-center text-[10px] text-gray-500 font-mono hidden sm:block">
                    {colWidth}" W
                  </div>

                  {["top", "mid", "bottom"].map((row, rIdx) => {
                    const sectionKey = `${col}-${row}`;
                    return (
                      <div key={sectionKey} className={`flex-1 relative group ${rIdx < 2 ? 'border-b-4 sm:border-b-[6px]' : ''} border-black/20`} style={{ borderColor: 'inherit' }}>
                        
                        {/* Row Dimension Side (Only on left col) */}
                        {col === "left" && (
                          <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono hidden sm:block">
                            {rowHeight}" H
                          </div>
                        )}

                        {renderModuleVisual(sections[sectionKey])}
                        {renderModuleControls(sectionKey, sections[sectionKey])}
                      </div>
                    );
                  })}
                </div>
              ))}
              
            </div>

            {/* Baseboard */}
            <div className={`w-[102%] h-4 sm:h-6 ${material.color} ${material.border} shadow-md translate-y-1`}
                 style={material.image ? { backgroundImage: `url('${material.image}')`, backgroundSize: 'cover' } : {}}></div>

            <div className="mt-16 w-full flex justify-center">
              <button 
                onClick={handleQuoteClick}
                className="px-8 py-4 bg-metallic-gold text-matte-black font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                Send Design for Quote
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
