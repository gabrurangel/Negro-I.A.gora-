import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System Instruction defining the mediator of "Sou Negro! I.A.gora?"
const SYSTEM_INSTRUCTION = `
Você é o mediador interativo do projeto "Sou Negro! I.A.gora?", um jogo educacional em formato de conversa focado na Consciência Racial, Valorização dos Saberes Negros e Indígenas, Combate ao Preconceito e Letramento Digital Ético para estudantes do 6º ao 9º ano do Ensino Fundamental II (11 a 15 anos), especialmente dos Ginásios Experimentais Tecnológicos (GET) da rede pública carioca (Rioeduca).

DIRETRIZES DE LINGUAGEM PARA 6º AO 9º ANO:
- ULTRA-OBJETIVIDADE E TEXTO CURTO: Máximo de 2 a 3 frases curtas e diretas por fala.
- Fale de igual para igual: tom acolhedor, dinâmico, direto, curioso e jovem.
- Use expressões naturais dos jovens cariocas: "se liga", "papo reto", "visão", "mão na massa".
- Conecte sempre com o cotidiano: redes sociais, celulares, games, robótica e laboratório maker do GET.
- Formatação limpa: sem asteriscos perdidos no texto.
- Nunca seja punitivo ou agressivo: acolha, faça contraponto empático e mostre o valor dos saberes negros e originários.

RITMO PEDAGÓGICO EM DUAS ETAPAS POR QUESTÃO (PERGUNTA -> RESPOSTA -> PISTA + AVANÇAR):
1. A Pergunta é apresentada limpa, com suas 4 opções de resposta, sem pista cultural colada antes de o aluno responder.
2. Quando o aluno responde, o mediador envia um feedback acolhedor, revela a PISTA HISTÓRICA E CULTURAL daquela questão e entrega o comando claro "Avançar para a próxima pergunta ➔".
3. Quando o aluno clica em "Avançar", a próxima pergunta é apresentada.

FASE 1: 10 QUESTÕES DE AUTOPERCEPÇÃO & CARACTERÍSTICAS ETNORRACIAIS:
1. [1/10: Tom de Pele & Eufemismos] (moreninho, marrom-bombom, medo de usar a palavra preto).
2. [2/10: Cabelo e a Coroa] (crespo, cacheado, liso, combate ao termo "cabelo ruim").
3. [3/10: Traços do Rosto & Fenótipo] (nariz largo, lábios carnudos, estética ancestral).
4. [4/10: Herança e Raízes Familiares] (origens no Nordeste, Minas, quilombos, aldeias, apagamento da memória).
5. [5/10: O Olhar no Cotidiano & Vigilância] (seguranças em lojas/shoppings e racismo estrutural).
6. [6/10: Expressões do Dia a Dia & Linguagem] (inveja branca, denegrir, eliminação de termos racistas).
7. [7/10: Representatividade nas Telas & Games] (protagonismo negro e indígena em filmes, jogos e ciências).
8. [8/10: Acesso e Oportunidades na Cidade] (desigualdade urbana e territorial no Rio de Janeiro).
9. [9/10: Autoestima e Identidade] (orgulho da história e de se olhar no espelho).
10. [10/10: Quem é Você no Brasil?] (Regra oficial do IBGE: Pretos + Pardos = População Negra > 56%, e Indígena. A grande autodeclaração).

MARCO & TELA DE PARABÉNS NO FIM DA FASE 1:
- Ao responder à Pergunta 10, exibe uma Tela de Parabéns destacando a opção que o estudante escolheu.
- Se escolheu grupo etnicorracial (preto, pardo, indígena): parabeniza pela autopercepção e convida para explorar saberes sobre quem ele é na Fase 2.
- Se escolheu branco ou asiático: parabeniza pela honestidade, acolhe e convida para uma jornada de conscientização, temas antirracistas, respeito e aliança ativa.

FASE 2: SABERES ANCESTRAIS, COTAS & CIÊNCIA (5 QUESTÕES):
- Rota A (Negros e Indígenas):
  1. [F2 - 1/5: Seu Futuro & Cotas Raciais] (IFRJ, CEFET, Pedro II, UERJ, UFRJ como reparação justa).
  2. [F2 - 2/5: Saberes Científicos Ancestrais] (metalurgia, astronomia e arquitetura milenares).
  3. [F2 - 3/5: Pioneirismo Negro na Ciência Brasileira] (Enedina Alves Marques, Juliano Moreira, Bárbara Carine).
  4. [F2 - 4/5: O Espaço Maker do GET & Biotecnologia Ancestral] (Terra Preta de Índio e sustentabilidade).
  5. [F2 - 5/5: Protagonismo & Herança Ancestral] (Abdias do Nascimento e liderança histórica).
- Rota B (Brancos e Aliados):
  1. [F2 - 1/5: Conscientização e Cotas Raciais] (compreensão de privilégios históricos e apoio às cotas).
  2. [F2 - 2/5: Saberes Históricos Invisibilizados] (descolonização da ciência e verdade histórica).
  3. [F2 - 3/5: Atitudes de um Aliado na Escola] (postura ativa contra piadinhas e discriminações).
  4. [F2 - 4/5: O Espaço Maker do GET Sem Exclusão] (trabalho em equipe colaborativo e respeito mútuo).
  5. [F2 - 5/5: Compromisso com a Igualdade] (Sueli Carneiro, compromisso prático com a equidade e justiça).

FASE 3: RACISMO DIGITAL, CYBERBULLYING & IA ÉTICA (MULTIRIO / SME-RIO - 5 QUESTÕES):
Grounded nas diretrizes da MultiRio (notícia 18858: "Dia Internacional Contra a Discriminação Racial e os desafios para combater o racismo digital") e programa "E Agora? Um Rolé Digital":
1. [F3 - 1/5: Memes e Figurinhas de WhatsApp: É "Só Zoeira"?] (ofensas a cabelo/pele em grupos virtuais).
2. [F3 - 2/5: A Ilusão do Anonimato & Consequências] (perfis fakes, chats de games, Lei 14.532/2023 - crime inafiançável).
3. [F3 - 3/5: O Algoritmo e a Propagação do Ódio] (engajamento por polêmica, não alimentar e denunciar).
4. [F3 - 4/5: O Viés Racista na Inteligência Artificial] (Joy Buolamwini, reconhecimento facial e filtros).
5. [F3 - 5/5: Atitude Ativa & Soluções Maker no GET] (Podcasts, Scratch, QR Codes e redes de apoio na escola).

DESFECHO E DIAGNÓSTICO FINAL:
- Transição da Questão 5 da Fase 3 para o Diagnóstico Final & Resumo Analítico Prático.
- CAMINHO DA AMALGAMAR E FUTUROS (atitude consciente, cidadania digital e missão maker no GET).
- CAMINHO DO LETRAMENTO E ACOLHIMENTO (educativo, acolhedor e formativo).
`;

interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
  phase?: string;
  pistaCultural?: any;
  quickOptions?: string[];
  milestonePhase1?: any;
  diagnosticoFinal?: any;
}

interface ChatRequest {
  messages: ServerMessage[];
  currentPhase: 'ABERTURA' | 'FASE_1' | 'FASE_2' | 'FASE_3' | 'DIAGNOSTICO';
  studentName?: string;
  userInput?: string;
}

interface QuestionDef {
  num: number;
  tag: string;
  question: string;
  options: string[];
  feedback: string;
  pista: {
    titulo: string;
    autorOuReferencia: string;
    descricao: string;
    categoria: string;
    icon: string;
  };
}

