import React from 'react';
import { Phase } from '../types.ts';
import { Sparkles, BookOpen, Wrench, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentPhase: Phase;
  unlockedCluesCount: number;
  onOpenBau: () => void;
  onOpenGetMaker: () => void;
  onRestart: () => void;
  isAudioSpeaking: boolean;
  onStopAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  unlockedCluesCount,
  onOpenBau,
  onOpenGetMaker,
  onRestart,
  isAudioSpeaking,
  onStopAudio
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-amber-900/40 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 shadow-md shadow-orange-900/50 border border-amber-300/30">
            <Sparkles className="w-5 h-5 text-amber-100 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                Sou Negro! I.A.gora?
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30">
                GET • Rioeduca
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Consciência Racial, Saberes Negros & Indígenas e IA Ética
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isAudioSpeaking && (
            <button
              onClick={onStopAudio}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-950/70 text-red-300 border border-red-800 hover:bg-red-900/60 transition-colors"
              title="Interromper leitura em voz alta"
            >
              <VolumeX className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="hidden sm:inline">Pausar Voz</span>
            </button>
          )}

          <button
            onClick={onOpenBau}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-sm"
            title="Abrir Baú de Saberes Históricos e Culturais"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Baú Griô</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
              {unlockedCluesCount}
            </span>
          </button>

          <button
            onClick={onOpenGetMaker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all shadow-sm"
            title="Conhecer o Espaço Maker GET da rede pública carioca"
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Maker GET</span>
          </button>

          <button
            onClick={onRestart}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
            title="Reiniciar Jornada"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
