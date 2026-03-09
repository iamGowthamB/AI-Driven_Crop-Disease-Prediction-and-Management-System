import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../services/api.js';
import { Upload, ScanLine, AlertCircle, CheckCircle2, Loader2, X, Leaf } from 'lucide-react';

const CROPS = ['Tomato', 'Potato', 'Pepper'];
const SEVERITY_COLORS = { Severe: 'text-agri-red', Moderate: 'text-agri-amber', Mild: 'text-agri-green', Healthy: 'text-agri-green' };
const SEVERITY_BADGE = { Severe: 'badge-red', Moderate: 'badge-amber', Mild: 'badge-green', Healthy: 'badge-green' };

export default function Scan() {
    const [cropType, setCropType] = useState('Tomato');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            setError(e.response?.data?.message || 'Diagnostic failed. Ensure Flask ML service is running on port 5000.');
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => { setFile(null); setPreview(null); setResult(null); setError(''); };

    const confPct = result ? (result.confidence * 100).toFixed(1) : 0;

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-slide-up">
            <div className="border-b border-agri-border pb-6">
                <p className="label-console mb-2">CNN MobileNetV2</p>
                <h1 className="h1-console">Diagnostic Scanner</h1>
                <p className="text-sm text-agri-text/50 font-sans mt-1">Upload a crop image for AI-driven disease prediction and treatment recommendation.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Upload + Crop Selector */}
                <div className="space-y-5">
                    {/* Crop selector */}
                    <div>
                        <label className="label-console mb-2 block">Select Crop Type</label>
                        <div className="flex gap-2">
                            {CROPS.map(c => (
                                <button key={c} onClick={() => setCropType(c)} className={`flex-1 py-2.5 text-xs font-mono uppercase tracking-widest rounded-sm border transition-all ${cropType === c ? 'border-agri-green bg-agri-green/10 text-agri-green' : 'border-agri-border text-agri-text/50 hover:text-white'}`}>{c}</button>
                            ))}
                        </div>
                    </div>

                    {/* Dropzone */}
                    <div>
                        <label className="label-console mb-2 block">Upload Image</label>
                        {!preview ? (
                            <div {...getRootProps()} className={`border-2 border-dashed rounded-sm p-10 text-center cursor-pointer transition-all ${isDragActive ? 'border-agri-green bg-agri-green/5' : 'border-agri-border hover:border-agri-green/50'}`}>
                                <input {...getInputProps()} />
                                <Upload size={36} className="text-agri-text/30 mx-auto mb-3" />
                                <p className="text-sm text-agri-text/60 font-sans">Drag & drop or <span className="text-agri-green underline">browse</span></p>
                                <p className="text-xs text-agri-text/30 font-mono mt-1">JPG, PNG, WEBP supported</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-sm border border-agri-border" />
                                <button onClick={clearAll} className="absolute top-2 right-2 w-7 h-7 bg-agri-dark/80 border border-agri-border rounded-sm flex items-center justify-center text-agri-text/60 hover:text-agri-red">
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="flex items-start gap-3 p-3 bg-agri-red/10 border border-agri-red/30 rounded-sm text-agri-red text-xs font-sans">
                            <AlertCircle size={14} className="shrink-0 mt-0.5" /> {error}
                        </div>
                    )}

                    <button onClick={runScan} disabled={!file || loading} className="btn-primary w-full justify-center py-3">
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><ScanLine size={16} /> Run Diagnostic</>}
                    </button>
                </div>

                {/* Right: Result */}
                <div>
                    {!result && !loading && (
                        <div className="h-full console-card-dark border-dashed border-agri-border flex flex-col items-center justify-center py-20 gap-4">
                            <Leaf size={40} className="text-agri-text/20" />
                            <p className="text-sm text-agri-text/40 font-sans text-center">Upload an image and run the diagnostic to see results.</p>
                        </div>
                    )}
                    {loading && (
                        <div className="h-full console-card-dark flex flex-col items-center justify-center py-20 gap-4">
                            <div className="spinner w-8 h-8 border-2" />
                            <p className="text-sm text-agri-text/50 font-sans">CNN inference in progress...</p>
                        </div>
                    )}
                    {result && (
                        <div className="console-card space-y-6 animate-slide-up">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="label-console mb-1">Detection Result</p>
                                    <h2 className="font-display font-semibold text-2xl text-white">{result.diseaseName}</h2>
                                </div>
                                <span className={`badge ${SEVERITY_BADGE[result.severity]}`}>{result.severity}</span>
                            </div>

                            {/* Confidence bar */}
                            <div>
                                <div className="flex justify-between mb-1.5">
                                    <span className="label-console">Confidence Score</span>
                                    <span className={`text-sm font-bold font-mono ${SEVERITY_COLORS[result.severity]}`}>{confPct}%</span>
                                </div>
                                <div className="h-2 bg-agri-dark border border-agri-border rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${result.severity === 'Severe' ? 'bg-agri-red' : result.severity === 'Moderate' ? 'bg-agri-amber' : 'bg-agri-green'}`}
                                        style={{ width: `${confPct}%` }} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-agri-dark border border-agri-border rounded-sm">
                                    <p className="label-console mb-1">Crop Type</p>
                                    <p className="text-sm font-semibold text-white">{result.cropType}</p>
                                </div>
                                <div className="p-3 bg-agri-dark border border-agri-border rounded-sm">
                                    <p className="label-console mb-1">Severity</p>
                                    <p className={`text-sm font-semibold ${SEVERITY_COLORS[result.severity]}`}>{result.severity}</p>
                                </div>
                            </div>

                            {result.treatment && (
                                <div className="p-4 bg-agri-green/5 border border-agri-green/20 rounded-sm">
                                    <p className="label-console text-agri-green mb-2">Treatment Protocol</p>
                                    <p className="text-sm text-agri-text/80 font-sans leading-relaxed">{result.treatment}</p>
                                </div>
                            )}

                            <button onClick={clearAll} className="btn-outline w-full justify-center">Run Another Scan</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