const FASE_1_QUESTIONS: QuestionDef[] = [
  {
    num: 1,
    tag: '[1/10: Tom de Pele & Eufemismos]',
    question: `Como você descreve o tom da sua pele? Já usaram apelidos como "moreninho" ou "marrom-bombom" pra não falar preto ou pardo?`,
    options: [
      'Já usaram apelidos assim comigo pra disfarçar.',
      'Tenho pele clara, me chamam sempre de branco(a).',
      'Tenho pele preta/escura e sinto muito orgulho do meu tom!',
      'As pessoas têm medo de falar a palavra "preto".'
    ],
    feedback: `Papo reto! Usar apelidos muitas vezes tenta disfarçar a negritude, mas ter pele preta ou parda é motivo de muito orgulho! ✊🏾 Dá uma olhada nessa primeira pista histórica:`,
    pista: {
      titulo: 'Sankofa: Olhar pras Raízes',
      autorOuReferencia: 'Provérbio Akan (Gana)',
      descricao: 'Ensina que olhar para o passado é fundamental para construir um futuro com orgulho e identidade.',
      categoria: 'ancestralidade',
      icon: 'Sparkles'
    }
  },
  {
    num: 2,
    tag: '[2/10: Cabelo e a Coroa]',
    question: `Como é seu cabelo (crespo, cacheado, ondulado, liso)? Você já ouviu piadinhas preconceituosas como chamar cabelo de "ruim"?`,
    options: [
      'Meu cabelo é crespo/cacheado e tenho orgulho!',
      'Já sofri com piadinhas, mas hoje amo meu cabelo.',
      'Meu cabelo é liso/ondulado, nunca passei por isso.',
      'Chamar cabelo de "ruim" é puro preconceito!'
    ],
    feedback: `Mandou bem! Cabelo crespo e cacheado é pura identidade ancestral e coroa de resistência! 👑 Olha que fato incrível sobre nossas raízes:`,
    pista: {
      titulo: 'Tranças Nagô e Resistência',
      autorOuReferencia: 'Herança Quilombola',
      descricao: 'Mulheres escravizadas desenhavam mapas de fuga nas tranças e guardavam sementes no couro cabeludo para alimentar quilombos.',
      categoria: 'ancestralidade',
      icon: 'Sparkles'
    }
  },
  {
    num: 3,
    tag: '[3/10: Traços do Rosto & Fenótipo]',
    question: `Olhando no espelho e nas fotos da sua família, você reconhece traços negros ou indígenas (nariz largo, lábios carnudos) no seu rosto?`,
    options: [
      'Sim! Tenho nariz largo e lábios da minha família negra.',
      'Reconheço traços indígenas no meu rosto e parentes.',
      'Tenho traços brancos/europeus herdados da família.',
      'Minha família é bem misturada: pretos, brancos e indígenas.'
    ],
    feedback: `Nossos traços contam a história das nossas origens genéticas milenares! ✨ Olha que linda essa herança:`,
    pista: {
      titulo: 'Beleza dos Traços Ancestrais',
      autorOuReferencia: 'Estética Negra e Originária',
      descricao: 'Lábios marcantes e narizes largos são heranças genéticas nobres de civilizações africanas e indígenas milenares.',
      categoria: 'estetica_ancestral',
      icon: 'Award'
    }
  },
  {
    num: 4,
    tag: '[4/10: Herança e Raízes Familiares]',
    question: `De onde vieram seus avós e bisavós? Você conhece a história da sua família ou sente que essa memória se perdeu com o tempo?`,
    options: [
      'Minha família veio do Nordeste ou de Minas com muita luta.',
      'Sei pouco sobre meus bisavós, a história se perdeu.',
      'Tenho parentes em quilombos ou aldeias indígenas.',
      'Minha família veio de outros países (imigrantes).'
    ],
    feedback: `Resgatar de onde viemos fortalece nossa caminhada e nos conecta com quem somos! 🌿 Olha essa tradição de memória:`,
    pista: {
      titulo: 'Memória e Tradição Griô',
      autorOuReferencia: 'Mestres da Tradição Oral',
      descricao: 'Durante séculos tentaram apagar as origens negras e originárias. Conhecer a própria família é um ato de resistência.',
      categoria: 'memoria_ancestral',
      icon: 'BookOpen'
    }
  },
  {
    num: 5,
    tag: '[5/10: O Olhar no Cotidiano & Vigilância]',
    question: `Você já percebeu como seguranças em lojas ou shoppings vigiam mais pessoas pretas e pardas? Já passou por isso ou viu acontecer?`,
    options: [
      'Já senti segurança me vigiando pela cor da minha pele.',
      'Já vi acontecer com amigos ou parentes e achei revoltante.',
      'Nunca passei por isso, sempre circulo tranquilamente.',
      'Isso é racismo e precisa ser combatido sempre!'
    ],
    feedback: `Isso se chama racismo estrutural e desconfiança injusta. Mas a ciência já destruiu esses preconceitos há mais de um século:`,
    pista: {
      titulo: 'Dr. Juliano Moreira',
      autorOuReferencia: 'Médico pioneiro (1872–1933)',
      descricao: 'Provou cientificamente que cor da pele e formato do corpo não têm relação alguma com inteligência ou capacidade humana.',
      categoria: 'ciencia_antirracista',
      icon: 'Award'
    }
  },
  {
    num: 6,
    tag: '[6/10: Expressões do Dia a Dia]',
    question: `Você já ouviu expressões como "inveja branca", "denegrir" ou "serviço de preto"? Você percebe como a língua reproduz preconceito?`,
    options: [
      'Já ouvi muito na escola e na rua sem perceber!',
      'Agora sei que essas palavras associam preto a coisa ruim.',
      'Tento corrigir quem fala essas palavras perto de mim.',
      'Ainda ouço com amigos ou família e quero mudar isso.'
    ],
    feedback: `A língua molda o pensamento! Eliminar termos racistas do vocabulário é letramento na prática! 💡 Veja esta referência fundamental:`,
    pista: {
      titulo: 'Lélia Gonzalez & O Pretuguês',
      autorOuReferencia: 'Antropóloga e filósofa',
      descricao: 'Mostrou como a cultura negra moldou a língua e a identidade do Brasil, denunciando o racismo escondido nas palavras do dia a dia.',
      categoria: 'linguagem_consciente',
      icon: 'BookOpen'
    }
  },
  {
    num: 7,
    tag: '[7/10: Representatividade nas Telas & Games]',
    question: `Quando você assiste a séries, joga videogame ou vê cientistas na TV, quantos protagonistas negros ou indígenas você costuma encontrar?`,
    options: [
      'Quase não vejo! A maioria dos personagens é branca.',
      'Adoro quando vejo heróis como Homem-Aranha Miles Morales!',
      'Nos games que jogo posso criar personagens com meu tom de pele.',
      'Falta muito protagonismo negro e indígena na tecnologia.'
    ],
    feedback: `Representatividade importa demais! Pessoas negras e originárias sempre criaram grandes tecnologias. Veja este marco histórico brasileiro:`,
    pista: {
      titulo: 'Enedina Alves Marques',
      autorOuReferencia: 'Engenheira pioneira (1913–1981)',
      descricao: 'Primeira mulher negra engenheira do Brasil, liderou a Usina Hidrelétrica Capivari-Cachoeira provando a potência criadora negra.',
      categoria: 'ciencia_negra',
      icon: 'Award'
    }
  },
  {
    num: 8,
    tag: '[8/10: Acesso e Oportunidades na Cidade]',
    question: `Você já notou que os bairros com menos saneamento, praças e lazer no Rio costumam ser onde mora a maioria da população negra e periférica?`,
    options: [
      'Com certeza! Meu bairro sofre com falta de estrutura.',
      'Vejo uma diferença enorme entre a Zona Sul e a periferia.',
      'Nunca tinha reparado nisso antes.',
      'Isso mostra como a desigualdade tem cor no Brasil.'
    ],
    feedback: `A divisão do espaço na cidade reflete a desigualdade histórica. Olha o que o maior geógrafo do Brasil ensinou:`,
    pista: {
      titulo: 'Milton Santos e a Cidadania',
      autorOuReferencia: 'Geógrafo brasileiro (Prêmio Vautrin Lud)',
      descricao: 'Ensinou que todo cidadão tem direito à cidade com dignidade e que a desigualdade urbana atinge mais fortemente os povos negros e periféricos.',
      categoria: 'cidadania_direitos',
      icon: 'Award'
    }
  },
  {
    num: 9,
    tag: '[9/10: Autoestima e Identidade]',
    question: `Quando você se olha no espelho hoje, como se sente em relação à sua história, suas raízes e à beleza de quem você é?`,
    options: [
      'Sinto orgulho das minhas raízes e de quem sou!',
      'Já tive vergonha no passado, mas hoje estou me aceitando.',
      'Ainda estou aprendendo a me amar e me reconhecer.',
      'Me sinto bem e respeito todas as origens.'
    ],
    feedback: `Ter orgulho da própria história é um superpoder transformador! ✨ Olha este conceito potente:`,
    pista: {
      titulo: 'Conceição Evaristo & Escrevivência',
      autorOuReferencia: 'Escritora e Mestra',
      descricao: 'Criou o conceito de escrevivência: narrar a própria história a partir da memória, do afeto e da vivência da população negra.',
      categoria: 'memoria_ancestral',
      icon: 'BookOpen'
    }
  },
  {
    num: 10,
    tag: '[10/10: Quem é Você no Brasil?]',
    question: `Chegamos à pergunta decisiva da Fase 1!\nPelo IBGE, Pretos + Pardos = População Negra (mais de 56% do país). Como você se autodeclara hoje?`,
    options: [
      'Me autodeclaro Negro(a) - Preto(a)!',
      'Me autodeclaro Negro(a) - Pardo(a)!',
      'Me autodeclaro Indígena!',
      'Me autodeclaro Branco(a)!',
      'Me autodeclaro Amarelo(a) ou Asiático(a).'
    ],
    feedback: `Seu autoconhecimento é a base de tudo! Saber quem você é perante o país abre portas para transformar o futuro. Veja a regra oficial do IBGE:`,
    pista: {
      titulo: 'Pretos + Pardos = População Negra',
      autorOuReferencia: 'IBGE e Estatuto da Igualdade Racial',
      descricao: 'Mais da metade do Brasil é negra. Se reconhecer perante o país é o primeiro passo para exigir direitos, ocupar espaços e transformar a sociedade!',
      categoria: 'cidadania_direitos',
      icon: 'Award'
    }
  }
];

