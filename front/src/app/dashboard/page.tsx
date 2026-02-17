'use client';

import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {ApiError, invocationService, Monster, monsterService, Player, playerService} from '@/lib/services';
import {LoadingPage, PlayerStats} from '@/components/ui';
import {MonsterGrid} from '@/components/monsters';
import {BoosterPack} from '@/components/BoosterPack';

export default function DashboardPage() {
    const {username, isAuthenticated, isLoading: authLoading} = useAuth();
    const router = useRouter();

    // États
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [player, setPlayer] = useState<Player | null>(null);
    const [hasPendingInvocations, setHasPendingInvocations] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isRetrying, setIsRetrying] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Helper pour afficher les erreurs retournées par ApiClient (qui sont maintenant conviviales)
    const handleError = (err: unknown, fallbackMessage: string) => {
        console.error(fallbackMessage, err);
        if (err instanceof ApiError) {
            setError(err.message);
        } else if (err instanceof Error) {
            setError(err.message);
        } else {
            setError(fallbackMessage);
        }
    };

    // Générer les particules une seule fois
    const particles = useMemo(() => {
        return Array.from({length: 30}, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
        }));
    }, []);

    // Chargement des données
    const loadData = useCallback(async () => {
        if (!username) return;

        try {
            setIsLoadingData(true);
            setError(null);

            const [monstersData, playerData, historyData] = await Promise.all([
                monsterService.getMyMonsters(),
                playerService.getPlayer(username),
                invocationService.getHistory(),
            ]);

            setMonsters(monstersData);
            setPlayer(playerData);
            setHasPendingInvocations(historyData.some(i => i.status !== 'COMPLETED'));
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
        try {
            setError(null);
            const invocation = await invocationService.invoke();

            if (invocation.monsterId) {
                return await monsterService.getMonster(invocation.monsterId);
            }
            throw new Error('Problème lors de l\'invocation : aucun monstre reçu.');
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
            setError(null);
            const retriedInvocations = await invocationService.retryFailed();

            // Toujours recharger les données pour mettre à jour l'état (monstres et pending status)
            await loadData();

            if (retriedInvocations.length > 0) {
                alert(`${retriedInvocations.length} invocations ont été traitées !`);
            } else {
                alert("Aucune invocation en attente n'a été trouvée.");
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
            setError(null);
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
            setError(null);
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
        <div className="min-h-screen bg-linear-to-br from-zinc-900 via-purple-900/20 to-zinc-900">
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Message d'erreur */}
                {error && (
                    <div
                        className="mb-6 rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-red-300 backdrop-blur-sm animate-shake">
                        <div className="flex items-center justify-between">
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="ml-4 rounded-lg bg-red-500/20 px-3 py-1 text-sm font-medium hover:bg-red-500/30 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats du joueur */}
                <div className="mb-8 animate-fadeInUp">
                    <PlayerStats player={player} monsters={monsters} isLoading={isLoadingData}/>
                </div>

                {/* Section Invocation avec Booster Pack */}
                <div
                    className="relative mb-12 overflow-hidden rounded-3xl bg-linear-to-br from-purple-900/40 via-pink-900/30 to-purple-900/40 p-12 shadow-2xl backdrop-blur-sm border border-purple-500/20 animate-fadeInUp min-h-150 flex flex-col justify-center"
                    style={{animationDelay: '0.1s'}}>
                    {/* Effet de particules d'arrière-plan */}
                    <div className="absolute inset-0 opacity-20">
                        {particles.map((particle, i) => (
                            <div
                                key={i}
                                className="absolute h-1 w-1 rounded-full bg-purple-400 animate-float"
                                style={{
                                    left: `${particle.left}%`,
                                    top: `${particle.top}%`,
                                    animationDelay: `${particle.delay}s`,
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10">
                        <div className="mb-8 text-center">
                            <h2 className="mb-3 text-4xl font-black text-white drop-shadow-lg">
                                🎴 Portail d&#39;Invocation de Monstres
                            </h2>
                            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                                Cliquez sur le pack booster pour invoquer une créature puissante !
                            </p>
                        </div>

                        {/* Booster Pack Component */}
                        <div className="flex justify-center mb-8">
                            <BoosterPack
                                onOpen={handleSummon}
                                onAdd={handleCollectionUpdate}
                                disabled={!canSummon || hasPendingInvocations}
                            />
                        </div>

                        {/* Statistiques et avertissements */}
                        <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
                            {/* Bouton pour réessayer les invocations échouées */}
                            {hasPendingInvocations && (
                                <div
                                    className="w-full rounded-xl bg-purple-500/20 border border-purple-500/40 px-6 py-4 backdrop-blur-sm animate-pulse flex items-center justify-between gap-4">
                                    <p className="text-sm font-bold text-purple-300 flex items-center gap-3">
                                        <span className="text-2xl">🔄</span>
                                        <span>Des invocations incomplètes ont été détectées.</span>
                                    </p>
                                    <button
                                        onClick={handleRetryInvocations}
                                        disabled={isRetrying}
                                        className={`shrink-0 rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white transition-colors shadow-lg hover:shadow-purple-500/20 ${
                                            isRetrying ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
                                        }`}
                                    >
                                        {isRetrying ? 'Traitement...' : 'Récupérer'}
                                    </button>
                                </div>
                            )}

                            {/* Avertissement si inventaire plein */}
                            {!canSummon && player && (
                                <div
                                    className="rounded-xl bg-orange-500/20 border border-orange-500/40 px-8 py-4 backdrop-blur-sm animate-pulse">
                                    <p className="text-sm font-bold text-orange-300 flex items-center gap-3">
                                        <span className="text-2xl">⚠️</span>
                                        <span>L&#39;inventaire de monstres est plein ({player.monsters.length}/{player.maxMonsters}) ! Libérez un monstre pour en invoquer d&#39;autres.</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Collection de monstres */}
                <div className="animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 p-4 shadow-xl">
                                <span className="text-3xl">👾</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white drop-shadow-lg">
                                    Votre Collection
                                </h2>
                                <p className="text-sm text-purple-300">
                                    {monsters.length} {monsters.length === 1 ? 'monstre' : 'monstres'} dans votre équipe
                                </p>
                            </div>
                        </div>

                        {player && (
                            <div
                                className="rounded-xl bg-purple-500/20 border border-purple-500/30 px-6 py-3 text-sm font-bold text-purple-200 backdrop-blur-sm">
                                {player.monsters.length} / {player.maxMonsters}
                            </div>
                        )}
                    </div>

                    {isLoadingData ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-64 animate-pulse rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                                />
                            ))}
                        </div>
                    ) : monsters.length > 0 ? (
                        <MonsterGrid
                            monsters={monsters}
                            onUpgradeSkill={handleUpgradeSkill}
                            onDelete={handleDelete}
                            deletingId={deletingId}
                        />
                    ) : (
                        <div
                            className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-16 text-center">
                            <div className="mb-4 text-6xl opacity-50">👻</div>
                            <h3 className="mb-2 text-xl font-bold text-white">Aucun monstre pour le moment</h3>
                            <p className="text-zinc-400">
                                Ouvrez votre premier pack booster pour commencer votre collection !
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
