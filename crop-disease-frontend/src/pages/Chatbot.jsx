import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Loader2, Microscope, CloudRain, Leaf, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KB = {
    'late blight': 'Late Blight (Phytophthora infestans) causes water-soaked lesions rapidly turning dark brown. White sporulation appears on leaf undersides. Thrives in humidity >80% and temperatures 10-25°C. Apply Metalaxyl-M + Mancozeb 2.5g/L preventively. Organic: Bordeaux mixture 1%.',
    'early blight': 'Early Blight (Alternaria solani) creates characteristic concentric ring "target" lesions on older leaves. Warm conditions with alternating wet/dry cycles favor it. Apply Chlorothalonil 2g/L every 7-14 days. Organic: Neem oil 5mL/L.',
    'humidity': 'Humidity above 80% is the primary trigger for fungal disease cycles. It allows spore germination and mycelial growth. Key pathogens: Phytophthora, Alternaria, Botrytis, Septoria. Mitigation: Drip irrigation, improved air circulation, avoid evening watering.',
    'organic': 'Approved organic treatments: 1) Biopesticides: Bacillus subtilis, Trichoderma viride. 2) Copper: Bordeaux mixture, copper hydroxide. 3) Sulfur: Foliar fungal control. 4) Neem oil: Broad-spectrum. 5) Compost tea: Boosts plant immunity.',
    'tomato': 'Tomatoes are vulnerable to Late Blight, Early Blight, Septoria Leaf Spot, Fusarium Wilt, Bacterial Spot, and TSWV virus. Key IPM: Use resistant varieties, copper protectants, proper plant spacing for airflow.',
    'potato': 'Potatoes face Late Blight (most devastating), Early Blight, Black Scurf (Rhizoctonia), Blackleg, and Viral diseases (PVY, PLRV). Management: Certified seed, 3-year crop rotation, weekly scouting.',
    'pepper': 'Peppers face Phytophthora Blight (kills plants in 48h), Bacterial Spot, Anthracnose, and Cercospora. Critical: Excellent drainage to prevent Phytophthora; avoid standing water around roots.',
    'treatment': 'For disease treatment: 1) Identify disease precisely. 2) Apply fungicide at correct timing — protectant before infection, systemic after. 3) Rotate chemical groups to prevent resistance. 4) Follow IPM — chemical is last resort.',
    'default': 'I am AgriBot, your AI agricultural intelligence assistant. Ask me about crop diseases, treatment protocols, organic solutions, weather risks, and soil management for tomato, potato, and pepper crops.',
};

const QUICK = [
    { icon: Microscope, text: 'Symptoms of Late Blight?' },
    { icon: CloudRain, text: 'How does humidity affect fungal diseases?' },
    { icon: Leaf, text: 'What organic treatments are available?' },
    { icon: Zap, text: 'How do I treat tomato early blight?' },
];

function getReply(input) {
    const q = input.toLowerCase();
    for (const [k, v] of Object.entries(KB)) {
        if (k !== 'default' && q.includes(k)) return v;
    }
    return KB.default;
}

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { id: 1, from: 'bot', text: 'AgriBot Neural Engine initialized. I can help with crop disease identification, treatment protocols, organic farming, and weather risk analysis. How can I assist you today?', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef();

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const send = (text) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;
        setInput('');
        const t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: msg, time: t }]);
        setLoading(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: getReply(msg), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }]);
            setLoading(false);
        }, 600 + Math.random() * 800);
    };

    return (
        <div className="min-h-full bg-stone-50 text-stone-900 pb-10 relative overflow-hidden font-sans flex flex-col pt-8 px-6 md:px-10 lg:px-14">
            <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-emerald-400/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="h-[calc(100vh-8rem)] w-full max-w-5xl mx-auto flex flex-col bg-white border border-stone-200 shadow-2xl shadow-stone-200/50 rounded-3xl overflow-hidden relative z-10">
                
                {/* Header */}
                <div className="bg-white border-b border-stone-100 p-6 flex items-center justify-between shrink-0 relative z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <Sparkles size={22} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h1 className="font-display font-black text-2xl text-stone-900">AgriBot AI</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Neural Intelligence Active</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setMessages([{ id: Date.now(), from: 'bot', text: 'Chat session cleared. Ready for new queries.', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }])} 
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Trash2 size={14} /> Clear Chat
                    </button>
                </div>

                {/* Quick Prompts */}
                <div className="bg-stone-50/50 border-b border-stone-100 p-4 shrink-0 overflow-x-auto custom-scrollbar">
                    <div className="flex gap-2 min-w-max">
                        {QUICK.map((q, i) => {
                            const Icon = q.icon; return (
                                <button key={i} onClick={() => send(q.text)} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm rounded-xl text-xs font-bold text-stone-600 transition-all">
                                    <Icon size={14} className="text-emerald-500 shrink-0" />
                                    <span>{q.text}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/30 w-full custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {messages.map(msg => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={msg.id} 
                                className={`flex gap-4 max-w-[85%] ${msg.from === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.from === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {msg.from === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                
                                {/* Message Bubble */}
                                <div className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`px-5 py-3.5 text-sm font-medium leading-relaxed shadow-sm
                                        ${msg.from === 'user' 
                                            ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-sm border border-emerald-700/50' 
                                            : 'bg-white border border-stone-200 text-stone-800 rounded-2xl rounded-tl-sm'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] font-bold text-stone-400 mt-1.5 px-1">{msg.time}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Loading Indicator */}
                    {loading && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 max-w-[85%] mr-auto">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm text-emerald-600">
                                <Bot size={14} />
                            </div>
                            <div className="px-5 py-4 bg-white border border-stone-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-2 h-2 bg-emerald-400 rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-emerald-400 rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-emerald-400 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={bottomRef} className="h-1" />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-white border-t border-stone-100 shrink-0">
                    <form onSubmit={(e) => { e.preventDefault(); send(); }} className="relative flex items-center">
                        <input 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            placeholder="Ask about crop diseases, organic treatments, or soil health..."
                            className="w-full pl-6 pr-16 py-4 bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm font-medium rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-inner" 
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || loading} 
                            className="absolute right-2 w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                        >
                            <Send size={16} className="ml-0.5" />
                        </button>
                    </form>
                    <p className="text-center text-[10px] font-medium text-stone-400 mt-3">AgriBot AI can make mistakes. Consider verifying critical agricultural treatments.</p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
            `}} />
        </div>
    );
}
