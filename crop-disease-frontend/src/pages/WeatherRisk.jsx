import React, { useState } from 'react';
import { CloudLightning, Droplets, Thermometer, Wind, AlertTriangle, Sun, Cloud, CloudRain } from 'lucide-react';
import api from '../services/api.js';

const RISK_COLOR = { Low: 'text-agri-green', Moderate: 'text-agri-amber', High: 'text-agri-red' };
const RISK_BADGE = { Low: 'badge-green', Moderate: 'badge-amber', High: 'badge-red' };

function getRisk(humidity, temp) {
    if (humidity > 80 && temp > 15 && temp < 30) return 'High';
    if (humidity > 65) return 'Moderate';
    return 'Low';
}

function getAdvise(risk, humidity) {
    if (risk === 'High') return `Critical: Humidity at ${humidity}% creates optimal conditions for Phytophthora infestans and Alternaria. Apply preventive copper fungicide immediately. Avoid overhead irrigation.`;
    if (risk === 'Moderate') return `Warning: Humidity at ${humidity}% elevated. Monitor foliage daily for early disease symptoms. Consider prophylactic treatment within 48 hours.`;
    return `Clear: Current conditions are unfavorable for fungal proliferation. Continue standard monitoring and preventive IPM protocols.`;
}

export default function WeatherRisk() {
    const [location, setLocation] = useState('Krishnagiri, Tamil Nadu');
    const [weather, setWeather] = useState({ temp: 28, humidity: 72, wind: 14, condition: 'Partly Cloudy' });
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    const fetch = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/weather/current?location=${encodeURIComponent(location)}`);
            setWeather(data);
        } catch {
            // Use mock data if backend weather not configured
            setWeather({ temp: Math.round(20 + Math.random() * 15), humidity: Math.round(50 + Math.random() * 40), wind: Math.round(5 + Math.random() * 25), condition: ['Sunny', 'Overcast', 'Humid', 'Rainy'][Math.floor(Math.random() * 4)] });
        } finally {
            setLoading(false);
            setFetched(true);
        }
    };

    const risk = getRisk(weather.humidity, weather.temp);
    const advice = getAdvise(risk, weather.humidity);

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-slide-up">
            <div className="border-b border-agri-border pb-6">
                <p className="label-console mb-2">Environmental Risk Intelligence</p>
                <h1 className="h1-console">Weather Risk Assessment</h1>
                <p className="text-sm text-agri-text/50 font-sans mt-1">Analyze local weather conditions against disease proliferation thresholds.</p>
            </div>

            {/* Location Bar */}
            <div className="flex gap-3">
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter location..."
                    className="input-field flex-1" onKeyDown={e => e.key === 'Enter' && fetch()} />
                <button onClick={fetch} disabled={loading} className="btn-primary shrink-0">
                    {loading ? 'Fetching...' : 'Check Risk'}
                </button>
            </div>

            {/* Weather Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Temperature', value: `${weather.temp}°C`, icon: Thermometer, color: 'text-agri-amber' },
                    { label: 'Humidity', value: `${weather.humidity}%`, icon: Droplets, color: 'text-blue-400' },
                    { label: 'Wind Speed', value: `${weather.wind} km/h`, icon: Wind, color: 'text-agri-text/60' },
                    { label: 'Condition', value: weather.condition, icon: Cloud, color: 'text-agri-text/60' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="console-card-dark text-center">
                        <Icon size={20} className={`${color} mx-auto mb-2`} />
                        <p className="label-console mb-1">{label}</p>
                        <p className="text-xl font-bold text-white font-sans">{value}</p>
                    </div>
                ))}
            </div>

            {/* Risk Assessment */}
            <div className={`console-card border ${risk === 'High' ? 'border-agri-red/40 bg-agri-red/5' : risk === 'Moderate' ? 'border-agri-amber/30 bg-agri-amber/5' : 'border-agri-green/30 bg-agri-green/5'}`}>
                <div className="flex items-start gap-4">
                    <AlertTriangle size={20} className={RISK_COLOR[risk]} />
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="h2-console text-xl">Fungal Proliferation Risk</h2>
                            <span className={`badge ${RISK_BADGE[risk]}`}>{risk}</span>
                        </div>
                        <p className="text-sm text-agri-text/70 font-sans leading-relaxed">{advice}</p>
                    </div>
                </div>
            </div>

            {/* Pathogen Risk Grid */}
            <div className="console-card">
                <h3 className="h2-console text-xl mb-5">Crop-Specific Risk Profile</h3>
                <div className="space-y-4">
                    {[
                        { crop: 'Tomato', pathogens: ['Phytophthora infestans', 'Alternaria solani'], threshold: 70, color: 'bg-agri-red' },
                        { crop: 'Potato', pathogens: ['Phytophthora infestans', 'Rhizoctonia solani'], threshold: 75, color: 'bg-agri-amber' },
                        { crop: 'Pepper', pathogens: ['Phytophthora capsici', 'Xanthomonas perforans'], threshold: 65, color: 'bg-agri-green' },
                    ].map(({ crop, pathogens, threshold, color }) => {
                        const pct = Math.min(100, Math.round((weather.humidity / threshold) * 100));
                        const active = weather.humidity >= threshold;
                        return (
                            <div key={crop} className="p-4 bg-agri-dark border border-agri-border rounded-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-semibold text-white">{crop}</p>
                                        <p className="text-[10px] font-mono text-agri-text/40">{pathogens.join(' · ')}</p>
                                    </div>
                                    <span className={`badge ${active ? 'badge-red' : 'badge-green'}`}>{active ? 'At Risk' : 'Safe'}</span>
                                </div>
                                <div className="h-1.5 bg-agri-surface border border-agri-border/50 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                </div>
                                <div className="flex justify-between mt-1 text-[9px] font-mono text-agri-text/30">
                                    <span>Threshold: {threshold}%</span>
                                    <span>Current: {weather.humidity}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
