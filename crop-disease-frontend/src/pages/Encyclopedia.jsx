import React, { useEffect, useState } from 'react';
import { BookOpen, Search, ChevronRight, X, Filter } from 'lucide-react';
import api from '../services/api.js';

// Built-in disease data (supplemented with backend data)
const BUILTIN = [
    { id: 1, cropName: 'Tomato', diseaseName: 'Late Blight', severity: 'Severe', pesticide: 'Metalaxyl-M + Mancozeb 2.5g/L', organic: 'Bordeaux mixture 1%, Copper hydroxide', prevention: 'Avoid overhead irrigation; apply preventive fungicide before humid spells; plant resistant varieties.', pathogen: 'Phytophthora infestans', symptoms: 'Water-soaked pale green lesions, rapidly turning dark brown; white sporulation on leaf undersides.' },
    { id: 2, cropName: 'Tomato', diseaseName: 'Early Blight', severity: 'Moderate', pesticide: 'Chlorothalonil 2g/L, Mancozeb 3g/L', organic: 'Neem oil 5mL/L, Baking soda spray', prevention: 'Remove infected leaves; rotate crops every 3 years; maintain adequate spacing.', pathogen: 'Alternaria solani', symptoms: 'Concentric ring target lesions on older leaves; yellowing around lesions.' },
    { id: 3, cropName: 'Potato', diseaseName: 'Late Blight', severity: 'Severe', pesticide: 'Dimethomorph + Mancozeb, Cymoxanil', organic: 'Copper hydroxide, Bacillus subtilis', prevention: 'Certified seed potato; destroy infected crop debris; scout weekly during humid weather.', pathogen: 'Phytophthora infestans', symptoms: 'Brown-black necrotic spots on foliage; infected tubers show reddish-brown internal rotting.' },
    { id: 4, cropName: 'Potato', diseaseName: 'Early Blight', severity: 'Mild', pesticide: 'Azoxystrobin 1mL/L, Iprodione', organic: 'Neem extract, Compost tea', prevention: 'Balanced NPK nutrition; avoid water stress; remove infected lower leaves.', pathogen: 'Alternaria solani', symptoms: 'Small dark brown spots with concentric rings on lower, older leaves.' },
    { id: 5, cropName: 'Pepper', diseaseName: 'Bacterial Spot', severity: 'Moderate', pesticide: 'Copper bactericide, Streptomycin', organic: 'Copper soap spray, Hydrogen peroxide 0.5%', prevention: 'Use certified pathogen-free seed; avoid leaf wetness; apply copper after pruning.', pathogen: 'Xanthomonas perforans', symptoms: 'Small water-soaked spots becoming dark brown with yellow halo; fruit spots are raised and scabby.' },
    { id: 6, cropName: 'Pepper', diseaseName: 'Phytophthora Blight', severity: 'Severe', pesticide: 'Metalaxyl, Propamocarb', organic: 'Trichoderma viride soil drench, Raised beds', prevention: 'Excellent drainage critical; avoid standing water; rotate with non-solanaceous crops for 3 years.', pathogen: 'Phytophthora capsici', symptoms: 'Wilting from base; dark water-soaked stem lesions; entire plant collapse within 48-72h.' },
];

const SEVERITY_BADGE = { Severe: 'badge-red', Moderate: 'badge-amber', Mild: 'badge-green' };

