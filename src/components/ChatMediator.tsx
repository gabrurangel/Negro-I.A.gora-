import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Phase, PistaCultural } from '../types.ts';
import { PistaCulturalCard } from './PistaCulturalCard.tsx';
import { Send, Volume2, Mic, MicOff, Sparkles, User, Loader2, Bot, Award, HeartHandshake, Compass } from 'lucide-react';
import { speechController } from '../utils/speech.ts';
import { FormattedText, stripMarkdownForSpeech } from '../utils/textFormat.tsx';

interface ChatMediatorProps {
  messages: ChatMessage[];
  currentPhase: Phase;
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  quickOptions: string[];
}

export const ChatMediator: React.FC<ChatMediatorProps> = ({
  messages,
  currentPhase,
  isLoading,
  onSendMessage,
  quickOptions,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, quickOptions]);

  // Setup Web Speech Recognition for voice input if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não suportado neste navegador. Você pode digitar sua resposta!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickOptionClick = (option: string) => {
    if (isLoading) return;
    onSendMessage(option);
  };

  const handleSpeakMessage = (text: string) => {
    speechController.speak(stripMarkdownForSpeech(text));
  };

  // Determine current question number from latest message tag
  let currentQuestionNum = 1;
  let currentQuestionNumF2 = 1;
  for (let i = messages.length - 1; i >= 0; i--) {
    const matchF1 = messages[i].content.match(/\[(\d+)\/10/);
    if (matchF1) {
      currentQuestionNum = parseInt(matchF1[1], 10);
      break;
    }
  }
  for (let i = messages.length - 1; i >= 0; i--) {
    const matchF2 = messages[i].content.match(/\[F2\s*-\s*(\d+)/);
    if (matchF2) {
      currentQuestionNumF2 = parseInt(matchF2[1], 10);
      break;
    }
  }
  const lastMsg = messages[messages.length - 1];
  const isClueUnlocked = lastMsg?.role === 'assistant' && !!lastMsg.pistaCultural;

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-5">
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${
                isAssistant ? 'justify-start' : 'justify-end'
              } animate-fadeIn`}
            >
              {/* Mediator Avatar */}
              {isAssistant && (
                <div className="relative shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 shadow-md shadow-amber-950/40 border border-amber-300/40 text-amber-100">
                  <Bot className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 sm:p-5 shadow-md ${
                  isAssistant
                    ? 'bg-slate-900 border border-amber-500/30 text-slate-100 rounded-tl-sm'
                    : 'bg-gradient-to-br from-amber-600 to-orange-700 text-white rounded-tr-sm shadow-orange-950/30'
                }`}
              >
                {/* Header of message */}
                <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                  <span
                    className={`font-bold flex items-center gap-1.5 ${
                      isAssistant ? 'text-amber-400' : 'text-amber-100'
                    }`}
                  >
                    {isAssistant ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Guia Sou Negro! I.A.gora?</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5" />
                        <span>Sua Resposta</span>
                      </>
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] opacity-60 font-mono">
                      {msg.timestamp}
                    </span>
                    {isAssistant && (
                      <button
                        onClick={() => handleSpeakMessage(msg.content)}
                        className="p-1 rounded-lg hover:bg-slate-800 text-amber-300 hover:text-amber-200 transition-colors"
                        title="Ouvir esta fala em voz alta"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Message text formatted with bold and italics support */}
                <FormattedText
                  text={msg.content}
                  isAssistant={isAssistant}
                  className="text-xs sm:text-sm font-normal"
                />

                {/* Inline Milestone Card if Phase 1 completed */}
                {msg.milestonePhase1 && (
                  <div
                    className={`mt-3 p-4 rounded-2xl border shadow-lg ${
                      msg.milestonePhase1.isGrupoEtnicorracial
                        ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-900/40 border-amber-500/50'
                        : 'bg-gradient-to-r from-cyan-950/70 via-slate-900 to-teal-900/40 border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Fase 1 Concluída • Marco Registrado
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          msg.milestonePhase1.isGrupoEtnicorracial
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-cyan-400 text-slate-950'
                        }`}
                      >
                        {msg.milestonePhase1.isGrupoEtnicorracial ? 'Grupo Etnicorracial' : 'Jornada do Aliado'}
                      </span>
                    </div>

                    <div className="text-sm sm:text-base font-black text-white flex items-center gap-2 mb-2">
                      <span className="text-lg">{msg.milestonePhase1.isGrupoEtnicorracial ? '✊🏾' : '🤝'}</span>
                      <span className={msg.milestonePhase1.isGrupoEtnicorracial ? 'text-amber-300' : 'text-cyan-300'}>
                        Sua Escolha: {msg.milestonePhase1.opcaoEscolhida}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed mb-2">
                      {msg.milestonePhase1.mensagem}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                      <span className="font-bold text-amber-400">Próximos passos na Fase 2: </span>
                      {msg.milestonePhase1.jornadaFase2}
                    </div>
                  </div>
                )}

                {/* Inline Pista Cultural Card if present */}
                {msg.pistaCultural && (
                  <div className="mt-3">
                    <PistaCulturalCard pista={msg.pistaCultural} />
                  </div>
                )}
              </div>

              {/* Student Avatar */}
              {!isAssistant && (
                <div className="shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-800 border border-slate-700 text-amber-300 shadow-sm">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading typing bubble */}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/30 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl rounded-tl-sm px-4 py-3 text-xs sm:text-sm text-amber-200/80 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>O mediador está analisando sua reflexão e consultando saberes ancestrais...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Options */}
      {quickOptions && quickOptions.length > 0 && !isLoading && (
        <div className="px-3 sm:px-6 py-2.5 bg-slate-950/80 border-t border-slate-800/80">
          <div className="text-[11px] font-bold mb-2 flex items-center gap-1.5 uppercase tracking-wider">
            {quickOptions.some((opt) => opt.toLowerCase().includes('avançar') || opt.toLowerCase().includes('avance') || opt.toLowerCase().includes('próxima')) ? (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Pista Histórica Revelada! Clique abaixo para avançar:
              </span>
            ) : (
              <span className="text-amber-300/90 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Opções de Resposta (clique ou digite livremente):
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {quickOptions.map((opt, idx) => {
              const isAdvance =
                opt.toLowerCase().includes('avançar') ||
                opt.toLowerCase().includes('avance') ||
                opt.toLowerCase().includes('próxima');

              if (isAdvance) {
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickOptionClick(opt)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/50 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>{opt}</span>
                  </button>
                );
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuickOptionClick(opt)}
                  className="text-left px-3.5 py-2.5 rounded-xl text-xs bg-slate-900 hover:bg-amber-600/20 text-slate-200 hover:text-amber-200 border border-amber-500/20 hover:border-amber-400/50 transition-all shadow-sm active:scale-95 leading-snug cursor-pointer"
                >
                  ✦ {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-amber-900/30">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite aqui sua resposta com sinceridade e pensamento crítico..."
              disabled={isLoading}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 pr-10 shadow-inner"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Voice Input button */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-3 rounded-2xl border transition-all ${
              isListening
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-slate-900 text-slate-400 hover:text-amber-300 border-slate-800 hover:border-amber-500/40'
            }`}
            title={isListening ? 'Ouvindo... Clique para parar' : 'Falar por microfone'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="flex items-center justify-center p-3 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold shadow-md shadow-orange-950/40 transition-all active:scale-95"
            title="Enviar resposta"
          >
            <Send className="w-5 h-5 text-slate-950" />
            <span className="hidden sm:inline ml-1.5 text-xs font-extrabold uppercase">Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
