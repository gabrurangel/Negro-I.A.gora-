import React, { useEffect, useState, useMemo } from 'react';
import { DiagnosticoFinal, PistaCultural, ChatMessage } from '../types.ts';
import confetti from 'canvas-confetti';
import { 
  Medal, Sparkles, Wrench, RotateCcw, Volume2, 
  HeartHandshake, Lightbulb, Copy, Check, BarChart3, 
  UserCheck, Cpu
} from 'lucide-react';
import { speechController } from '../utils/speech.ts';
import { FormattedText, stripMarkdownForSpeech } from '../utils/textFormat.tsx';
import { GoogleDocsCertificateSection } from './GoogleDocsCertificateSection.tsx';

interface DiagnosticoViewProps {
  diagnostico: DiagnosticoFinal;
  studentName: string;
  cluesCollected: PistaCultural[];
  messages?: ChatMessage[];
  onRestart: () => void;
  onOpenGetMaker: () => void;
  onOpenBau: () => void;
}

export const DiagnosticoView: React.FC<DiagnosticoViewProps> = ({
  diagnostico,
  studentName,
  messages = [],
  onRestart,
  onOpenGetMaker,
}) => {
  const isAmalgamar = diagnostico.caminho === 'AMALGAMAR_E_FUTUROS';
  const [copied, setCopied] = useState(false);
  const [editableName, setEditableName] = useState(studentName || 'Estudante');

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#f59e0b', '#10b981', '#fbbf24', '#06b6d4', '#e11d48'],
      });
    } catch {
      // ignore in tests
    }
  }, []);

  // Filter substantive user answers
  const substantiveUserAnswers = useMemo(() => {
    return messages
      .filter((m) => m.role === 'user')
      .map((m) => m.content.trim())
      .filter((text) => {
        const l = text.toLowerCase();
        return (
          !l.includes('avançar') &&
          !l.includes('avance') &&
          !l.includes('iniciar fase 2') &&
          !l.includes('proxima') &&
          !l.includes('próxima') &&
          !l.includes('ver meu')
        );
      });
  }, [messages]);

  // Extract student declaration specifically from the last question of Phase 1 (Pergunta 10)
  const autodeclaracao = useMemo(() => {
    // Look for user response to Question 10 of Phase 1
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (
        msg.role === 'assistant' &&
        (msg.content.includes('[10/10') || msg.content.includes('pergunta decisiva da Fase 1'))
      ) {
        for (let j = i + 1; j < messages.length; j++) {
          if (messages[j].role === 'user') {
            const text = messages[j].content.trim();
            const lower = text.toLowerCase();
            if (
              !lower.includes('avançar') &&
              !lower.includes('avance') &&
              !lower.includes('iniciar fase 2')
            ) {
              return text;
            }
          }
        }
      }
    }

    // Fallback: search substantive user answers for self-declaration
    const decMsg = substantiveUserAnswers.find((t) => {
      const l = t.toLowerCase();
      return (
        l.includes('autodeclaro') ||
        l.includes('preto') ||
        l.includes('preta') ||
        l.includes('pardo') ||
        l.includes('parda') ||
        l.includes('indígena') ||
        l.includes('indigena') ||
        l.includes('branco') ||
        l.includes('branca') ||
        l.includes('amarelo') ||
        l.includes('asiátic')
      );
    });

    if (!decMsg) return 'População Brasileira / Autodeclarado';
    return decMsg;
  }, [messages, substantiveUserAnswers]);

  const isWhiteOrAsian = useMemo(() => {
    const l = autodeclaracao.toLowerCase();
    return (
      l.includes('branco') ||
      l.includes('branca') ||
      l.includes('amarelo') ||
      l.includes('asiátic') ||
      l.includes('asiatic')
    );
  }, [autodeclaracao]);

  const isEthnicGroup = useMemo(() => {
    if (isWhiteOrAsian) return false;
    const l = autodeclaracao.toLowerCase();
    return (
      l.includes('preto') ||
      l.includes('preta') ||
      l.includes('pardo') ||
      l.includes('parda') ||
      l.includes('indígena') ||
      l.includes('indigena') ||
      l.includes('negro') ||
      l.includes('negra')
    );
  }, [autodeclaracao, isWhiteOrAsian]);

  // Extract identified characteristics from user answers
  const caracteristicasIdentificadas = useMemo(() => {
    const findMatch = (terms: string[]) => {
      return substantiveUserAnswers.find((ans) => {
        const lower = ans.toLowerCase();
        return terms.some((term) => lower.includes(term.toLowerCase()));
      });
    };

    const cabelo = findMatch(['crespo', 'cacheado', 'ondulado', 'liso', 'piadinha', 'cabelo']);
    const tracos = findMatch(['nariz', 'lábios', 'labios', 'traços', 'tracos', 'misturada', 'fenótipo', 'fenotipo']);
    const raizes = findMatch(['nordeste', 'minas', 'quilombo', 'aldeia', 'imigrante', 'bisavó', 'bisavo', 'origens']);

    return {
      cabelo,
      tracos,
      raizes,
    };
  }, [substantiveUserAnswers]);

  // Read analytical diagnosis aloud
  const handleSpeak = () => {
    const allyReassurance = isWhiteOrAsian
      ? 'Se você se declarou branco ou asiático, não se preocupe de forma alguma: você é um grande aliado da causa!'
      : 'Você se reconhece no grupo Sou Negro!, com orgulho da sua identidade e raízes!';
    const text = `${diagnostico.titulo}. Parabéns ${editableName}! ${diagnostico.mensagem}. Resumo da sua trajetória: sua autodeclaração na última questão da primeira fase foi ${autodeclaracao}. ${allyReassurance} Desafio Maker no Ginásio Experimental Tecnológico: ${diagnostico.desafioMakerGET}`;
    speechController.speak(stripMarkdownForSpeech(text));
  };

  // Copy concise analytical synthesis to clipboard
  const handleCopySummary = () => {
    const summaryText = `📋 RELATÓRIO PEDAGÓGICO • PROJETO "SOU NEGRO! I.A.GORA?"
Estudante: ${editableName}
Data: ${new Date().toLocaleDateString('pt-BR')}

★ DIAGNÓSTICO:
${diagnostico.titulo}
${diagnostico.mensagem}

🔍 RESUMO DA SUA TRAJETÓRIA:
- Autodeclaração na última questão da Fase 1: [${autodeclaracao}] ➔ ${isEthnicGroup ? 'Sou Negro!' : 'Aliado Antirracista'}
${caracteristicasIdentificadas.cabelo ? `- Cabelo & Estética: ${caracteristicasIdentificadas.cabelo}\n` : ''}${caracteristicasIdentificadas.tracos ? `- Fenótipo & Traços: ${caracteristicasIdentificadas.tracos}\n` : ''}${caracteristicasIdentificadas.raizes ? `- Raízes Familiares: ${caracteristicasIdentificadas.raizes}\n` : ''}- Atuação: ${isEthnicGroup ? 'Protagonista Maker & Saberes Ancestrais' : 'Aliado Antirracista Ativo (Não se preocupe: seu papel como aliado é essencial!)'}
- Posicionamento: Defesa das cotas nas Escolas Técnicas Estaduais (FAETEC) e federais, valorização da ciência ancestral, combate ativo ao racismo digital (MultiRio) e inovação ética no GET.

🎖️ MEDALHAS CONQUISTADAS:
${diagnostico.medalhas.map((m) => `• [Medalha] ${m}`).join('\n')}

🛠️ MISSÃO MAKER NO GET (RIOEDUCA):
${diagnostico.desafioMakerGET}
`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-3 sm:px-6 print:py-2 print:px-2">
      {/* 1. Header de Parabenização & Celebração */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-2 transition-all ${
          isAmalgamar
            ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 border-amber-400/60 shadow-amber-950/40'
            : 'bg-gradient-to-br from-cyan-950 via-slate-900 to-teal-950 border-cyan-400/60 shadow-cyan-950/40'
        }`}
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3.5 rounded-2xl shadow-inner border shrink-0 ${
                isAmalgamar
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
              }`}
            >
              {isAmalgamar ? (
                <Sparkles className="w-8 h-8 animate-pulse text-amber-300" />
              ) : (
                <HeartHandshake className="w-8 h-8 animate-pulse text-cyan-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase ${
                    isAmalgamar ? 'bg-amber-400 text-slate-950' : 'bg-cyan-400 text-slate-950'
                  }`}
                >
                  {isAmalgamar ? '★ Expedição Concluída • Protagonista' : '♥ Expedição Concluída • Aliado'}
                </span>
                <span className="text-xs text-slate-300 font-medium">GET • Rioeduca</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Parabéns pela sua Jornada de Consciência! 🚀
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto print:hidden">
            <button
              onClick={handleSpeak}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-sm transition-all cursor-pointer"
              title="Ouvir análise em voz alta"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Ouvir</span>
            </button>
          </div>
        </div>

        {/* Narrative analysis text */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-200 text-xs sm:text-sm leading-relaxed">
          <FormattedText text={diagnostico.mensagem} isAssistant={true} />
        </div>

        {/* Student Name Editor Bar (Sem campo de unidade) */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">Estudante:</span>
            <input
              type="text"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-semibold focus:outline-none focus:border-amber-400"
              placeholder="Seu nome"
            />
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Nome salvo para emissão do relatório
          </span>
        </div>
      </div>

      {/* 2. Painel de Indicadores & Métricas Analíticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-semibold">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Engajamento</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400">100%</div>
          <div className="text-[10px] text-slate-400">Jornada crítica completa</div>
        </div>

        {/* Quadro Autodeclaração: Sou Negro! vs Aliado Antirracista correspondendo à última pergunta da Fase 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-semibold">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Autodeclaração</span>
          </div>
          <div className="text-sm sm:text-base font-black text-white truncate" title={autodeclaracao}>
            {isEthnicGroup ? 'Sou Negro!' : 'Aliado Antirracista'}
          </div>
          <div className="text-[10px] text-emerald-400 truncate font-mono">
            {autodeclaracao}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-semibold">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Cidadania Digital & IA</span>
          </div>
          <div className="text-xs sm:text-sm font-black text-cyan-300">MultiRio & GET</div>
          <div className="text-[10px] text-slate-400">Contra o racismo digital</div>
        </div>
      </div>

      {/* 3. RESUMO DA SUA TRAJETÓRIA (Síntese em Texto Corrido com Destaque para a Autodeclaração) */}
      <div className="bg-slate-900/95 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Resumo da sua trajetória
              </h3>
              <p className="text-xs text-slate-400">
                Síntese pedagógica contínua das suas respostas, autodeclaração e posicionamento crítico
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer print:hidden"
            title="Copiar síntese formatada para o caderno ou Classroom"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar Síntese'}</span>
          </button>
        </div>

        {/* Mensagem Específica de Acolhimento e Apoio: Se Branco ou Asiático, não se preocupe! */}
        {isWhiteOrAsian ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-teal-950/80 border-2 border-cyan-400/50 text-cyan-100 flex items-start gap-3.5 shadow-lg">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shrink-0 mt-0.5">
              <HeartHandshake className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm">
              <h4 className="font-black text-cyan-200 text-sm sm:text-base flex items-center gap-2">
                <span>Não se preocupe! Você é um grande aliado da causa! 🤝</span>
              </h4>
              <p className="text-slate-200 leading-relaxed">
                Você se autodeclarou como <strong className="text-cyan-300">{autodeclaracao}</strong> na última questão da Fase 1. 
                <strong className="text-white"> Não se preocupe de forma alguma com essa escolha!</strong> A autoidentificação sincera é a base de todo o respeito.
                Como <strong className="text-cyan-300">Aliado Antirracista</strong>, o seu apoio, empatia e compromisso diário em combater o preconceito, não tolerar piadas racistas e defender a igualdade de oportunidades são peças fundamentais para transformar a escola e o Brasil!
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-900/60 border-2 border-amber-400/50 text-amber-100 flex items-start gap-3.5 shadow-lg">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shrink-0 mt-0.5">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm">
              <h4 className="font-black text-amber-200 text-sm sm:text-base flex items-center gap-2">
                <span>Afirmação e Orgulho: Sou Negro! ✨</span>
              </h4>
              <p className="text-slate-200 leading-relaxed">
                Você se declarou como <strong className="text-amber-300">{autodeclaracao}</strong> na última questão da Fase 1, afirmando com dignidade seu lugar perante a história e as estatísticas do Brasil. 
                Seus cabelos, seus traços faciais e suas raízes carregam sabedoria e coragem ancestral. No laboratório maker do GET e na sociedade, sua voz é protagonista!
              </p>
            </div>
          </div>
        )}

        {/* Resumo da sua trajetória em TEXTO CORRIDO (Sem pequenos quadros isolados) */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3">
            <p>
              <strong className="text-amber-400 font-black uppercase tracking-wide text-xs block mb-1">
                ✦ Síntese das Características & Posicionamento:
              </strong>
              Ao longo da primeira fase de autodescoberta e reflexão, você compartilhou com sinceridade suas características físicas e culturais: 
              {caracteristicasIdentificadas.cabelo && (
                <span> quanto à estética e ao seu cabelo, afirmou que <strong className="text-emerald-300 font-semibold">"{caracteristicasIdentificadas.cabelo}"</strong>; </span>
              )}
              {caracteristicasIdentificadas.tracos && (
                <span> observando os traços do seu rosto e o espelho da família, reconheceu <strong className="text-cyan-300 font-semibold">"{caracteristicasIdentificadas.tracos}"</strong>; </span>
              )}
              {caracteristicasIdentificadas.raizes && (
                <span> e resgatando a memória das suas origens familiares, expressou que <strong className="text-purple-300 font-semibold">"{caracteristicasIdentificadas.raizes}"</strong>. </span>
              )}
            </p>

            {/* Destaque no texto para a autodeclaração escolhida na última questão da fase 1 */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2">
              <span className="text-slate-300 block text-xs sm:text-sm font-medium">
                Na pergunta final decisiva da Fase 1 sobre quem você é perante o país e o IBGE, a sua autodeclaração escolhida foi:
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black shadow-md border ${
                  isEthnicGroup
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-500/20'
                    : 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-cyan-500/20'
                }`}>
                  ★ {autodeclaracao}
                </span>
              </div>
            </div>

            <p>
              Nas fases seguintes, você defendeu a política de cotas nas <strong className="text-amber-300">Escolas Técnicas Estaduais (FAETEC)</strong>, colégios federais e universidades públicas como ação fundamental de reparação histórica, valorizou a ciência ancestral e o pioneirismo científico de intelectuais negros e indígenas, posicionou-se com firmeza contra o cyberbullying e o racismo virtual disfarçado de piada em grupos de mensagens (conforme as diretrizes pedagógicas da MultiRio) e assumiu o compromisso com a criação de tecnologias e inteligências artificiais éticas no laboratório maker do Ginásio Experimental Tecnológico (GET).
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-emerald-400 font-bold block mb-1 uppercase tracking-wide text-[11px]">
              Análise Pedagógica do Mediador:
            </strong>
            {isEthnicGroup
              ? 'Sua trajetória demonstra maturidade crítica, orgulho identitário e clareza sobre o papel transformador da educação técnica e da tecnologia. Você tem a postura de um verdadeiro protagonista para criar soluções no GET e inspirar seus colegas.'
              : 'Sua jornada revela honestidade exemplar, empatia ativa e compreensão sólida sobre reparação histórica e cidadania digital. Como aliado antirracista, suas atitudes diárias fazem toda a diferença para construir um ambiente escolar acolhedor e justo.'}
          </div>
        </div>
      </div>

      {/* 4. MEDALHAS REFLEXIVAS CONQUISTADAS (Destaque Especial com Ícone de Medalha) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-inner">
            <Medal className="w-6 h-6 text-amber-400 animate-bounce" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Medalhas Reflexivas Conquistadas</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                {diagnostico.medalhas?.length || 0}
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Condecorações de consciência, cidadania digital e protagonismo escolar:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {diagnostico.medalhas?.map((medalha, i) => (
            <div
              key={i}
              className="group relative flex items-center gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-400/60 transition-all shadow-md hover:shadow-amber-950/30"
            >
              {/* Medal Badge Icon */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-inner border border-amber-200/50">
                <Medal className="w-5 h-5 text-slate-950" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-amber-200 group-hover:text-amber-100 transition-colors leading-snug">
                  {medalha}
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">
                  ✦ Conquista Reflexiva
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Desafio Prático Maker no Laboratório do GET */}
      {diagnostico.desafioMakerGET && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-500/40 text-emerald-100 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-black text-sm sm:text-base mb-2">
            <Lightbulb className="w-5 h-5 text-emerald-400" />
            <span>Missão Prática para Executar no Laboratório Maker do GET:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {diagnostico.desafioMakerGET}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-emerald-300 font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-700/50">
              ✦ Micro:bit & Sensores
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-700/50">
              ✦ Impressão 3D & Modelagem
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-700/50">
              ✦ Scratch & Teachable Machine
            </span>
          </div>
        </div>
      )}

      {/* 6. Certificado Oficial no Google Docs */}
      <GoogleDocsCertificateSection
        studentName={editableName}
        autodeclaracao={autodeclaracao}
        isEthnicGroup={isEthnicGroup}
        isWhiteOrAsian={isWhiteOrAsian}
        caracteristicas={caracteristicasIdentificadas}
        diagnostico={diagnostico}
      />

      {/* 7. Barra de Ações Práticas */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800 print:hidden">
        <button
          onClick={handleCopySummary}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-950/40 transition-all hover:scale-105 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copiado para o Caderno!' : 'Copiar Síntese Analítica'}</span>
        </button>

        <button
          onClick={onOpenGetMaker}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
        >
          <Wrench className="w-4 h-4 text-emerald-300" />
          <span>Projetos Maker do GET</span>
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-slate-400 hover:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-800 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reiniciar Expedição</span>
        </button>
      </div>
    </div>
  );
};