export default function Encyclopedia() {
    const [items, setItems] = useState(BUILTIN);
    const [search, setSearch] = useState('');
    const [crop, setCrop] = useState('All');
    const [severity, setSeverity] = useState('All');
    const [selected, setSelected] = useState(null);

    // Load additional entries from backend knowledge base
    useEffect(() => {
        api.get('/admin/knowledge').then(r => {
            if (r.data?.length) setItems(prev => [...BUILTIN, ...r.data.map(d => ({ ...d, id: 1000 + d.id }))]);
        }).catch(() => { });
    }, []);

    const filtered = items.filter(i => {
        const text = (i.diseaseName + i.cropName + (i.pathogen || '')).toLowerCase();
        return (crop === 'All' || i.cropName === crop)
            && (severity === 'All' || i.severity === severity)
            && text.includes(search.toLowerCase());
    });

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-slide-up">
            <div className="border-b border-agri-border pb-6">
                <p className="label-console mb-2">Pathology Database</p>
                <h1 className="h1-console">Disease Encyclopedia</h1>
                <p className="text-sm text-agri-text/50 font-sans mt-1">{items.length} diseases indexed across tomato, potato, and pepper.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative group flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-agri-text/30" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search diseases..." className="input-field pl-9" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['All', 'Tomato', 'Potato', 'Pepper'].map(c => (
                        <button key={c} onClick={() => setCrop(c)} className={`px-3 py-2 text-xs font-mono uppercase tracking-widest rounded-sm border transition-all ${crop === c ? 'border-agri-green bg-agri-green/10 text-agri-green' : 'border-agri-border text-agri-text/50 hover:text-white'}`}>{c}</button>
                    ))}
                    <div className="w-px h-8 bg-agri-border self-center" />
                    {['All', 'Severe', 'Moderate', 'Mild'].map(s => (
                        <button key={s} onClick={() => setSeverity(s)} className={`px-3 py-2 text-xs font-mono uppercase tracking-widest rounded-sm border transition-all ${severity === s ? 'border-agri-amber bg-agri-amber/10 text-agri-amber' : 'border-agri-border text-agri-text/50 hover:text-white'}`}>{s}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(item => (
                    <div key={item.id} onClick={() => setSelected(item)} className="console-card cursor-pointer hover:border-agri-green/40 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="label-console">{item.cropName}</p>
                                <h3 className="font-display font-semibold text-xl text-white mt-0.5">{item.diseaseName}</h3>
                            </div>
                            <span className={`badge ${SEVERITY_BADGE[item.severity] || 'badge-grey'}`}>{item.severity}</span>
                        </div>
                        {item.pathogen && <p className="text-[10px] font-mono text-agri-text/40 italic mb-3">{item.pathogen}</p>}
                        <p className="text-xs text-agri-text/60 font-sans leading-relaxed line-clamp-2">{item.symptoms}</p>
                        <div className="mt-4 flex items-center justify-end text-agri-green text-[10px] font-mono uppercase tracking-widest group-hover:gap-2 gap-1 transition-all">
                            View Protocol <ChevronRight size={12} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Side panel */}
            {selected && (
                <div className="fixed inset-0 z-50 flex" onClick={() => setSelected(null)}>
                    <div className="flex-1 bg-agri-dark/70 backdrop-blur-sm" />
                    <div className="w-full max-w-md bg-agri-surface border-l border-agri-border overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="label-console">{selected.cropName}</p>
                                    <h2 className="font-display font-semibold text-3xl text-white">{selected.diseaseName}</h2>
                                    <span className={`badge ${SEVERITY_BADGE[selected.severity] || 'badge-grey'} mt-2`}>{selected.severity}</span>
                                </div>
                                <button onClick={() => setSelected(null)} className="text-agri-text/30 hover:text-white mt-1"><X size={18} /></button>
                            </div>
                            {selected.pathogen && (
                                <div>
                                    <p className="label-console mb-1">Pathogen</p>
                                    <p className="text-sm font-mono italic text-agri-text/70">{selected.pathogen}</p>
                                </div>
                            )}
                            {selected.symptoms && (
                                <div className="p-4 bg-agri-dark border border-agri-border rounded-sm">
                                    <p className="label-console mb-2">Symptoms</p>
                                    <p className="text-sm text-agri-text/80 font-sans leading-relaxed">{selected.symptoms}</p>
                                </div>
                            )}
                            {selected.pesticide && (
                                <div className="p-4 bg-agri-red/5 border border-agri-red/20 rounded-sm">
                                    <p className="label-console text-agri-red mb-2">Chemical Treatment</p>
                                    <p className="text-sm text-agri-text/80 font-sans">{selected.pesticide}</p>
                                </div>
                            )}
                            {selected.organic && (
                                <div className="p-4 bg-agri-green/5 border border-agri-green/20 rounded-sm">
                                    <p className="label-console text-agri-green mb-2">Organic Solution</p>
                                    <p className="text-sm text-agri-text/80 font-sans">{selected.organic}</p>
                                </div>
                            )}
                            {selected.prevention && (
                                <div className="p-4 bg-agri-amber/5 border border-agri-amber/20 rounded-sm">
                                    <p className="label-console text-agri-amber mb-2">Prevention Guidelines</p>
                                    <p className="text-sm text-agri-text/80 font-sans leading-relaxed">{selected.prevention}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
