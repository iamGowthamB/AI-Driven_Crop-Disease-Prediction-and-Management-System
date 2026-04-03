import React, { useEffect, useState } from 'react';
import { BookOpen, Search, ChevronRight, X, Sprout, Bot } from 'lucide-react';
import api from '../services/api.js';
import { motion, AnimatePresence } from 'framer-motion';

// Built-in disease data perfectly matching the ML Backend classes
const BUILTIN = [
    { id: 1, cropName: 'Pepper (Bell)', diseaseName: 'Bacterial Spot', severity: 'Moderate', supported: true, pathogen: 'Xanthomonas campestris', symptoms: 'Small, circular, water-soaked spots on leaves that turn brown. Dark, raised scabs on fruit.', treatment: 'Apply copper-based bactericides (e.g., Kocide 3000) every 7–10 days. Remove and destroy infected plant debris. Avoid overhead irrigation. Use certified disease-free transplants next season.' },
    { id: 2, cropName: 'Potato', diseaseName: 'Early Blight', severity: 'Moderate', supported: true, pathogen: 'Alternaria solani', symptoms: 'Dark target-like spots with concentric rings on older leaves. Lower leaves yellow and drop.', treatment: 'Apply fungicides containing chlorothalonil or mancozeb at first sign of symptoms, repeating every 7 days. Remove lower infected leaves promptly. Ensure proper plant spacing for air circulation. Rotate crops — avoid planting potatoes in the same field for 2–3 years.' },
    { id: 3, cropName: 'Potato', diseaseName: 'Late Blight', severity: 'Severe', supported: true, pathogen: 'Phytophthora infestans', symptoms: 'Large, dark green/brown water-soaked spots. White fuzzy growth on undersides in humid weather. Entire plant collapse.', treatment: 'Apply systemic fungicides such as metalaxyl or cymoxanil immediately upon detection. Destroy all infected plant material — do NOT compost. Avoid wetting foliage during irrigation. This disease spreads rapidly; treat the entire field as a precaution.' },
    { id: 4, cropName: 'Tomato', diseaseName: 'Bacterial Spot', severity: 'Moderate', supported: true, pathogen: 'Xanthomonas perforans', symptoms: 'Small water-soaked spots becoming dark brown with yellow halo. Raised, scabby spots on fruit.', treatment: 'Spray copper bactericides combined with mancozeb weekly. Remove and bag infected leaves. Avoid working in the field when plants are wet. Treat seeds with hot water (50°C for 25 min) before planting.' },
    { id: 5, cropName: 'Tomato', diseaseName: 'Early Blight', severity: 'Moderate', supported: true, pathogen: 'Alternaria linariae', symptoms: 'Concentric ring "target" lesions on older leaves, causing yellowing and defoliation from bottom up.', treatment: 'Apply chlorothalonil or azoxystrobin fungicide every 7–10 days. Water at the base to keep foliage dry. Mulch to prevent soil splash. Remove and destroy infected lower leaves.' },
    { id: 6, cropName: 'Tomato', diseaseName: 'Late Blight', severity: 'Severe', supported: true, pathogen: 'Phytophthora infestans', symptoms: 'Irregular pale green to brown water-soaked lesions. White sporulation rings on leaf undersides. Rapid wilting.', treatment: 'Apply preventive fungicides (mancozeb, chlorothalonil) before symptoms appear in rainy seasons. Use systemic fungicides (metalaxyl) when infection is confirmed. Destroy infected plants immediately to prevent spread to neighbouring plants.' },
    { id: 7, cropName: 'Tomato', diseaseName: 'Leaf Mold', severity: 'Mild', supported: true, pathogen: 'Passalora fulva', symptoms: 'Pale green/yellow spots on upper leaf surfaces. Olive-green to brown velvety fungal growth on undersides.', treatment: 'Improve greenhouse ventilation to reduce humidity. Apply fungicides such as chlorothalonil or mancozeb. Remove and destroy infected leaves. Avoid overhead watering.' },
    { id: 8, cropName: 'Tomato', diseaseName: 'Septoria Leaf Spot', severity: 'Moderate', supported: true, pathogen: 'Septoria lycopersici', symptoms: 'Numerous small, circular spots with dark borders and gray/clear centers on older leaves.', treatment: 'Apply fungicides (chlorothalonil, mancozeb, or copper-based sprays) every 7–10 days. Remove infected leaves at the bottom of the plant. Mulch around the base to prevent soil splash. Rotate crops to reduce soil pathogen load.' },
    { id: 9, cropName: 'Tomato', diseaseName: 'Two-spotted Spider Mite', severity: 'Severe', supported: true, pathogen: 'Tetranychus urticae (pest)', symptoms: 'Leaves appear stippled or yellowed (bronzing). Fine silken webbing visible under leaves and stems.', treatment: 'Apply miticides such as abamectin or spiromesifen. Introduce natural predators like Phytoseiulus persimilis (predatory mites). Keep plants well-watered — drought stress worsens mite outbreaks. Spray the underside of leaves where mites congregate.' },
    { id: 10, cropName: 'Tomato', diseaseName: 'Target Spot', severity: 'Moderate', supported: true, pathogen: 'Corynespora cassiicola', symptoms: 'Brown, circular spots with light centers (target-like) on leaves, stems, and fruit. Premature leaf drop.', treatment: 'Apply fungicides such as pyraclostrobin or boscalid at early signs of infection. Ensure good air circulation by proper spacing and pruning. Avoid leaf wetness by using drip irrigation.' },
    { id: 11, cropName: 'Tomato', diseaseName: 'Yellow Leaf Curl Virus', severity: 'Severe', supported: true, pathogen: 'Begomovirus (Whitefly-transmitted)', symptoms: 'Severe stunting, upward curling and yellowing of leaf margins. Flowers drop prematurely.', treatment: 'There is no cure for infected plants — remove and destroy them immediately to prevent spread. Control whitefly vectors with insecticides (imidacloprid) or reflective mulches. Plant resistant varieties in future seasons.' },
    { id: 12, cropName: 'Tomato', diseaseName: 'Mosaic Virus', severity: 'Severe', supported: true, pathogen: 'Tobamovirus', symptoms: 'Light and dark green mottled "mosaic" patterns on leaves. Fern-like distorted leaf growth.', treatment: 'Remove and destroy infected plants. Disinfect tools and hands with 10% bleach solution. Control aphid and insect vectors. Plant virus-resistant varieties. Avoid tobacco products near plants as they can transmit the virus mechanically.' },
];

