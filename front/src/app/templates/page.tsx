'use client';

import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useState} from 'react';
import {invocationService, MonsterTemplate} from '@/lib/services';
import {LoadingPage, Navbar} from '@/components/ui';
import {TemplateList} from '@/components/invocation/TemplateList';
import toast from 'react-hot-toast';

export default function TemplatesPage() {
    const {username, isAuthenticated, isLoading: authLoading, logout} = useAuth();
    const router = useRouter();

    const [templates, setTemplates] = useState<MonsterTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            <Navbar username={username} onLogout={logout}/>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Gestion des Templates</h1>
                    <p className="text-zinc-400">Ajoutez et visualisez les modèles de monstres disponibles pour
                        l'invocation.</p>
                </div>

                <TemplateList templates={templates} onRefresh={loadTemplates}/>
            </main>
        </div>
    );
}
