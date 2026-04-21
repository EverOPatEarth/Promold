import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Square, 
  Target, 
  ArrowUpRight, 
  MoveHorizontal, 
  Layers, 
  BookOpen,
  Info,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

// --- Types & Constants ---
interface CalculatorProps {
  isVisible: boolean;
}

// --- Component 1: Square Iron ---
const SquareIronCalc: React.FC<CalculatorProps> = ({ isVisible }) => {
  const [e, setE] = useState<number>(30);
  const [p, setP] = useState<number>(50);
  const [l, setL] = useState<number>(27);
  const [c, setC] = useState<number>(5);

  const h = useMemo(() => e + p + l + c, [e, p, l, c]);

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-sm font-mono text-amber-400 mb-4 tracking-widest uppercase">Input Parameters</h3>
        <div className="grid gap-4">
          <InputGroup label="Product Ejection Distance (E)" value={e} onChange={setE} unit="mm" min={1} />
          <InputGroup label="Ejector Plate Height (P)" value={p} onChange={setP} unit="mm" min={1} />
          <InputGroup label="Limit Block Height (L)" value={l} onChange={setL} unit="mm" min={1} highlight={l < 25 || l > 30} />
          <InputGroup label="Clearance (C)" value={c} onChange={setC} unit="mm" min={0} highlight={c !== 5} />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-500" />
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-tighter">Square Iron Height (H)</p>
            <p className="text-4xl font-bold font-sans text-cyan-400">{h.toFixed(1)} <span className="text-xl">mm</span></p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase ${h > 0 ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' : 'bg-slate-800 text-slate-500'}`}>
              {h > 0 ? 'Calculated' : 'Awaiting Input'}
            </span>
          </div>
        </div>
      </div>

      {/* SVG Diagram for Square Iron */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Cross-Section Preview</span>
        </div>
        <div className="p-4 bg-slate-950 flex justify-center">
          <SquareIronSVG E={e} P={p} L={l} C={c} H={h} />
        </div>
      </div>
    </div>
  );
};

const SquareIronSVG = ({ E, P, L, C, H }: any) => {
  const totalH = H > 0 ? H : (E + P + L + C) || 100;
  const maxDrawH = 180;
  const scale = Math.min(maxDrawH / totalH, 3.0);

  const drawH = totalH * scale;
  const drawE = E * scale;
  const drawP = P * scale;
  const drawL = L * scale;
  const drawC = C * scale;

  const LEFT = 80;
  const RIGHT = 160;
  const W = RIGHT - LEFT;
  const TOP = 30;
  const BOTTOM = TOP + drawH;

  const COL_E = '#38bdf8';
  const COL_P = '#818cf8';
  const COL_L = '#fb923c';
  const COL_C = '#4ade80';
  const COL_H = '#f0c040';

  return (
    <svg viewBox="0 0 320 240" className="w-full max-w-[320px] h-auto overflow-visible">
      {/* Base Plate */}
      <rect x="20" y={BOTTOM} width="280" height="12" fill="#1e2535" stroke="#2c3a50" strokeWidth="1" />
      
      {/* Moving Plate */}
      <rect x="20" y={TOP - 12} width="280" height="12" fill="#1e2535" stroke="#2c3a50" strokeWidth="1" />

      {/* Square Iron Pillar */}
      <rect x={LEFT} y={TOP} width={W} height={drawH} fill="#111418" stroke={COL_H} strokeWidth="1.5" />

      {/* Segments from bottom up */}
      <rect x={LEFT + 1} y={BOTTOM - drawC} width={W - 2} height={drawC} fill={`${COL_C}20`} />
      <line x1={LEFT} y1={BOTTOM - drawC} x2={RIGHT} y2={BOTTOM - drawC} stroke={COL_C} strokeWidth="1" strokeDasharray="3,2" />

      <rect x={LEFT + 1} y={BOTTOM - drawC - drawP} width={W - 2} height={drawP} fill={`${COL_P}20`} />
      <line x1={LEFT} y1={BOTTOM - drawC - drawP} x2={RIGHT} y2={BOTTOM - drawC - drawP} stroke={COL_P} strokeWidth="1" strokeDasharray="3,2" />

      <rect x={LEFT + 1} y={BOTTOM - drawC - drawP - drawL} width={W - 2} height={drawL} fill={`${COL_L}20`} />
      <line x1={LEFT} y1={BOTTOM - drawC - drawP - drawL} x2={RIGHT} y2={BOTTOM - drawC - drawP - drawL} stroke={COL_L} strokeWidth="1" strokeDasharray="3,2" />

      {/* Ejection Area (Top) */}
      <rect x={LEFT + 1} y={TOP} width={W - 2} height={drawE} fill={`${COL_E}10`} />

      {/* Dimension Line for H */}
      <line x1={LEFT - 40} y1={TOP} x2={LEFT - 40} y2={BOTTOM} stroke={COL_H} strokeWidth="1" />
      <path d={`M ${LEFT - 44},${TOP + 8} L ${LEFT - 40},${TOP} L ${LEFT - 36},${TOP + 8}`} fill={COL_H} />
      <path d={`M ${LEFT - 44},${BOTTOM - 8} L ${LEFT - 40},${BOTTOM} L ${LEFT - 36},${BOTTOM - 8}`} fill={COL_H} />
      <text x={LEFT - 50} y={(TOP + BOTTOM) / 2} fill={COL_H} fontSize="10" fontFamily="monospace" textAnchor="middle" transform={`rotate(-90, ${LEFT - 50}, ${(TOP + BOTTOM) / 2})`}>H={totalH.toFixed(1)}</text>
    </svg>
  );
};

// --- Component 2: Tiger Mouth ---
const TigerMouthCalc: React.FC<CalculatorProps> = ({ isVisible }) => {
  const [w, setW] = useState<number>(500);
  const [l, setL] = useState<number>(800);

  const T_TABLE = [
    [400,490,400,799,35,25,30],[400,490,800,1399,40,25,30],[400,490,1400,9999,50,30,40],
    [500,590,500,699,35,25,30],[500,590,700,1299,40,25,30],[500,590,1300,9999,50,30,40],
    [600,690,600,999,40,25,30],[600,690,1000,1599,50,30,40],[600,690,1600,9999,60,35,50],
    [700,790,700,1399,50,30,40],[700,790,1400,9999,60,35,50],
    [800,990,800,1199,50,30,40],[800,990,1200,1599,60,35,50],[800,990,1600,9999,70,35,60],
    [1000,1190,1000,1399,60,35,50],[1000,1190,1400,1999,70,35,60],[1000,1190,2000,9999,80,35,60],
    [1200,9999,1200,1799,70,35,60],[1200,9999,1800,9999,80,35,60],
  ];

  const result = useMemo(() => {
    return T_TABLE.find(r => w >= r[0] && w <= r[1] && l >= r[2] && l <= r[3]);
  }, [w, l]);

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-sm font-mono text-orange-400 mb-4 tracking-widest uppercase">Plate Dimensions</h3>
        <div className="grid gap-4">
          <InputGroup label="AB Plate Width" value={w} onChange={setW} unit="mm" min={400} />
          <InputGroup label="AB Plate Length" value={l} onChange={setL} unit="mm" min={400} />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-orange-500/10 border-b border-slate-800">
              <th className="p-4 font-mono text-orange-400 uppercase text-xs">Component</th>
              <th className="p-4 font-mono text-orange-400 uppercase text-xs text-right">Spec (mm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {[
              { label: 'Guide Pin Dia.', value: result ? `Φ${result[4]}` : '—' },
              { label: 'Return Pin Dia.', value: result ? `Φ${result[5]}` : '—' },
              { label: 'Guide Bushing Dia.', value: result ? `Φ${result[6]}` : '—' },
              { label: 'Tiger Mouth Width', value: result ? `${(result[4] as number) * 2}` : '—', highlight: true },
              { label: 'Tiger Mouth Height', value: result ? `${result[4]}` : '—', highlight: true }
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                <td className={`p-4 font-medium ${row.highlight ? 'text-orange-300' : 'text-slate-400'}`}>{row.label}</td>
                <td className={`p-4 text-right font-mono text-lg ${row.highlight ? 'text-orange-400' : 'text-slate-200'}`}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Component 3: Lifter Angle ---
const LifterAngleCalc: React.FC<CalculatorProps> = ({ isVisible }) => {
  const [u, setU] = useState<number>(5);
  const [c, setC] = useState<number>(2);
  const [h, setH] = useState<number>(50);

  const angle = useMemo(() => {
    if (h <= 0) return 0;
    return (Math.atan((u + c) / h) * 180) / Math.PI;
  }, [u, c, h]);

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-mono text-blue-400 mb-4 tracking-widest uppercase">Geometry</h3>
        <div className="grid gap-4">
          <InputGroup label="Undercut Depth (U)" value={u} onChange={setU} unit="mm" min={0.1} />
          <InputGroup label="Safety Clearance (C)" value={c} onChange={setC} unit="mm" min={0} />
          <InputGroup label="Ejection Stroke (H)" value={h} onChange={setH} unit="mm" min={0.1} />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Required Lifter Angle (α)</p>
        <p className={`text-5xl font-bold font-sans ${angle > 11 ? 'text-red-400' : 'text-blue-400'}`}>
          {angle.toFixed(2)}°
        </p>
        {angle > 11 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex gap-2 items-start text-left">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p><strong>Warning:</strong> Angles above 11° increase binding risk. Consider increasing stroke H.</p>
          </div>
        )}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden p-6">
        <div className="flex justify-center">
          <LifterAngleSVG U={u} C={c} H={h} angleDeg={angle} />
        </div>
      </div>
    </div>
  );
};

const LifterAngleSVG = ({ U, C, H, angleDeg }: any) => {
  const lateralMM = U + C;
  const maxW = 200;
  const maxH = 150;
  const scale = Math.min(maxW / Math.max(lateralMM, 1), maxH / Math.max(H, 1), 5);

  const drawH = H * scale;
  const drawU = U * scale;
  const drawC = C * scale;
  const drawL = (U + C) * scale;

  const startX = 50;
  const startY = 180;

  const A = { x: startX, y: startY - drawH };
  const B = { x: startX + drawL, y: startY };
  const Corner = { x: startX, y: startY };

  return (
    <svg viewBox="0 0 300 220" className="w-full max-w-[300px] h-auto overflow-visible">
      {/* Ground */}
      <line x1={startX - 20} y1={startY + 2} x2={startX + drawL + 40} y2={startY + 2} stroke="#2e3250" strokeWidth="2" />
      
      {/* Triangle */}
      <polygon points={`${A.x},${A.y} ${Corner.x},${Corner.y} ${B.x},${B.y}`} fill="#4f8ef710" />
      
      {/* Vertical Ejection Side */}
      <line x1={A.x} y1={A.y} x2={Corner.x} y2={Corner.y} stroke="#4f8ef7" strokeWidth="2.5" />
      
      {/* Lateral Undercut Side */}
      <line x1={Corner.x} y1={Corner.y} x2={Corner.x + drawU} y2={Corner.y} stroke="#f97316" strokeWidth="3" />
      <line x1={Corner.x + drawU} y1={Corner.y} x2={B.x} y2={B.y} stroke="#a78bfa" strokeWidth="3" />

      {/* Hypotenuse (Lifter Path) */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#22c55e" strokeWidth="2" strokeDasharray="5,3" />

      {/* Angle Marker */}
      <path d={`M ${B.x - 30},${B.y} A 30,30 0 0 1 ${B.x - 28},${B.y - 12}`} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
      <text x={B.x - 45} y={B.y - 5} fill="#f59e0b" fontSize="12" fontWeight="bold">α</text>
    </svg>
  );
};

// --- Component 4: Slider Angle ---
const SliderAngleCalc: React.FC<CalculatorProps> = ({ isVisible }) => {
  const [u, setU] = useState<number>(15);
  const [c, setC] = useState<number>(5);
  const [h, setH] = useState<number>(50);

  const angle = useMemo(() => {
    if (h <= 0) return 0;
    return (Math.atan((u + c) / h) * 180) / Math.PI;
  }, [u, c, h]);

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-mono text-emerald-400 mb-4 tracking-widest uppercase">Cam Parameters</h3>
        <div className="grid gap-4">
          <InputGroup label="Undercut Distance (U)" value={u} onChange={setU} unit="mm" min={0.1} />
          <InputGroup label="Clearance Distance (C)" value={c} onChange={setC} unit="mm" min={0} />
          <InputGroup label="Slider Height (H)" value={h} onChange={setH} unit="mm" min={0.1} />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Slider Angle (α)</p>
        <p className={`text-5xl font-bold font-sans ${angle > 25 ? 'text-amber-400' : 'text-emerald-400'}`}>
          {angle.toFixed(2)}°
        </p>
        <div className="mt-4 flex justify-center gap-4 text-xs font-mono text-slate-500">
          <span>Complement: {(90 - angle).toFixed(1)}°</span>
          <span>Length: {Math.sqrt(Math.pow(u+c, 2) + Math.pow(h, 2)).toFixed(1)} mm</span>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden p-6">
        <div className="flex justify-center">
          <SliderAngleSVG U={u} C={c} H={h} angleDeg={angle} />
        </div>
      </div>
    </div>
  );
};

const SliderAngleSVG = ({ U, C, H, angleDeg }: any) => {
  const lateralMM = U + C;
  const maxW = 200;
  const maxH = 150;
  const scale = Math.min(maxW / Math.max(lateralMM, 1), maxH / Math.max(H, 1), 5);

  const drawH = H * scale;
  const drawU = U * scale;
  const drawC = C * scale;
  const drawL = (U + C) * scale;

  const startX = 60;
  const startY = 180;

  const A = { x: startX, y: startY };
  const B = { x: startX + drawL, y: startY };
  const Cpt = { x: startX, y: startY - drawH };

  return (
    <svg viewBox="0 0 300 220" className="w-full max-w-[300px] h-auto overflow-visible">
      {/* Ground */}
      <line x1={startX - 20} y1={startY + 2} x2={startX + drawL + 40} y2={startY + 2} stroke="#1f2640" strokeWidth="2" />
      
      {/* Triangle */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${Cpt.x},${Cpt.y}`} fill="#00d4aa10" />
      
      {/* Vertical Slider Height */}
      <line x1={A.x} y1={A.y} x2={Cpt.x} y2={Cpt.y} stroke="#00d4aa" strokeWidth="2.5" />
      
      {/* Lateral Sides */}
      <line x1={A.x} y1={A.y} x2={A.x + drawU} y2={A.y} stroke="#f97316" strokeWidth="3" />
      <line x1={A.x + drawU} y1={A.y} x2={B.x} y2={B.y} stroke="#a78bfa" strokeWidth="3" />

      {/* Hypotenuse (Cam Path) */}
      <line x1={Cpt.x} y1={Cpt.y} x2={B.x} y2={B.y} stroke="#ffb347" strokeWidth="2" strokeDasharray="5,3" />

      {/* Angle Marker */}
      <path d={`M ${B.x - 30},${B.y} A 30,30 0 0 1 ${B.x - 22},${B.y - 18}`} fill="none" stroke="#ffd166" strokeWidth="1.5" />
      <text x={B.x - 45} y={B.y - 8} fill="#ffd166" fontSize="12" fontWeight="bold">α</text>
    </svg>
  );
};


// --- Component 5: Ejector Plate ---
const EjectorPlateCalc: React.FC<CalculatorProps> = ({ isVisible }) => {
  const [w, setW] = useState<number>(500);
  const [l, setL] = useState<number>(800);

  const E_TABLE = [
    [200, 290, 200, 499, 15, 20, 30, 25],
    [200, 290, 500, 1000, 20, 30, 40, 35],
    [300, 390, 300, 899, 20, 30, 40, 35],
    [300, 390, 900, 1200, 25, 40, 50, 40],
    [400, 490, 400, 699, 25, 30, 40, 35],
    [400, 490, 700, 1500, 25, 40, 50, 40],
    [500, 590, 500, 1190, 25, 40, 50, 40],
    [500, 590, 1200, 2000, 30, 50, 60, 50],
    [600, 690, 600, 999, 25, 40, 50, 40],
    [600, 690, 1000, 1590, 35, 50, 60, 50],
    [600, 690, 1600, 2200, 40, 60, 80, 60],
    [700, 790, 700, 1390, 35, 50, 60, 50],
    [700, 790, 1400, 2000, 40, 60, 80, 60],
    [800, 990, 800, 1190, 35, 50, 80, 50],
    [800, 990, 1200, 1590, 40, 60, 90, 60],
    [800, 990, 1600, 2200, 40, 60, 100, 70],
    [1000, 1190, 1000, 1390, 40, 60, 90, 70],
    [1000, 1190, 1400, 1990, 40, 70, 100, 70],
    [1000, 1190, 2000, 2500, '40/60', 80, 110, 80],
    [1200, 9999, 1200, 1790, 40, 70, 100, 70],
    [1200, 9999, 1800, 2500, '40/60', 80, 110, 80],
  ];

  const result = useMemo(() => {
    return E_TABLE.find(r => w >= r[0] && w <= r[1] && l >= r[2] && l <= r[3]);
  }, [w, l]);

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-mono text-purple-400 mb-4 tracking-widest uppercase">Base Parameters</h3>
        <div className="grid gap-4">
          <InputGroup label="Plate Width" value={w} onChange={setW} unit="mm" min={200} />
          <InputGroup label="Plate Length" value={l} onChange={setL} unit="mm" min={200} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Ejector Face', value: result ? result[4] : '—' },
          { label: 'Ejector Base', value: result ? result[5] : '—' },
          { label: 'Single Plate', value: result ? result[6] : '—', col: 'col-span-2' },
          { label: 'Clamp Plates', value: result ? result[7] : '—', col: 'col-span-2' }
        ].map((item, i) => (
          <div key={i} className={`bg-slate-900/50 border border-slate-800 p-4 rounded-xl ${item.col || ''}`}>
            <p className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-purple-500" />
              {item.label}
            </p>
            <p className="text-2xl font-bold font-mono text-purple-400 mt-1">{item.value} <span className="text-sm text-slate-600">mm</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Component 6: Info Reference ---
const InfoReference: React.FC<CalculatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4">Engineering Standards</h3>
        <div className="space-y-4">
          <ReferenceItem 
            title="Square Iron (Support Pillars)" 
            content="Support pillars provide rigidity to the mold base. Limit block height (L) is typically 25-30mm, and clearance (C) is standard at 5mm."
          />
          <ReferenceItem 
            title="Lifter Angles" 
            content="To prevent binding, lifter angles (α) should generally not exceed 11°. Standard design ranges from 3° to 10° depending on stroke."
          />
          <ReferenceItem 
            title="Slider Cam Angles" 
            content="Common cam angles for sliders are 15° to 25°. Angles above 25° produce excessive lateral forces that may cause premature wear."
          />
          <ReferenceItem 
            title="Ejector System" 
            content="Ejector plate thickness is derived from the overall mold base dimensions to ensure structural integrity during high-pressure cycles."
          />
        </div>
      </div>
    </div>
  );
};

// --- Helper UI Components ---
const InputGroup = ({ label, value, onChange, unit, min, highlight = false }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center px-1">
      <label className={`text-[10px] font-mono uppercase tracking-wider ${highlight ? 'text-amber-400' : 'text-slate-500'}`}>
        {label}
      </label>
      {highlight && <span className="text-[9px] text-amber-500 italic">Non-standard value</span>}
    </div>
    <div className="relative group">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        className={`w-full bg-slate-950 border ${highlight ? 'border-amber-500/50' : 'border-slate-800'} rounded-lg py-2.5 px-4 font-mono text-slate-200 outline-none focus:border-slate-600 transition-all`}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-600 pointer-events-none">{unit}</span>
    </div>
  </div>
);

const ReferenceItem = ({ title, content }: any) => (
  <div className="bg-slate-800/30 border-l-2 border-slate-700 p-4 rounded-r-lg">
    <h4 className="text-sm font-bold text-slate-300 mb-1">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{content}</p>
  </div>
);

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState<string>('square');

  const tabs = [
    { id: 'square', label: 'Square Iron', icon: Square, color: 'text-cyan-400' },
    { id: 'tiger', label: 'Tiger Mouth', icon: Target, color: 'text-orange-400' },
    { id: 'lifter', label: 'Lifter', icon: ArrowUpRight, color: 'text-blue-400' },
    { id: 'slider', label: 'Slider', icon: MoveHorizontal, color: 'text-emerald-400' },
    { id: 'ejector', label: 'Ejector', icon: Layers, color: 'text-purple-400' },
    { id: 'info', label: 'Info', icon: BookOpen, color: 'text-slate-400' }
  ];

  return (
    <div className="min-h-screen bg-[#07090f] text-slate-200 selection:bg-slate-700 font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#07090f]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase">Engineering Suite</span>
            <h1 className="text-xl font-bold tracking-tight">ProMold Expert<span className="text-slate-500">.</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-slate-700 px-2 py-1 border border-slate-800 rounded">v1.2.0</span>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="max-w-md mx-auto px-6 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SquareIronCalc isVisible={activeTab === 'square'} />
            <TigerMouthCalc isVisible={activeTab === 'tiger'} />
            <LifterAngleCalc isVisible={activeTab === 'lifter'} />
            <SliderAngleCalc isVisible={activeTab === 'slider'} />
            <EjectorPlateCalc isVisible={activeTab === 'ejector'} />
            <InfoReference isVisible={activeTab === 'info'} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 px-2 pb-6 pt-2">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1.5 p-2 transition-all duration-300 relative group min-w-[64px]`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-slate-800 scale-110 shadow-lg' : 'group-hover:bg-slate-900'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? tab.color : 'text-slate-600'}`} />
                </div>
                <span className={`text-[9px] font-mono uppercase tracking-tighter transition-all duration-300 ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>
                  {tab.label.split(' ')[0]}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
