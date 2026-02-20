'use client';

import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useState} from 'react';
import {invocationService, MonsterTemplate} from '@/lib/services';
import {LoadingPage} from '@/components/ui';
import {TemplateList} from '@/components/invocation/TemplateList';
import {CreateTemplateModal} from '@/components/admin/CreateTemplateModal'; // Added import
import toast from 'react-hot-toast';
import {ChevronLeft, ChevronRight, Zap} from 'lucide-react'; // Added imports

export default function TemplatesPage() {
    const {isAuthenticated, isLoading: authLoading} = useAuth();
    const router = useRouter();

    const [templates, setTemplates] = useState<MonsterTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Added pagination state
    const ITEMS_PER_PAGE = 5;

    const loadTemplates = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await invocationService.getTemplates();
            setTemplates(data);
        } catch (err) {
            console.error(err);
            toast.error("Impossible de charger les templates.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadTemplates();
        }
    }, [isAuthenticated, loadTemplates]);

    if (authLoading || isLoading) {
        return <LoadingPage message="Chargement des templates..."/>;
    }

    if (!isAuthenticated) return null;

    const totalPages = Math.ceil(templates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedTemplates = templates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <main className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 max-w-360">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white flex items-center gap-2 drop-shadow-lg">
                    <span className="text-purple-500"><Zap className="inline mb-1" size={24}
                                                           fill="currentColor"/></span> Gestion des Modèles
                </h3>

                <div className="flex items-center gap-4">
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                            >
                                <ChevronLeft size={20}/>
                            </button>
                            <span className="text-sm font-bold text-zinc-400">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg bg-zinc-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                            >
                                <ChevronRight size={20}/>
                            </button>
                        </div>
                    )}
                    <CreateTemplateModal onSuccess={loadTemplates}/>
                </div>
            </div>

            <TemplateList
                allTemplates={templates}
                displayedTemplates={displayedTemplates}
                onRefresh={loadTemplates}
            />
        </main>
    );
}
