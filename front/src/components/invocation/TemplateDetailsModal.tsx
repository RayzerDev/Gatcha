import {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {ElementEnum, MonsterTemplate} from '@/lib/types';
import {Clock, Droplets, Flame, Heart, Shield, Sword, Wind, X, Zap} from 'lucide-react';

interface TemplateDetailsModalProps {
    template: MonsterTemplate;
    onClose: () => void;
}

const elementIcons = {
    [ElementEnum.fire]: <Flame size={20} className="text-orange-500"/>,
    [ElementEnum.water]: <Droplets size={20} className="text-blue-500"/>,
    [ElementEnum.wind]: <Wind size={20} className="text-green-500"/>,
};

export function TemplateDetailsModal({template, onClose}: TemplateDetailsModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div
                className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">

                <div className={`p-6 bg-linear-to-r relative overflow-hidden flex items-start justify-between ${
                    template.element === 'fire' ? 'from-orange-900/50 to-red-900/50' :
                        template.element === 'water' ? 'from-blue-900/50 to-cyan-900/50' :
                            'from-green-900/50 to-emerald-900/50'
                }`}>
                    <div className="flex items-center gap-4 relative z-10">
                        <div
                            className={`p-4 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 shadow-xl ${
                                template.element === 'fire' ? 'text-orange-400' :
                                    template.element === 'water' ? 'text-blue-400' :
                                        'text-green-400'
                            }`}>
                            {elementIcons[template.element]}
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white drop-shadow-lg tracking-tight">
                                Monstre #{template.id}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-white border border-white/10">
                                    TEMPLATE
                                </span>
                                <span
                                    className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/20">
                                    Drop Rate: {template.lootRate}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="relative z-10 p-2 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all backdrop-blur-sm border border-white/5 hover:border-white/20"
                    >
                        <X size={24}/>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div
                            className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 hover:bg-zinc-800 transition-colors">
                            <div className="flex items-center gap-2 text-zinc-400 mb-1 text-sm font-bold uppercase">
                                <Heart className="text-red-500" size={16}/> PV
                            </div>
                            <span className="text-2xl font-black text-white">{template.hp}</span>
                        </div>
                        <div
                            className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 hover:bg-zinc-800 transition-colors">
                            <div className="flex items-center gap-2 text-zinc-400 mb-1 text-sm font-bold uppercase">
                                <Sword className="text-orange-500" size={16}/> ATK
                            </div>
                            <span className="text-2xl font-black text-white">{template.atk}</span>
                        </div>
                        <div
                            className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 hover:bg-zinc-800 transition-colors">
                            <div className="flex items-center gap-2 text-zinc-400 mb-1 text-sm font-bold uppercase">
                                <Shield className="text-blue-500" size={16}/> DEF
                            </div>
                            <span className="text-2xl font-black text-white">{template.def}</span>
                        </div>
                        <div
                            className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50 hover:bg-zinc-800 transition-colors">
                            <div className="flex items-center gap-2 text-zinc-400 mb-1 text-sm font-bold uppercase">
                                <Zap className="text-yellow-500" size={16}/> VIT
                            </div>
                            <span className="text-2xl font-black text-white">{template.vit}</span>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Zap size={20} className="text-purple-400"/>
                            Compétences
                        </h4>
                        <div className="space-y-4">
                            {template.skills.map((skill) => (
                                <div key={skill.num}
                                     className="bg-zinc-800/60 p-5 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 font-bold text-zinc-400 border border-zinc-700">
                                                {skill.num}
                                            </span>
                                            <span
                                                className="font-bold text-lg text-zinc-200">Compétence #{skill.num}</span>
                                        </div>
                                        <span
                                            className="text-xs font-bold bg-zinc-700/50 px-3 py-1.5 rounded-full text-zinc-300 border border-zinc-600">
                                            Max Lvl {skill.lvlMax}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
                                            <div className="text-xs text-zinc-500 mb-1 uppercase font-bold">Dégâts
                                                Base
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Sword size={16} className="text-orange-400"/>
                                                <span className="text-lg font-bold text-white">{skill.dmg}</span>
                                            </div>
                                        </div>

                                        <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
                                            <div className="text-xs text-zinc-500 mb-1 uppercase font-bold">Cooldown
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-blue-400"/>
                                                <span className="text-lg font-bold text-white">{skill.cooldown}s</span>
                                            </div>
                                        </div>

                                        <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800">
                                            <div className="text-xs text-zinc-500 mb-1 uppercase font-bold">Scaling
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-purple-400 font-black text-lg">
                                                    {skill.ratio.percent * 100}%
                                                </span>
                                                <span
                                                    className="text-sm font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                                                    {skill.ratio.stat}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

