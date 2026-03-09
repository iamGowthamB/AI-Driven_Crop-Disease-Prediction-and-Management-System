import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Loader2, Microscope, CloudRain, Leaf, Zap } from 'lucide-react';

const KB = {
    'late blight': 'Late Blight (Phytophthora infestans) causes water-soaked lesions rapidly turning dark brown. White sporulation appears on leaf undersides. Thrives in humidity >80% and temperatures 10-25°C. Apply Metalaxyl-M + Mancozeb 2.5g/L preventively. Organic: Bordeaux mixture 1%.',
    'early blight': 'Early Blight (Alternaria solani) creates characteristic concentric ring "target" lesions on older leaves. Warm conditions with alternating wet/dry cycles favor it. Apply Chlorothalonil 2g/L every 7-14 days. Organic: Neem oil 5mL/L.',
    'humidity': 'Humidity above 80% is the primary trigger for fungal disease cycles. It allows spore germination and mycelial growth. Key pathogens: Phytophthora, Alternaria, Botrytis, Septoria. Mitigation: Drip irrigation, improved air circulation, avoid evening watering.',
    'organic': 'Approved organic treatments: 1) Biopesticides: Bacillus subtilis, Trichoderma viride. 2) Copper: Bordeaux mixture, copper hydroxide. 3) Sulfur: Foliar fungal control. 4) Neem oil: Broad-spectrum. 5) Compost tea: Boosts plant immunity.',
    'tomato': 'Tomatoes are vulnerable to Late Blight, Early Blight, Septoria Leaf Spot, Fusarium Wilt, Bacterial Spot, and TSWV virus. Key IPM: Use resistant varieties, copper protectants, proper plant spacing for airflow.',
    'potato': 'Potatoes face Late Blight (most devastating), Early Blight, Black Scurf (Rhizoctonia), Blackleg, and Viral diseases (PVY, PLRV). Management: Certified seed, 3-year crop rotation, weekly scouting.',
    'pepper': 'Peppers face Phytophthora Blight (kills plants in 48h), Bacterial Spot, Anthracnose, and Cercospora. Critical: Excellent drainage to prevent Phytophthora; avoid standing water around roots.',
    'treatment': 'For disease treatment: 1) Identify disease precisely. 2) Apply fungicide at correct timing — protectant before infection, systemic after. 3) Rotate chemical groups to prevent resistance. 4) Follow IPM — chemical is last resort.',
    'default': 'I am AgriBot, your agricultural intelligence assistant. Ask me about crop diseases, treatment protocols, organic solutions, weather risks, and soil management for tomato, potato, and pepper crops.',
};

const QUICK = [
    { icon: Microscope, text: 'What are the symptoms of Late Blight?' },
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
        { id: 1, from: 'bot', text: 'AgriBot initialized. I can help with crop disease identification, treatment protocols, organic farming, and weather risk analysis. What is your agricultural query?', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
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
        }, 600 + Math.random() * 600);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b border-agri-border pb-4 mb-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-agri-green/10 border border-agri-green/30 rounded-sm flex items-center justify-center"><Bot size={18} className="text-agri-green" /></div>
                    <div>
                        <h1 className="font-display font-semibold text-2xl text-white">AgriBot AI</h1>
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-agri-green rounded-full" /><span className="text-[9px] font-mono uppercase tracking-widest text-agri-green">Neural Node Active</span></div>
                    </div>
                </div>
                <button onClick={() => setMessages([{ id: Date.now(), from: 'bot', text: 'Session cleared. Ready for new queries.', time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }])} className="btn-outline text-xs !py-2"><Trash2 size={13} /> Clear</button>
            </div>

            {/* Quick prompts */}
            <div className="shrink-0 mb-4">
                <div className="flex gap-2 flex-wrap">
                    {QUICK.map((q, i) => {
                        const Icon = q.icon; return (
                            <button key={i} onClick={() => send(q.text)} className="flex items-center gap-1.5 px-3 py-2 bg-agri-dark border border-agri-border hover:border-agri-green/40 rounded-sm text-xs text-agri-text/60 hover:text-agri-green transition-all font-sans">
                                <Icon size={11} />{q.text.slice(0, 30)}{q.text.length > 30 ? '…' : ''}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto space-y-4 console-card-dark min-h-0 p-4 mb-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.from === 'bot' && (
                            <div className="w-7 h-7 rounded-sm bg-agri-green/10 border border-agri-green/20 flex items-center justify-center shrink-0 mt-1"><Bot size={13} className="text-agri-green" /></div>
                        )}
                        <div className={`max-w-[75%] flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-3 rounded-sm text-sm font-sans leading-relaxed border ${msg.from === 'user' ? 'bg-agri-surface border-agri-border text-white' : 'bg-agri-dark border-agri-green/10 text-agri-text/80'}`}>
                                {msg.text}
                            </div>
                            <span className="text-[9px] font-mono text-agri-text/30 mt-1 px-1">{msg.time}</span>
                        </div>
                        {msg.from === 'user' && (
                            <div className="w-7 h-7 rounded-sm bg-agri-surface border border-agri-border flex items-center justify-center shrink-0 mt-1"><User size={13} className="text-agri-text/40" /></div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-sm bg-agri-green/10 border border-agri-green/20 flex items-center justify-center"><Bot size={13} className="text-agri-green" /></div>
                        <div className="px-4 py-3 console-card-dark border-agri-green/10 flex items-center gap-2">
                            <Loader2 size={13} className="text-agri-green animate-spin" /><span className="text-xs font-mono text-agri-text/50">Processing...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-3 shrink-0">
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about diseases, treatments, soil health, weather..."
                    className="input-field flex-1" />
                <button type="submit" disabled={!input.trim() || loading} className="btn-primary !px-5 shrink-0 disabled:opacity-40"><Send size={16} /></button>
            </form>
        </div>
    );
}
