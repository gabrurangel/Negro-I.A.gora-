import React, { useState, useEffect, useCallback } from 'react';
import { Phase, ChatMessage, PistaCultural, DiagnosticoFinal, MilestonePhase1Data } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { ChatMediator } from './components/ChatMediator.tsx';
import { DiagnosticoView } from './components/DiagnosticoView.tsx';
import { BauDeSaberesModal } from './components/BauDeSaberesModal.tsx';
import { GetMakerHubModal } from './components/GetMakerHubModal.tsx';
import { MilestonePhase1Modal } from './components/MilestonePhase1Modal.tsx';
import { WelcomeNameModal } from './components/WelcomeNameModal.tsx';
import { speechController } from './utils/speech.ts';
import { Sparkles, Bot, Award, RotateCcw, MessageSquare, BookOpen, Wrench, BarChart3 } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPhase, setCurrentPhase] = useState<Phase>('ABERTURA');
  const [studentName, setStudentName] = useState<string>('');
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(true);
  const [cluesCollected, setCluesCollected] = useState<PistaCultural[]>([]);
  const [finalDiagnosis, setFinalDiagnosis] = useState<DiagnosticoFinal | null>(null);
  const [quickOptions, setQuickOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAudioSpeaking, setIsAudioSpeaking] = useState<boolean>(false);
  const [isBauOpen, setIsBauOpen] = useState<boolean>(false);
  const [isGetMakerOpen, setIsGetMakerOpen] = useState<boolean>(false);
  const [milestoneData, setMilestoneData] = useState<MilestonePhase1Data | null>(null);
  const [isMilestoneOpen, setIsMilestoneOpen] = useState<boolean>(false);
  const [activeTabInFinal, setActiveTabInFinal] = useState<'certificado' | 'conversa'>('certificado');

  // Track audio state from speechController
  useEffect(() => {
    const unsubscribe = speechController.subscribe((speaking) => {
      setIsAudioSpeaking(speaking);
    });
    return () => {
      unsubscribe();
      speechController.stop();
    };
  }, []);

  // Helper to add unique clues
  const addClueIfNew = useCallback((clue?: PistaCultural) => {
    if (!clue) return;
    setCluesCollected((prev) => {
      if (prev.some((c) => c.titulo.toLowerCase() === clue.titulo.toLowerCase())) {
        return prev;
      }
      return [...prev, clue];
    });
  }, []);

  // Start / restart game with student name
  const startNewGame = useCallback(async (customName?: string) => {
    const activeName = customName || studentName || 'Estudante';
    speechController.stop();
    setIsLoading(true);
    setMessages([]);
    setCurrentPhase('ABERTURA');
    setFinalDiagnosis(null);
    setCluesCollected([]);
    setMilestoneData(null);
    setIsMilestoneOpen(false);
    setActiveTabInFinal('certificado');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          currentPhase: 'ABERTURA',
          studentName: activeName,
          userInput: '',
        }),
      });

      const data = await res.json();

      const initialMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: data.reply || `Olá, ${activeName}! Boas-vindas ao Sou Negro! I.A.gora?. Vamos começar nossa jornada?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        phase: data.currentPhase || 'FASE_1',
        pistaCultural: data.pistaCultural,
        quickOptions: data.quickOptions || [],
      };

      setMessages([initialMessage]);
      setCurrentPhase(data.nextPhase || 'FASE_1');
      setQuickOptions(data.quickOptions || []);
      addClueIfNew(data.pistaCultural);
    } catch (err) {
      console.error('Error starting game:', err);
    } finally {
      setIsLoading(false);
    }
  }, [studentName, addClueIfNew]);

  const handleNameSubmit = (enteredName: string) => {
    const name = enteredName.trim() || 'Estudante';
    setStudentName(name);
    setIsNameModalOpen(false);
    startNewGame(name);
  };

  const handleRestart = () => {
    setIsNameModalOpen(true);
  };

  // Send student message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    speechController.stop();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      phase: currentPhase,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          currentPhase,
          studentName,
          userInput: text,
        }),
      });

      const data = await res.json();

      if (data.milestonePhase1) {
        setMilestoneData(data.milestonePhase1);
        setIsMilestoneOpen(true);
      }

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        phase: data.currentPhase || currentPhase,
        pistaCultural: data.pistaCultural,
        diagnosticoFinal: data.diagnosticoFinal,
        milestonePhase1: data.milestonePhase1,
        quickOptions: data.quickOptions || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      addClueIfNew(data.pistaCultural);

      if (data.diagnosticoFinal) {
        setFinalDiagnosis(data.diagnosticoFinal);
        setCurrentPhase('DIAGNOSTICO');
        setActiveTabInFinal('certificado');
      } else if (data.nextPhase) {
        setCurrentPhase(data.nextPhase);
      }

      setQuickOptions(data.quickOptions || []);
    } catch (err) {
      console.error('Error in chat exchange:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopAudio = () => {
    speechController.stop();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      {/* Top Navbar */}
      <Navbar
        currentPhase={currentPhase}
        unlockedCluesCount={cluesCollected.length}
        onOpenBau={() => setIsBauOpen(true)}
        onOpenGetMaker={() => setIsGetMakerOpen(true)}
        onRestart={handleRestart}
        isAudioSpeaking={isAudioSpeaking}
        onStopAudio={handleStopAudio}
      />

      {/* Main Body */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-ancestral-pattern">
        {/* If diagnosis reached, show toggle between Certificate and Chat history */}
        {currentPhase === 'DIAGNOSTICO' && finalDiagnosis && (
          <div className="bg-slate-900/90 border-b border-amber-900/40 p-2 sm:p-3 sticky top-[57px] z-20 backdrop-blur-md">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 px-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs sm:text-sm font-bold text-amber-300">
                  Jornada Concluída com Sucesso!
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveTabInFinal('certificado')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTabInFinal === 'certificado'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Resumo Analítico</span>
                </button>
                <button
                  onClick={() => setActiveTabInFinal('conversa')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTabInFinal === 'conversa'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Rever Diálogo ({messages.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View switching */}
        {currentPhase === 'DIAGNOSTICO' && finalDiagnosis && activeTabInFinal === 'certificado' ? (
          <div className="flex-1 overflow-y-auto">
            <DiagnosticoView
              diagnostico={finalDiagnosis}
              studentName={studentName}
              cluesCollected={cluesCollected}
              messages={messages}
              onRestart={handleRestart}
              onOpenGetMaker={() => setIsGetMakerOpen(true)}
              onOpenBau={() => setIsBauOpen(true)}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-[calc(100vh-65px)]">
            <ChatMediator
              messages={messages}
              currentPhase={currentPhase}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              quickOptions={quickOptions}
            />
          </div>
        )}
      </main>

      {/* Drawer / Modals */}
      <BauDeSaberesModal
        isOpen={isBauOpen}
        onClose={() => setIsBauOpen(false)}
        unlockedClueTitles={cluesCollected.map((c) => c.titulo)}
      />

      <GetMakerHubModal
        isOpen={isGetMakerOpen}
        onClose={() => setIsGetMakerOpen(false)}
      />

      {/* Phase 1 Milestone Celebration Modal */}
      <MilestonePhase1Modal
        isOpen={isMilestoneOpen}
        onClose={() => setIsMilestoneOpen(false)}
        data={milestoneData}
        onProceed={() => {
          if (milestoneData?.botaoTexto) {
            handleSendMessage(milestoneData.botaoTexto);
          }
        }}
      />

      {/* Student Welcome Name Modal at Start */}
      <WelcomeNameModal
        isOpen={isNameModalOpen}
        onSubmit={handleNameSubmit}
      />
    </div>
  );
}