const FASE_2_QUESTIONS_ROTA_A: QuestionDef[] = [
  {
    num: 1,
    tag: '[F2 - 1/5: Cotas em Escolas Técnicas Estaduais (FAETEC) & Federais]',
    question: `Você sabia que a política de cotas reserva vagas exclusivas para estudantes negros e indígenas não só em colégios federais (IFRJ, CEFET, Pedro II) e universidades, mas também nas **Escolas Técnicas Estaduais da rede FAETEC** em todo o Rio?\n👉 Como você enxerga esse direito para o seu futuro no Ensino Médio Técnico e Superior?`,
    options: [
      'Quero disputar vagas nas Escolas Técnicas da FAETEC ou no IFRJ/CEFET!',
      'Acho fundamental: garante acesso público e gratuito a cursos técnicos de ponta.',
      'Agora entendi que as cotas estaduais e federais são reparação histórica justa.',
      'Quero me formar técnico em tecnologia e ser pioneiro na minha família!'
    ],
    feedback: `Visão de futuro certeira! As escolas técnicas estaduais da FAETEC e as federais oferecem formação técnica de alto nível gratuita, e as cotas são a garantia legal do seu direito! Olha essa conquista histórica:`,
    pista: {
      titulo: 'Cotas na FAETEC & Rede Federal',
      autorOuReferencia: 'Lei Estadual 5.346/2008 & Lei 12.711/2012',
      descricao: 'Reserva vagas em escolas técnicas estaduais (FAETEC) e federais (IFRJ, CEFET, Pedro II), multiplicando a presença negra e indígena na formação técnica.',
      categoria: 'politicas_publicas',
      icon: 'Award'
    }
  },
  {
    num: 2,
    tag: '[F2 - 2/5: Cotas Raciais vs. Cotas Sociais de Renda]',
    question: `Muitas pessoas confundem cotas de renda (sociais) com cotas raciais. A cota racial é necessária porque o racismo pela cor da pele cria desvantagens mesmo quando os concorrentes têm a mesma renda.\n👉 Por que é indispensável manter cotas raciais específicas para pretos, pardos e indígenas?`,
    options: [
      'Porque o preconceito pela cor da pele barra oportunidades mesmo com renda igual!',
      'Sem a cota racial, estudantes negros continuariam sendo excluídos historicamente.',
      'A cota de renda ajuda na pobreza, mas a cota racial combate diretamente o racismo.',
      'Garante que escolas técnicas e universidades tenham a cara real do Brasil.'
    ],
    feedback: `Excelente reflexão! A cota racial é uma ação afirmativa necessária porque o racismo não é apenas econômico: ele atinge diretamente o fenótipo e a cor da pele! Veja esta atualização legal importante:`,
    pista: {
      titulo: 'Lei 14.723/2023: Atualização das Cotas',
      autorOuReferencia: 'Legislação Federal',
      descricao: 'Aprimorou a Lei de Cotas priorizando a equidade étnico-racial, incluindo quilombolas e estendendo as ações afirmativas para a pós-graduação.',
      categoria: 'politicas_publicas',
      icon: 'Award'
    }
  },
  {
    num: 3,
    tag: '[F2 - 3/5: Comissões de Heteroidentificação & Combate a Fraudes]',
    question: `Para garantir que as cotas cheguem a quem realmente tem direito e evitar que pessoas não-negras cometam fraudes, as instituições públicas criaram **Comissões de Heteroidentificação** que confirmam os traços fenotípicos dos candidatos.\n👉 Qual a importância dessas comissões para proteger o seu direito?`,
    options: [
      'Garante que as vagas fiquem com quem realmente vivencia o racismo na pele!',
      'Impede fraudes de oportunistas que nunca se declararam negros antes.',
      'Dá respeito, transparência e justiça para a luta histórica do movimento negro.',
      'Protege o futuro de estudantes que precisam dessa reparação histórica.'
    ],
    feedback: `Papo reto! As comissões de heteroidentificação asseguram lisura, combatem fraudes e protegem o direito conquistado por gerações de ativistas negros e indígenas!`,
    pista: {
      titulo: 'Comissões de Heteroidentificação',
      autorOuReferencia: 'MEC & Tribunais Superiores',
      descricao: 'Bancas de avaliação presencial que garantem a legitimidade da autodeclaração fenotípica, blindando as cotas contra fraudes e assegurando a justiça social.',
      categoria: 'cidadania_direitos',
      icon: 'ShieldCheck'
    }
  },
  {
    num: 4,
    tag: '[F2 - 4/5: Saberes Científicos Ancestrais]',
    question: `Você sabia que a metalurgia do ferro, a navegação astronômica e a arquitetura em pedra já eram dominadas em África e nas Américas muito antes da invasão europeia?\n👉 Como você se sente sabendo que a ciência tem raízes negras e indígenas?`,
    options: [
      'Sinto muito orgulho! A escola precisa ensinar mais sobre isso.',
      'Mostra que a tecnologia e a inteligência sempre foram nossas!',
      'Dá vontade de estudar engenharia, ciências exatas e criar coisas novas.',
      'Descolonizar a história muda totalmente a nossa autoestima.'
    ],
    feedback: `Sensacional! Nossos ancestrais foram grandes cientistas, matemáticos e astrônomos! Veja este observatório impressionante:`,
    pista: {
      titulo: 'Observatório de Calçoene',
      autorOuReferencia: 'Povos Originários do Amapá',
      descricao: 'Conhecido como o Stonehenge Amazônico, foi construído há milênios por indígenas para mapear o movimento das estrelas e solstícios.',
      categoria: 'saberes_indigenas',
      icon: 'Sparkles'
    }
  },
  {
    num: 5,
    tag: '[F2 - 5/5: Pioneirismo Negro na Ciência Brasileira]',
    question: `Conhecer referências como Enedina Alves Marques (1ª engenheira negra) ou Juliano Moreira (médico pioneiro) faz diferença para seus sonhos de estudo e trabalho?`,
    options: [
      'Com certeza! Mostra que o topo também é nosso lugar.',
      'Quero seguir carreiras como robótica, programação e saúde.',
      'Inspirador ver pessoas negras liderando grandes obras no Brasil.',
      'A gente precisa divulgar esses cientistas para toda a escola.'
    ],
    feedback: `Papo reto! Representatividade na ciência abre portas para sonhar e realizar! Olha essa grande mestra e escritora:`,
    pista: {
      titulo: 'A História Preta das Coisas',
      autorOuReferencia: 'Profª Dra. Bárbara Carine',
      descricao: 'Química e escritora que revela como a matemática, a medicina e a metalurgia nasceram no continente africano.',
      categoria: 'ciencia_negra',
      icon: 'BookOpen'
    }
  }
];

