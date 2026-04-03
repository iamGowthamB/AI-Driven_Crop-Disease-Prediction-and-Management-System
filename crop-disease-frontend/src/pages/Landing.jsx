import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Leaf, CloudLightning, Activity, ChevronRight, Lock, Sprout, CloudRain, Wheat, ArrowRight } from 'lucide-react';

// Leaf SVG Components
const SimpleLeaf = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C7.58 2 4 5.58 4 10C4 12.82 5.46 15.3 7.6 16.7L6.3 21.3C6.1 22 6.7 22.5 7.3 22.3L12 21C16.88 20.9 20 16.5 20 12C20 6.48 16.48 2 12 2ZM12 19L8.7 19.9L9.6 16.6C10.3 16.9 11.1 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7C9.24 7 7 9.24 7 12C7 13.56 7.7 14.95 8.8 15.8L7.9 18.9C6.4 17.5 5.5 15.5 5.5 13.3C5.5 9.44 8.64 6.3 12.5 6.3C16.36 6.3 19.5 9.44 19.5 13.3C19.5 17.16 16.36 20.3 12.5 20.3L12 19Z" opacity="0.9"/>
    </svg>
);

const MapleLeaf = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2L14.5,7.5L21,7L17.5,12L20,18L13.5,15.5L12,22L10.5,15.5L4,18L6.5,12L3,7L9.5,7.5L12,2Z" opacity="0.9"/>
    </svg>
);

const OakLeaf = ({ className, style }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2 C15.33,2 17,4.67 16,7 C18.67,7.67 19.67,10.67 17,13 C18.33,15.67 16,19 12,21 C8,19 5.67,15.67 7,13 C4.33,10.67 5.33,7.67 8,7 C7,4.67 8.67,2 12,2 Z" opacity="0.9"/>
    </svg>
);

const AUTUMN_COLORS = [
    'text-orange-600',
    'text-orange-500',
    'text-amber-600',
    'text-amber-500',
    'text-red-600',
    'text-red-500',
    'text-yellow-600'
];

const LEAF_SHAPES = [SimpleLeaf, MapleLeaf, OakLeaf];

