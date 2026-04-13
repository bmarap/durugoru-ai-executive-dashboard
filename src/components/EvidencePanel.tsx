import React from "react";

interface EvidencePanelProps {
    server: any;
    onMarkFalsePositive?: (serverName: string) => void;
}

const renderApps = (apps: any) => {
    if (!apps || apps === "None") return "None";
    return Array.isArray(apps) ? apps.join(", ") : String(apps);
};

const renderPortsList = (portsString: any) => {
    if (!portsString || portsString === "None" || portsString === "NO_DATA") {
        return <span className="text-brand-silver font-mono text-[10px]">{portsString || "None"}</span>;
    }
    const ports = String(portsString).split(',').map(p => p.trim()).filter(Boolean);
    return (
        <div className="flex flex-wrap gap-1.5 mt-1">
            {ports.map((p, idx) => (
                <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 whitespace-nowrap">
                    {p}
                </span>
            ))}
        </div>
    );
};

export const EvidencePanel: React.FC<EvidencePanelProps> = ({ server, onMarkFalsePositive }) => {
    return (
        <div className="bg-black/20 border-x border-b border-panel-border p-6 shadow-inner text-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-semibold uppercase tracking-wider text-xs">
                    Section A: AI Reasoning
                </h4>
                <div className="flex items-center gap-3">
                    {(server.ai_classification === 'ZOMBIE' || server.ai_classification === 'SUSPECT') && onMarkFalsePositive && (
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                onMarkFalsePositive(server.server_name); 
                            }}
                            className="bg-brand-slate/10 hover:bg-brand-orange/20 text-brand-silver hover:text-brand-orange border border-panel-border hover:border-brand-orange/50 transition-colors px-3 py-1 rounded text-xs font-semibold flex items-center gap-1"
                        >
                            Postpone
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-brand-slate uppercase tracking-wider font-semibold">
                            Analysis Timestamp:
                        </span>
                        <span className="text-xs text-brand-silver font-mono bg-black/40 px-2 py-1 rounded border border-panel-border">
                            {new Date(server.analysis_timestamp).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <div className="bg-panel-bg p-4 rounded text-brand-silver border border-panel-border">
                    {server.decision_rationale}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs">
                        Section B: ML Anomaly Scores
                    </h4>
                    <div className="space-y-4 bg-panel-bg p-4 rounded border border-panel-border">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-brand-slate">LSTM Temporal</span>
                                <span className="text-brand-silver font-mono">
                                    {server.ai_anomaly_scores?.lstm_temporal_anomaly_score ?? 0}%
                                </span>
                            </div>
                            <div className="w-full bg-black/40 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${(server.ai_anomaly_scores?.lstm_temporal_anomaly_score ?? 0) > 70 ? "bg-brand-orange" : "bg-brand-cyan"}`}
                                    style={{
                                        width: `${server.ai_anomaly_scores?.lstm_temporal_anomaly_score ?? 0}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-brand-slate">Peer Comparison</span>
                                <span className="text-brand-silver font-mono">
                                    {server.ai_anomaly_scores?.peer_comparison_anomaly_score ?? 0}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-black/40 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${(server.ai_anomaly_scores?.peer_comparison_anomaly_score ?? 0) > 70 ? "bg-brand-orange" : "bg-brand-cyan"}`}
                                    style={{
                                        width: `${server.ai_anomaly_scores?.peer_comparison_anomaly_score ?? 0}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs">
                        Section C: Network & Firewall
                    </h4>
                    {server.evidence_firewall?.outbound ||
                        server.evidence_firewall?.inbound ? (
                        <div className="bg-panel-bg p-4 rounded border border-panel-border space-y-4">
                            {/* Outbound */}
                            {server.evidence_firewall.outbound && (
                                <div>
                                    <h5 className="text-brand-slate text-xs uppercase mb-2">
                                        Outbound
                                    </h5>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-brand-slate text-xs">Sessions</span>
                                            <span className="text-brand-silver font-mono text-xs">
                                                {Number(
                                                    server.evidence_firewall.outbound.sessions || 0,
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-slate text-xs">
                                                Unique Dest.
                                            </span>
                                            <span className="text-brand-silver font-mono text-xs">
                                                {Number(
                                                    server.evidence_firewall.outbound.unique_dests || 0,
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t border-panel-border/50 pt-1 mt-1">
                                            <span className="text-brand-slate text-xs">Apps</span>
                                            <span
                                                className="text-brand-silver truncate ml-2 text-xs"
                                                title={renderApps(
                                                    server.evidence_firewall.outbound.apps_detected,
                                                )}
                                            >
                                                {renderApps(
                                                    server.evidence_firewall.outbound.apps_detected,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Inbound */}
                            {server.evidence_firewall.inbound && (
                                <div
                                    className={
                                        server.evidence_firewall.outbound
                                            ? "pt-3 border-t border-panel-border"
                                            : ""
                                    }
                                >
                                    <h5 className="text-brand-slate text-xs uppercase mb-2">
                                        Inbound
                                    </h5>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-brand-slate text-xs">Sessions</span>
                                            <span className="text-brand-silver font-mono text-xs">
                                                {Number(
                                                    server.evidence_firewall.inbound.sessions || 0,
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-brand-slate text-xs">
                                                Unique Src.
                                            </span>
                                            <span className="text-brand-silver font-mono text-xs">
                                                {Number(
                                                    server.evidence_firewall.inbound.unique_sources || 0,
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t border-panel-border/50 pt-1 mt-1">
                                            <span className="text-brand-slate text-xs">Apps</span>
                                            <span
                                                className="text-brand-silver truncate ml-2 text-xs"
                                                title={renderApps(
                                                    server.evidence_firewall.inbound.apps_detected,
                                                )}
                                            >
                                                {renderApps(
                                                    server.evidence_firewall.inbound.apps_detected,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-panel-bg p-4 rounded border border-panel-border space-y-2">
                            <div className="flex justify-between">
                                <span className="text-brand-slate">Total Sessions</span>
                                <span className="text-brand-silver font-mono">
                                    {server.evidence_firewall?.total_sessions?.toLocaleString() ??
                                        0}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-slate">Unique Dest.</span>
                                <span className="text-brand-silver font-mono">
                                    {server.evidence_firewall?.unique_destinations ?? 0}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-panel-border pt-2 mt-2">
                                <span className="text-brand-slate">Apps Detected</span>
                                <span
                                    className="text-brand-silver truncate ml-2"
                                    title={renderApps(server.evidence_firewall?.apps_detected)}
                                >
                                    {renderApps(server.evidence_firewall?.apps_detected)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs">
                        Section D: Log Intelligence
                    </h4>
                    <div className="bg-panel-bg p-4 rounded border border-panel-border space-y-2">
                        <div className="flex justify-between">
                            <span className="text-brand-slate">Total Logs</span>
                            <span className="text-brand-silver font-mono">
                                {server.evidence_logs?.total_log_count?.toLocaleString() ?? 0}
                            </span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-brand-slate">Unique Patterns</span>
                            <span className="text-brand-silver font-mono">
                                {server.evidence_logs?.unique_patterns_found ?? 0}
                            </span>
                        </div>
                        <div className="text-xs text-brand-silver bg-black/30 border border-panel-border p-2 rounded whitespace-pre-wrap font-mono uppercase">
                            {server.evidence_logs?.log_summary || "-"}
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-xs">
                        Section E: VMware vDS
                    </h4>
                    <div className="bg-panel-bg p-4 rounded border border-panel-border space-y-4">
                        {/* Outbound */}
                        <div>
                            <h5 className="text-brand-slate text-xs uppercase mb-2">
                                Outbound
                            </h5>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-brand-slate">Traffic</span>
                                    <span className="text-brand-silver font-mono">
                                        {server.evidence_aria_vds?.outbound_mb != null ? `${server.evidence_aria_vds.outbound_mb} MB` : "NO_DATA"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-brand-slate text-xs block">Ports</span>
                                    {renderPortsList(server.evidence_aria_vds?.outbound_ports)}
                                </div>
                            </div>
                        </div>

                        {/* Inbound */}
                        <div className="pt-3 border-t border-panel-border">
                            <h5 className="text-brand-slate text-xs uppercase mb-2">
                                Inbound
                            </h5>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-brand-slate">Traffic</span>
                                    <span className="text-brand-silver font-mono">
                                        {server.evidence_aria_vds?.inbound_mb != null ? `${server.evidence_aria_vds.inbound_mb} MB` : "NO_DATA"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-brand-slate text-xs block">Ports</span>
                                    {renderPortsList(server.evidence_aria_vds?.inbound_ports)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