const SEVERITY_BADGE = { Severe: 'badge-red', Moderate: 'badge-amber', Mild: 'badge-emerald' };

// 3D Premium Book Opening Animation Component
const BookIntro = ({ onComplete }) => {
    return (
        <div className="fixed inset-0 z-[100] flex pointer-events-none overflow-hidden bg-stone-900" style={{ perspective: '3000px' }}>
            
            {/* Glowing Center Emblem */}
            <motion.div 
                className="absolute inset-0 flex items-center justify-center z-30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.4] }}
                transition={{ duration: 2.5, times: [0, 0.3, 0.7, 1] }}
            >
                <div className="flex flex-col items-center gap-6 drop-shadow-2xl">
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[3px] shadow-[0_0_60px_rgba(251,191,36,0.5)]">
                        <div className="w-full h-full bg-emerald-950 rounded-full flex items-center justify-center border-4 border-emerald-900/50">
                            <BookOpen size={48} className="text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse" />
                        </div>
                    </div>
                    <h2 className="font-display font-black text-4xl md:text-5xl tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-500 uppercase filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] ml-4">Codex</h2>
                </div>
            </motion.div>

            {/* Left Cover (Full Screen Half) */}
            <motion.div 
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -110, filter: 'brightness(0)' }}
                transition={{ duration: 2, ease: [0.25, 1, 0.4, 1], delay: 1.8 }}
                style={{ transformOrigin: 'left' }}
                className="w-1/2 h-full bg-gradient-to-l from-emerald-900 to-emerald-950 border-r border-emerald-800 shadow-[inset_-60px_0_100px_rgba(0,0,0,0.9)] z-20 flex items-center justify-end pr-8"
            >
                {/* Gold binding detail */}
                <div className="w-2 h-[90%] bg-gradient-to-b from-amber-600 via-amber-300 to-amber-600 rounded-full opacity-40 blur-[1px]" />
            </motion.div>
            
            {/* Right Cover (Full Screen Half) */}
            <motion.div 
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 110, filter: 'brightness(0)' }}
                transition={{ duration: 2, ease: [0.25, 1, 0.4, 1], delay: 1.8 }}
                style={{ transformOrigin: 'right' }}
                className="w-1/2 h-full bg-gradient-to-r from-emerald-900 to-emerald-950 border-l border-emerald-800 shadow-[inset_60px_0_100px_rgba(0,0,0,0.9)] z-20 flex items-center justify-start pl-8"
                onAnimationComplete={onComplete}
            >
                 {/* Gold binding detail */}
                 <div className="w-2 h-[90%] bg-gradient-to-b from-amber-600 via-amber-300 to-amber-600 rounded-full opacity-40 blur-[1px]" />
            </motion.div>
        </div>
    );
};

