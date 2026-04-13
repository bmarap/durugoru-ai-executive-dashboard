import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FeedbackModalProps {
    isOpen: boolean;
    serverName: string | null;
    onClose: () => void;
    onSubmit: (reason: string) => Promise<void>;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, serverName, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setReason('');
            setError(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen || !serverName) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!reason.trim()) {
            setError('Please provide a reason.');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        
        try {
            await onSubmit(reason);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-panel-bg border border-panel-border rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-4 border-b border-panel-border bg-black/20">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                        Postpone Server
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-brand-slate hover:text-white transition-colors p-1"
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-brand-slate mb-1">
                            Server
                        </label>
                        <div className="text-brand-silver font-mono bg-black/30 p-2 rounded border border-panel-border">
                            {serverName}
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="reason" className="block text-sm font-medium text-brand-slate mb-1">
                            Reason for Postponing <span className="text-brand-orange">*</span>
                        </label>
                        <textarea
                            id="reason"
                            rows={4}
                            className="w-full bg-black/40 border border-panel-border rounded p-3 text-white placeholder-brand-slate focus:outline-none focus:ring-1 focus:ring-brand-cyan focus:border-brand-cyan text-sm resize-none"
                            placeholder="e.g., Target server is an active DR node causing expected high network traffic..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={isSubmitting}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-brand-orange text-sm">{error}</p>
                        )}
                    </div>
                    
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-brand-slate hover:text-white transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-brand-cyan text-black rounded hover:bg-brand-cyan/80 transition-colors flex items-center gap-2 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
