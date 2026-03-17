'use client';

import { useState, useEffect } from 'react';
import {
    FileText,
    Upload,
    CheckCircle2,
    Clock,
    AlertCircle,
    ShieldCheck,
    Loader2,
    Trash2,
    Download
} from 'lucide-react';
import { api } from '@/lib/api';
import axiosInstance from '@/lib/axios';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from 'sonner';

interface Document {
    id?: number;
    document_type: string;
    label: string;
    file: string | null;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'MISSING';
    updated_at: string | null;
    rejection_reason?: string;
}

export default function CandidateDocumentsPage() {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { fetchUser } = useAuthStore();
    const [documents, setDocuments] = useState<Document[]>([
        { document_type: 'CNI', label: 'Carte d\'Identité / Passeport', file: null, status: 'MISSING', updated_at: null },
        { document_type: 'CV', label: 'Curriculum Vitae (PDF)', file: null, status: 'MISSING', updated_at: null },
        { document_type: 'DIPLOMA', label: 'Dernier Diplôme Obtenu', file: null, status: 'MISSING', updated_at: null },
        { document_type: 'CERTIFICATE', label: 'Certification / Attestation', file: null, status: 'MISSING', updated_at: null },
    ]);
    const [uploadingType, setUploadingType] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get('users/documents/');
            const apiDocs = response.data.results || response.data;

            setDocuments(prev => prev.map(baseDoc => {
                const found = apiDocs.find((d: any) => d.document_type === baseDoc.document_type);
                if (found) {
                    return { ...baseDoc, ...found };
                }
                return baseDoc;
            }));
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.warning("Le fichier est trop volumineux (max 5MB)");
            return;
        }

        setUploadingType(type);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', type);

        try {
            await axiosInstance.post('users/documents/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchDocuments();
            await fetchUser(); // Refresh placability score
            toast.success('Document uploadé avec succès ! Nos équipes vont le vérifier.');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Erreur lors de l\'envoi du document.');
        } finally {
            setUploadingType(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Supprimer ce document ?")) return;
        try {
            await axiosInstance.delete(`users/documents/${id}/`);
            await fetchDocuments();
            await fetchUser();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    if (!mounted) return null;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mes Documents & KYC</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium font-sans">Vérifiez votre identité pour débloquer les offres <span className="text-blue-600 dark:text-blue-400 font-black italic">Elite</span>.</p>
                </div>
                <div className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-2xl flex items-center space-x-3 shadow-lg shadow-blue-100 dark:shadow-none">
                    <ShieldCheck size={20} />
                    <span className="text-sm font-black uppercase tracking-widest leading-none">Confiance : Standard</span>
                </div>
            </div>

            {/* Verification Status Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-200 dark:shadow-none transition-colors font-sans">
                <div className="flex items-center space-x-6 text-left">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <Loader2 size={32} className="text-blue-300 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black mb-1">Dossier en cours de complétion</h3>
                        <p className="text-blue-100 font-medium text-sm">
                            Uploadez tous vos documents pour obtenir le badge <span className="font-bold text-white uppercase italic">Vérifié par IA</span>.
                        </p>
                    </div>
                </div>
                <div className="flex -space-x-3 transition-opacity">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`w-10 h-10 rounded-full border-4 border-blue-900 dark:border-slate-900 flex items-center justify-center font-black text-xs ${i === 1 ? 'bg-blue-500' : 'bg-blue-800/50 dark:bg-slate-800/50 opacity-100'}`}>
                            {i}
                        </div>
                    ))}
                </div>
            </div>

            {/* Documents List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={40} className="text-blue-600 animate-spin" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {documents.map((doc) => (
                        <div key={doc.document_type} className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 border border-blue-50 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all group">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${doc.status === 'VERIFIED' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                                    doc.status === 'PENDING' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                                        doc.status === 'REJECTED' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                                            'bg-blue-50 dark:bg-blue-900/20 text-blue-400 dark:text-blue-500'
                                    }`}>
                                    <FileText size={28} />
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${doc.status === 'VERIFIED' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                                    doc.status === 'PENDING' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' :
                                        doc.status === 'REJECTED' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                                            'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                                    }`}>
                                    {doc.status === 'VERIFIED' ? 'Vérifié' :
                                        doc.status === 'PENDING' ? 'En attente' :
                                            doc.status === 'REJECTED' ? 'Refusé' :
                                                'Absent'}
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{doc.label}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans mb-8 leading-relaxed">
                                {doc.file ? `Dernière mise à jour : ${new Date(doc.updated_at!).toLocaleDateString()}` : 'Aucun fichier sélectionné. Format PDF recommandé.'}
                                {doc.rejection_reason && <span className="block text-red-500 dark:text-red-400 mt-2 font-black">Motif : {doc.rejection_reason}</span>}
                            </p>

                            <div className="flex items-center gap-3">
                                {doc.status === 'MISSING' || doc.status === 'REJECTED' ? (
                                    <div className="flex-1 relative">
                                        <input
                                            type="file"
                                            id={`file-${doc.document_type}`}
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange(e, doc.document_type)}
                                            disabled={uploadingType === doc.document_type}
                                        />
                                        <label
                                            htmlFor={`file-${doc.document_type}`}
                                            className={`w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer ${uploadingType === doc.document_type ? 'opacity-50 cursor-wait' : ''}`}
                                        >
                                            {uploadingType === doc.document_type ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                                            {uploadingType === doc.document_type ? 'Upload...' : 'Téléverser'}
                                        </label>
                                    </div>
                                ) : (
                                    <>
                                        <a
                                            href={doc.file!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 py-4 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Download size={14} /> Voir
                                        </a>
                                        <button
                                            onClick={() => handleDelete(doc.id!)}
                                            className="p-4 bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Help Section */}
            <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-[2.5rem] border border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors font-sans">
                <div className="flex items-center space-x-4">
                    <AlertCircle className="text-blue-600 dark:text-blue-400" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        La vérification de vos documents prend généralement moins de <span className="font-bold text-slate-900 dark:text-white">24 heures</span> ouvrées.
                    </p>
                </div>
                <button
                    onClick={() => toast.info('Ouverture du support KYC...')}
                    className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest hover:underline"
                >
                    Support KYC
                </button>
            </div>
        </div>
    );
}