export default function Encyclopedia() {
    const [items, setItems] = useState(BUILTIN);
    const [search, setSearch] = useState('');
    const [crop, setCrop] = useState('All');
    const [severity, setSeverity] = useState('All');
    const [selected, setSelected] = useState(null);
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        api.get('/admin/knowledge').then(r => {
            if (r.data?.length) setItems(prev => [...BUILTIN, ...r.data.map(d => ({ ...d, id: 1000 + d.id }))]);
        }).catch(() => { });
    }, []);

    const filtered = items.filter(i => {
        const text = (i.diseaseName + i.cropName + (i.pathogen || '')).toLowerCase();
        return (crop === 'All' || i.cropName.includes(crop))
            && (severity === 'All' || i.severity === severity)
            && text.includes(search.toLowerCase());
    });

    return (
        <>
        <AnimatePresence>
            {showIntro && <BookIntro onComplete={() => setShowIntro(false)} />}
        </AnimatePresence>

        <div className={`min-h-full bg-stone-50 text-stone-900 pb-20 relative overflow-hidden font-sans transition-opacity duration-1000 ${showIntro ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
            <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-emerald-400/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14 pt-8 relative z-10">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-white border border-stone-200 shadow-xl shadow-stone-200/50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 relative">
                        <BookOpen size={32} />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white animate-bounce shadow-emerald-500/30">
                            <Bot size={12} />
                        </div>
                    </div>
                    <h1 className="font-display font-black text-4xl md:text-5xl text-stone-900 tracking-tight mb-4">Pathology Database</h1>
                    <p className="text-base text-stone-600 font-medium">Browse the exact {items.filter(i => i.supported).length} diseases and pests our ML model is officially trained to detect, plus additional user-contributed knowledge.</p>
                </motion.div>

                {/* Filters */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white border border-stone-200 shadow-xl shadow-stone-200/40 rounded-3xl p-4 flex flex-col md:flex-row gap-4 items-center mb-10 sticky top-4 z-30">
                    <div className="relative w-full md:w-96 group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search diseases, pathogens..." className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm font-bold rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm" />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                        <div className="flex gap-1 bg-stone-50 p-1 rounded-2xl border border-stone-200">
                            {['All', 'Tomato', 'Potato', 'Pepper'].map(c => (
                                <button key={c} onClick={() => setCrop(c)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${crop === c ? 'bg-white text-emerald-700 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-800'}`}>{c}</button>
                            ))}
                        </div>
                        <div className="flex gap-1 bg-stone-50 p-1 rounded-2xl border border-stone-200">
                            {['All', 'Severe', 'Moderate', 'Mild'].map(s => (
                                <button key={s} onClick={() => setSeverity(s)} className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${severity === s ? 'bg-white text-amber-700 shadow-sm border border-stone-200' : 'text-stone-500 hover:text-stone-800'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filtered.map((item, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05 }}
                                key={item.id} onClick={() => setSelected(item)} 
                                className="bg-white border border-stone-200 shadow-lg shadow-stone-200/40 rounded-3xl p-6 cursor-pointer hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full relative overflow-hidden"
                            >
                                {item.supported && (
                                    <div className="absolute top-0 right-0 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-bl-xl font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5 shadow-sm border-b border-l border-emerald-100/50">
                                        <Bot size={12} /> AI Supported
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-4 mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-100 transition-colors">
                                            <Sprout size={14} />
                                        </div>
                                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{item.cropName}</p>
                                    </div>
                                    <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${SEVERITY_BADGE[item.severity] || 'badge-grey'}`}>{item.severity} Risk</span>
                                </div>
                                
                                <h3 className="font-display font-black text-2xl text-stone-900 leading-tight mb-2 group-hover:text-emerald-700 transition-colors pr-8">{item.diseaseName}</h3>
                                {item.pathogen && <p className="text-xs font-mono text-stone-400 italic mb-4 line-clamp-1">{item.pathogen}</p>}
                                
                                <p className="text-sm text-stone-600 font-medium leading-relaxed line-clamp-3 mb-6 flex-1">{item.symptoms}</p>
                                
                                <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-600 uppercase tracking-widest">
                                    <span>View Protocol</span>
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 group-hover:translate-x-1 transition-all">
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-32 bg-white/50 border-2 border-dashed border-stone-200 rounded-3xl mt-8">
                        <BookOpen size={48} className="mx-auto text-stone-300 mb-4" />
                        <h3 className="text-xl font-bold text-stone-900 mb-2">No Entries Found</h3>
                        <p className="text-stone-500 font-medium">Try adjusting your search criteria or filters.</p>
                    </div>
                )}
            </div>

            {/* Slide-over Detail Panel */}
            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setSelected(null)} 
                        />
                        
                        {/* Panel */}
                        <motion.div 
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-stone-200 flex flex-col"
                        >
                            {/* Panel Header */}
                            <div className="p-6 md:p-8 border-b border-stone-100 bg-stone-50/50 flex flex-col items-start relative">
                                <button onClick={() => setSelected(null)} className="absolute top-6 right-6 w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm z-10">
                                    <X size={16} />
                                </button>
                                
                                <div className="flex flex-wrap items-center gap-2 mb-3 pr-12">
                                    {selected.supported && (
                                        <span className="badge bg-emerald-50 border-emerald-200 text-emerald-700 flex items-center gap-1.5 shadow-sm">
                                            <Bot size={12} /> AI Certified
                                        </span>
                                    )}
                                    <span className="badge badge-grey bg-white">{selected.cropName}</span>
                                    <span className={`badge ${SEVERITY_BADGE[selected.severity] || 'badge-grey'}`}>{selected.severity}</span>
                                </div>
                                <h2 className="font-display font-black text-4xl text-stone-900 leading-tight mb-2 pr-6">{selected.diseaseName}</h2>
                                {selected.pathogen && <p className="text-xs font-mono text-stone-500 italic">Agent: {selected.pathogen}</p>}
                            </div>

                            {/* Panel Content */}
                            <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                                {selected.symptoms && (
                                    <div>
                                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">Clinical Symptoms</p>
                                        <p className="text-sm text-stone-700 font-medium leading-relaxed bg-stone-50 p-5 rounded-2xl border border-stone-100">{selected.symptoms}</p>
                                    </div>
                                )}

                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3 border-b border-stone-100 pb-2">
                                        <h3 className="font-display font-bold text-2xl text-stone-900">Treatment Protocol</h3>
                                    </div>
                                    
                                    {/* Consolidated Action Protocol */}
                                    {(selected.treatment || selected.prevention) && (
                                        <div className="p-5 bg-blue-50/50 border border-blue-100/60 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                                            <div className="relative z-10">
                                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-1.5"><BookOpen size={12} /> Recommended Action</p>
                                                <p className="text-sm text-stone-800 font-medium leading-relaxed">{selected.treatment || selected.prevention}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="p-6 border-t border-stone-100 bg-stone-50">
                                <button onClick={() => setSelected(null)} className="btn-primary w-full py-4 text-base shadow-lg shadow-emerald-500/20">Acknowledge</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 4px; }
            `}} />
        </div>
        </>
    );
}
