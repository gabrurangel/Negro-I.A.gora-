import { PistaCultural, MakerProject } from '../types.ts';

export const PISTAS_HISTORICAS: PistaCultural[] = [
  {
    id: 'barbara-carine',
    titulo: 'A História Preta das Coisas',
    autorOuReferencia: 'Profª Dra. Bárbara Carine Soares Pinheiro',
    descricao: 'Química e escritora baiana que fundou uma escola afro-brasileira. No livro "A História Preta das Coisas", ela revela 50 invenções incríveis criadas por pessoas negras que a escola quase nunca ensina: da química e medicina na África antiga até tecnologias modernas!',
    categoria: 'Ciência & Educação',
    icon: 'BookOpen',
    tags: ['Química', 'África Berço da Ciência', 'Educação Antirracista'],
    anoOuEpoca: 'Hoje em dia',
    impacto: 'Derruba a mentira de que ciência é só coisa europeia e dá orgulho pra juventude negra e indígena.'
  },
  {
    id: 'enedina-alves',
    titulo: 'A Força das Águas e do Concreto',
    autorOuReferencia: 'Enedina Alves Marques (1913–1981)',
    descricao: 'Filha de uma trabalhadora doméstica, Enedina estudou muito e virou a primeira engenheira negra do Brasil em 1945! Ela encarou o preconceito e comandou as obras da Usina Hidrelétrica Capivari-Cachoeira, furando montanhas inteiras no Paraná.',
    categoria: 'Engenharia & Infraestrutura',
    icon: 'Cpu',
    tags: ['Engenharia Civil', 'Energia Limpa', 'Pioneirismo'],
    anoOuEpoca: '1945',
    impacto: 'Provou que mulheres negras podem liderar as maiores obras de engenharia do país.'
  },
  {
    id: 'terra-preta-indigena',
    titulo: 'A Milenar Terra Preta de Índio',
    autorOuReferencia: 'Povos Indígenas da Amazônia',
    descricao: 'Mais de 2.500 anos atrás, povos indígenas inventaram um solo super adubado com carvão vegetal e restos naturais que fica fértil por séculos sem precisar de adubo químico. Até hoje os cientistas mais modernos do mundo tentam copiar essa biotecnologia da floresta!',
    categoria: 'Biotecnologia Ancestral',
    icon: 'Sparkles',
    tags: ['Amazônia', 'Solos Férteis', 'Sustentabilidade'],
    anoOuEpoca: 'Há 2.500 anos',
    impacto: 'Uma lição de agricultura ecológica e preservação do planeta que vem dos povos da floresta.'
  },
  {
    id: 'joy-buolamwini',
    titulo: 'Desmascarando o Viés dos Algoritmos (Coded Bias)',
    autorOuReferencia: 'Joy Buolamwini (Pesquisadora do MIT)',
    descricao: 'Cientista que testou câmeras inteligentes de grandes empresas e descobriu um escândalo: os robôs de reconhecimento facial erravam muito mais em rostos negros (e erravam quase zero em brancos!). Ela fundou a Liga da Justiça Algorítmica pra lutar por robôs sem preconceito.',
    categoria: 'Inteligência Artificial & Ética',
    icon: 'ShieldCheck',
    tags: ['IA Ética', 'Visão Computacional', 'Justiça Algorítmica'],
    anoOuEpoca: 'Hoje em dia',
    impacto: 'Mudou regras no mundo inteiro sobre como câmeras e inteligências artificiais devem funcionar.'
  },
  {
    id: 'gladys-west',
    titulo: 'A Mente Matemática por Trás do GPS',
    autorOuReferencia: 'Gladys Mae West (1930)',
    descricao: 'Matemática negra que programou os primeiros supercomputadores espaciais. Ela calculou com exatidão o formato da Terra usando dados de satélites no espaço — e foi essa conta matemática que permitiu criar o GPS que a gente usa todo dia no celular e no Uber!',
    categoria: 'Matemática & Tecnologia',
    icon: 'Award',
    tags: ['GPS', 'Satélites', 'Computação'],
    anoOuEpoca: 'Anos 1970–1980',
    impacto: 'Toda vez que você abre o mapa no smartphone, você está usando a inteligência de Gladys West.'
  },
  {
    id: 'andre-reboucas',
    titulo: 'O Gênio das Ferrovias e Pontes',
    autorOuReferencia: 'André Pinto Rebouças (1838–1898)',
    descricao: 'Engenheiro negro super talentoso que projetou a ferrovia Curitiba-Paranaguá. Os europeus diziam que era impossível atravessar aquela serra cheia de abismos, mas ele desenhou pontes suspensas incríveis e provou a inteligência negra no Brasil!',
    categoria: 'Engenharia & História',
    icon: 'Cpu',
    tags: ['Ferrovias', 'Abolicionismo', 'Engenharia'],
    anoOuEpoca: 'Século XIX',
    impacto: 'Um dos maiores engenheiros da história do Brasil que também lutou pelo fim da escravidão.'
  },
  {
    id: 'juliano-moreira',
    titulo: 'O Médico que Derrubou o Racismo na Ciência',
    autorOuReferencia: 'Dr. Juliano Moreira (1872–1933)',
    descricao: 'Médico negro da Bahia que acabou com a crueldade nos hospitais psiquiátricos, tirando os pacientes de correntes e celas. Ele usou a ciência para provar que a cor da pele ou a origem não têm nada a ver com doenças mentais, calando os racistas da época.',
    categoria: 'Medicina & Direitos Humanos',
    icon: 'Award',
    tags: ['Saúde Mental', 'Ciência Antirracista', 'Medicina'],
    anoOuEpoca: 'Início do Século XX',
    impacto: 'Fundou o tratamento humanizado no Brasil e defendeu a dignidade do povo negro.'
  },
  {
    id: 'otis-boykin',
    titulo: 'O Chip que Salvou Vidas no Marca-Passo',
    autorOuReferencia: 'Otis Frank Boykin (1920–1982)',
    descricao: 'Inventor negro que criou componentes eletrônicos miniaturizados que não queimavam nem com mudanças extremas de temperatura. A invenção dele foi usada em computadores da IBM e tornou possível o marca-passo no coração, salvando milhões de vidas!',
    categoria: 'Eletrônica & Saúde',
    icon: 'Cpu',
    tags: ['Marca-passo', 'Eletrônica', 'Biomedicina'],
    anoOuEpoca: '1961',
    impacto: 'Aparelhos no coração de pessoas no mundo todo funcionam graças ao circuito que ele inventou.'
  },
  {
    id: 'lewis-latimer',
    titulo: 'A Luz que Não Apaga e o Desenho do Telefone',
    autorOuReferencia: 'Lewis Howard Latimer (1848–1928)',
    descricao: 'Antes dele, as lâmpadas queimavam em poucas horas. Latimer inventou um filamento de carbono resistente que fazia as lâmpadas durarem centenas de horas acesas! Ele também foi o desenhista técnico que fez as plantas do primeiro telefone do mundo.',
    categoria: 'Invenções & Eletricidade',
    icon: 'Sparkles',
    tags: ['Lâmpada Elétrica', 'Telecomunicações', 'Desenho Técnico'],
    anoOuEpoca: '1881',
    impacto: 'Iluminou as ruas das grandes cidades e ajudou a criar o telefone.'
  },
  {
    id: 'ailton-krenak',
    titulo: 'Sabedoria da Floresta e o Futuro da Terra',
    autorOuReferencia: 'Ailton Krenak (Líder Indígena e Escritor da ABL)',
    descricao: 'Primeiro indígena a entrar para a Academia Brasileira de Letras. Krenak ensina que a maior tecnologia que existe é viver em paz com os rios e as árvores, e que a humanidade precisa aprender com os povos originários se quiser salvar o planeta.',
    categoria: 'Filosofia & Ecologia Originária',
    icon: 'BookOpen',
    tags: ['Literatura', 'Direitos Indígenas', 'Ecologia Viva'],
    anoOuEpoca: 'Hoje em dia',
    impacto: 'Um dos pensadores mais ouvidos do mundo sobre meio ambiente e futuro da humanidade.'
  },
  {
    id: 'metalurgia-ioruba',
    titulo: 'Mestres do Fogo, do Ferro e do Aço',
    autorOuReferencia: 'Povos Africanos Iorubá e Banto',
    descricao: 'Muito tempo antes das fábricas modernas, povos africanos já faziam fornos a mais de 1.400°C pra produzir aço de altíssima qualidade. Quando os africanos foram trazidos pro Brasil, eles eram os verdadeiros donos da tecnologia de mineração e ferraria!',
    categoria: 'Metalurgia Ancestral',
    icon: 'Cpu',
    tags: ['Aço Carbono', 'Engenharia de Materiais', 'Tradição Banto'],
    anoOuEpoca: 'Mais de 2.000 anos atrás',
    impacto: 'Construiu a base de todas as construções, ferramentas e cidades brasileiras.'
  },
  {
    id: 'timnit-gebru',
    titulo: 'A Investigadora dos Erros da IA',
    autorOuReferencia: 'Timnit Gebru (Cientista de Dados)',
    descricao: 'Cientista de dados que trabalhou no Google e alertou o mundo que os grandes robôs de conversa e inteligências artificiais estavam aprendendo preconceitos e mentiras da internet. Hoje ela lidera pesquisas para criar IAs transparentes e do bem.',
    categoria: 'Inteligência Artificial & Ética',
    icon: 'ShieldCheck',
    tags: ['IA Responsável', 'Dados Críticos', 'Cidadania Digital'],
    anoOuEpoca: 'Hoje em dia',
    impacto: 'Abriu os olhos do mundo para os perigos de confiar cegamente em robôs sem fiscalização.'
  }
];

