export type Phase = 'ABERTURA' | 'FASE_1' | 'FASE_2' | 'FASE_3' | 'DIAGNOSTICO';

export type EtniaDeclarada = 'negro_preto' | 'negro_pardo' | 'indigena' | 'branco' | 'amarelo' | 'em_duvida' | 'nao_declarado';

export interface PistaCultural {
  id?: string;
  titulo: string;
  autorOuReferencia: string;
  descricao: string;
  categoria: string;
  icon?: string;
  tags?: string[];
  impacto?: string;
  anoOuEpoca?: string;
}

export interface DiagnosticoFinal {
  caminho: 'AMALGAMAR_E_FUTUROS' | 'LETRAMENTO_E_ACOLHIMENTO';
  titulo: string;
  mensagem: string;
  desafioMakerGET: string;
  medalhas: string[];
}

export interface MilestonePhase1Data {
  opcaoEscolhida: string;
  isGrupoEtnicorracial: boolean;
  titulo: string;
  mensagem: string;
  jornadaFase2: string;
  botaoTexto: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  phase: Phase;
  pistaCultural?: PistaCultural;
  diagnosticoFinal?: DiagnosticoFinal;
  milestonePhase1?: MilestonePhase1Data;
  quickOptions?: string[];
}

export interface MakerProject {
  titulo: string;
  tecnologias: string[];
  descricao: string;
  habilidadesBNCC: string[];
}