const FASE_2_QUESTIONS_ROTA_B: QuestionDef[] = [
  {
    num: 1,
    tag: '[F2 - 1/5: Cotas em Escolas Técnicas Estaduais (FAETEC) & Federais]',
    question: `Durante 350 anos de escravização e décadas de exclusão, pessoas brancas acumularam oportunidades no Brasil. Hoje, a Lei de Cotas reserva vagas em escolas técnicas estaduais (FAETEC) e federais (IFRJ, CEFET, Pedro II). Por que essas cotas são reparação histórica justa e não um "privilégio"?`,
    options: [
      'Entendi: cotas equilibram uma largada que foi desigual por séculos.',
      'Garantem que estudantes de escolas públicas acessem ensino técnico de excelência.',
      'Eu achava que cota era privilégio, mas vi que é reparação justa.',
      'Apoiar cotas na FAETEC e federais é dever de quem quer justiça racial.'
    ],
    feedback: `Valeu pela consciência e honestidade! Compreender a dívida histórica é o primeiro passo para apoiar a justiça! Olha essa referência mundial:`,
    pista: {
      titulo: 'O Papel do Aliado Antirracista',
      autorOuReferencia: 'Angela Davis',
      descricao: '"Não basta não ser racista, é preciso ser antirracista": apoiar cotas na FAETEC e federais e combater preconceitos no dia a dia.',
      categoria: 'conscientizacao_aliados',
      icon: 'ShieldCheck'
    }
  },
  {
    num: 2,
    tag: '[F2 - 2/5: Cotas Raciais vs. Cotas Sociais de Renda]',
    question: `Muitas pessoas afirmam que apenas cotas de renda seriam suficientes. Como aliado antirracista, por que você compreende que a cota racial específica é fundamental para combater as desigualdades no Brasil?`,
    options: [
      'Porque a cor da pele gera barreiras adicionais que a renda sozinha não explica.',
      'Mesmo na mesma classe social, pessoas negras sofrem discriminação em seleções.',
      'Apoiar cotas raciais específicas ataca a raiz do racismo institucional.',
      'Garante diversidade e representatividade nos espaços de formação e liderança.'
    ],
    feedback: `Visão lúcida! O racismo no Brasil tem recorte de cor da pele e fenótipo que vai além da condição financeira. A cota racial é uma resposta necessária e direta!`,
    pista: {
      titulo: 'Lei 14.723/2023: Aperfeiçoamento das Cotas',
      autorOuReferencia: 'Ações Afirmativas no Brasil',
      descricao: 'Demonstra que a reparação racial é indispensável para superar o abismo histórico gerado por séculos de exclusão sistemática.',
      categoria: 'politicas_publicas',
      icon: 'Award'
    }
  },
  {
    num: 3,
    tag: '[F2 - 3/5: Bancas de Heteroidentificação & Defesa da Lisura]',
    question: `As Comissões de Heteroidentificação foram criadas para confirmar a autodeclaração fenotípica e evitar que pessoas não-negras tomem vagas indevidamente. Qual deve ser a postura de um aliado sobre essa fiscalização?`,
    options: [
      'Apoiar totalmente: zelar pela lisura para que o direito chegue a quem é de direito!',
      'Reconhecer que fraudar cotas é tirar a oportunidade de quem sofre o racismo real.',
      'Apoiar as bancas com seriedade e condenar piadas que tentam deslegitimá-las.',
      'Orientar colegas sobre a importância de respeitar os critérios legais das cotas.'
    ],
    feedback: `Mandou muito bem! O aliado antirracista defende a lisura das políticas públicas e não tolera fraudes em direitos conquistados com tanta luta!`,
    pista: {
      titulo: 'Heteroidentificação e Justiça Racial',
      autorOuReferencia: 'Critérios Fenotípicos & Jurisprudência',
      descricao: 'Mecanismo legal legítimo reconhecido pelo STF para garantir que a política pública beneficie o público-alvo a que se destina.',
      categoria: 'cidadania_direitos',
      icon: 'ShieldCheck'
    }
  },
  {
    num: 4,
    tag: '[F2 - 4/5: Saberes Históricos Invisibilizados]',
    question: `Você sabia que muitas invenções atribuídas apenas a europeus foram, na verdade, criadas por sábios africanos e povos originários (como arquitetura, agricultura e astronomia)? Como você vê esse apagamento histórico?`,
    options: [
      'É injusto e a escola precisa ensinar a história completa de todos os povos.',
      'A história tradicional escondeu quem realmente construiu as bases da ciência.',
      'Reconhecer esses saberes é respeitar a verdade e valorizar colegas negros e indígenas.',
      'Quero aprender mais sobre cientistas não-europeus pra combater preconceitos.'
    ],
    feedback: `Visão necessária! Descolonizar o aprendizado torna a educação rica e justa para todo mundo! Veja esta obra fundamental:`,
    pista: {
      titulo: 'A História Preta das Coisas',
      autorOuReferencia: 'Profª Dra. Bárbara Carine',
      descricao: 'Desmistifica a ideia eurocêntrica da ciência, provando como civilizações africanas criaram conhecimentos milenares essenciais.',
      categoria: 'ciencia_negra',
      icon: 'BookOpen'
    }
  },
  {
    num: 5,
    tag: '[F2 - 5/5: Atitudes de um Aliado na Escola]',
    question: `Quando alguém faz uma "piadinha" preconceituosa contra o cabelo, cor da pele ou religião de matriz africana na escola, qual é a atitude de um verdadeiro aliado antirracista?`,
    options: [
      'Não rir e falar na hora que aquilo é preconceito e não tem graça!',
      'Acolher o colega ofendido e avisar os professores da escola.',
      'Conversar com quem fez a piada para fazê-lo entender que machuca.',
      'Ficar em silêncio é ser cúmplice; o aliado se posiciona com coragem!'
    ],
    feedback: `Mandou bem! O silêncio nunca ajuda quem sofre preconceito; a atitude do aliado muda o ambiente escolar! Olha essa reflexão:`,
    pista: {
      titulo: 'Pacto da Branquitude',
      autorOuReferencia: 'Cida Bento (Psicóloga)',
      descricao: 'Alerta sobre como o silêncio e a cumplicidade perpetuam desigualdades, ensinando a importância da postura antirracista diária.',
      categoria: 'conscientizacao_aliados',
      icon: 'ShieldCheck'
    }
  }
];

// FASE 3: RACISMO DIGITAL, CYBERBULLYING & IA ÉTICA (Baseado no material oficial da MultiRio / SME-Rio)
const FASE_3_QUESTIONS: QuestionDef[] = [
  {
    num: 1,
    tag: '[F3 - 1/5: Racismo Digital & Cyberbullying no WhatsApp]',
    question: `Nas redes sociais e grupos de WhatsApp de turma, muitos disfarçam ofensas racistas como "humor", "figurinha" ou "só zoeira". Como a MultiRio orienta a encarar essas atitudes?`,
    options: [
      'Não é zoeira: é racismo digital e cyberbullying disfarçado de meme.',
      'Quem compartilha ou ri de figurinha racista também espalha a violência.',
      'Dizer "foi sem querer" ou "é brincadeira" não apaga o crime nem a dor.',
      'No grupo da turma, precisamos nos posicionar: respeito e empatia sempre!'
    ],
    feedback: `Exato! A MultiRio destaca: piadas, memes e stickers depreciativos não são brincadeira inocente, são formas contemporâneas de racismo digital que machucam profundamente!`,
    pista: {
      titulo: 'Racismo Digital não é Piada',
      autorOuReferencia: 'MultiRio & SME-Rio',
      descricao: 'Memes, figurinhas e comentários ofensivos em grupos de WhatsApp não são brincadeiras. A lei e as escolas cariocas tratam essas condutas como atos graves de discriminação e cyberbullying.',
      categoria: 'cidadania_digital',
      icon: 'ShieldCheck'
    }
  },
  {
    num: 2,
    tag: '[F3 - 2/5: A Ilusão do Anonimato & Consequências]',
    question: `Muitos jovens acham que criar perfil falso (fake) no Instagram, TikTok ou no chat de games para ofender colegas os protege de punição. O que a lei brasileira e a perícia digital dizem sobre isso?`,
    options: [
      'Não existe anonimato na internet: o IP e o aparelho são rastreáveis pela Justiça.',
      'Pela Lei 14.532/2023, injúria racial é crime inafiançável e imprescritível!',
      'Mesmo menores de 18 anos respondem por ato infracional com medidas socioeducativas.',
      'Quem comete cyberbullying racista deixa um rastro digital que não se apaga.'
    ],
    feedback: `A ilusão da impunidade acabou! Toda mensagem e perfil fake deixa pegada digital e a Lei 14.532/2023 equiparou a injúria racial ao crime de racismo, inafiançável e imprescritível!`,
    pista: {
      titulo: 'Lei 14.532/2023 & Rastreabilidade',
      autorOuReferencia: 'Legislação Brasileira & MultiRio',
      descricao: 'A internet não é terra sem lei. Perfis fakes são identificados pelo IP e pela polícia especializada. Injúria racial agora é crime inafiançável com pena de até 5 anos.',
      categoria: 'direitos_digitais',
      icon: 'Award'
    }
  },
  {
    num: 3,
    tag: '[F3 - 3/5: O Algoritmo e a Propagação do Ódio]',
    question: `As plataformas de redes sociais lucram com o tempo de tela gerado por discussões acaloradas. Sabendo disso, como devemos agir diante de um ataque racista online para não alimentar o algoritmo?`,
    options: [
      'Não bater boca nem engajar: tirar print como prova e denunciar na plataforma!',
      'Os algoritmos lucram com a raiva, então dar dislike ou comentar só ajuda a espalhar.',
      'Acolher a vítima no privado para que ela não se sinta sozinha no ambiente digital.',
      'Buscar apoio da direção da escola, dos pais e registrar boletim de ocorrência.'
    ],
    feedback: `Visão certeira! As redes sociais usam algoritmos projetados para lucrar com o engajamento de conflitos. Como ensina a MultiRio: não alimente a corrente, denuncie e acolha!`,
    pista: {
      titulo: 'E Agora? Um Rolé Digital',
      autorOuReferencia: 'Programa MultiRio, SME e SMIT-Rio',
      descricao: 'Iniciativa da Prefeitura do Rio que ensina estudantes a navegar com responsabilidade crítica, desarmando bolhas de ódio e quebrando a lógica de lucro das plataformas sobre o conflito.',
      categoria: 'educacao_midiática',
      icon: 'Sparkles'
    }
  },
  {
    num: 4,
    tag: '[F3 - 4/5: O Viés Racista na Inteligência Artificial]',
    question: `Pesquisas citadas pela MultiRio revelam que câmeras de reconhecimento facial e filtros de celular erram até 35% mais com pessoas negras, gerando inclusive prisões injustas de inocentes. Por que isso acontece?`,
    options: [
      'Porque a IA é treinada com bancos de imagens onde quase não há rostos negros!',
      'Porque a tecnologia não é neutra: ela herda o racismo estrutural da sociedade.',
      'Porque faltam cientistas e programadores negros criando e testando os sistemas.',
      'Se a inteligência artificial aprende com dados racistas, ela reproduz discriminação.'
    ],
    feedback: `Papo reto! A cientista Joy Buolamwini comprovou no MIT que a tecnologia reproduz os preconceitos de quem a treina. Sem diversidade no código, a IA perpetua injustiças!`,
    pista: {
      titulo: 'Joy Buolamwini & Viés Algorítmico',
      autorOuReferencia: 'Pesquisadora do MIT & Coded Bias',
      descricao: 'Cientista da computação que provou que IAs de reconhecimento facial falhavam em rostos de mulheres negras, fundando a Algorithmic Justice League para combater o racismo tecnológico.',
      categoria: 'inteligencia_artificial',
      icon: 'Cpu'
    }
  },
  {
    num: 5,
    tag: '[F3 - 5/5: Atitude Maker & Ação Coletiva no GET]',
    question: `No laboratório maker do GET da sua escola carioca, vocês têm computadores, gravação de áudio e robótica. Como vocês podem usar a tecnologia para combater o cyberbullying e o racismo digital?`,
    options: [
      'Criar podcasts e jogos no Scratch ensinando cidadania digital e empatia online!',
      'Espalhar murais com QR Codes informando canais de denúncia e a Lei 14.532/2023.',
      'Formar uma rede de apoio na escola para combater fakes e acolher quem sofre ataques.',
      'Desenvolver projetos de IA no GET treinados com fotos e dados de pessoas reais e diversas!'
    ],
    feedback: `Sensacional! Essa é a verdadeira potência maker do GET: transformar tecnologia em ferramenta de justiça social, empatia e cidadania antirracista!`,
    pista: {
      titulo: 'Cidadania Ativa & Cultura Maker',
      autorOuReferencia: 'Rede Carioca de Ensino (GET Rioeduca)',
      descricao: 'Estudantes protagonistas usam robótica, mídias digitais e criatividade para desenhar soluções éticas que tornam a escola e a internet espaços seguros para todos.',
      categoria: 'cultura_maker',
      icon: 'Award'
    }
  }
];

