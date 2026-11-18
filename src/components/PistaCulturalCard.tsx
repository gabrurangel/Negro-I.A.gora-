import React from 'react';
import { PistaCultural } from '../types.ts';
import { BookOpen, Sparkles, Cpu, Award, ShieldCheck, Volume2 } from 'lucide-react';
import { speechController } from '../utils/speech.ts';
import { FormattedText, stripMarkdownForSpeech } from '../utils/textFormat.tsx';

interface PistaCulturalCardProps {
  pista: PistaCultural;
  compact?: boolean;
}

export const PistaCulturalCard: React.FC<PistaCulturalCardProps> = ({ pista, compact = false }) => {
  const getIcon = () => {
    switch (pista.icon) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-300" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-300" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-300" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-300" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-300" />;
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToRead = `Pista Cultural: ${pista.titulo}. Referência: ${pista.autorOuReferencia}. ${pista.descricao}`;
    speechController.speak(stripMarkdownForSpeech(textToRead));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/50 p-4 sm:p-5 shadow-xl shadow-amber-950/30 text-slate-100 my-3 transition-all hover:border-amber-400">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/30 shadow-inner">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-400 text-slate-950 shadow-sm">
                Pista Histórica & Cultural
              </span>
              {pista.anoOuEpoca && (
                <span className="text-[11px] text-amber-200/70 font-mono">
                  {pista.anoOuEpoca}
                </span>
              )}
            </div>
            <h4 className="font-heading font-bold text-base sm:text-lg text-amber-100 mt-1 leading-snug">
              {pista.titulo}
            </h4>
          </div>
        </div>

        <button
          onClick={handleSpeak}
          className="p-2 rounded-xl bg-slate-800/80 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 transition-all shadow-sm"
          title="Ouvir esta pista cultural"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Author / Source */}
      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-300/90 font-medium">
        <span className="font-semibold text-amber-400">Referência:</span>
        <span>{pista.autorOuReferencia}</span>
      </div>

      {/* Description */}
      <div className="mt-2 text-xs sm:text-sm text-slate-200">
        <FormattedText text={pista.descricao} isAssistant={true} />
      </div>

      {/* Impact quote if present */}
      {pista.impacto && !compact && (
        <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
          <span className="text-amber-400 font-bold">💡 Impacto:</span>
          <span>{pista.impacto}</span>
        </div>
      )}

      {/* Tags */}
      {pista.tags && pista.tags.length > 0 && !compact && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pista.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800/90 text-slate-300 border border-slate-700 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
