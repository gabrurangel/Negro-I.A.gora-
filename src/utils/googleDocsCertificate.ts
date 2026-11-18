import { DiagnosticoFinal } from '../types.ts';

export interface CertificateDocPayload {
  studentName: string;
  autodeclaracao: string;
  perfilLabel: 'Sou Negro!' | 'Aliado Antirracista';
  isEthnicGroup: boolean;
  isWhiteOrAsian: boolean;
  caracteristicas: {
    cabelo?: string;
    tracos?: string;
    raizes?: string;
  };
  diagnostico: DiagnosticoFinal;
  dateLabel?: string;
}

export interface GeneratedCertificateDoc {
  documentId: string;
  title: string;
  webViewLink: string;
  createdAt: string;
}

export class GoogleAuthExpiredError extends Error {
  constructor(message = 'Sua sessão do Google expirou. Faça login novamente.') {
    super(message);
    this.name = 'GoogleAuthExpiredError';
  }
}

interface RGBColor {
  red: number;
  green: number;
  blue: number;
}

const COLORS = {
  amberDark: { red: 0.706, green: 0.325, blue: 0.035 }, // #B45309
  amberAccent: { red: 0.851, green: 0.467, blue: 0.024 }, // #D97706
  emeraldDark: { red: 0.02, green: 0.471, blue: 0.341 }, // #057857
  cyanDark: { red: 0.055, green: 0.455, blue: 0.565 }, // #0E7490
  slateDark: { red: 0.059, green: 0.09, blue: 0.165 }, // #0F172A
  slateMuted: { red: 0.278, green: 0.333, blue: 0.412 }, // #475569
};

interface TextStyleOpts {
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  color?: RGBColor;
  fontFamily?: string;
}

interface ParagraphStyleOpts {
  alignment?: 'START' | 'CENTER' | 'END' | 'JUSTIFIED';
  spaceAbove?: number;
  spaceBelow?: number;
  lineSpacing?: number;
  borderBottomColor?: RGBColor;
}

