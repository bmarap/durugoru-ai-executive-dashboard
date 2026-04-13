import React from 'react';
import { Server, Activity, Ghost, Percent, AlertTriangle, Clock } from 'lucide-react';

interface KPICardsProps {
    data: any[];
    postponedCount?: number;
}

export const KPICards: React.FC<KPICardsProps> = ({ data, postponedCount = 0 }) => {
    const totalServers = data.length;
    const zombies = data.filter(d => d.ai_classification === 'ZOMBIE');
    const actives = data.filter(d => d.ai_classification === 'ACTIVE');
    const suspects = data.filter(d => d.ai_classification === 'SUSPECT');

    const avgZombieConfidence = zombies.length > 0
        ? (zombies.reduce((acc, curr) => acc + curr.confidence_score, 0) / zombies.length) * 100
        : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-panel-bg border border-panel-border rounded-lg p-5 flex items-center justify-between shadow-lg">
                <div>
                    <p className="text-sm text-brand-silver font-medium mb-1">Total Servers Analyzed</p>
                    <p className="text-3xl font-bold text-white">{totalServers}</p>
                </div>
                <div className="bg-brand-blue/20 p-3 rounded-full text-brand-blue">
                    <Server size={24} />
                </div>
            </div>

            <div className="bg-panel-bg border border-panel-border rounded-lg p-5 flex items-center justify-between shadow-lg">
                <div>
                    <p className="text-sm text-brand-silver font-medium mb-1">Zombies Detected</p>
                    <p className="text-3xl font-bold text-brand-orange">{zombies.length}</p>
                </div>
                <div className="bg-brand-orange/20 p-3 rounded-full text-brand-orange">
                    <Ghost size={24} />
                </div>
            </div>

            <div className="bg-panel-bg border border-panel-border rounded-lg p-5 flex items-center justify-between shadow-lg">
                <div>
                    <p className="text-sm text-brand-silver font-medium mb-1">Active Servers</p>
                    <p className="text-3xl font-bold text-brand-cyan">{actives.length}</p>
                </div>
                <div className="bg-brand-cyan/20 p-3 rounded-full text-brand-cyan">
                    <Activity size={24} />
                </div>
            </div>

            <div className="bg-panel-bg border border-panel-border rounded-lg p-5 flex items-center justify-between shadow-lg">
                <div>
                    <p className="text-sm text-brand-silver font-medium mb-1">Suspect Servers</p>
                    <p className="text-3xl font-bold text-brand-yellow">{suspects.length}</p>
                </div>
                <div className="bg-brand-yellow/20 p-3 rounded-full text-brand-yellow">
                    <AlertTriangle size={24} />
                </div>
            </div>

            <div className="bg-panel-bg border border-panel-border rounded-lg p-5 flex items-center justify-between shadow-lg">
                <div>
                    <p className="text-sm text-brand-silver font-medium mb-1">Postponed</p>
                    <p className="text-3xl font-bold text-brand-blue">{postponedCount}</p>
                </div>
                <div className="bg-brand-blue/20 p-3 rounded-full text-brand-blue">
                    <Clock size={24} />
                </div>
            </div>

            <div className="bg-panel-bg border border-panel-border rounded-lg p-5 flex items-center justify-between shadow-lg">
                <div>
                    <p className="text-sm text-brand-silver font-medium mb-1">Avg Zombie Confidence</p>
                    <p className="text-3xl font-bold text-brand-yellow">{avgZombieConfidence.toFixed(1)}%</p>
                </div>
                <div className="bg-brand-yellow/20 p-3 rounded-full text-brand-yellow">
                    <Percent size={24} />
                </div>
            </div>
        </div>
    );
};
