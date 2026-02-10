'use client';

import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import toast from 'react-hot-toast';
import {ElementEnum, MonsterTemplate} from '@/lib/types';
import {invocationService} from '@/lib/services';

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
    lvlMax: 5
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

    // Dynamic skills configuration
    const [skills, setSkills] = useState([defaultSkill(1), defaultSkill(2)]);

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
                lvlMax: s.lvlMax
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
        const newSkills = [...skills];
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            (newSkills[index] as any)[parent][child] = value;
        } else {
            (newSkills[index] as any)[field] = value;
        }
        setSkills(newSkills);
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
                className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-bold text-white hover:bg-pink-700 transition-colors shadow-lg"
            >
                + Nouveau Template
            </button>
        );
    }

    if (!isOpen && template) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
            <div
                className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-purple-500/30 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {template ? `Modifier Monstre #${template.id}` : 'Créer un Nouveau Monstre'}
                    </h2>
                    <button onClick={handleClose} className="text-zinc-400 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">Élément</label>
                            <select
                                value={element}
                                onChange={(e) => setElement(e.target.value as ElementEnum)}
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white p-2 focus:border-purple-500 focus:outline-hidden"
                            >
                                <option value={ElementEnum.fire}>Feu 🔥</option>
                                <option value={ElementEnum.water}>Eau 💧</option>
                                <option value={ElementEnum.wind}>Vent 🌪️</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">Taux de drop (Poids)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={lootRate}
                                onChange={(e) => setLootRate(Number(e.target.value))}
                                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 text-white p-2 focus:border-purple-500 focus:outline-hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-purple-500/30 pb-1">Statistiques
                            de Base</h3>
                        <div className="grid grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">HP ❤️</label>
                                <input type="number" value={hp} onChange={(e) => setHp(Number(e.target.value))}
                                       className="w-full rounded bg-zinc-800 border border-zinc-700 text-white p-2"/>
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">ATK ⚔️</label>
                                <input type="number" value={atk} onChange={(e) => setAtk(Number(e.target.value))}
                                       className="w-full rounded bg-zinc-800 border border-zinc-700 text-white p-2"/>
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">DEF 🛡️</label>
                                <input type="number" value={def} onChange={(e) => setDef(Number(e.target.value))}
                                       className="w-full rounded bg-zinc-800 border border-zinc-700 text-white p-2"/>
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">VIT ⚡</label>
                                <input type="number" value={vit} onChange={(e) => setVit(Number(e.target.value))}
                                       className="w-full rounded bg-zinc-800 border border-zinc-700 text-white p-2"/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-3 border-b border-purple-500/30 pb-1">
                            <h3 className="text-lg font-semibold text-purple-300">Compétences</h3>
                            <button
                                type="button"
                                onClick={addSkill}
                                className="text-xs bg-purple-600/50 hover:bg-purple-600 text-white px-2 py-1 rounded transition-colors"
                            >
                                + Ajouter Skill
                            </button>
                        </div>
                        <div className="space-y-4">
                            {skills.map((skill, index) => (
                                <div key={index}
                                     className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 relative">
                                    <div className="absolute top-2 right-2">
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="text-zinc-500 hover:text-red-400"
                                            title="Supprimer la compétence"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <h4 className="text-zinc-200 font-medium mb-3">Compétence #{index + 1}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1">Dégâts Base</label>
                                            <input type="number" value={skill.dmg}
                                                   onChange={(e) => updateSkill(index, 'dmg', Number(e.target.value))}
                                                   className="w-full rounded bg-zinc-900 border border-zinc-700 text-white p-1"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1">Cooldown</label>
                                            <input type="number" value={skill.cooldown}
                                                   onChange={(e) => updateSkill(index, 'cooldown', Number(e.target.value))}
                                                   className="w-full rounded bg-zinc-900 border border-zinc-700 text-white p-1"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1">Max Level</label>
                                            <input type="number" value={skill.lvlMax}
                                                   onChange={(e) => updateSkill(index, 'lvlMax', Number(e.target.value))}
                                                   className="w-full rounded bg-zinc-900 border border-zinc-700 text-white p-1"/>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1">Stat Ratio</label>
                                            <select value={skill.ratio.stat}
                                                    onChange={(e) => updateSkill(index, 'ratio.stat', e.target.value)}
                                                    className="w-full rounded bg-zinc-900 border border-zinc-700 text-white p-1">
                                                <option value="ATK">ATK</option>
                                                <option value="DEF">DEF</option>
                                                <option value="VIT">VIT</option>
                                                <option value="HP">HP</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-zinc-500 mb-1">% Ratio</label>
                                            <input type="number" step="0.1" value={skill.ratio.percent}
                                                   onChange={(e) => updateSkill(index, 'ratio.percent', Number(e.target.value))}
                                                   className="w-full rounded bg-zinc-900 border border-zinc-700 text-white p-1"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors shadow-lg disabled:opacity-50"
                        >
                            {isSubmitting ? 'Enregistrement...' : (template ? 'Mettre à jour' : 'Créer le Template')}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