function buildCertificateRequests(payload: CertificateDocPayload): Record<string, unknown>[] {
  const {
    studentName,
    autodeclaracao,
    perfilLabel,
    isEthnicGroup,
    isWhiteOrAsian,
    caracteristicas,
    diagnostico,
    dateLabel = new Date().toLocaleDateString('pt-BR'),
  } = payload;

  let buffer = '';
  const styleRequests: Record<string, unknown>[] = [];
  const bulletRanges: Array<{ startIndex: number; endIndex: number }> = [];

  const appendParagraph = (
    text: string,
    textStyle?: TextStyleOpts,
    paraStyle?: ParagraphStyleOpts,
    isBullet = false
  ) => {
    const startIndex = 1 + buffer.length;
    const textEndIndex = startIndex + text.length;
    buffer += text + '\n';
    const paraEndIndex = 1 + buffer.length;

    if (paraStyle) {
      const pStyle: Record<string, unknown> = {};
      const fields: string[] = [];

      if (paraStyle.alignment) {
        pStyle.alignment = paraStyle.alignment;
        fields.push('alignment');
      }
      if (paraStyle.spaceAbove !== undefined) {
        pStyle.spaceAbove = { magnitude: paraStyle.spaceAbove, unit: 'PT' };
        fields.push('spaceAbove');
      }
      if (paraStyle.spaceBelow !== undefined) {
        pStyle.spaceBelow = { magnitude: paraStyle.spaceBelow, unit: 'PT' };
        fields.push('spaceBelow');
      }
      if (paraStyle.lineSpacing !== undefined) {
        pStyle.lineSpacing = paraStyle.lineSpacing;
        fields.push('lineSpacing');
      }
      if (paraStyle.borderBottomColor) {
        pStyle.borderBottom = {
          color: { color: { rgbColor: paraStyle.borderBottomColor } },
          width: { magnitude: 1.5, unit: 'PT' },
          padding: { magnitude: 6, unit: 'PT' },
          dashStyle: 'SOLID',
        };
        fields.push('borderBottom');
      }

      if (fields.length > 0) {
        styleRequests.push({
          updateParagraphStyle: {
            range: { startIndex, endIndex: paraEndIndex },
            paragraphStyle: pStyle,
            fields: fields.join(','),
          },
        });
      }
    }

    if (textStyle && text.length > 0) {
      const tStyle: Record<string, unknown> = {};
      const fields: string[] = [];

      if (textStyle.bold !== undefined) {
        tStyle.bold = textStyle.bold;
        fields.push('bold');
      }
      if (textStyle.italic !== undefined) {
        tStyle.italic = textStyle.italic;
        fields.push('italic');
      }
      if (textStyle.fontSize !== undefined) {
        tStyle.fontSize = { magnitude: textStyle.fontSize, unit: 'PT' };
        fields.push('fontSize');
      }
      if (textStyle.color) {
        tStyle.foregroundColor = { color: { rgbColor: textStyle.color } };
        fields.push('foregroundColor');
      }
      if (textStyle.fontFamily) {
        tStyle.weightedFontFamily = { fontFamily: textStyle.fontFamily };
        fields.push('weightedFontFamily');
      }

      if (fields.length > 0) {
        styleRequests.push({
          updateTextStyle: {
            range: { startIndex, endIndex: textEndIndex },
            textStyle: tStyle,
            fields: fields.join(','),
          },
        });
      }
    }

    if (isBullet) {
      bulletRanges.push({ startIndex, endIndex: paraEndIndex });
    }
  };

  // Institutional Banner & Title
  appendParagraph(
    'GINÁSIO EXPERIMENTAL TECNOLÓGICO (GET) • RIOEDUCA • REDE PÚBLICA CARIOCA',
    { bold: true, fontSize: 10, color: COLORS.amberDark, fontFamily: 'Space Grotesk' },
    { alignment: 'CENTER', spaceAbove: 0, spaceBelow: 4 }
  );

  appendParagraph(
    'CERTIFICADO DE CONCLUSÃO E CONSCIÊNCIA CRÍTICA',
    { bold: true, fontSize: 18, color: COLORS.slateDark, fontFamily: 'Space Grotesk' },
    { alignment: 'CENTER', spaceAbove: 4, spaceBelow: 2 }
  );

  appendParagraph(
    'Projeto Educacional: Sou Negro! I.A.gora? — Consciência Racial, Saberes Ancestrais & IA Ética',
    { bold: true, italic: true, fontSize: 11, color: COLORS.emeraldDark, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'CENTER', spaceAbove: 0, spaceBelow: 12, borderBottomColor: COLORS.amberAccent }
  );

  // Student Certification Statement
  appendParagraph(
    'Certificamos que',
    { fontSize: 12, color: COLORS.slateMuted, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'CENTER', spaceAbove: 10, spaceBelow: 2 }
  );

  appendParagraph(
    studentName.toUpperCase(),
    { bold: true, fontSize: 18, color: COLORS.amberDark, fontFamily: 'Space Grotesk' },
    { alignment: 'CENTER', spaceAbove: 2, spaceBelow: 6 }
  );

  appendParagraph(
    'concluiu com 100% de engajamento as três fases da jornada interativa de autopercepção identitária, valorização das políticas de ação afirmativa, ciência negra e indígena, combate ao cyberbullying e cidadania digital ética.',
    { fontSize: 11, color: COLORS.slateDark, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'CENTER', spaceAbove: 0, spaceBelow: 14, lineSpacing: 125 }
  );

  // Section 1: Self-Declaration & Profile
  appendParagraph(
    '1. AUTODECLARAÇÃO & PERFIL NA EXPEDIÇÃO',
    { bold: true, fontSize: 12, color: COLORS.amberDark, fontFamily: 'Space Grotesk' },
    { alignment: 'START', spaceAbove: 8, spaceBelow: 4, borderBottomColor: COLORS.amberAccent }
  );

  appendParagraph(
    `Classificação no Painel Final: ${perfilLabel}`,
    {
      bold: true,
      fontSize: 11,
      color: isEthnicGroup ? COLORS.amberDark : COLORS.cyanDark,
      fontFamily: 'Plus Jakarta Sans',
    },
    { alignment: 'START', spaceAbove: 4, spaceBelow: 2 }
  );

  appendParagraph(
    `Autodeclaração escolhida na questão final da Fase 1 (IBGE): ${autodeclaracao}`,
    { bold: true, fontSize: 11, color: COLORS.slateDark, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'START', spaceAbove: 0, spaceBelow: 4 }
  );

  const recognitionNote = isWhiteOrAsian
    ? 'Nota de Reconhecimento: A autoidentificação sincera é a base do respeito. Como Aliado Antirracista, seu apoio, empatia e compromisso diário contra o preconceito são indispensáveis para transformar a escola e a sociedade.'
    : 'Nota de Reconhecimento: Você afirmou com dignidade sua identidade e lugar na história do Brasil. Seus cabelos, seus traços e suas raízes carregam sabedoria e protagonismo ancestral.';

  appendParagraph(
    recognitionNote,
    { italic: true, fontSize: 10.5, color: COLORS.slateMuted, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'JUSTIFIED', spaceAbove: 0, spaceBelow: 10, lineSpacing: 120 }
  );

  // Section 2: Trajectory Summary
  appendParagraph(
    '2. RESUMO DA SUA TRAJETÓRIA',
    { bold: true, fontSize: 12, color: COLORS.amberDark, fontFamily: 'Space Grotesk' },
    { alignment: 'START', spaceAbove: 6, spaceBelow: 4, borderBottomColor: COLORS.amberAccent }
  );

  const traitsParts: string[] = [];
  if (caracteristicas.cabelo) {
    traitsParts.push(`quanto à estética e ao cabelo, afirmou: "${caracteristicas.cabelo}"`);
  }
  if (caracteristicas.tracos) {
    traitsParts.push(`observando os traços do rosto e o espelho da família, reconheceu: "${caracteristicas.tracos}"`);
  }
  if (caracteristicas.raizes) {
    traitsParts.push(`resgatando suas raízes familiares, expressou: "${caracteristicas.raizes}"`);
  }

  const traitsParagraph =
    traitsParts.length > 0
      ? `Durante a primeira fase de autodescoberta, o(a) estudante compartilhou suas características físicas e culturais: ${traitsParts.join('; ')}.`
      : 'Durante a primeira fase de autodescoberta, o(a) estudante refletiu com sinceridade sobre suas características estéticas, traços familiares e origens culturais.';

  appendParagraph(
    traitsParagraph,
    { fontSize: 10.5, color: COLORS.slateDark, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'JUSTIFIED', spaceAbove: 4, spaceBelow: 6, lineSpacing: 125 }
  );

  appendParagraph(
    'Nas fases seguintes, defendeu a política de cotas nas Escolas Técnicas Estaduais (FAETEC), colégios federais e universidades públicas como reparação histórica; valorizou o pioneirismo científico negro e indígena; posicionou-se firmemente contra o cyberbullying e o racismo digital nos grupos de mensagens (orientações da MultiRio); e assumiu o compromisso de criar tecnologias e inteligências artificiais justas no laboratório maker do GET.',
    { fontSize: 10.5, color: COLORS.slateDark, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'JUSTIFIED', spaceAbove: 0, spaceBelow: 10, lineSpacing: 125 }
  );

  // Section 3: Final Diagnosis
  appendParagraph(
    '3. DIAGNÓSTICO PEDAGÓGICO',
    { bold: true, fontSize: 12, color: COLORS.amberDark, fontFamily: 'Space Grotesk' },
    { alignment: 'START', spaceAbove: 6, spaceBelow: 4, borderBottomColor: COLORS.amberAccent }
  );

  appendParagraph(
    diagnostico.titulo,
    { bold: true, fontSize: 11, color: COLORS.emeraldDark, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'START', spaceAbove: 4, spaceBelow: 2 }
  );

  appendParagraph(
    diagnostico.mensagem,
    { fontSize: 10.5, color: COLORS.slateDark, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'JUSTIFIED', spaceAbove: 0, spaceBelow: 10, lineSpacing: 125 }
  );

  // Section 4: Reflective Medals
  if (diagnostico.medalhas && diagnostico.medalhas.length > 0) {
    appendParagraph(
      '4. MEDALHAS REFLEXIVAS CONQUISTADAS',
      { bold: true, fontSize: 12, color: COLORS.amberDark, fontFamily: 'Space Grotesk' },
      { alignment: 'START', spaceAbove: 6, spaceBelow: 4, borderBottomColor: COLORS.amberAccent }
    );

    diagnostico.medalhas.forEach((medal) => {
      appendParagraph(
        medal,
        { bold: true, fontSize: 10.5, color: COLORS.slateDark, fontFamily: 'Plus Jakarta Sans' },
        { alignment: 'START', spaceAbove: 2, spaceBelow: 2 },
        true
      );
    });
  }

  // Section 5: Maker Challenge at GET
  if (diagnostico.desafioMakerGET) {
    appendParagraph(
      '5. MISSÃO PRÁTICA MAKER NO GET',
      { bold: true, fontSize: 12, color: COLORS.emeraldDark, fontFamily: 'Space Grotesk' },
      { alignment: 'START', spaceAbove: 8, spaceBelow: 4, borderBottomColor: COLORS.emeraldDark }
    );

    appendParagraph(
      diagnostico.desafioMakerGET,
      { fontSize: 10.5, color: COLORS.slateDark, fontFamily: 'Plus Jakarta Sans' },
      { alignment: 'JUSTIFIED', spaceAbove: 4, spaceBelow: 14, lineSpacing: 125 }
    );
  }

  // Signature & Issue Date Footer
  appendParagraph(
    `Documento gerado oficialmente via Google Docs em ${dateLabel}`,
    { italic: true, fontSize: 9.5, color: COLORS.slateMuted, fontFamily: 'Plus Jakarta Sans' },
    { alignment: 'CENTER', spaceAbove: 14, spaceBelow: 2 }
  );

  appendParagraph(
    'Projeto Sou Negro! I.A.gora? • Ginásio Experimental Tecnológico (GET) • Rioeduca',
    { bold: true, fontSize: 10, color: COLORS.amberDark, fontFamily: 'Space Grotesk' },
    { alignment: 'CENTER', spaceAbove: 0, spaceBelow: 0 }
  );

  const requests: Record<string, unknown>[] = [
    {
      updateDocumentStyle: {
        documentStyle: {
          marginTop: { magnitude: 44, unit: 'PT' },
          marginBottom: { magnitude: 44, unit: 'PT' },
          marginLeft: { magnitude: 50, unit: 'PT' },
          marginRight: { magnitude: 50, unit: 'PT' },
        },
        fields: 'marginTop,marginBottom,marginLeft,marginRight',
      },
    },
    {
      insertText: {
        location: { index: 1 },
        text: buffer,
      },
    },
    ...styleRequests,
  ];

  // Apply bullets after text insertion
  if (bulletRanges.length > 0) {
    const firstStart = bulletRanges[0].startIndex;
    const lastEnd = bulletRanges[bulletRanges.length - 1].endIndex;
    requests.push({
      createParagraphBullets: {
        range: { startIndex: firstStart, endIndex: lastEnd },
        bulletPreset: 'BULLET_DISC_CIRCLE_SQUARE',
      },
    });
  }

  return requests;
}