export const PROJETOS_MAKER_GET: MakerProject[] = [
  {
    titulo: 'Robô Griô Contador de Histórias Ancestrais',
    tecnologias: ['Arduino / micro:bit', 'Sensor ultrassônico de distância', 'Módulo de áudio DFPlayer'],
    descricao: 'No laboratório do GET, os alunos constroem uma escultura ou totem interativo. Quando alguém passa em frente, o sensor aciona a voz dos próprios estudantes contando a vida de Bárbara Carine, Enedina Alves Marques ou de líderes indígenas locais.',
    habilidadesBNCC: ['História e Cultura Afro-Brasileira (Lei 10.639)', 'Lógica de Programação', 'Oralidade e Mídia']
  },
  {
    titulo: 'Laboratório de Visão Computacional Antirracista',
    tecnologias: ['Google Teachable Machine', 'Webcam', 'Scratch / Python'],
    descricao: 'Os estudantes treinam um modelo de inteligência artificial para reconhecer rostos e cabelos com diversidade real (crespos, cacheados, lisos, tranças, tons de pele). Comparam o resultado com modelos fechados e debatem o viés algorítmico.',
    habilidadesBNCC: ['Letramento Digital', 'Pensamento Crítico', 'Cidadania Algorítmica']
  },
  {
    titulo: 'Horta Inteligente Inspirada na Terra Preta Amazônica',
    tecnologias: ['Sensor de umidade capacitivo', 'Bomba d’água 5V', 'Compostagem com biochar'],
    descricao: 'União da sabedoria ancestral dos povos originários amazônicos (preparo de substrato hiperfértil com carvão ativado) com a cultura maker e IoT do GET para rega automatizada das plantas da escola.',
    habilidadesBNCC: ['Ciências da Natureza', 'Sustentabilidade', 'Automação e Robótica']
  },
  {
    titulo: 'Quiz Físico Adinkra com Impressão 3D e Botões Arcade',
    tecnologias: ['Modelagem 3D (Tinkercad)', 'Impressora 3D', 'Makey Makey / Microcontrolador'],
    descricao: 'Prototipagem de um jogo de tabuleiro eletrônico interativo. As peças físicas são símbolos Adinkra impressos em 3D que, quando encaixadas na mesa condutiva, acionam desafios sobre "A História Preta das Coisas".',
    habilidadesBNCC: ['Design Maker', 'Prototipagem Rápida', 'Gamificação Educacional']
  }
];