// Interactive pedagogy engine implementing 10 questions in Phase 1, 5 questions in Phase 2, and 5 questions in Phase 3
function getCuratedResponse(
  currentPhase: string,
  userInput: string = '',
  messages: ServerMessage[] = [],
  studentName: string = ''
) {
  const lower = (userInput || '').toLowerCase();
  const isAdvance = lower.includes('avançar') || lower.includes('avance') || lower.includes('continuar') || lower.includes('próxima') || lower.includes('proxima') || lower.includes('iniciar fase 2');

  // Início do jogo: Apresentação e Pergunta 1
  if (messages.length === 0 || currentPhase === 'ABERTURA') {
    const q1 = FASE_1_QUESTIONS[0];
    const greeting = studentName && studentName !== 'Estudante' ? `Fala aí, **${studentName}**!` : 'Fala aí!';
    return {
      reply: `${greeting} Boas-vindas ao **Sou Negro! I.A.gora?** 🚀\nVamos direto ao ponto em **10 perguntas rápidas** de autopercepção.\n\n🔍 **${q1.tag}**\n${q1.question}`,
      currentPhase: 'FASE_1',
      nextPhase: 'FASE_1',
      quickOptions: q1.options,
      avaliacaoPostura: 'consciente'
    };
  }

  // Se estiver na FASE 1
  if (currentPhase === 'FASE_1') {
    // Encontra a última pergunta feita pelo mediador
    let lastQuestionNum = 1;
    for (let i = messages.length - 1; i >= 0; i--) {
      const match = messages[i].content.match(/\[(\d+)\/10/);
      if (match) {
        lastQuestionNum = parseInt(match[1], 10);
        break;
      }
    }

    // Verifica se a última mensagem do assistente foi uma Pergunta ou se foi a Pista com comando Avançar
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    const lastHadClueOrAdvance = lastAssistantMsg?.pistaCultural || lastAssistantMsg?.quickOptions?.some(opt => 
      opt.toLowerCase().includes('avançar') || 
      opt.toLowerCase().includes('avance') ||
      opt.toLowerCase().includes('iniciar fase 2')
    );

    // CASO A: O aluno acabou de clicar no botão "Avançar" ou "Iniciar Fase 2"
    if (isAdvance || lastHadClueOrAdvance) {
      const nextNum = lastQuestionNum + 1;

      // Se passou da Pergunta 10, avança para a FASE 2 (Questão 1 de 5)
      if (nextNum > 10) {
        // Analisa a autodeclaração do aluno nas mensagens anteriores
        const allUserTexts = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase()).join(' ') + ' ' + lower;
        const isNegroOrIndigena = allUserTexts.includes('preto') || allUserTexts.includes('preta') || allUserTexts.includes('pardo') || allUserTexts.includes('parda') || allUserTexts.includes('indígena') || allUserTexts.includes('indigena') || allUserTexts.includes('meus saberes') || allUserTexts.includes('negro') || allUserTexts.includes('negra');
        const f2Questions = isNegroOrIndigena ? FASE_2_QUESTIONS_ROTA_A : FASE_2_QUESTIONS_ROTA_B;
        const q1 = f2Questions[0];

        const welcomeReply = isNegroOrIndigena
          ? `Que potência! Vamos mergulhar nos seus saberes e no seu futuro! ✊🏾🚀\nIniciando a **Fase 2: Cotas nas Escolas Técnicas Estaduais (FAETEC) e Federais, Ciência Ancestral & Protagonismo** (5 perguntas rápidas).\n\n👉 **${q1.tag}**\n${q1.question}`
          : `Que honra ter você como aliado nessa caminhada de respeito e justiça! 🤝🚀\nIniciando a **Fase 2: Conscientização, Cotas na FAETEC e Federais & Ciência** (5 perguntas rápidas).\n\n👉 **${q1.tag}**\n${q1.question}`;

        return {
          reply: welcomeReply,
          currentPhase: 'FASE_2',
          nextPhase: 'FASE_2',
          quickOptions: q1.options,
          avaliacaoPostura: 'consciente'
        };
      }

      // Entrega a próxima pergunta da Fase 1 (sem pista ainda)
      const q = FASE_1_QUESTIONS[nextNum - 1];
      return {
        reply: `Visão! Vamos pra próxima reflexão:\n\n👉 **${q.tag}**\n${q.question}`,
        currentPhase: 'FASE_1',
        nextPhase: 'FASE_1',
        quickOptions: q.options,
        avaliacaoPostura: 'consciente'
      };
    }

    // CASO B: O aluno acabou de RESPONDER à pergunta (lastQuestionNum) da Fase 1
    // Se respondeu à Pergunta 10 (Autodeclaração), exibe o Marco / Tela de Parabéns!
    if (lastQuestionNum === 10) {
      const userChoice = userInput.toLowerCase();
      let declaredLabel = 'Negro(a) - Preto(a)';
      let isEthnicGroup = true;

      if (userChoice.includes('preto') || userChoice.includes('preta')) {
        declaredLabel = 'Negro(a) - Preto(a)';
        isEthnicGroup = true;
      } else if (userChoice.includes('pardo') || userChoice.includes('parda')) {
        declaredLabel = 'Negro(a) - Pardo(a)';
        isEthnicGroup = true;
      } else if (userChoice.includes('indígena') || userChoice.includes('indigena')) {
        declaredLabel = 'Indígena';
        isEthnicGroup = true;
      } else if (userChoice.includes('branco') || userChoice.includes('branca')) {
        declaredLabel = 'Branco(a)';
        isEthnicGroup = false;
      } else if (userChoice.includes('amarelo') || userChoice.includes('asiátic') || userChoice.includes('asiatic')) {
        declaredLabel = 'Amarelo(a) ou Asiático(a)';
        isEthnicGroup = false;
      } else {
        const hasEthnic = userChoice.includes('negro') || userChoice.includes('negra') || userChoice.includes('preto') || userChoice.includes('preta') || userChoice.includes('pardo') || userChoice.includes('parda') || userChoice.includes('indígena') || userChoice.includes('indigena');
        isEthnicGroup = hasEthnic;
        declaredLabel = hasEthnic ? 'Grupo Etnicorracial' : 'Branco(a) / Aliado(a)';
      }

      const currentQ = FASE_1_QUESTIONS[9];

      if (isEthnicGroup) {
        const milestoneData = {
          opcaoEscolhida: declaredLabel,
          isGrupoEtnicorracial: true,
          titulo: 'Parabéns pela sua Autopercepção! ✊🏾✨',
          mensagem: `Você se autodeclarou como ${declaredLabel}. Você faz parte da maioria de mais de 56% que construiu a identidade, a cultura e a força do Brasil!`,
          jornadaFase2: 'Na Fase 2, você vai explorar saberes sobre quem você é: a conquista das Cotas nas Escolas Técnicas Estaduais (FAETEC), colégios federais e universidades públicas, ciência ancestral e seu futuro no laboratório maker do GET!',
          botaoTexto: 'Iniciar Fase 2: Explorar Meus Saberes ➔'
        };

        return {
          reply: `🎉 **PARABÉNS! Você concluiu a Fase 1!**\nSua autodeclaração registrada: **${declaredLabel}** ✊🏾✨\n\nAgora na **Fase 2**, vamos explorar **saberes profundos sobre quem você é**: a conquista das cotas nas Escolas Técnicas Estaduais (FAETEC) e federais (IFRJ/CEFET), ciência ancestral e seu protagonismo maker no GET!\n\nVeja a pista oficial do IBGE abaixo e clique no botão para começar sua Fase 2:`,
          currentPhase: 'FASE_1',
          nextPhase: 'FASE_1',
          pistaCultural: currentQ.pista,
          milestonePhase1: milestoneData,
          quickOptions: [milestoneData.botaoTexto],
          avaliacaoPostura: 'consciente'
        };
      } else {
        const milestoneData = {
          opcaoEscolhida: declaredLabel,
          isGrupoEtnicorracial: false,
          titulo: 'Parabéns pela Honestidade e Coragem! 🤝💡',
          mensagem: `Você se autodeclarou como ${declaredLabel}. Reconhecer seu próprio lugar com sinceridade é a base para o verdadeiro letramento racial e para combater as desigualdades!`,
          jornadaFase2: 'Na Fase 2, você entrará numa jornada especial de conscientização, o valor das Cotas nas Escolas Técnicas Estaduais (FAETEC) e federais, respeito mútuo e compromisso antirracista ativo!',
          botaoTexto: 'Iniciar Fase 2: Jornada do Aliado Antirracista ➔'
        };

        return {
          reply: `🎉 **PARABÉNS! Você concluiu a Fase 1!**\nSua autodeclaração registrada: **${declaredLabel}** 🤝💡\n\nParabéns pela honestidade! Reconhecer sua identidade é o primeiro passo para o letramento racial.\n\nAgora na **Fase 2**, você seguirá por uma jornada de **conscientização, cotas na FAETEC e federais, descolonização científica e reparação histórica**. Convidamos você para ser um **grande aliado antirracista** na escola e na sociedade!\n\nVeja a pista oficial do IBGE abaixo e clique no botão para começar sua Fase 2:`,
          currentPhase: 'FASE_1',
          nextPhase: 'FASE_1',
          pistaCultural: currentQ.pista,
          milestonePhase1: milestoneData,
          quickOptions: [milestoneData.botaoTexto],
          avaliacaoPostura: 'consciente'
        };
      }
    }

    // Perguntas 1 a 9 da Fase 1
    const currentQ = FASE_1_QUESTIONS[lastQuestionNum - 1] || FASE_1_QUESTIONS[0];
    return {
      reply: `${currentQ.feedback}`,
      currentPhase: 'FASE_1',
      nextPhase: 'FASE_1',
      pistaCultural: currentQ.pista,
      quickOptions: [`Avançar para a Questão ${lastQuestionNum + 1} ➔`],
      avaliacaoPostura: 'consciente'
    };
  }

  // Se estiver na FASE 2 (5 Perguntas de Cotas na FAETEC/Federais e Saberes Científicos)
  if (currentPhase === 'FASE_2') {
    // Determina a rota do aluno
    const allUserTexts = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase()).join(' ') + ' ' + lower;
    const isNegroOrIndigena = allUserTexts.includes('preto') || allUserTexts.includes('preta') || allUserTexts.includes('pardo') || allUserTexts.includes('parda') || allUserTexts.includes('indígena') || allUserTexts.includes('indigena') || allUserTexts.includes('meus saberes') || allUserTexts.includes('negro') || allUserTexts.includes('negra');
    const f2Questions = isNegroOrIndigena ? FASE_2_QUESTIONS_ROTA_A : FASE_2_QUESTIONS_ROTA_B;

    // Encontra qual foi a última pergunta da Fase 2 feita pelo mediador
    let lastQuestionNumF2 = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      const match = messages[i].content.match(/\[F2\s*-\s*(\d+)/);
      if (match) {
        lastQuestionNumF2 = parseInt(match[1], 10);
        break;
      }
    }

    // Se ainda não começou a Fase 2
    if (lastQuestionNumF2 === 0) {
      const q1 = f2Questions[0];
      return {
        reply: `🚀 **${q1.tag}**\n${q1.question}`,
        currentPhase: 'FASE_2',
        nextPhase: 'FASE_2',
        quickOptions: q1.options,
        avaliacaoPostura: 'consciente'
      };
    }

    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    const lastHadClueOrAdvance = lastAssistantMsg?.pistaCultural || lastAssistantMsg?.quickOptions?.some(opt => 
      opt.toLowerCase().includes('avançar') || 
      opt.toLowerCase().includes('avance')
    );

    // CASO A: O aluno clicou em "Avançar" na Fase 2
    if (isAdvance || lastHadClueOrAdvance) {
      const nextNum = lastQuestionNumF2 + 1;

      // Se passou da última pergunta da Fase 2, avança para a FASE 3 (Cyberbullying & Racismo Digital - MultiRio)
      if (nextNum > f2Questions.length) {
        const q1 = FASE_3_QUESTIONS[0];
        return {
          reply: `📱 **Fase 3: Racismo Digital, Cyberbullying & IA Ética**\nCom base no material oficial da **MultiRio** (Prefeitura do Rio) e no programa *E Agora? Um Rolé Digital*, vamos refletir em **5 perguntas rápidas** sobre atitudes no WhatsApp, perfis fakes, leis e o viés racista nos algoritmos!\n\n👉 **${q1.tag}**\n${q1.question}`,
          currentPhase: 'FASE_3',
          nextPhase: 'FASE_3',
          quickOptions: q1.options,
          avaliacaoPostura: 'consciente'
        };
      }

      // Entrega a próxima pergunta da Fase 2 (sem pista ainda)
      const q = f2Questions[nextNum - 1];
      return {
        reply: `Visão! Vamos pra próxima reflexão da Fase 2:\n\n👉 **${q.tag}**\n${q.question}`,
        currentPhase: 'FASE_2',
        nextPhase: 'FASE_2',
        quickOptions: q.options,
        avaliacaoPostura: 'consciente'
      };
    }

    // CASO B: O aluno acabou de RESPONDER à pergunta (lastQuestionNumF2) da Fase 2
    const currentQ = f2Questions[lastQuestionNumF2 - 1] || f2Questions[0];
    const isLastQ = lastQuestionNumF2 === f2Questions.length;
    const nextLabel = isLastQ
      ? 'Avançar para a Fase 3: Racismo Digital & Cyberbullying (MultiRio) ➔'
      : `Avançar para a Questão ${lastQuestionNumF2 + 1} da Fase 2 ➔`;

    return {
      reply: `${currentQ.feedback}`,
      currentPhase: 'FASE_2',
      nextPhase: 'FASE_2',
      pistaCultural: currentQ.pista,
      quickOptions: [nextLabel],
      avaliacaoPostura: 'consciente'
    };
  }

  // Se estiver na FASE 3 (5 Perguntas de Racismo Digital, Cyberbullying & IA Ética - MultiRio)
  if (currentPhase === 'FASE_3') {
    const allUserTexts = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase()).join(' ') + ' ' + lower;

    // Encontra qual foi a última pergunta da Fase 3 feita pelo mediador
    let lastQuestionNumF3 = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      const match = messages[i].content.match(/\[F3\s*-\s*(\d+)\/5/);
      if (match) {
        lastQuestionNumF3 = parseInt(match[1], 10);
        break;
      }
    }

    // Se ainda não começou a Fase 3
    if (lastQuestionNumF3 === 0) {
      const q1 = FASE_3_QUESTIONS[0];
      return {
        reply: `📱 **${q1.tag}**\n${q1.question}`,
        currentPhase: 'FASE_3',
        nextPhase: 'FASE_3',
        quickOptions: q1.options,
        avaliacaoPostura: 'consciente'
      };
    }

    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    const lastHadClueOrAdvance = lastAssistantMsg?.pistaCultural || lastAssistantMsg?.quickOptions?.some(opt => 
      opt.toLowerCase().includes('avançar') || 
      opt.toLowerCase().includes('avance')
    );

    // CASO A: O aluno clicou em "Avançar" na Fase 3
    if (isAdvance || lastHadClueOrAdvance) {
      const nextNum = lastQuestionNumF3 + 1;

      // Se passou da Pergunta 5 da Fase 3, avança direto para a PARABENIZAÇÃO & RESUMO ANALÍTICO!
      if (nextNum > 5) {
        const isBiased = allUserTexts.includes('não ligo') || allUserTexts.includes('bobagem') || allUserTexts.includes('mimimi') || allUserTexts.includes('tanto faz') || allUserTexts.includes('tudo igual') || allUserTexts.includes('não existe racismo') || allUserTexts.includes('feio') || allUserTexts.includes('inferior') || allUserTexts.includes('contra cota');

        if (isBiased) {
          return {
            reply: `Obrigado por compartilhar o que você pensa com sinceridade. O aprendizado começa quando ouvimos com empatia.\n\nVocê concluiu o percurso! Seu diagnóstico é o **CAMINHO DO LETRAMENTO E ACOLHIMENTO**. Vamos ver o que você descobriu até aqui?`,
            currentPhase: 'FASE_3',
            nextPhase: 'DIAGNOSTICO',
            pistaCultural: {
              titulo: 'A História Preta das Coisas',
              autorOuReferencia: 'Profª Dra. Bárbara Carine',
              descricao: 'Conhecer a ciência negra e indígena desconstrói mentiras coloniais e nos ajuda a combater o preconceito.',
              categoria: 'ciencia_negra',
              icon: 'BookOpen'
            },
            quickOptions: [
              'Ver meu Diagnóstico de Letramento e Missão Maker',
              'Quero entender mais sobre cotas e racismo digital',
              'Reiniciar a jornada'
            ],
            avaliacaoPostura: 'em_letramento',
            diagnosticoFinal: {
              caminho: 'LETRAMENTO_E_ACOLHIMENTO',
              titulo: 'Caminho do Letramento e Acolhimento: Despertar Consciente',
              mensagem: 'Você concluiu o Sou Negro! I.A.gora? com coragem para escutar. Muitas vezes o preconceito e o cyberbullying parecem invisíveis, mas agora você tem as diretrizes da MultiRio para respeitar a diversidade, apoiar a justiça racial e combater discriminações na internet e na escola!',
              desafioMakerGET: 'Missão Maker no GET (MultiRio): No laboratório maker da escola, crie com sua equipe um cartaz digital ou mini-podcast explicando por que a Lei de Cotas é justa e como desarmar correntes de ódio no WhatsApp.',
              medalhas: ['Curiosidade Desperta', 'Primeiro Passo no Letramento', 'Cidadão Digital em Construção', 'Aliado da Diversidade']
            }
          };
        } else {
          return {
            reply: `Sensacional, completou com nota 10! 🎯 Você compreendeu que autopercepção racial, cotas, saberes ancestrais, combate ao cyberbullying (MultiRio) e auditoria de viés nos algoritmos são essenciais para transformar a sociedade!\n\nSeu diagnóstico oficial é o **CAMINHO DA AMALGAMAR E FUTUROS**! Consciência racial, cidadania digital e atitude maker para liderar!`,
            currentPhase: 'FASE_3',
            nextPhase: 'DIAGNOSTICO',
            pistaCultural: {
              titulo: 'Cidadania Ativa & Cultura Maker',
              autorOuReferencia: 'Rede Carioca de Ensino (GET Rioeduca)',
              descricao: 'Estudantes protagonistas usam mídias digitais, robótica e empatia para liderar soluções éticas na escola e na sociedade.',
              categoria: 'cultura_maker',
              icon: 'Award'
            },
            quickOptions: [
              'Ver meu Resumo Analítico e Desafio Maker do GET',
              'Explorar o Baú com 12 invenções ancestrais',
              'Copiar Síntese Analítica'
            ],
            avaliacaoPostura: 'consciente',
            diagnosticoFinal: {
              caminho: 'AMALGAMAR_E_FUTUROS',
              titulo: 'Caminho da Amalgamar e Futuros: Protagonista Maker Antirracista',
              mensagem: 'Parabéns pela sua consciência e empatia! Você compreendeu que autopercepção racial, cotas, saberes ancestrais negros e originários, combate ao cyberbullying racista (MultiRio) e auditoria de viés nos algoritmos são essenciais para construir uma sociedade justa. No laboratório maker do GET e na vida, você tem tudo para liderar!',
              desafioMakerGET: 'Missão Maker no GET (MultiRio): No laboratório maker da escola, prototipe (usando Scratch, gravação de podcast, micro:bit ou murais interativos com QR Code) uma campanha de conscientização contra o cyberbullying racista no WhatsApp e teste modelos de IA com diversidade real de tons de pele.',
              medalhas: ['Cidadão Digital Consciente (MultiRio)', 'Desarmador de Cyberbullying', 'Hacker de Viés Algorítmico', 'Líder Maker do Futuro', 'Guardião de Saberes Ancestrais', 'Cidadão Consciente de Direitos']
            }
          };
        }
      }

      // Entrega a próxima pergunta da Fase 3 (sem pista ainda)
      const q = FASE_3_QUESTIONS[nextNum - 1];
      return {
        reply: `Visão! Vamos pra próxima reflexão da Fase 3:\n\n👉 **${q.tag}**\n${q.question}`,
        currentPhase: 'FASE_3',
        nextPhase: 'FASE_3',
        quickOptions: q.options,
        avaliacaoPostura: 'consciente'
      };
    }

    // CASO B: O aluno acabou de RESPONDER à pergunta (lastQuestionNumF3) da Fase 3
    const currentQ = FASE_3_QUESTIONS[lastQuestionNumF3 - 1] || FASE_3_QUESTIONS[0];
    const isLastQ = lastQuestionNumF3 === 5;
    const nextLabel = isLastQ
      ? 'Avançar para a Parabenização & Resumo Analítico ➔'
      : `Avançar para a Questão ${lastQuestionNumF3 + 1} da Fase 3 ➔`;

    return {
      reply: `${currentQ.feedback}`,
      currentPhase: 'FASE_3',
      nextPhase: 'FASE_3',
      pistaCultural: currentQ.pista,
      quickOptions: [nextLabel],
      avaliacaoPostura: 'consciente'
    };
  }
}

