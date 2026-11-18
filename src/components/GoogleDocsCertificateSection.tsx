import React, { useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  FileText,
  ExternalLink,
  Download,
  Trash2,
  Loader2,
  CheckCircle2,
  LogOut,
  AlertTriangle,
  Sparkles,
  X,
} from 'lucide-react';
import { DiagnosticoFinal } from '../types.ts';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  clearCachedToken,
  logout,
} from '../utils/googleAuth.ts';
import {
  createCertificateGoogleDoc,
  listGeneratedCertificates,
  downloadCertificatePdf,
  deleteCertificateFromDrive,
  GeneratedCertificateDoc,
  GoogleAuthExpiredError,
} from '../utils/googleDocsCertificate.ts';
import { GoogleSignInButton } from './GoogleSignInButton.tsx';

interface GoogleDocsCertificateSectionProps {
  studentName: string;
  autodeclaracao: string;
  isEthnicGroup: boolean;
  isWhiteOrAsian: boolean;
  caracteristicas: {
    cabelo?: string;
    tracos?: string;
    raizes?: string;
  };
  diagnostico: DiagnosticoFinal;
}

export const GoogleDocsCertificateSection: React.FC<GoogleDocsCertificateSectionProps> = ({
  studentName,
  autodeclaracao,
  isEthnicGroup,
  isWhiteOrAsian,
  caracteristicas,
  diagnostico,
}) => {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingPdfId, setIsDownloadingPdfId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedCertificateDoc[]>([]);
  const [latestCreatedDoc, setLatestCreatedDoc] = useState<GeneratedCertificateDoc | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [docPendingDeletion, setDocPendingDeletion] = useState<GeneratedCertificateDoc | null>(null);

  const loadExistingDocs = useCallback(async (token: string) => {
    try {
      const docs = await listGeneratedCertificates(token);
      setGeneratedDocs(docs);
    } catch (err) {
      if (err instanceof GoogleAuthExpiredError) {
        clearCachedToken();
        setNeedsAuth(true);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      (loggedUser, token) => {
        setUser(loggedUser);
        setNeedsAuth(false);
        loadExistingDocs(token);
      },
      () => {
        setUser(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, [loadExistingDocs]);

  const handleLogin = async () => {
    setErrorMsg(null);
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setNeedsAuth(false);
        await loadExistingDocs(result.accessToken);
      }
    } catch (err) {
      console.error('Erro no login Google:', err);
      setErrorMsg(
        'Não foi possível concluir a autenticação com o Google. Verifique se pop-ups estão permitidos e tente novamente.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setNeedsAuth(true);
    setGeneratedDocs([]);
    setLatestCreatedDoc(null);
  };

  const handleGenerateCertificate = async () => {
    setErrorMsg(null);
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setIsGenerating(true);
    try {
      const doc = await createCertificateGoogleDoc(token, {
        studentName: studentName.trim() || 'Estudante',
        autodeclaracao,
        perfilLabel: isEthnicGroup ? 'Sou Negro!' : 'Aliado Antirracista',
        isEthnicGroup,
        isWhiteOrAsian,
        caracteristicas,
        diagnostico,
      });

      setLatestCreatedDoc(doc);
      setGeneratedDocs((prev) => [doc, ...prev.filter((d) => d.documentId !== doc.documentId)]);
    } catch (err) {
      if (err instanceof GoogleAuthExpiredError) {
        clearCachedToken();
        setNeedsAuth(true);
        setErrorMsg(err.message);
      } else {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : 'Erro ao gerar o certificado no Google Docs.'
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = async (doc: GeneratedCertificateDoc) => {
    setErrorMsg(null);
    const token = await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      return;
    }

    setIsDownloadingPdfId(doc.documentId);
    try {
      await downloadCertificatePdf(token, doc.documentId, doc.title);
    } catch (err) {
      if (err instanceof GoogleAuthExpiredError) {
        clearCachedToken();
        setNeedsAuth(true);
        setErrorMsg(err.message);
      } else {
        setErrorMsg(err instanceof Error ? err.message : 'Erro ao exportar PDF.');
      }
    } finally {
      setIsDownloadingPdfId(null);
    }
  };

  const confirmDeleteCertificate = async () => {
    if (!docPendingDeletion) return;
    setErrorMsg(null);
    const token = await getAccessToken();
    if (!token) {
      setDocPendingDeletion(null);
      setNeedsAuth(true);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCertificateFromDrive(token, docPendingDeletion.documentId);
      setGeneratedDocs((prev) =>
        prev.filter((d) => d.documentId !== docPendingDeletion.documentId)
      );
      if (latestCreatedDoc?.documentId === docPendingDeletion.documentId) {
        setLatestCreatedDoc(null);
      }
      setDocPendingDeletion(null);
    } catch (err) {
      if (err instanceof GoogleAuthExpiredError) {
        clearCachedToken();
        setNeedsAuth(true);
        setErrorMsg(err.message);
      } else {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : 'Erro ao excluir certificado do Google Drive.'
        );
      }
      setDocPendingDeletion(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/40 shadow-xl space-y-4 print:hidden">
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/40 shadow-inner shrink-0">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2 flex-wrap">
              <span>Certificado Oficial no Google Docs</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold uppercase tracking-wider">
                Google Drive
              </span>
            </h4>
            <p className="text-xs text-slate-300">
              Crie e salve um documento oficial no seu Google Docs com seu nome, autodeclaração, resumo da trajetória, medalhas e missão no GET.
            </p>
          </div>
        </div>

        {!needsAuth && user && (
          <div className="flex items-center gap-2 text-xs bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Google User'}
                className="w-5 h-5 rounded-full border border-slate-700"
              />
            )}
            <span className="text-slate-200 font-medium max-w-[160px] truncate">
              {user.email || user.displayName}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-300 transition-colors ml-1 cursor-pointer"
              title="Desconectar conta Google"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {needsAuth ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-bold text-white">
              Conecte sua conta Google para emitir o certificado
            </p>
            <p className="text-slate-400 text-xs">
              O certificado formatado será criado diretamente no seu Google Docs e salvo no seu Google Drive.
            </p>
          </div>
          <div className="shrink-0">
            <GoogleSignInButton onClick={handleLogin} disabled={isLoggingIn} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateCertificate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-950/50 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando Certificado no Google Docs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Certificado no Google Docs</span>
                </>
              )}
            </button>

            {latestCreatedDoc && (
              <a
                href={latestCreatedDoc.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir Certificado no Google Docs</span>
              </a>
            )}
          </div>

          {latestCreatedDoc && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Certificado gerado com sucesso para <strong className="text-white">{studentName || 'Estudante'}</strong>! Você pode editá-lo ou compartilhá-lo diretamente pelo Google Docs.
              </span>
            </div>
          )}

          {generatedDocs.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Certificados salvos no seu Google Drive ({generatedDocs.length}):
              </span>
              <div className="space-y-2">
                {generatedDocs.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-100 truncate">
                          {doc.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(doc.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <a
                        href={doc.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-[11px] font-bold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Docs</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(doc)}
                        disabled={isDownloadingPdfId === doc.documentId}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {isDownloadingPdfId === doc.documentId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDocPendingDeletion(doc)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-800/50 text-red-300 text-[11px] font-bold transition-colors cursor-pointer"
                        title="Excluir certificado do Google Drive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Confirmation Modal for Deleting a Google Drive Certificate */}
      {docPendingDeletion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-red-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h5 id="confirm-delete-title" className="text-base font-black text-white">
                  Confirmar exclusão no Google Drive
                </h5>
              </div>
              <button
                type="button"
                onClick={() => setDocPendingDeletion(null)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
                disabled={isDeleting}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tem certeza que deseja excluir permanentemente o documento{' '}
              <strong className="text-white">"{docPendingDeletion.title}"</strong> do seu Google Drive? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDocPendingDeletion(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeleteCertificate}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir do Drive</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
