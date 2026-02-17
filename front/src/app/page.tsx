'use client';

import {useAuth} from '@/contexts/AuthContext';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {Sparkles} from 'lucide-react';

export default function Home() {
    const {isAuthenticated, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-900 via-zinc-900 to-pink-900">
            <div className="text-center">
                {/* Logo animé */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/50 blur-xl"></div>
                    <div
                        className="relative flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-pink-600 shadow-2xl mx-auto">
                        <Sparkles size={64} className="text-white animate-[float_2s_ease-in-out_infinite]"/>
                    </div>
                </div>

                {/* Titre */}
                <h1 className="mb-4 text-4xl font-bold text-white animate-[fadeInUp_0.5s_ease-out]">
                    Gatcha
                </h1>

                {/* Sous-titre */}
                <p className="mb-8 text-lg text-zinc-300 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
                    Invoquez • Collectionnez • Combattez
                </p>

                {/* Spinner de chargement */}
                <div className="flex justify-center gap-2 animate-[fadeInUp_0.5s_ease-out_0.4s_both]">
                    <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500"
                         style={{animationDelay: '0s'}}></div>
                    <div className="h-3 w-3 animate-bounce rounded-full bg-pink-500"
                         style={{animationDelay: '0.1s'}}></div>
                    <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500"
                         style={{animationDelay: '0.2s'}}></div>
                </div>

                <p className="mt-6 text-sm text-zinc-400 animate-[fadeInUp_0.5s_ease-out_0.6s_both]">
                    Chargement de votre aventure...
                </p>
            </div>
        </div>
    );
}
