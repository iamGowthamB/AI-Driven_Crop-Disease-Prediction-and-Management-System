import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../services/api.js';
import { Upload, ScanLine, AlertCircle, Loader2, X, Leaf, ImageIcon, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CROPS = ['Tomato', 'Potato', 'Pepper'];
const SEVERITY_COLORS = { Severe: 'text-red-600', Moderate: 'text-amber-600', Mild: 'text-emerald-600', Healthy: 'text-emerald-600' };
const SEVERITY_BG = { Severe: 'bg-red-500', Moderate: 'bg-amber-500', Mild: 'bg-emerald-500', Healthy: 'bg-emerald-500' };
const SEVERITY_BADGE = { Severe: 'badge-red', Moderate: 'badge-amber', Mild: 'badge-emerald', Healthy: 'badge-emerald' };

// Page Intro Animation (fires once on load)
const ScanIntro = ({ onComplete }) => (
    <div className="fixed inset-0 z-[100] flex pointer-events-none overflow-hidden bg-stone-950" style={{ perspective: '3000px' }}>
        {/* Ambient glow behind image */}
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 5 }}
            animate={{ opacity: [0, 0.25, 0.25, 0] }}
            transition={{ duration: 2.5, times: [0, 0.3, 0.7, 1] }}
        >
            <div className="w-96 h-96 rounded-full bg-emerald-500 blur-[140px]" />
        </motion.div>

        {/* Center hero: plant image + scan text */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1, 1, 1.3] }}
                transition={{ duration: 2.5, times: [0, 0.3, 0.7, 1] }}
                className="flex flex-col items-center gap-4"
            >
                {/* Plant image with scan line effect */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                    <img
                        src="/plant-scan.png"
                        alt="Plant Scan"
                        className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.6)]"
                    />
                    {/* Animated scan line over image */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-0 right-0 h-1 pointer-events-none"
                        style={{
                            background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.95), transparent)',
                            boxShadow: '0 0 18px 5px rgba(16,185,129,0.4)',
                        }}
                    />
                </div>
                <h2 className="font-display font-black text-5xl tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 to-cyan-500 uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] ml-4">Neural Scan</h2>
            </motion.div>
        </div>

        {/* Left panel swings open */}
        <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -110, filter: 'brightness(0)' }}
            transition={{ duration: 2, ease: [0.25, 1, 0.4, 1], delay: 1.8 }}
            style={{ transformOrigin: 'left' }}
            className="w-1/2 h-full bg-gradient-to-l from-emerald-950 to-stone-950 border-r border-emerald-900 shadow-[inset_-60px_0_100px_rgba(0,0,0,0.9)] z-20 flex items-center justify-end pr-8"
        >
            <div className="w-2 h-[90%] bg-gradient-to-b from-cyan-600 via-emerald-300 to-cyan-600 rounded-full opacity-40 blur-[1px]" />
        </motion.div>

        {/* Right panel swings open */}
        <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 110, filter: 'brightness(0)' }}
            transition={{ duration: 2, ease: [0.25, 1, 0.4, 1], delay: 1.8 }}
            style={{ transformOrigin: 'right' }}
            className="w-1/2 h-full bg-gradient-to-r from-emerald-950 to-stone-950 border-l border-emerald-900 shadow-[inset_60px_0_100px_rgba(0,0,0,0.9)] z-20 flex items-center justify-start pl-8"
            onAnimationComplete={onComplete}
        >
            <div className="w-2 h-[90%] bg-gradient-to-b from-cyan-600 via-emerald-300 to-cyan-600 rounded-full opacity-40 blur-[1px]" />
        </motion.div>
    </div>
);

