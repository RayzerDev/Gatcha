'use client';

import {Monster} from '@/lib/services';
import {ArrowUp, Clock, Droplets, Flame, Heart, Shield, Sparkles, Sword, Trash2, Wind, Zap} from 'lucide-react';

interface MonsterCardProps {
    monster: Monster;
    onUpgradeSkill?: (skillNum: number) => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

const elementConfig = {
    fire: {
        gradient: 'from-orange-600 to-red-600',
        bg: 'bg-orange-950/30',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        icon: <Flame size={20} className="text-orange-400"/>
    },
    water: {
        gradient: 'from-blue-600 to-cyan-600',
        bg: 'bg-blue-950/30',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        icon: <Droplets size={20} className="text-blue-400"/>
    },
    wind: {
        gradient: 'from-green-600 to-emerald-600',
        bg: 'bg-green-950/30',
        border: 'border-green-500/30',
        text: 'text-green-400',
        icon: <Wind size={20} className="text-green-400"/>
    },
};

export function MonsterCard({monster, onUpgradeSkill, onDelete, isDeleting}: MonsterCardProps) {
    const expPercent = Math.min(100, Math.max(0, (monster.experience / monster.experienceToNextLevel) * 100));
    const config = elementConfig[monster.element as keyof typeof elementConfig] || elementConfig.fire;

    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-zinc-900 border ${config.border} shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 hover:border-opacity-50 group`}>

            {/* Background Glow */}
            <div
                className={`absolute -right-10 -top-10 w-40 h-40 bg-linear-to-br ${config.gradient} opacity-20 blur-3xl rounded-full group-hover:opacity-30 transition-opacity`}/>

            {/* Header */}
            <div className="relative p-5 pb-0">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/40 border border-white/10 text-zinc-400`}>
                                #{monster.templateId}
                            </span>
                            <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
                                {monster.element}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white leading-none tracking-tight">
                            MONSTRE #{monster.templateId}
                        </h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <div
                            className={`w-10 h-10 rounded-xl bg-linear-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-black text-lg">{monster.level}</span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 mt-1 uppercase">Level</span>
                    </div>
                </div>

                {/* XP Bar */}
                <div className="mt-4 relative">
                    <div
                        className="flex justify-between text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wide">
                        <span>Experience</span>
                        <span>{Math.floor(monster.experience)} / {Math.floor(monster.experienceToNextLevel)} XP</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={`h-full bg-linear-to-r ${config.gradient} transition-all duration-500 ease-out`}
                            style={{width: `${expPercent}%`}}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="p-5 grid grid-cols-2 gap-3">
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-900/20 text-red-500">
                        <Heart size={16}/>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Health</div>
                        <div className="text-lg font-black text-white leading-none">{monster.hp}</div>
                    </div>
                </div>
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-900/20 text-orange-500">
                        <Sword size={16}/>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Attack</div>
                        <div className="text-lg font-black text-white leading-none">{monster.atk}</div>
                    </div>
                </div>
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-900/20 text-blue-500">
                        <Shield size={16}/>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Defense</div>
                        <div className="text-lg font-black text-white leading-none">{monster.def}</div>
                    </div>
                </div>
                <div className="bg-zinc-950/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-900/20 text-yellow-500">
                        <Zap size={16}/>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase">Speed</div>
                        <div className="text-lg font-black text-white leading-none">{monster.vit}</div>
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="px-5 pb-5">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={12} className={config.text}/>
                        Compétences
                    </h4>
                    {monster.skillPoints > 0 && (
                        <span
                            className="text-[10px] font-bold bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30 animate-pulse">
                            {monster.skillPoints} PTS DISPO
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    {monster.skills.map((skill) => (
                        <div key={skill.num}
                             className="bg-zinc-800/50 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-white">Skill #{skill.num}</span>
                                <div className="text-[10px] font-bold text-zinc-500 bg-black/30 px-1.5 py-0.5 rounded">
                                    LVL {skill.lvl}/{skill.lvlMax}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-zinc-400 mb-2">
                                <span className="flex items-center gap-1"><Sword size={10}/> {skill.dmg}</span>
                                <span className="flex items-center gap-1"><Clock size={10}/> {skill.cooldown}s</span>
                                <span
                                    className="text-purple-400 font-bold">{skill.ratio.percent}% {skill.ratio.stat}</span>
                            </div>

                            {onUpgradeSkill && monster.skillPoints > 0 && skill.lvl < skill.lvlMax && (
                                <button
                                    onClick={() => onUpgradeSkill(skill.num)}
                                    className="w-full mt-1 flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-xs font-bold text-white py-1.5 rounded transition-colors border border-white/10"
                                >
                                    <ArrowUp size={12} className="text-yellow-400"/>
                                    UPGRADE
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {onDelete && (
                    <button
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/delete"
                    >
                        <Trash2 size={16} className="group-hover/delete:animate-bounce"/>
                        {isDeleting ? 'Suppression...' : 'Libérer le Monstre'}
                    </button>
                )}
            </div>
        </div>
    );
}
