'use client';

import { useState, useEffect } from 'react';
import {
    Brain,
    CheckCircle2,
    Clock,
    Trophy,
    ChevronRight,
    ArrowRight,
    Loader2,
    X,
    Star,
    Zap,
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
    id: number;
    content: string;
    options: string[];
}

interface SkillTest {
    id: number;
    title: string;
    description: string;
    category: string;
    duration_minutes: number;
    questions: Question[];
}

interface TestResult {
    id: number;
    test: { title: string };
    score: number;
    completed_at: string;
}

type TestPhase = 'list' | 'taking' | 'result';

export default function CandidateTestsPage() {
    const [recommendedTest, setRecommendedTest] = useState<SkillTest | null>(null);
    const [results, setResults] = useState<TestResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Test taking state
    const [phase, setPhase] = useState<TestPhase>('list');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [lastScore, setLastScore] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [testRes, resultsRes] = await Promise.all([
                axiosInstance.get('skills/tests/recommend/'),
                axiosInstance.get('skills/results/'),
            ]);
            setRecommendedTest(testRes.data);
            setResults(resultsRes.data.results || resultsRes.data);
        } catch (err) {
            console.error('Failed to fetch test data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const startTest = () => {
        setAnswers([]);
        setCurrentQuestion(0);
        setPhase('taking');
    };

    const selectAnswer = (optionIdx: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = optionIdx;
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (!recommendedTest) return;
        if (currentQuestion < recommendedTest.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    };

    const submitTest = async () => {
        if (!recommendedTest) return;
        setIsSubmitting(true);
        try {
            const res = await axiosInstance.post(`skills/tests/${recommendedTest.id}/submit/`, {
                answers
            });
            setLastScore(res.data.score);
            setPhase('result');
            fetchData(); // Refresh results
            toast.success('Test soumis avec succès !');
        } catch (err) {
            console.error('Failed to submit test:', err);
            toast.error('Erreur lors de la soumission du test.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600';
        if (score >= 50) return 'text-blue-600';
        return 'text-orange-500';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-emerald-50 border-emerald-100';
        if (score >= 50) return 'bg-blue-50 border-blue-100';
        return 'bg-orange-50 border-orange-100';
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tests de Compétences IA</h1>
                    <p className="text-slate-500 font-medium mt-1">Prouvez votre expertise et boostez votre score de placabilité.</p>
                </div>
                {results.length > 0 && (
                    <div className="flex items-center gap-3 bg-white border border-blue-100 rounded-2xl px-6 py-3 shadow-sm">
                        <Trophy size={20} className="text-amber-500" />
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tests Complétés</div>
                            <div className="text-xl font-black text-slate-900">{results.length}</div>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {/* PHASE: LIST */}
                {phase === 'list' && (
                    <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                        {/* Recommended Test Card */}
                        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                            <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                <div className="w-20 h-20 bg-white/10 rounded-[2rem] border border-white/20 flex items-center justify-center shrink-0">
                                    <Brain size={40} className="text-blue-200" />
                                </div>
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/30 border border-blue-400/30 rounded-full text-blue-200 text-[10px] font-black uppercase tracking-widest mb-4">
                                        <Zap size={10} />
                                        Recommandé par l'IA
                                    </div>

                                    {isLoading ? (
                                        <div className="space-y-3">
                                            <Skeleton className="h-8 w-3/4 bg-white/10" />
                                            <Skeleton className="h-4 w-full bg-white/10" />
                                            <Skeleton className="h-4 w-2/3 bg-white/10" />
                                        </div>
                                    ) : recommendedTest ? (
                                        <>
                                            <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">{recommendedTest.title}</h2>
                                            <p className="text-blue-100/80 text-sm max-w-lg mb-6 leading-relaxed">{recommendedTest.description}</p>
                                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-blue-200 uppercase tracking-widest">
                                                    <Clock size={14} /> {recommendedTest.duration_minutes} min
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-blue-200 uppercase tracking-widest">
                                                    <CheckCircle2 size={14} /> {recommendedTest.questions?.length || 0} questions
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-blue-200 uppercase tracking-widest">
                                                    <Trophy size={14} /> {recommendedTest.category}
                                                </div>
                                            </div>
                                            <button
                                                onClick={startTest}
                                                disabled={!recommendedTest.questions || recommendedTest.questions.length === 0}
                                                className="px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 flex items-center gap-3 mx-auto lg:mx-0 disabled:opacity-50"
                                            >
                                                Démarrer le test <ArrowRight size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-blue-200 font-medium">Aucun test disponible pour le moment.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Past Results */}
                        <div>
                            <h2 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Historique des Tests</h2>
                            {isLoading ? (
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="bg-white rounded-[2rem] p-6 border border-blue-50 flex items-center gap-6">
                                            <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-5 w-1/2" />
                                                <Skeleton className="h-3 w-1/3" />
                                            </div>
                                            <Skeleton className="w-16 h-8 rounded-xl" />
                                        </div>
                                    ))}
                                </div>
                            ) : results.length === 0 ? (
                                <div className="p-12 bg-white rounded-[2.5rem] border-2 border-dashed border-blue-100 text-center">
                                    <Brain size={40} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-500 font-medium text-sm">Aucun test complété pour le moment.</p>
                                    <p className="text-slate-400 text-xs mt-1">Passez votre premier test pour booster votre score de placabilité.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {results.map((result) => (
                                        <div key={result.id} className={`bg-white rounded-[2rem] p-6 border flex items-center gap-6 ${getScoreBg(result.score)}`}>
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl ${getScoreColor(result.score)} bg-white border border-current/20`}>
                                                {result.score}%
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-slate-900 truncate">{result.test?.title || 'Test'}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {new Date(result.completed_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div className="shrink-0 flex items-center gap-2">
                                                {result.score >= 80 && <Star size={16} className="text-amber-400 fill-amber-400" />}
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${result.score >= 80 ? 'bg-emerald-100 text-emerald-700' : result.score >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {result.score >= 80 ? 'Expert' : result.score >= 50 ? 'Validé' : 'À améliorer'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* PHASE: TAKING */}
                {phase === 'taking' && recommendedTest && (
                    <motion.div key="taking" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-blue-50 overflow-hidden">
                            {/* Progress Bar */}
                            <div className="h-1.5 bg-slate-100">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500"
                                    style={{ width: `${((currentQuestion + 1) / recommendedTest.questions.length) * 100}%` }}
                                />
                            </div>

                            <div className="p-8 sm:p-12">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                                            Question {currentQuestion + 1} / {recommendedTest.questions.length}
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 truncate max-w-sm">{recommendedTest.title}</h2>
                                    </div>
                                    <button
                                        onClick={() => setPhase('list')}
                                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Question */}
                                <div className="mb-10">
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-relaxed mb-8">
                                        {recommendedTest.questions[currentQuestion]?.content}
                                    </h3>

                                    <div className="space-y-4">
                                        {recommendedTest.questions[currentQuestion]?.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => selectAnswer(idx)}
                                                className={`w-full text-left p-6 rounded-2xl border-2 font-bold text-sm transition-all ${answers[currentQuestion] === idx
                                                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-lg shadow-blue-100'
                                                        : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-700'
                                                    }`}
                                            >
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl mr-4 text-[10px] font-black uppercase shrink-0 ${answers[currentQuestion] === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-between gap-4">
                                    <button
                                        onClick={prevQuestion}
                                        disabled={currentQuestion === 0}
                                        className="px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-30"
                                    >
                                        Précédent
                                    </button>

                                    {currentQuestion < recommendedTest.questions.length - 1 ? (
                                        <button
                                            onClick={nextQuestion}
                                            disabled={answers[currentQuestion] === undefined}
                                            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            Suivant <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={submitTest}
                                            disabled={isSubmitting || answers[currentQuestion] === undefined}
                                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                            Valider le test
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* PHASE: RESULT */}
                {phase === 'result' && lastScore !== null && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <div className="bg-white rounded-[2.5rem] p-12 border border-blue-50 shadow-sm text-center">
                            {/* Score Circle */}
                            <div className="relative w-48 h-48 mx-auto mb-10">
                                <svg className="w-full h-full -rotate-90">
                                    <circle stroke="#f1f5f9" strokeWidth="12" fill="transparent" r="80" cx="96" cy="96" />
                                    <circle
                                        stroke={lastScore >= 80 ? '#10b981' : lastScore >= 50 ? '#3b82f6' : '#f97316'}
                                        strokeWidth="12"
                                        strokeDasharray={502}
                                        strokeDashoffset={502 - (502 * lastScore) / 100}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        r="80"
                                        cx="96"
                                        cy="96"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-5xl font-black ${getScoreColor(lastScore)}`}>{lastScore}%</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Score Final</span>
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mb-3">
                                {lastScore >= 80 ? '🏆 Excellent !' : lastScore >= 50 ? '✅ Bien joué !' : '💪 Continuez !'}
                            </h2>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
                                {lastScore >= 80
                                    ? 'Votre score a été ajouté à votre profil. Les recruteurs voient maintenant votre expertise validée par l\'IA.'
                                    : lastScore >= 50
                                        ? 'Bon score ! Votre profil a été mis à jour. Continuez à pratiquer pour atteindre le niveau Expert.'
                                        : 'Ne vous découragez pas ! Révisez et retentez le test pour améliorer votre score.'}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => { setPhase('list'); fetchData(); }}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                                >
                                    Voir mes résultats
                                </button>
                                {lastScore < 80 && (
                                    <button
                                        onClick={startTest}
                                        className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"
                                    >
                                        Retenter le test
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
