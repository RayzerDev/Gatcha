'use client';

import {useState, useMemo} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/contexts/AuthContext';
import {authService, ApiError} from '@/lib/services';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const {login: loginContext} = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Générer les particules une seule fois
    const particles = useMemo(() => {
        return Array.from({ length: 50 }, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 3 + Math.random() * 4,
        }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authService.login({username, password});
            await loginContext(response.token);
            toast.success('Bon retour !');
            router.push('/dashboard');
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.error(err.message);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('Échec de la connexion');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-purple-900 via-indigo-900 to-pink-900">
            {/* Animated background particles */}
            <div className="absolute inset-0">
                {particles.map((particle, i) => (
                    <div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-white/30 animate-float"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                        }}
                    />
                ))}
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />

            <div className="relative z-10 w-full max-w-md px-6 animate-fadeInUp">
                {/* Logo/Title */}
                <div className="mb-8 text-center">
                    <div className="mb-4 inline-block rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 p-4 shadow-2xl">
                        <span className="text-6xl">🎴</span>
                    </div>
                    <h1 className="mb-2 text-5xl font-black text-white drop-shadow-lg">
                        GATCHA
                    </h1>
                    <p className="text-purple-200">Collecte, Combat, Conquête</p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20">
                    <h2 className="mb-6 text-center text-2xl font-bold text-white">
                        Bon Retour
                    </h2>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-white/90 mb-2">
                                Nom d'utilisateur
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                                placeholder="Entrez votre nom d'utilisateur"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 backdrop-blur-sm transition-all focus:border-purple-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                                placeholder="Entrez votre mot de passe"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3.5 text-base font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10">
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Connexion...
                                    </span>
                                ) : (
                                    'Se Connecter'
                                )}
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-purple-700 to-pink-700 opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-white/70">
                            Pas encore de compte ?{' '}
                            <a
                                href="/register"
                                className="font-bold text-purple-300 transition-colors hover:text-purple-200"
                            >
                                Créez-en un maintenant
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-white/50">
                        Invoquez des monstres puissants et dominez l'arène
                    </p>
                </div>
            </div>
        </div>
    );
}
