import { useState, useRef } from "react";
import axios from "axios";
import "./App.css";

type Status = "idle" | "loading" | "success" | "error";

export default function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function simulateProgress() {
    setProgress(0);
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 8;
      if (current >= 90) {
        clearInterval(intervalRef.current!);
        current = 90;
      }
      setProgress(Math.min(current, 90));
    }, 400);
  }

  function finishProgress() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);
  }

  async function handleDownload() {
    if (!url.trim()) return;

    setStatus("loading");
    setErrorMsg("");
    simulateProgress();

    try {
      const response = await axios.post(
        "https://ytdlp-downloader-uaga.onrender.com/api/convert",
        { url },
        { responseType: "blob" }
      );

      finishProgress();

      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "musica.mp3";
      a.click();
      window.URL.revokeObjectURL(downloadUrl);

      setTimeout(() => setStatus("success"), 300);
    } catch (err: any) {
      finishProgress();
      setStatus("error");
      setErrorMsg(
        err?.response?.data?.error || "Erro ao converter. Verifique o link."
      );
    }
  }

  function handleReset() {
    setStatus("idle");
    setUrl("");
    setProgress(0);
    setErrorMsg("");
  }

  const isLoading = status === "loading";

  return (
    <div className="app">
      <div className="noise" />

      <div className="card">
        <div className="badge">MP3 DOWNLOADER</div>

        <h1 className="title">
          Cole o link<br />
          <span className="title-accent">baixe a música</span>
        </h1>

        <p className="subtitle">YouTube → MP3 em segundos</p>

        {status !== "success" && (
          <>
            <div className={`input-wrap ${isLoading ? "disabled" : ""}`}>
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              </span>
              <input
                type="text"
                className="input"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
              />
            </div>

            {isLoading && (
              <div className="progress-wrap">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="progress-label">
                  {progress < 30
                    ? "Conectando ao YouTube..."
                    : progress < 60
                    ? "Extraindo áudio..."
                    : progress < 90
                    ? "Convertendo para MP3..."
                    : "Finalizando..."}
                </span>
              </div>
            )}

            {status === "error" && (
              <div className="error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errorMsg}
              </div>
            )}

            <button
              className="btn"
              onClick={handleDownload}
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Convertendo...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Baixar MP3
                </>
              )}
            </button>
          </>
        )}

        {status === "success" && (
          <div className="success-wrap">
            <div className="success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <p className="success-title">Música baixada com sucesso!</p>
            <p className="success-msg">
              Você pode compartilhar no WhatsApp 🎵
            </p>

            <a
              className="whatsapp-btn"
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Compartilhar no WhatsApp
            </a>

            <button className="btn-outline" onClick={handleReset}>
              Baixar outra música
            </button>
          </div>
        )}
      </div>

      <p className="footer">Feito com muito carinho para vc mamãe ❤️ </p>
    </div>
  );
}