import React, { useState } from 'react';
import { PistaCultural } from '../types.ts';
import { PISTAS_HISTORICAS } from '../data/pistasData.ts';
import { PistaCulturalCard } from './PistaCulturalCard.tsx';
import { X, Search, BookOpen, Sparkles, Filter } from 'lucide-react';

interface BauDeSaberesModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedClueTitles: string[];
}

export const BauDeSaberesModal: React.FC<BauDeSaberesModalProps> = ({
  isOpen,
  onClose,
  unlockedClueTitles
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  if (!isOpen) return null;

  const categories = [
    { id: 'todos', label: 'Todas as Pistas' },
    { id: 'Ciência & Educação', label: 'Ciência & Bárbara Carine' },
    { id: 'Engenharia & Infraestrutura', label: 'Engenharia Negra' },
    { id: 'Biotecnologia Ancestral', label: 'Saberes Indígenas' },
    { id: 'Inteligência Artificial & Ética', label: 'IA & Viés Algorítmico' },
    { id: 'Matemática & Tecnologia', label: 'Matemática & GPS' },
  ];

  const filteredPistas = PISTAS_HISTORICAS.filter((pista) => {
    const matchesSearch =
      pista.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pista.autorOuReferencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pista.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pista.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'todos' || pista.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-amber-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-amber-900/40 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Enciclopédia Griô do Sou Negro! I.A.gora?
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  {PISTAS_HISTORICAS.length} Inovações
                </span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-amber-100">
                Baú de Saberes Negros & Indígenas
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cientista, invenção, tecnologia (ex: Bárbara Carine, Enedina, GPS, Terra Preta)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Inspirado na obra seminal <strong>"A História Preta das Coisas"</strong>, da Profª Dra. Bárbara Carine, e em pesquisas arqueológicas e etnobotânicas sobre saberes originários indígenas.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPistas.map((pista) => {
              const isUnlocked = unlockedClueTitles.some(
                t => t.toLowerCase().includes(pista.titulo.toLowerCase()) || pista.titulo.toLowerCase().includes(t.toLowerCase())
              );

              return (
                <div key={pista.id} className="relative">
                  {isUnlocked && (
                    <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-md">
                      ✓ Desbloqueada no seu jogo!
                    </div>
                  )}
                  <PistaCulturalCard pista={pista} />
                </div>
              );
            })}
          </div>

          {filteredPistas.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>Nenhuma pista encontrada com os termos buscados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
