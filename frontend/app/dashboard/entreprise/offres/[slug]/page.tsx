'use client';

import {
    ChevronLeft, Briefcase, MapPin, Clock, Zap, Users,
    UserCheck, MessageSquare, Eye, ShieldCheck, Loader2,
    CheckCircle2, XCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axiosInstance from '@/lib/axios';
import { getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Application {
    id: number;
    candidate_detail: {
        id: number;
        user_detail?: {
            id: number;
            email: string;
            username: string;
            first_name?: string;
            last_name?: string;
        };
        title: string;
        location: string;
        is_verified: boolean;
        placability_score: number;
        photo?: string;
    };
    status: string;
    matching_score: number;
    applied_at: string;
}

interface JobOffer {
    id: number;
    title: string;
    slug: string;
    location: string;
    contract_type: string;
    description: string;
    company_detail?: {
        name: string;
        logo?: string;
    };
}

export default function JobApplicationsPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const [offer, setOffer] = useState<JobOffer | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isStartingChat, setIsStartingChat] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (slug) fetchData();
    }, [slug]);

    const fetchData = async () => {
        try {
            const [offerRes, appsRes] = await Promise.all([
                axiosInstance.get(`jobs/offers/${slug}/`),
                axiosInstance.get(`jobs/my-applications/`) // Backend filters by company
            ]);
            setOffer(offerRes.data);
            // In a better API design, we'd have a nested endpoint: jobs/offers/[slug]/applications/
            // For now we filter locally or rely on the fact that my-applications returns all company apps
            const allApps = appsRes.data.results || appsRes.data;
            const filteredApps = allApps.filter((a: any) => a.job_offer_detail?.slug === slug);
            setApplications(filteredApps);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartChat = async (userId: number) => {
        if (!userId) return;
        setIsStartingChat(userId);
        try {
            await axiosInstance.post('chat/start_conversation/', { user_id: userId });
            router.push('/dashboard/entreprise/messages');
        } catch (err) {
            console.error('Failed to start conversation', err);
            toast.error('Erreur lors de l\'ouverture de la discussion.');
        } finally {
            setIsStartingChat(null);
        }
    };

    if (!mounted) return null;

    if (isLoading) {
        return (
            <div className="space-y-10">
                <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-lg" />
                <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-blue-50 shadow-sm">
                    <div className="flex items-center gap-6">
                        <Skeleton className="w-24 h-24 rounded-[2rem]" />
                        <div className="space-y-4 flex-1">
                            <Skeleton className="h-10 w-1/3" />
                            <div className="flex gap-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-8 w-48" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-8 border border-blue-50 flex items-center gap-10">
                            <Skeleton className="w-16 h-16 rounded-2xl" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-4 w-1/6" />
                            </div>
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-14 w-40 rounded-2xl" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <Link
                href="/dashboard/entreprise/offres"
                className="group flex items-center text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all"
            >
                <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                Retour aux offres
            </Link>

            <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 border border-blue-50 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        {offer?.company_detail?.logo ? (
                            <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-blue-50 shadow-xl shadow-blue-100 shrink-0">
                                <Image
                                    src={getImageUrl(offer.company_detail.logo) || ''}
                                    alt={offer.company_detail.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-200 shrink-0">
                                <Briefcase size={24} className="sm:w-8 sm:h-8" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase mb-2 leading-tight">{offer?.title}</h1>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center"><MapPin size={14} className="mr-1 sm:mr-2 text-blue-400" /> {offer?.location}</span>
                                <span className="flex items-center"><Clock size={14} className="mr-1 sm:mr-2 text-blue-400" /> {offer?.contract_type}</span>
                                <span className="flex items-center"><Users size={14} className="mr-1 sm:mr-2 text-blue-400" /> {applications.length} Candidatures</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tighter">Candidats Correspondants</h2>

                {applications.length === 0 ? (
                    <div className="text-center py-12 sm:py-20 bg-slate-50 rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-slate-200 px-4">
                        <Users size={40} className="mx-auto text-slate-300 mb-4 sm:w-12 sm:h-12" />
                        <h3 className="text-lg sm:text-xl font-black text-slate-400 uppercase">Aucune candidature pour le moment</h3>
                    </div>
                ) : (
                    applications.sort((a, b) => b.matching_score - a.matching_score).map((app) => {
                        const userDetail = app.candidate_detail.user_detail;
                        const firstName = userDetail?.first_name || '';
                        const lastName = userDetail?.last_name || '';
                        const fullName = firstName && lastName
                            ? `${firstName} ${lastName}`
                            : userDetail?.username || userDetail?.email?.split('@')[0] || 'Talent';
                        const userId = userDetail?.id;
                        const profilePhoto = app.candidate_detail.photo;

                        return (
                            <div key={app.id} className="group bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-blue-50 shadow-sm hover:shadow-2xl transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6 sm:gap-10">
                                    {/* Profile Info */}
                                    <div className="flex items-center space-x-4 sm:space-x-6 lg:w-1/3">
                                        {profilePhoto ? (
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-blue-100">
                                                <Image
                                                    src={getImageUrl(profilePhoto) || ''}
                                                    alt={fullName}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg">
                                                {fullName.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-black text-slate-900 tracking-tight text-base sm:text-lg">{fullName}</h4>
                                                {app.candidate_detail.is_verified && <ShieldCheck size={16} className="text-blue-600 shrink-0" />}
                                            </div>
                                            <p className="text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest leading-tight">{app.candidate_detail.title || 'Candidat'}</p>
                                        </div>
                                    </div>

                                    {/* IA Compatibility Score */}
                                    <div className="flex flex-col items-start sm:items-center justify-center flex-1 py-4 sm:py-0 px-0 sm:px-10 border-y sm:border-y-0 sm:border-x border-slate-50 text-left sm:text-center">
                                        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 sm:mb-3">Score de Matching</div>
                                        <div className="flex items-center space-x-4 w-full max-w-[200px]">
                                            <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${app.matching_score > 80 ? 'bg-green-500' : 'bg-blue-600'}`}
                                                    style={{ width: `${app.matching_score}%` }}
                                                ></div>
                                            </div>
                                            <span className={`text-lg font-black ${app.matching_score > 80 ? 'text-green-600' : 'text-blue-600'}`}>{app.matching_score}%</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 sm:gap-4 lg:w-1/3 mt-2 sm:mt-0">
                                        <Link
                                            href={`/dashboard/entreprise/candidats/${app.candidate_detail.id}`}
                                            className="p-3 sm:p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all block shrink-0"
                                        >
                                            <Eye size={20} />
                                        </Link>
                                        <button
                                            onClick={() => userId && handleStartChat(userId)}
                                            disabled={isStartingChat === userId || !userId}
                                            className="flex-1 sm:flex-none justify-center bg-slate-900 text-white px-6 sm:px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center shadow-lg shadow-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isStartingChat === userId ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                                <>
                                                    <MessageSquare size={16} className="mr-2" /> Contacter
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