export async function createCertificateGoogleDoc(
  accessToken: string,
  payload: CertificateDocPayload
): Promise<GeneratedCertificateDoc> {
  const dateLabel = payload.dateLabel || new Date().toLocaleDateString('pt-BR');
  const title = `Certificado • Sou Negro! I.A.gora? — ${payload.studentName} (${dateLabel})`;

  // 1. Create blank Google Doc
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (createRes.status === 401) {
    throw new GoogleAuthExpiredError();
  }
  if (!createRes.ok) {
    const errBody = await createRes.text();
    throw new Error(`Falha ao criar documento no Google Docs (${createRes.status}): ${errBody}`);
  }

  const createdDoc = (await createRes.json()) as { documentId: string; title: string };
  const documentId = createdDoc.documentId;

  // 2. Populate & style certificate content with batchUpdate
  const requests = buildCertificateRequests({ ...payload, dateLabel });
  const batchRes = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (batchRes.status === 401) {
    throw new GoogleAuthExpiredError();
  }
  if (!batchRes.ok) {
    const errBody = await batchRes.text();
    throw new Error(`Falha ao formatar certificado no Google Docs (${batchRes.status}): ${errBody}`);
  }

  return {
    documentId,
    title: createdDoc.title || title,
    webViewLink: `https://docs.google.com/document/d/${documentId}/edit`,
    createdAt: new Date().toISOString(),
  };
}

