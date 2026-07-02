import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, Check } from "lucide-react";
import { mensalidadePixPayload, isPixConfigured, PIX_CONFIG } from "@/lib/pix";

// Modal de pagamento Pix da mensalidade (valor ABERTO — o aluno digita no banco).
export function PixDialog({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const payload = isPixConfigured ? mensalidadePixPayload() : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/60 p-4 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-sm border border-border bg-card p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">PAGAMENTO</div>
            <h2 className="text-display mt-1 text-2xl">Pagar via Pix</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isPixConfigured ? (
          <>
            <div className="mt-6 flex justify-center">
              <div className="bg-white p-4">
                <QRCodeSVG value={payload} size={200} level="M" />
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Escaneie no app do banco. O <strong className="text-foreground">valor é aberto</strong> — digite o da sua mensalidade.
            </p>

            <div className="mt-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pix Copia e Cola</div>
              <div className="mt-1.5 flex items-stretch gap-2">
                <code className="min-w-0 flex-1 truncate border border-border bg-background px-3 py-2.5 text-xs text-muted-foreground">
                  {payload}
                </code>
                <button
                  onClick={copy}
                  className="text-display inline-flex items-center gap-1.5 bg-primary px-3 text-xs text-primary-foreground transition hover:bg-primary/90"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4 text-center text-[11px] text-muted-foreground">
              Recebedor: {PIX_CONFIG.merchantName} · {PIX_CONFIG.merchantCity}
            </div>
          </>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Chave Pix não configurada. Defina <code>VITE_PIX_KEY</code> no <code>.env</code> para habilitar o pagamento.
          </p>
        )}
      </div>
    </div>
  );
}
