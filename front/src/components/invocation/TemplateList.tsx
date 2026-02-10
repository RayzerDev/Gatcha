'use client';

import {ElementEnum, MonsterTemplate} from '@/lib/types';
import {CreateTemplateModal} from '@/components/admin/CreateTemplateModal';
import {useState} from 'react';

interface TemplateListProps {
    templates: MonsterTemplate[];
    onRefresh: () => void;
    readOnly?: boolean;
}

const elementIcons = {
    [ElementEnum.fire]: '🔥',
    [ElementEnum.water]: '💧',
    [ElementEnum.wind]: '🌪️',
};

export function TemplateList({templates, onRefresh, readOnly = false}: TemplateListProps) {
    const totalRate = templates.reduce((acc, t) => acc + t.lootRate, 0);

    return (
        <div
            className={`w-full mt-8 rounded-2xl bg-zinc-900/80 border border-purple-500/20 p-6 backdrop-blur-md ${readOnly ? 'max-w-2xl mx-auto' : ''}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    📊 Taux d&#39;invocation
                </h3>
                {!readOnly && <CreateTemplateModal onSuccess={onRefresh}/>}
            </div>

            <div className={`space-y-2 overflow-y-auto pr-2 custom-scrollbar ${readOnly ? 'max-h-[60vh]' : ''}`}>
                {templates.length === 0 ? (
                    <p className="text-zinc-500 text-sm text-center py-4">Aucun template disponible</p>
                ) : (
                    templates.map((template) => {
                        const percent = totalRate > 0 ? ((template.lootRate / totalRate) * 100).toFixed(1) : '0';
                        return (
                            <div key={template.id}
                                 className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="text-2xl p-2 rounded-lg bg-zinc-900/50">{elementIcons[template.element]}</span>
                                    <div>
                                        <p className="font-bold text-zinc-200">Monstre #{template.id}</p>
                                        <div className="text-xs text-zinc-400 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                                            <span className="flex items-center gap-1"><span
                                                className="text-red-400">❤️</span> {template.hp}</span>
                                            <span className="flex items-center gap-1"><span
                                                className="text-orange-400">⚔️</span> {template.atk}</span>
                                            <span className="flex items-center gap-1"><span
                                                className="text-blue-400">🛡️</span> {template.def}</span>
                                            <span className="flex items-center gap-1"><span
                                                className="text-green-400">⚡</span> {template.vit}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="block text-lg font-black text-purple-400">{percent}%</span>
                                        <span className="text-xs text-zinc-500">Poids: {template.lootRate}</span>
                                    </div>
                                    {!readOnly && (
                                        <EditButton template={template} onSuccess={onRefresh} />
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function EditButton({ template, onSuccess }: { template: MonsterTemplate; onSuccess: () => void }) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return <CreateTemplateModal template={template} onSuccess={onSuccess} onClose={() => setIsEditing(false)} />;
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-700 transition-colors"
            title="Modifier"
        >
            ✎
        </button>
    );
}