export default function Landing() {
    const navigate = useNavigate();

    // Particle Generation
    const leaves = Array.from({ length: 35 }).map((_, i) => {
        const shapeIdx = Math.floor(Math.random() * LEAF_SHAPES.length);
        const colorIdx = Math.floor(Math.random() * AUTUMN_COLORS.length);
        const baseTop = Math.random() * 80 + 10;
        
        // Create an organic curving path
        const curveAmplitude = Math.random() * 30 + 10;
        
        return {
            id: `leaf-${i}`,
            Shape: LEAF_SHAPES[shapeIdx],
            colorClass: AUTUMN_COLORS[colorIdx],
            size: Math.random() * 45 + 25,
            top: baseTop,
            duration: Math.random() * 12 + 15,
            delay: Math.random() * -20, // Negative delay so they are instantly on screen
            pathY: [
                `${baseTop}%`, 
                `${baseTop - curveAmplitude}%`, 
                `${baseTop + curveAmplitude}%`, 
                `${baseTop - curveAmplitude/2}%`, 
                `${baseTop}%`
            ],
            rotations: [0, Math.random() * 180 + 90, Math.random() * 360 + 180, Math.random() * 540 + 270, Math.random() * 720 + 360],
            zIndex: Math.random() > 0.8 ? 20 : 0,
            opacity: Math.random() * 0.4 + 0.6
        };
    });

    const sandParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: `sand-${i}`,
        size: Math.random() * 4 + 2,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5,
        yOffset: Math.random() * 50 - 25,
        opacity: Math.random() * 0.5 + 0.2
    }));

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
    };

    const features = [
        {
            icon: Sprout,
            title: "AI Disease Detection",
            desc: "Upload images of your plants and our state-of-the-art neural networks will diagnose anomalies instantly.",
            color: "text-amber-700",
            bg: "bg-amber-100/50",
            link: "https://plantvillage.psu.edu/"
        },
        {
            icon: CloudRain,
            title: "Climatic Intelligence",
            desc: "Anticipate threats using real-time global weather data mapped perfectly to your farm's coordinates.",
            color: "text-emerald-700",
            bg: "bg-emerald-100/50",
            link: "https://www.fao.org/climate-change/en/"
        },
        {
            icon: Wheat,
            title: "Data-Driven Yields",
            desc: "Unlock historical insights and trend analysis to maximize your crop output year after year.",
            color: "text-orange-700",
            bg: "bg-orange-100/50",
            link: "https://www.fao.org/faostat/en/"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] via-[#F4EBD0] to-[#E6D5B8] text-stone-800 overflow-hidden font-sans relative selection:bg-amber-500/30">
            
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-400/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Airborne Leaves Animation (Autumn Swirl) */}
            {leaves.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    className={`absolute pointer-events-none ${leaf.colorClass} ${leaf.zIndex === 20 ? 'z-20' : 'z-0'}`}
                    style={{ opacity: leaf.opacity }}
                    initial={{ left: '-15%', top: `${leaf.top}%`, rotate: 0 }}
                    animate={{ 
                        left: '115%', 
                        top: leaf.pathY,
                        rotate: leaf.rotations
                    }}
                    transition={{ 
                        duration: leaf.duration, 
                        repeat: Infinity, 
                        delay: leaf.delay, 
                        ease: "easeInOut" 
                    }}
                >
                    <leaf.Shape className="drop-shadow-md" style={{ width: leaf.size, height: leaf.size }} />
                </motion.div>
            ))}

            {/* Airborne Wind Lines */}
            {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                    key={`wind-${i}`}
                    className="absolute z-0 h-[1px] bg-stone-500/10 pointer-events-none rounded-full"
                    style={{ width: Math.random() * 200 + 100 }}
                    initial={{ left: '-20%', top: `${Math.random() * 80 + 10}%` }}
                    animate={{ 
                        left: '120%',
                    }}
                    transition={{ 
                        duration: Math.random() * 5 + 8, 
                        repeat: Infinity, 
                        delay: Math.random() * -10, 
                        ease: "linear" 
                    }}
                />
            ))}

            {/* Airborne Sand Particles */}
            {sandParticles.map((sand) => (
                <motion.div
                    key={sand.id}
                    className="absolute z-0 bg-amber-700/30 pointer-events-none rounded-full"
                    style={{ width: sand.size, height: sand.size, opacity: sand.opacity }}
                    initial={{ x: '-5vw', y: `${sand.top}vh` }}
                    animate={{ 
                        x: '105vw', 
                        y: [`${sand.top}vh`, `${sand.top + sand.yOffset/10}vh`, `${sand.top}vh`]
                    }}
                    transition={{ 
                        duration: sand.duration, 
                        repeat: Infinity, 
                        delay: sand.delay, 
                        ease: "linear" 
                    }}
                    // Add slight horizontal distortion for sand
                />
            ))}

            {/* Navbar */}
            <motion.nav 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-50 flex items-center justify-between px-6 py-5 md:px-12 lg:px-24 border-b border-stone-800/5 backdrop-blur-md bg-[#FDFBF7]/60"
            >
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:shadow-emerald-600/40 transition-shadow">
                        <Leaf size={20} className="text-white" />
                    </div>
                    <span className="font-display font-bold text-2xl tracking-wide text-stone-900">NexAgri<span className="text-emerald-600">.</span></span>
                </div>
                <div className="flex items-center gap-5">
                    <button 
                        onClick={() => navigate('/login')} 
                        className="text-sm font-semibold text-stone-600 hover:text-emerald-700 transition-colors hidden sm:block"
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="relative px-6 py-2.5 rounded-full bg-stone-900 text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-xl"
                    >
                        Get Started
                    </button>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 text-center pt-10">
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="max-w-4xl space-y-8 relative"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-sm font-bold mb-2 mx-auto shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                        </span>
                        Next-Gen Agricultural Intelligence
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="font-display font-black text-6xl md:text-7xl leading-[1.1] tracking-tight text-stone-900 drop-shadow-sm">
                        Nurture Your Harvest with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-amber-600 drop-shadow-sm">
                            Deep Learning
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        Detect diseases instantly, monitor changing weather forces, and guarantee your farm’s prosperity with predictive AI.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 pb-10">
                        <button 
                            onClick={() => navigate('/signup')} 
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(5,150,105,0.3)] group"
                        >
                            <span>Start Diagnosing</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={() => navigate('/login')} 
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/60 border border-stone-200 text-stone-800 font-bold hover:bg-white hover:border-stone-300 hover:shadow-sm transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <Lock size={16} className="text-stone-500" />
                            Admin Console
                        </button>
                    </motion.div>
                </motion.div>
            </main>

            {/* Features Section */}
            <section className="relative z-20 py-24 px-6 md:px-12 lg:px-24 border-t border-stone-800/5 bg-gradient-to-b from-[#FDFBF7]/40 to-[#FDFBF7]/90 backdrop-blur-sm">
                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="max-w-6xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feat, idx) => (
                            <motion.div 
                                key={idx} 
                                variants={fadeUp} 
                                whileHover={{ y: -8 }}
                                className="group relative p-8 rounded-3xl bg-white shadow-xl shadow-stone-200/50 border border-stone-100 transition-all duration-300 overflow-hidden"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feat.icon size={26} className={feat.color} />
                                </div>
                                <h3 className="text-2xl font-display font-bold text-stone-900 mb-3">{feat.title}</h3>
                                <p className="text-stone-600 leading-relaxed font-medium">{feat.desc}</p>
                                
                                <a 
                                    href={feat.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`mt-8 flex items-center gap-2 text-sm font-bold ${feat.color} opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer`}
                                >
                                    Learn More <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
