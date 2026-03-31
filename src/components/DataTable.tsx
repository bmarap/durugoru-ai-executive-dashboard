import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { EvidencePanel } from './EvidencePanel';

interface DataTableProps {
    data: any[];
}

const getFirewallAppsString = (firewall: any) => {
    if (!firewall) return 'None';
    // Backwards compatibility
    if (firewall.apps_detected) {
        return Array.isArray(firewall.apps_detected) 
            ? firewall.apps_detected.join(', ') 
            : firewall.apps_detected;
    }
    
    // New nested format
    const outApps = firewall.outbound?.apps_detected;
    const inApps = firewall.inbound?.apps_detected;
    
    const outStr = Array.isArray(outApps) ? outApps.join(', ') : (outApps === 'None' ? '' : outApps);
    const inStr = Array.isArray(inApps) ? inApps.join(', ') : (inApps === 'None' ? '' : inApps);
    
    const combined = [outStr, inStr].filter(Boolean).join(' | ');
    return combined || 'None';
};

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const toggleRow = (serverName: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(serverName)) {
            newExpanded.delete(serverName);
        } else {
            newExpanded.add(serverName);
        }
        setExpandedRows(newExpanded);
    };

    const filteredData = useMemo(() => {
        let sortedData = [...data];

        if (search) {
            sortedData = sortedData.filter(item =>
                item.server_name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filterStatus !== 'ALL') {
            sortedData = sortedData.filter(item => item.ai_classification === filterStatus);
        }

        if (sortConfig !== null) {
            sortedData.sort((a, b) => {
                let aValue, bValue;
                switch (sortConfig.key) {
                    case 'server_name':
                        aValue = a.server_name;
                        bValue = b.server_name;
                        break;
                    case 'status':
                        aValue = a.ai_classification;
                        bValue = b.ai_classification;
                        break;
                    case 'confidence':
                        aValue = a.confidence_score;
                        bValue = b.confidence_score;
                        break;
                    case 'cpu':
                        aValue = a.evidence_metrics?.cpu_usage_max_pct ?? 0;
                        bValue = b.evidence_metrics?.cpu_usage_max_pct ?? 0;
                        break;
                    case 'ram':
                        aValue = a.evidence_metrics?.mem_usage_max_pct ?? 0;
                        bValue = b.evidence_metrics?.mem_usage_max_pct ?? 0;
                        break;
                    default:
                        return 0;
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return sortedData;
    }, [data, search, filterStatus, sortConfig]);

    return (
        <div className="bg-panel-bg border border-panel-border rounded-lg shadow-xl overflow-hidden">
            <div className="p-4 border-b border-panel-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/20">
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-brand-slate" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-panel-border rounded-md leading-5 bg-black/30 text-white placeholder-brand-slate focus:outline-none focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan sm:text-sm"
                        placeholder="Search server name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-brand-slate" />
                    <select
                        className="block w-full pl-3 pr-10 py-2 border border-panel-border rounded-md leading-5 bg-black/30 text-white focus:outline-none focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan sm:text-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="ZOMBIE">Zombie</option>
                        <option value="SUSPECT">Suspect</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-panel-border">
                    <thead className="bg-black/40">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-slate uppercase tracking-wider w-8">
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-brand-slate uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('server_name')}
                            >
                                Server Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-brand-slate uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('status')}
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-brand-slate uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('confidence')}
                            >
                                AI Confidence
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-brand-slate uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('cpu')}
                            >
                                Max CPU
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-brand-slate uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('ram')}
                            >
                                Max RAM
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-slate uppercase tracking-wider">
                                FW Apps
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-panel-border/50">
                        {filteredData.map((server) => {
                            const isExpanded = expandedRows.has(server.server_name);
                            const isZombie = server.ai_classification === 'ZOMBIE';
                            const isSuspect = server.ai_classification === 'SUSPECT';
                            const confPct = Math.round(server.confidence_score * 100);

                            return (
                                <React.Fragment key={server.server_name}>
                                    <tr
                                        onClick={() => toggleRow(server.server_name)}
                                        className="hover:bg-panel-hover cursor-pointer transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-brand-slate group-hover:text-white">
                                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="text-sm font-medium text-white">{server.server_name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${isZombie ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' : isSuspect ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20' : 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'}`}>
                                                {server.ai_classification}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center w-full max-w-[120px]">
                                                <span className="text-sm text-brand-silver mr-2 w-8">{confPct}%</span>
                                                <div className="w-full bg-black/40 rounded-full h-1.5 border border-white/5">
                                                    <div
                                                        className={`h-1.5 rounded-full ${isZombie ? 'bg-brand-orange' : isSuspect ? 'bg-brand-yellow' : 'bg-brand-cyan'}`}
                                                        style={{ width: `${confPct}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver font-mono">
                                            {server.evidence_metrics?.cpu_usage_max_pct ?? '-'}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-silver font-mono">
                                            {server.evidence_metrics?.mem_usage_max_pct ?? '-'}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-slate max-w-[150px] truncate" title={getFirewallAppsString(server.evidence_firewall)}>
                                            {getFirewallAppsString(server.evidence_firewall)}
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan={7} className="p-0">
                                                <EvidencePanel server={server} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>

                {filteredData.length === 0 && (
                    <div className="p-8 text-center text-brand-slate">
                        No servers found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};
