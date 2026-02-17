'use client';

import {ElementEnum, MonsterTemplate} from '@/lib/types';
import {CreateTemplateModal} from '@/components/admin/CreateTemplateModal';
import {useState} from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Droplets,
    Edit,
    Eye,
    Flame,
    Ghost,
    Heart,
    Shield,
    Sword,
    Wind,
    Zap
} from 'lucide-react';
import {TemplateDetailsModal} from './TemplateDetailsModal';

interface TemplateListProps {
    templates: MonsterTemplate[];
    onRefresh: () => void;
    readOnly?: boolean;
}

const elementIcons = {
    [ElementEnum.fire]: <Flame className="text-orange-500" size={24}/>,
    [ElementEnum.water]: <Droplets className="text-blue-500" size={24}/>,
    [ElementEnum.wind]: <Wind className="text-green-500" size={24}/>,
};

const ITEMS_PER_PAGE = 5;

export function TemplateList({templates, onRefresh, readOnly = false}: TemplateListProps) {
    const totalRate = templates.reduce((acc, t) => acc + t.lootRate, 0);
    const [selectedTemplate, setSelectedTemplate] = useState<MonsterTemplate | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(templates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedTemplates = templates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div
            className={`w-full rounded-2xl transition-all ${
                readOnly
                    ? 'mx-auto border-none bg-transparent p-0'
                    : 'bg-zinc-900/80 border border-purple-500/20 backdrop-blur-md p-6'
            }`}>
            {!readOnly && (
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-white flex items-center gap-2 drop-shadow-lg">
                        <span className="text-purple-500">⚡</span> Gestion des Templates
                    </h3>
                    <CreateTemplateModal onSuccess={onRefresh}/>
                </div>
            )}

            <div className={`space-y-3 ${readOnly ? '' : 'overflow-y-auto pr-2 custom-scrollbar max-h-[60vh]'}`}>
                {templates.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center py-12 text-zinc-500 bg-zinc-800/30 rounded-xl border border-dashed border-zinc-700">
                        <Ghost size={48} className="mb-2 opacity-50"/>
                        <p className="text-sm font-medium">Aucun template disponible</p>
                    </div>
                ) : (
                    displayedTemplates.map((template) => {
                        const percent = totalRate > 0 ? ((template.lootRate / totalRate) * 100).toFixed(1) : '0';
                        return (
                            <div key={template.id}
                                 className="group relative flex items-center justify-between p-4 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 transition-all duration-300 border border-white/5 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] overflow-hidden">

                                {/* Hover Gradient Effect */}
                                <div
                                    className="absolute inset-0 bg-linear-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"/>

                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`
                                        w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner
                                        ${template.element === 'fire' ? 'bg-orange-900/20 text-orange-500 border border-orange-500/20' :
                                        template.element === 'water' ? 'bg-blue-900/20 text-blue-500 border border-blue-500/20' :
                                            'bg-green-900/20 text-green-500 border border-green-500/20'}
                                    `}>
                                        {elementIcons[template.element]}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-zinc-200 text-lg group-hover:text-purple-300 transition-colors">
                                                Monstre #{template.id}
                                            </p>
                                            {readOnly && (
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                                                    Number(percent) < 5 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        Number(percent) < 15 ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                            Number(percent) < 30 ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                                }`}>
                                                    {Number(percent) < 5 ? 'LEGENDARY' : Number(percent) < 15 ? 'EPIC' : Number(percent) < 30 ? 'RARE' : 'COMMON'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 mt-1.5">
                                            <div
                                                className="flex items-center gap-3 text-xs font-medium text-zinc-400 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                                                <span className="flex items-center gap-1.5"><Heart
                                                    className="text-red-400" size={12}/> {template.hp}</span>
                                                <div className="w-px h-3 bg-zinc-700"/>
                                                <span className="flex items-center gap-1.5"><Sword
                                                    className="text-orange-400" size={12}/> {template.atk}</span>
                                                <div className="w-px h-3 bg-zinc-700"/>
                                                <span className="flex items-center gap-1.5"><Shield
                                                    className="text-blue-400" size={12}/> {template.def}</span>
                                                <div className="w-px h-3 bg-zinc-700"/>
                                                <span className="flex items-center gap-1.5"><Zap
                                                    className="text-yellow-400" size={12}/> {template.vit}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="text-right hidden sm:block">
                                        <div className="flex items-baseline justify-end gap-1">
                                            <span
                                                className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors">{percent}</span>
                                            <span className="text-sm font-bold text-purple-500">%</span>
                                        </div>
                                        <span
                                            className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Probabilité</span>
                                    </div>

                                    <div className="flex items-center gap-2 pl-4 border-l border-white/5">
                                        <button
                                            onClick={() => setSelectedTemplate(template)}
                                            className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all hover:scale-110 active:scale-95"
                                            title="Voir les détails"
                                        >
                                            <Eye size={20}/>
                                        </button>

                                        {!readOnly && (
                                            <EditButton template={template} onSuccess={onRefresh}/>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-white/5">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20}/>
                    </button>
                    <span className="text-sm text-zinc-400 font-medium">
                        Page {currentPage} sur {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20}/>
                    </button>
                </div>
            )}

            {selectedTemplate && (
                <TemplateDetailsModal
                    template={selectedTemplate}
                    onClose={() => setSelectedTemplate(null)}
                />
            )}
        </div>
    );
}

function EditButton({template, onSuccess}: { template: MonsterTemplate; onSuccess: () => void }) {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return <CreateTemplateModal template={template} onSuccess={onSuccess} onClose={() => setIsEditing(false)}/>;
    }

    return (
        <button
            onClick={() => setIsEditing(true)}
            className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all hover:scale-110 active:scale-95"
            title="Modifier"
        >
            <Edit size={20}/>
        </button>
    );
}