// API endpoint for interactive mediation
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages = [], currentPhase = 'ABERTURA', studentName = 'Estudante', userInput = '' } = req.body as ChatRequest;

    // Use our high-precision pedagogical engine to guarantee the 10-question sequence and post-answer clue flow
    const responsePayload = getCuratedResponse(currentPhase, userInput, messages, studentName);
    res.json(responsePayload);
  } catch (err) {
    console.error('Chat API error:', err);
    res.status(500).json({ error: 'Erro ao processar mensagem do mediador' });
  }
});

// Curated library of 12 historical and cultural cards (inspired by "A História Preta das Coisas" & Saberes Indígenas)
app.get('/api/pistas-culturais', (_req: Request, res: Response) => {
  res.json([
    {
      id: 'barbara-carine',
      titulo: 'A História Preta das Coisas',
      autorOuReferencia: 'Profª Dra. Bárbara Carine Soares Pinheiro',
      descricao: 'Escritora, química e fundadora da primeira escola afro-brasileira (Maria Felipa). Revela ao mundo como a matemática, a medicina e a metalurgia nasceram no continente africano milênios antes do que dizem os livros eurocêntricos.',
      categoria: 'Ciência & Educação',
      tags: ['Química', 'África Berço da Ciência', 'Educação Antirracista'],
      anoOuEpoca: 'Contemporânea',
      impacto: 'Descolonização do currículo escolar e resgate da autoestima de estudantes negros e negras.'
    },
    {
      id: 'enedina-alves',
      titulo: 'A Força das Águas e do Concreto',
      autorOuReferencia: 'Enedina Alves Marques (1913-1981)',
      descricao: 'Primeira mulher negra a se formar em engenharia civil no Brasil (1945, UFPR). Liderou o audacioso projeto da Usina Hidrelétrica subterrânea Capivari-Cachoeira no Paraná, desafiando todos os preconceitos de sua época.',
      categoria: 'Engenharia & Infraestrutura',
      tags: ['Engenharia Civil', 'Energia Limpa', 'Pioneirismo Feminino'],
      anoOuEpoca: '1945',
      impacto: 'Abriu as portas para mulheres e negros na ciência exata e engenharia pesada no Brasil.'
    },
    {
      id: 'terra-preta-indigena',
      titulo: 'A Milenar Terra Preta de Índio',
      autorOuReferencia: 'Povos Originários da Bacia Amazônica',
      descricao: 'Biotecnologia agrícola desenvolvida há mais de 2.500 anos por indígenas amazônicos. Mistura enriquecida com biocarvão, matéria orgânica e minerais que mantém o solo fértil por séculos sem químicos nocivos.',
      categoria: 'Biotecnologia Ancestral',
      tags: ['Amazônia', 'Solos Sustentáveis', 'Agroecologia Indígena'],
      anoOuEpoca: 'Há mais de 2.500 anos',
      impacto: 'Modelo global de agricultura sustentável, sequestro de carbono e regeneração de ecossistemas.'
    },
    {
      id: 'joy-buolamwini',
      titulo: 'Desmascarando o Viés dos Algoritmos (Coded Bias)',
      autorOuReferencia: 'Joy Buolamwini (Pesquisadora do MIT)',
      descricao: 'Cientista da computação de origem ganense-americana que descobriu que softwares de reconhecimento facial de grandes corporações falhavam em pessoas negras por falta de dados representativos. Criou a Algorithmic Justice League.',
      categoria: 'Inteligência Artificial & Ética',
      tags: ['IA Ética', 'Visão Computacional', 'Justiça Algorítmica'],
      anoOuEpoca: 'Contemporânea (2016-Presente)',
      impacto: 'Mudou leis nos EUA e Europa sobre uso de reconhecimento facial em espaços públicos.'
    },
    {
      id: 'gladys-west',
      titulo: 'A Matemática do Espaço e do GPS',
      autorOuReferencia: 'Gladys Mae West (1930)',
      descricao: 'Matemática e programadora negra que trabalhou no centro de superfície naval dos EUA. Seus modelos de geodésia por satélite foram a base que permitiu a criação e precisão de todo o sistema de GPS do planeta.',
      categoria: 'Matemática & Tecnologia',
      tags: ['GPS', 'Satélites', 'Programação Pioneira'],
      anoOuEpoca: 'Década de 1970-1980',
      impacto: 'Toda localização em smartphones, aeronaves e logística mundial depende de seus cálculos.'
    },
    {
      id: 'andre-reboucas',
      titulo: 'Engenharia da Ferrovia e Abolição',
      autorOuReferencia: 'André Pinto Rebouças (1838-1898)',
      descricao: 'Engenheiro negro brilhante que projetou a espetacular ferrovia Curitiba-Paranaguá, atravessando a Serra do Mar com pontes suspensas revolucionárias. Foi um dos maiores estrategistas do movimento abolicionista no Brasil.',
      categoria: 'Engenharia & História',
      tags: ['Ferrovias', 'Abolicionismo', 'Engenharia Naval'],
      anoOuEpoca: 'Século XIX',
      impacto: 'Provou no auge do Império que a inteligência técnica negra construía a infraestrutura do país.'
    },
    {
      id: 'juliano-moreira',
      titulo: 'Fundador da Psiquiatria Humanizada no Brasil',
      autorOuReferencia: 'Dr. Juliano Moreira (1872-1933)',
      descricao: 'Médico baiano negro que revolucionou o tratamento da saúde mental no Brasil, abolindo o uso de camisas de força e correntes. Combateu as teorias racistas pseudocientíficas que tentavam associar doenças mentais à raça.',
      categoria: 'Medicina & Direitos Humanos',
      tags: ['Saúde Mental', 'Ciência Antirracista', 'Medicina'],
      anoOuEpoca: 'Início do Século XX',
      impacto: 'Derrubou teses racistas de Nina Rodrigues e fundou a Sociedade Brasileira de Psiquiatria.'
    },
    {
      id: 'otis-boykin',
      titulo: 'O Controle Elétrico e o Marca-Passo',
      autorOuReferencia: 'Otis Frank Boykin (1920-1982)',
      descricao: 'Inventor e cientista negro que patenteou mais de 28 dispositivos eletrônicos. Sua invenção de resistores de precisão que resistiam a variações extremas de temperatura salvou milhões de vidas ao viabilizar o marca-passo cardíaco moderno.',
      categoria: 'Eletrônica & Saúde',
      tags: ['Marca-passo', 'Circuitos Elétricos', 'Biomedicina'],
      anoOuEpoca: '1961',
      impacto: 'Componentes usados em mísseis guiados, computadores IBM e dispositivos cardíacos que salvam vidas.'
    },
    {
      id: 'lewis-latimer',
      titulo: 'A Luz Duradoura e a Patente do Telefone',
      autorOuReferencia: 'Lewis Howard Latimer (1848-1928)',
      descricao: 'Filho de escravizados fugitivos, Latimer inventou o filamento de carbono que tornou a lâmpada elétrica incandescente prática e durável (antes queimava em poucas horas). Também desenhou as plantas originais do telefone de Alexander Graham Bell.',
      categoria: 'Invenções & Eletricidade',
      tags: ['Lâmpada Elétrica', 'Telecomunicações', 'Desenho Técnico'],
      anoOuEpoca: '1881',
      impacto: 'Permitiu a eletrificação urbana de Nova York, Filadélfia e Londres.'
    },
    {
      id: 'ailton-krenak',
      titulo: 'Ideias Para Adiar o Fim do Mundo',
      autorOuReferencia: 'Ailton Krenak (Líder Indígena, Filósofo e Escritor da ABL)',
      descricao: 'Primeiro indígena eleito para a Academia Brasileira de Letras. Propõe que a tecnologia humana deve aprender com a floresta viva e com o rio doce ("Watu"), desafiando a lógica de destruição da natureza.',
      categoria: 'Filosofia & Ecologia Originária',
      tags: ['Literatura', 'Direitos Indígenas', 'Ecologia Viva'],
      anoOuEpoca: 'Contemporânea',
      impacto: 'Voz fundamental na COP e no pensamento filosófico planetário sobre o futuro da humanidade.'
    },
    {
      id: 'metalurgia-ioruba',
      titulo: 'Os Mestres do Ferro de Ogum',
      autorOuReferencia: 'Civilizações Iorubá e Banto (África Subsaariana)',
      descricao: 'Fornos africanos de alta temperatura produziam aço carbono superior ao europeu no século I a.C. No Brasil colonial, pessoas escravizadas trazidas do Benim e Angola eram as verdadeiras detentoras da técnica de fundição do ouro e ferro.',
      categoria: 'Metalurgia Ancestral',
      tags: ['Aço Carbono', 'Engenharia de Materiais', 'Tradição Banto'],
      anoOuEpoca: 'Século I a.C. em diante',
      impacto: 'A fundação da metalurgia e mineração no ciclo do ouro em Minas Gerais e Bahia.'
    },
    {
      id: 'timnit-gebru',
      titulo: 'Pioneira da IA Ética e Transparência de Dados',
      autorOuReferencia: 'Timnit Gebru (Cientista de Dados de Origem Etíope)',
      descricao: 'Coautora do artigo divisor de águas "Stochastic Parrots", denunciando o impacto ambiental e os preconceitos ocultos em grandes modelos de linguagem. Fundou o DAIR (Distributed AI Research Institute).',
      categoria: 'Inteligência Artificial & Ética',
      tags: ['Grandes Modelos de Linguagem', 'Auditoria Algorítmica', 'Pesquisa Independente'],
      anoOuEpoca: 'Contemporânea',
      impacto: 'Inspirou regulamentações mundiais para que inteligências artificiais sejam auditadas contra preconceitos.'
    }
  ]);
});

