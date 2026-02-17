'use client';

import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import toast from 'react-hot-toast';
import {ElementEnum, MonsterTemplate} from '@/lib/types';
import {invocationService} from '@/lib/services';
import {
    ArrowUpCircle,
    Clock,
    Dna,
    Droplets,
    Flame,
    Heart,
    Percent,
    Plus,
    Save,
    Shield,
    Sword,
    Trash2,
    Wind,
    X,
    Zap
} from 'lucide-react';

interface CreateTemplateModalProps {
    template?: MonsterTemplate;
    onSuccess?: () => void;
    onClose?: () => void;
}

const defaultSkill = (num: number) => ({
    num,
    dmg: 10,
    ratio: {stat: 'ATK', percent: 0.5},
    cooldown: 3,
    lvlMax: 5,
    lvl: 1
});

export function CreateTemplateModal({template, onSuccess, onClose}: CreateTemplateModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [element, setElement] = useState<ElementEnum>(ElementEnum.fire);
    const [lootRate, setLootRate] = useState(10);
    const [hp, setHp] = useState(100);
    const [atk, setAtk] = useState(10);
    const [def, setDef] = useState(10);
    const [vit, setVit] = useState(10);
    const [mounted, setMounted] = useState(false);

    // Dynamic skills configuration
    const [skills, setSkills] = useState([defaultSkill(1), defaultSkill(2)]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Initialize form when template is provided or modal opens
    useEffect(() => {
        if (template) {
            setElement(template.element);
            setLootRate(template.lootRate);
            setHp(template.hp);
            setAtk(template.atk);
            setDef(template.def);
            setVit(template.vit);
            setSkills(template.skills.map(s => ({
                num: s.num,
                dmg: s.dmg,
                ratio: s.ratio,
                cooldown: s.cooldown,
                lvlMax: s.lvlMax,
                lvl: s.lvl
            })));
            setIsOpen(true);
        }
    }, [template]);

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    const addSkill = () => {
        setSkills([...skills, defaultSkill(skills.length + 1)]);
    };

    const removeSkill = (index: number) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const updateSkill = (index: number, field: string, value: string | number) => {
        setSkills(prevSkills => {
            const newSkills = [...prevSkills];
            const skill = {...newSkills[index]};

            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                if (parent === 'ratio') {
                    skill.ratio = {
                        ...skill.ratio,
                        [child]: value
                    };
                }
                (skill as any)[field] = value;
            }

            newSkills[index] = skill;
            return newSkills;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const data: MonsterTemplate = {
                id: template?.id || 0, // 0 for new
                element,
                lootRate,
                hp,
                atk,
                def,
                vit,
                skills: skills.map((s, idx) => ({
                    ...s,
                    num: idx + 1, // Ensure sequential numbering
                    lvlMax: Number(s.lvlMax),
                    dmg: Number(s.dmg),
                    cooldown: Number(s.cooldown),
                    ratio: {
                        ...s.ratio,
                        percent: Number(s.ratio.percent)
                    }
                }))
            };

            if (template) {
                await invocationService.updateTemplate(template.id, data);
                toast.success('Template mis à jour avec succès !');
            } else {
                await invocationService.createTemplate(data);
                toast.success('Template créé avec succès !');
            }

            handleClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de l'enregistrement du template.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // If controlled by parent (template prop provided), always render if isOpen is true
    // If used as trigger button (no template prop), render trigger button
    if (!isOpen && !template) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-bold text-white hover:bg-pink-700 transition-colors shadow-lg group"
            >
                <Plus size={16} className="group-hover:rotate-90 transition-transform"/>
                Nouveau Template
            </button>
        );
    }

    if (!isOpen && template) return null;

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div
                    className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Dna className="text-pink-500" size={28}/>
                        {template ? `Modifier Monstre #${template.id}` : 'Créer un Nouveau Monstre'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        <X size={24}/>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <form id="templateForm" onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: Informations Générales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-300">Élément</label>
                                <div className="relative">
                                    <select
                                        value={element}
                                        onChange={(e) => setElement(e.target.value as ElementEnum)}
                                        className="w-full appearance-none rounded-xl bg-zinc-800 border border-zinc-700 text-white p-3 pr-10 focus:border-purple-500 focus:outline-hidden focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                                    >
                                        <option value={ElementEnum.fire}>Feu</option>
                                        <option value={ElementEnum.water}>Eau</option>
                                        <option value={ElementEnum.wind}>Vent</option>
                                    </select>
                                    <div
                                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                                        {element === ElementEnum.fire && <Flame size={18} className="text-orange-500"/>}
                                        {element === ElementEnum.water &&
                                            <Droplets size={18} className="text-blue-500"/>}
                                        {element === ElementEnum.wind && <Wind size={18} className="text-green-500"/>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-300">Taux de drop (Poids)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={lootRate}
                                        onChange={(e) => setLootRate(Number(e.target.value))}
                                        className="w-full rounded-xl bg-zinc-800 border border-zinc-700 text-white p-3 pl-10 focus:border-purple-500 focus:outline-hidden focus:ring-1 focus:ring-purple-500 transition-all"
                                    />
                                    <Percent size={18}
                                             className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Statistiques de Base */}
                        <div className="bg-zinc-800/30 p-5 rounded-2xl border border-zinc-700/50">
                            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                                <ArrowUpCircle size={20}/>
                                Statistiques de Base
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                    <label
                                        className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                                        <Heart size={14} className="text-red-500"/> HP
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={hp}
                                        onChange={(e) => setHp(Number(e.target.value))}
                                        className="w-full bg-transparent border-none text-white p-0 text-xl font-bold focus:ring-0 placeholder-zinc-700"
                                    />
                                </div>
                                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                    <label
                                        className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                                        <Sword size={14} className="text-orange-500"/> ATK
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={atk}
                                        onChange={(e) => setAtk(Number(e.target.value))}
                                        className="w-full bg-transparent border-none text-white p-0 text-xl font-bold focus:ring-0 placeholder-zinc-700"
                                    />
                                </div>
                                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                    <label
                                        className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                                        <Shield size={14} className="text-blue-500"/> DEF
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={def}
                                        onChange={(e) => setDef(Number(e.target.value))}
                                        className="w-full bg-transparent border-none text-white p-0 text-xl font-bold focus:ring-0 placeholder-zinc-700"
                                    />
                                </div>
                                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                    <label
                                        className="flex items-center gap-2 text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                                        <Zap size={14} className="text-yellow-500"/> VIT
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={vit}
                                        onChange={(e) => setVit(Number(e.target.value))}
                                        className="w-full bg-transparent border-none text-white p-0 text-xl font-bold focus:ring-0 placeholder-zinc-700"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Compétences */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
                                    <Zap size={20}/>
                                    Compétences
                                </h3>
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="flex items-center gap-1 text-xs font-bold bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white px-3 py-1.5 rounded-lg transition-all border border-purple-500/30 hover:border-purple-500"
                                >
                                    <Plus size={14}/>
                                    Ajouter Skill
                                </button>
                            </div>

                            <div className="space-y-4">
                                {skills.map((skill, index) => (
                                    <div key={index}
                                         className="bg-zinc-800/40 p-5 rounded-2xl border border-zinc-700 group hover:border-zinc-600 transition-colors relative">
                                        <div
                                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(index)}
                                                className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Supprimer la compétence"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>

                                        <div className="mb-4 flex items-center gap-3">
                                            <span
                                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 text-sm font-bold text-zinc-400">
                                                {index + 1}
                                            </span>
                                            <h4 className="text-zinc-200 font-medium">Configuration de la
                                                compétence</h4>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <Sword size={12}/> Dégâts Base
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={skill.dmg}
                                                    onChange={(e) => updateSkill(index, 'dmg', Number(e.target.value))}
                                                    className="w-full rounded-lg bg-zinc-900 border border-zinc-700 text-white p-2 text-sm focus:border-purple-500 focus:outline-hidden"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <Clock size={12}/> Cooldown (s)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    value={skill.cooldown}
                                                    onChange={(e) => updateSkill(index, 'cooldown', Number(e.target.value))}
                                                    className="w-full rounded-lg bg-zinc-900 border border-zinc-700 text-white p-2 text-sm focus:border-purple-500 focus:outline-hidden"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-zinc-500 flex items-center gap-1">
                                                    <ArrowUpCircle size={12}/> Level Max
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={skill.lvlMax}
                                                    onChange={(e) => updateSkill(index, 'lvlMax', Number(e.target.value))}
                                                    className="w-full rounded-lg bg-zinc-900 border border-zinc-700 text-white p-2 text-sm focus:border-purple-500 focus:outline-hidden"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800">
                                            <label
                                                className="text-xs font-bold text-purple-400 mb-2 block uppercase tracking-wide">Scaling
                                                (Ratio)</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <select
                                                        value={skill.ratio.stat}
                                                        onChange={(e) => updateSkill(index, 'ratio.stat', e.target.value)}
                                                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white p-2 text-sm focus:border-purple-500 focus:outline-hidden"
                                                    >
                                                        <option value="ATK">Attack (ATK)</option>
                                                        <option value="DEF">Defense (DEF)</option>
                                                        <option value="VIT">Vitesse (VIT)</option>
                                                        <option value="HP">Points de vie (HP)</option>
                                                    </select>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={skill.ratio.percent}
                                                        onChange={(e) => updateSkill(index, 'ratio.percent', Number(e.target.value))}
                                                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white p-2 pr-8 text-sm focus:border-purple-500 focus:outline-hidden"
                                                    />
                                                    <span
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-900 sticky bottom-0 z-10 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-medium border border-transparent hover:border-zinc-700"
                    >
                        Annuler
                    </button>
                    <button
                        form="templateForm"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                    >
                        {isSubmitting ? (
                            <>
                                <div
                                    className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <Save size={18}/>
                                {template ? 'Mettre à jour' : 'Créer le Template'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