// Premium 3D Holographic Scan Overlay
const ScanOverlay = ({ preview }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/95 backdrop-blur-xl">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }} />

        <div className="flex flex-col items-center gap-8 relative z-10">
            {/* 3D Rotating Scan Frame */}
            <div className="relative" style={{ perspective: '800px' }}>
                {/* Outer ring */}
                <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    className="w-64 h-64 rounded-full border border-emerald-500/20 flex items-center justify-center absolute inset-0 m-auto"
                />
                <motion.div
                    animate={{ rotateY: [0, -360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="w-52 h-52 rounded-full border border-cyan-400/20 flex items-center justify-center absolute inset-0 m-auto"
                />

                {/* Image Display with scan line */}
                <motion.div
                    initial={{ rotateY: -25 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-64 h-64 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_60px_rgba(16,185,129,0.3)] relative"
                >
                    {preview && <img src={preview} alt="Scanning" className="w-full h-full object-cover brightness-90" />}

                    {/* Scan Line sweeping down */}
                    <motion.div
                        initial={{ top: '-10%' }}
                        animate={{ top: ['0%', '110%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-0 right-0 h-1 pointer-events-none"
                        style={{
                            background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.9), transparent)',
                            boxShadow: '0 0 20px 6px rgba(16,185,129,0.4)',
                        }}
                    />

                    {/* Corner brackets */}
                    {[
                        'top-2 left-2 border-t-2 border-l-2 rounded-tl-lg',
                        'top-2 right-2 border-t-2 border-r-2 rounded-tr-lg',
                        'bottom-2 left-2 border-b-2 border-l-2 rounded-bl-lg',
                        'bottom-2 right-2 border-b-2 border-r-2 rounded-br-lg',
                    ].map((cls, i) => (
                        <div key={i} className={`absolute w-6 h-6 border-emerald-400 ${cls}`} />
                    ))}

                    {/* Overlay tint */}
                    <div className="absolute inset-0 bg-emerald-900/20 mix-blend-overlay" />
                </motion.div>
            </div>

            {/* Status Text */}
            <div className="flex flex-col items-center gap-3">
                <motion.div
                    className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/50 px-6 py-3 rounded-full shadow-lg"
                    animate={{ boxShadow: ['0 0 10px rgba(16,185,129,0.1)', '0 0 30px rgba(16,185,129,0.3)', '0 0 10px rgba(16,185,129,0.1)'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <Cpu size={16} className="text-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 font-bold text-sm tracking-widest uppercase">Neural Network Active</span>
                </motion.div>

                {/* Typing dots */}
                <div className="flex items-center gap-1.5">
                    {['Cross-referencing pathogen database', '.', '.', '.'].map((t, i) => (
                        <motion.span
                            key={i}
                            className="text-xs font-medium text-stone-500 tracking-wide"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        >{t}</motion.span>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="w-64 h-1.5 bg-stone-800 rounded-full overflow-hidden mx-auto mt-1">
                    <motion.div
                        className="h-full bg-gradient-to-r from-emerald-600 to-cyan-400 rounded-full"
                        initial={{ width: '5%' }}
                        animate={{ width: ['5%', '90%'] }}
                        transition={{ duration: 4, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                </div>
            </div>
        </div>
    </div>
);

export default function Scan() {
    const [cropType, setCropType] = useState('Tomato');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showIntro, setShowIntro] = useState(true);

    const onDrop = useCallback((accepted) => {
        const f = accepted[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setResult(null);
        setError('');
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: { 'image/*': [] }, maxFiles: 1,
    });

    const runScan = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('image', file);
            fd.append('cropType', cropType);
            const { data } = await api.post('/predictions/predict', fd);
            setResult(data);
        } catch (e) {
            setError(e.response?.data?.message || 'Diagnostic failed. Ensure ML service is running.');
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => { setFile(null); setPreview(null); setResult(null); setError(''); };

    const confPct = result ? (result.confidence * 100).toFixed(1) : 0;

    return (
        <>
        <AnimatePresence>
            {showIntro && <ScanIntro onComplete={() => setShowIntro(false)} />}
        </AnimatePresence>

        <div className={`min-h-full bg-stone-50 text-stone-900 pb-20 relative overflow-hidden font-sans transition-opacity duration-700 ${showIntro ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>

            {/* 3D Scan Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ScanOverlay preview={preview} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-14 pt-8">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b border-stone-200 pb-6 relative">
                    <div className="absolute top-0 right-10 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Neural Scan Engine</p>
                    <h1 className="font-display font-black text-4xl text-stone-900 tracking-tight">Diagnostic Scanner</h1>
                    <p className="text-sm text-stone-500 font-medium mt-2 max-w-xl">Upload a high-resolution crop image. Our convolutional neural networks will detect anomalies and recommend immediate treatment protocols.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT PANEL: UPLOAD */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-5 space-y-6">
                        {/* Crop Selector */}
                        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-4">Target Crop Specimen</label>
                            <div className="flex gap-2 bg-stone-100 p-1.5 rounded-xl">
                                {CROPS.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => setCropType(c)} 
                                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide rounded-lg transition-all ${cropType === c ? 'bg-white text-emerald-700 shadow-sm border border-stone-200/50' : 'text-stone-500 hover:text-stone-800 hover:bg-white/50'}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dropzone */}
                        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-4">Specimen Imagery</label>
                            
                            <AnimatePresence mode="wait">
                                {!preview ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        {...getRootProps()} 
                                        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-stone-300 hover:border-emerald-400 bg-stone-50 hover:bg-stone-100/50'}`}
                                    >
                                        <input {...getInputProps()} />
                                        <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-stone-200 flex items-center justify-center mx-auto mb-4 text-stone-400">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-stone-700">Drag &amp; drop image here</p>
                                        <p className="text-xs font-medium text-stone-500 mt-1">or <span className="text-emerald-600 hover:underline">browse files</span></p>
                                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-4">High-res JPG, PNG</p>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative group rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                                        <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                                        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <button onClick={(e) => { e.stopPropagation(); clearAll(); }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-stone-600 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <X size={16} />
                                        </button>
                                        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg shadow-sm text-xs font-bold text-stone-700 flex items-center gap-2">
                                            <ImageIcon size={14} className="text-emerald-600" /> Image Loaded
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium shadow-sm">
                                <AlertCircle size={18} className="shrink-0 mt-0.5" /> <p>{error}</p>
                            </motion.div>
                        )}

                        <button onClick={runScan} disabled={!file || loading} className="w-full btn-primary py-4 text-base shadow-emerald-600/30">
                            {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing Image...</> : <><ScanLine size={18} /> Run Diagnostic Scan</>}
                        </button>
                    </motion.div>

                    {/* RIGHT PANEL: RESULTS */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-7 h-full">
                        {!result && !loading && (
                            <div className="h-full min-h-[400px] border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center py-20 gap-4 bg-white/50">
                                <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
                                    <Leaf size={40} />
                                </div>
                                <p className="text-sm font-medium text-stone-400 max-w-xs text-center">Awaiting image upload. Results will appear here.</p>
                            </div>
                        )}
                        
                        {loading && (
                            <div className="h-full min-h-[400px] bg-white/30 border border-stone-200 rounded-3xl flex items-center justify-center">
                                <p className="text-stone-400 text-sm font-medium animate-pulse">Scanning...</p>
                            </div>
                        )}

                        {result && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-stone-200 shadow-2xl shadow-stone-200/50 rounded-3xl p-8 h-full flex flex-col">
                                <div className="flex items-start justify-between mb-8 pb-6 border-b border-stone-100">
                                    <div>
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Detection Result</p>
                                        <h2 className="font-display font-black text-3xl text-stone-900 leading-tight">{result.diseaseName}</h2>
                                    </div>
                                    <span className={`px-4 py-1.5 text-sm font-bold rounded-full border shadow-sm ${SEVERITY_BADGE[result.severity]}`}>{result.severity} Risk</span>
                                </div>

                                <div className="space-y-8 flex-1">
                                    {/* Confidence Meter */}
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">AI Confidence Score</span>
                                            <span className={`text-2xl font-bold font-mono leading-none ${SEVERITY_COLORS[result.severity]}`}>{confPct}%</span>
                                        </div>
                                        <div className="h-3 bg-stone-100 rounded-full overflow-hidden shadow-inner">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${confPct}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full ${SEVERITY_BG[result.severity]}`} 
                                            />
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Crop Type</p>
                                            <p className="text-base font-bold text-stone-900">{result.cropType}</p>
                                        </div>
                                        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Status</p>
                                            <p className={`text-base font-bold ${SEVERITY_COLORS[result.severity]}`}>{result.severity}</p>
                                        </div>
                                    </div>

                                    {/* Treatment */}
                                    {result.treatment && (
                                        <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <Leaf size={16} />
                                                </div>
                                                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Recommended Protocol</p>
                                            </div>
                                            <p className="text-sm text-stone-700 font-medium leading-relaxed">{result.treatment}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-stone-100">
                                    <button onClick={clearAll} className="w-full btn-outline py-4 text-sm hover:!bg-stone-900 hover:!text-white hover:!border-stone-900 transition-colors">
                                        Scan Another Specimen
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
        </>
    );
}