// GET Maker Lab projects guide for SME-Rio / Rioeduca
app.get('/api/projetos-get', (_req: Request, res: Response) => {
  res.json({
    sobreGET: 'O Ginásio Experimental Tecnológico (GET) é a grande política pública de educação integral da Prefeitura do Rio de Janeiro (SME-Rio), equipando escolas com FabLabs, cultura STEAM, pensamento computacional, corte a laser, robótica e impressoras 3D para transformar os alunos em produtores de conhecimento.',
    projetosMakerSugeridos: [
      {
        titulo: 'Robô Griô Contador de Histórias',
        tecnologias: ['Arduino / micro:bit', 'Sensor de proximidade ultrassônico', 'Módulo de som MP3'],
        descricao: 'Quando o visitante se aproxima da escultura ou maquete, o robô conta a biografia de Enedina Alves Marques ou um mito africano narrado pelas vozes dos próprios estudantes do 6º ao 9º ano.',
        habilidadesBNCC: ['História e Cultura Afro-Brasileira (Lei 10.639)', 'Lógica de Programação', 'Oralidade']
      },
      {
        titulo: 'Auditoria de Visão Computacional Antirracista',
        tecnologias: ['Google Teachable Machine', 'Webcam', 'Scratch'],
        descricao: 'Treinar um classificador de IA com fotografias de alunos de diferentes etnias, cabelos crespos e traços indígenas para testar se a máquina acerta igualmente ou se possui viés de luminosidade, gerando um debate crítico.',
        habilidadesBNCC: ['Letramento Digital', 'Pensamento Crítico', 'Cidadania Algorítmica']
      },
      {
        titulo: 'Horta Inteligente Inspirada na Terra Preta Amazônica',
        tecnologias: ['Sensor de umidade de solo', 'Bomba d’água 5V', 'Compostagem com biochar'],
        descricao: 'Combinar biotecnologia milenar indígena (adubação com carvão ativado vegetal) e irrigação automatizada controlada por microcomputador na horta da escola.',
        habilidadesBNCC: ['Ciências da Natureza', 'Sustentabilidade', 'Automação']
      },
      {
        titulo: 'Quiz Interativo em Impressão 3D e Botões Arcade',
        tecnologias: ['Impressão 3D de símbolos Adinkra', 'Botões arcade iluminados', 'Makey Makey ou Raspberry Pi'],
        descricao: 'Criar um totem físico com peças tácteis que representam a obra de Bárbara Carine ("A História Preta das Coisas"), onde cada botão aciona uma pergunta e ilumina LEDs coloridos.',
        habilidadesBNCC: ['Design Maker', 'Prototipagem Rápida', 'Gamificação Educacional']
      }
    ]
  });
});

// Setup Vite middleware in dev or serve dist in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server Negro! I.A.gora? rodando na porta ${PORT} (dev: ${isDev})`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
});
