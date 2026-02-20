'use client';

import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import React, {useCallback, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {LayoutGrid, Sparkles} from 'lucide-react';
import {
    ApiError,
    invocationService,
    Monster,
    monsterService,
    MonsterTemplate,
    Player,
    playerService
} from '@/lib/services';
import {LoadingPage, PlayerStats} from '@/components/ui';
import {InvocationTab} from '@/components/dashboard/InvocationTab';
import {CollectionTab} from '@/components/dashboard/CollectionTab';

export default function DashboardPage() {
    const {username, isAuthenticated, isLoading: authLoading} = useAuth();
    const router = useRouter();

    // États
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [templates, setTemplates] = useState<MonsterTemplate[]>([]);
    const [player, setPlayer] = useState<Player | null>(null);
    const [hasPendingInvocations, setHasPendingInvocations] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isRetrying, setIsRetrying] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'invocation' | 'collection'>('invocation');

    // Helper pour afficher les erreurs retournées par ApiClient (qui sont maintenant conviviales)
    const handleError = (err: unknown, fallbackMessage: string) => {
        console.error(fallbackMessage, err);
        if (err instanceof ApiError) {
            toast.error(err.message);
        } else if (err instanceof Error) {
            toast.error(err.message);
        } else {
            toast.error(fallbackMessage);
        }
    };

    // Chargement des données
    const loadData = useCallback(async () => {
        if (!username) return;

        try {
            setIsLoadingData(true);

            const [monstersData, playerData, historyData, templatesData] = await Promise.all([
                monsterService.getMyMonsters(),
                playerService.getPlayer(username),
                invocationService.getHistory(),
                invocationService.getTemplates(),
            ]);

            setMonsters(monstersData);
            setPlayer(playerData);
            setHasPendingInvocations(historyData.some(i => i.status !== 'COMPLETED'));
            setTemplates(templatesData);
        } catch (err) {
            handleError(err, 'Impossible de charger vos données.');
        } finally {
            setIsLoadingData(false);
        }
    }, [username]);

    // Effet de redirection si non authentifié
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Chargement initial des données
    useEffect(() => {
        if (isAuthenticated && username) {
            loadData();
        }
    }, [isAuthenticated, username, loadData]);

    // Invocation d'un monstre avec l'animation de booster
    const handleSummon = async (): Promise<Monster> => {
        const performInvocation = async () => {
            const invocation = await invocationService.invoke();

            if (!invocation.monsterId) {
                throw new Error('Problème lors de l\'invocation : aucun monstre reçu.');
            }
            return await monsterService.getMonster(invocation.monsterId);
        };

        try {
            return await performInvocation();
        } catch (err) {
            handleError(err, 'L\'invocation a échoué.');

            // Vérifier s'il y a des invocations en attente suite à l'échec
            try {
                const history = await invocationService.getHistory();
                setHasPendingInvocations(history.some(i => i.status !== 'COMPLETED'));
            } catch (e) {
                console.error("Erreur lors de la vérification de l'historique", e);
            }

            throw err;
        }
    };

    // Callback appelée quand l'utilisateur clique sur "Ajouter à la collection"
    const handleCollectionUpdate = async (monster: Monster) => {
        setMonsters(prev => [...prev, monster]);

        // Recharger les données du joueur
        if (username) {
            const updatedPlayer = await playerService.getPlayer(username);
            setPlayer(updatedPlayer);
        }
    };

    // Rejouer les invocations échouées
    const handleRetryInvocations = async () => {
        if (isRetrying) return;
        setIsRetrying(true);
        try {
            const retriedInvocations = await invocationService.retryFailed();

            // Toujours recharger les données pour mettre à jour l'état (monstres et pending status)
            await loadData();

            if (retriedInvocations.length > 0) {
                toast.success(`${retriedInvocations.length} invocations ont été traitées !`);
            } else {
                toast.error("Aucune invocation en attente n'a été trouvée.");
            }
        } catch (err) {
            handleError(err, 'Impossible de relancer les invocations.');
        } finally {
            setIsRetrying(false);
        }
    };

    // Amélioration d'une compétence
    const handleUpgradeSkill = async (monsterId: string, skillNum: number) => {
        try {
            const updatedMonster = await monsterService.upgradeSkill(monsterId, skillNum);
            setMonsters(prev =>
                prev.map(m => m.id === monsterId ? updatedMonster : m)
            );
        } catch (err) {
            handleError(err, 'Impossible d\'améliorer cette compétence.');
        }
    };

    // Suppression d'un monstre
    const handleDelete = async (monsterId: string) => {
        try {
            setDeletingId(monsterId);
            await monsterService.deleteMonster(monsterId);
            setMonsters(prev => prev.filter(m => m.id !== monsterId));

            // Recharger les données du joueur
            if (username) {
                const updatedPlayer = await playerService.getPlayer(username);
                setPlayer(updatedPlayer);
            }
        } catch (err) {
            handleError(err, 'Impossible de supprimer ce monstre.');
        } finally {
            setDeletingId(null);
        }
    };

    // États de chargement
    if (authLoading) {
        return <LoadingPage message="Vérification de l'authentification..."/>;
    }

    if (!isAuthenticated) {
        return null;
    }

    const canSummon = player && player.monsters.length < player.maxMonsters;

    return (

        <div className="mx-auto w-full max-w-[90rem] px-4 py-4 sm:px-6 lg:px-8 h-full flex flex-col overflow-hidden">

            {/* Stats du joueur */}
            <div className="mb-4 shrink-0 animate-fadeInUp">
                <PlayerStats player={player} monsters={monsters} isLoading={isLoadingData}/>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-4 gap-4 shrink-0 animate-fadeInUp" style={{animationDelay: '0.05s'}}>
                <button
                    onClick={() => setActiveTab('invocation')}
                    className={`
                        px-6 py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2
                        ${activeTab === 'invocation'
                        ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'}
                    `}
                >
                    <Sparkles size={20}/>
                    Invocation
                </button>
                <button
                    onClick={() => setActiveTab('collection')}
                    className={`
                        px-6 py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2
                        ${activeTab === 'collection'
                        ? 'bg-white text-black shadow-lg shadow-white/20 scale-105'
                        : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white'}
                    `}
                >
                    <LayoutGrid size={20}/>
                    Collection
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar animate-fadeInUp"
                 style={{animationDelay: '0.1s'}}>
                {activeTab === 'invocation' ? (
                    <InvocationTab
                        canSummon={!!canSummon}
                        hasPendingInvocations={hasPendingInvocations}
                        isRetrying={isRetrying}
                        player={player}
                        templates={templates}
                        onSummon={handleSummon}
                        onCollectionUpdate={handleCollectionUpdate}
                        onRetryInvocations={handleRetryInvocations}
                        onRefreshTemplates={loadData}
                    />
                ) : (
                    <CollectionTab
                        monsters={monsters}
                        player={player}
                        isLoading={isLoadingData}
                        deletingId={deletingId}
                        onUpgradeSkill={handleUpgradeSkill}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}