export async function listGeneratedCertificates(
  accessToken: string
): Promise<GeneratedCertificateDoc[]> {
  const query = encodeURIComponent(
    "mimeType='application/vnd.google-apps.document' and name contains 'Certificado • Sou Negro! I.A.gora?' and trashed=false"
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,createdTime)&orderBy=createdTime desc&pageSize=5`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.status === 401) {
    throw new GoogleAuthExpiredError();
  }
  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as {
    files?: Array<{
      id: string;
      name: string;
      webViewLink?: string;
      createdTime?: string;
    }>;
  };

  return (data.files || []).map((f) => ({
    documentId: f.id,
    title: f.name,
    webViewLink: f.webViewLink || `https://docs.google.com/document/d/${f.id}/edit`,
    createdAt: f.createdTime || new Date().toISOString(),
  }));
}

export async function downloadCertificatePdf(
  accessToken: string,
  documentId: string,
  fileName: string
): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${documentId}/export?mimeType=application/pdf`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (res.status === 401) {
    throw new GoogleAuthExpiredError();
  }
  if (!res.ok) {
    throw new Error('Não foi possível exportar o PDF a partir do Google Docs.');
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${fileName.replace(/[^\w\s-]/g, '').trim() || 'Certificado_Sou_Negro_IAGora'}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function deleteCertificateFromDrive(
  accessToken: string,
  documentId: string
): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${documentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    throw new GoogleAuthExpiredError();
  }
  if (!res.ok) {
    throw new Error('Não foi possível excluir o documento do Google Drive.');
  }
}
