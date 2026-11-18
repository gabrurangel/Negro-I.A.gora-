import React, { useState } from 'react';
import { Sparkles, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomeNameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

export const WelcomeNameModal: React.FC<WelcomeNameModalProps> = ({
  isOpen,
  onSubmit,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError('Por favor, digite seu nome ou como prefere ser chamado(a).');
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/60 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-white shadow-amber-950/50">
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
              GET • Rioeduca
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Sou Negro! I.A.gora?
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          Boas-vindas à sua jornada interativa de autopercepção, cotas, saberes ancestrais e combate ao racismo digital!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wide">
              Qual é o seu nome?
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ex: Gabriel, Maria, Lucas..."
                className="w-full bg-slate-950 border border-amber-500/40 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 shadow-inner"
              />
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            {error ? (
              <p className="text-xs text-red-400 mt-1.5 font-medium">{error}</p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Seu nome será usado pelo mediador e no resumo pedagógico final.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-orange-950/40 transition-all active:scale-98 cursor-pointer"
          >
            <span>Iniciar Minha Jornada</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
