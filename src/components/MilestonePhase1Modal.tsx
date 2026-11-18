import React from 'react';
import { MilestonePhase1Data } from '../types.ts';
import { Award, Sparkles, HeartHandshake, ArrowRight, X, Volume2, ShieldCheck, Compass } from 'lucide-react';
import { speechController } from '../utils/speech.ts';

interface MilestonePhase1ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: MilestonePhase1Data | null;
  onProceed: () => void;
}

export const MilestonePhase1Modal: React.FC<MilestonePhase1ModalProps> = ({
  isOpen,
  onClose,
  data,
  onProceed,
}) => {
  if (!isOpen || !data) return null;

  const handleSpeak = () => {
    const textToRead = `${data.titulo}. Sua escolha foi: ${data.opcaoEscolhida}. ${data.mensagem}. ${data.jornadaFase2}`;
    speechController.speak(textToRead);
  };

  const isEthnic = data.isGrupoEtnicorracial;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className={`relative w-full max-w-xl rounded-3xl bg-slate-900 border ${
          isEthnic ? 'border-amber-500/40 shadow-amber-950/70' : 'border-cyan-500/40 shadow-cyan-950/70'
        } shadow-2xl p-6 sm:p-8 overflow-hidden`}
      >
        {/* Decorative background glow */}
        <div 
          className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isEthnic ? 'bg-amber-500/15' : 'bg-cyan-500/15'
          }`} 
        />
        <div 
          className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
            isEthnic ? 'bg-orange-600/15' : 'bg-teal-500/15'
          }`} 
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          title="Fechar e ver a pista na conversa"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span 
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isEthnic 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fase 1 Concluída • Parabéns!</span>
          </span>

          <button
            onClick={handleSpeak}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Ouvir mensagem"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ouvir</span>
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          {isEthnic ? (
            <Award className="w-7 h-7 text-amber-400 shrink-0" />
          ) : (
            <HeartHandshake className="w-7 h-7 text-cyan-400 shrink-0" />
          )}
          <span>{data.titulo}</span>
        </h2>

        {/* Highlighted Chosen Ethnicity Card */}
        <div 
          className={`mt-4 mb-4 p-4 rounded-2xl border ${
            isEthnic 
              ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-900/30 border-amber-500/40' 
              : 'bg-gradient-to-r from-cyan-950/60 via-slate-900 to-teal-900/30 border-cyan-500/40'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Sua Autodeclaração Registrada:
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span className="text-xl">{isEthnic ? '✊🏾' : '🤝'}</span>
              <span className={isEthnic ? 'text-amber-300' : 'text-cyan-300'}>
                {data.opcaoEscolhida}
              </span>
            </div>
            <span 
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                isEthnic ? 'bg-amber-400 text-slate-950' : 'bg-cyan-400 text-slate-950'
              }`}
            >
              {isEthnic ? 'Grupo Etnicorracial' : 'Jornada do Aliado'}
            </span>
          </div>
        </div>

        {/* Warm Personal Message */}
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
          {data.mensagem}
        </p>

        {/* Phase 2 Path Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wide">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>O Que Espera por Você na Fase 2:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {data.jornadaFase2}
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onProceed();
            }}
            className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base text-slate-950 shadow-xl transition-all cursor-pointer active:scale-95 ${
              isEthnic
                ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 shadow-amber-950/50'
                : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-teal-300 shadow-cyan-950/50'
            }`}
          >
            <span>{data.botaoTexto}</span>
            <ArrowRight className="w-5 h-5 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
