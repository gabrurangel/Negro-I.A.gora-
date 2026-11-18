import React from 'react';
import { PROJETOS_MAKER_GET } from '../data/pistasData.ts';
import { X, Wrench, Cpu, Lightbulb, GraduationCap, CheckCircle2 } from 'lucide-react';

interface GetMakerHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetMakerHubModal: React.FC<GetMakerHubModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-emerald-900/40 bg-gradient-to-r from-slate-950 via-emerald-950/50 to-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Rede Pública Municipal • Rioeduca
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-slate-950">
                  GET Maker
                </span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-emerald-100">
                Protagonismo Maker no GET
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

        {/* Overview Box */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-emerald-300 font-semibold">O que é o GET (Ginásio Experimental Tecnológico)?</strong> É o modelo inovador de escola pública em tempo integral da Secretaria Municipal de Educação do Rio de Janeiro (SME-Rio). Os GETs integram a abordagem <strong>STEAM</strong> (Ciência, Tecnologia, Engenharia, Artes e Matemática) e a <strong>cultura maker</strong> (mão na massa), dando aos estudantes ferramentas reais de fabricação digital, robótica e pensamento computacional para resolver problemas reais da sua comunidade.
            </div>
          </div>
        </div>

        {/* Suggested Anti-Racist Maker Projects */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>4 Projetos Práticos para Desenvolver no Espaço Maker do GET:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROJETOS_MAKER_GET.map((proj, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950/80 border border-emerald-500/30 p-5 shadow-lg flex flex-col justify-between hover:border-emerald-400/60 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="font-heading font-bold text-base text-emerald-200">
                      {proj.titulo}
                    </h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {proj.descricao}
                  </p>

                  <div className="mb-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-emerald-400" /> Ferramentas & Tecnologias:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tecnologias.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-emerald-300 border border-emerald-500/20 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-[10px] text-amber-300/80 font-medium">
                    ✦ Alinhamento com a Lei 10.639/03 e BNCC
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner of Maker Protagonism */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-emerald-950/40 to-slate-900 border border-amber-500/30 text-xs text-slate-200 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tecnologia Antirracista é Tecnologia com Propósito!</span>
            </div>
            <p>
              Ao construir no laboratório maker do GET, os alunos deixam de ser apenas consumidores de telas e se tornam inventores que reprogramam o futuro da cidade com respeito e ancestralidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
