// Gerador de Pix "Copia e Cola" / BR Code (padrão EMV® do Banco Central).
// Produz a string que vira QR Code e que os bancos leem para pagamento.

function normalize(s: string, max: number): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .trim()
    .slice(0, max);
}

// EMV é TLV: cada campo é id(2) + tamanho(2) + valor.
function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

// CRC16/CCITT-FALSE (poly 0x1021, init 0xFFFF) — exigido pelo padrão Pix.
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export type PixParams = {
  /** chave Pix (CPF só dígitos, e-mail, telefone +55..., ou chave aleatória) */
  key: string;
  /** nome do recebedor (até 25 chars, sem acento) */
  merchantName: string;
  /** cidade do recebedor (até 15 chars, sem acento) */
  merchantCity: string;
  /** valor fixo; omitido = aberto (pagador digita) */
  amount?: number;
  /** identificador da transação (estático: "***") */
  txid?: string;
};

/** Monta o payload Pix "Copia e Cola". */
export function buildPixPayload({ key, merchantName, merchantCity, amount, txid = "***" }: PixParams): string {
  const merchantAccount = tlv("26", tlv("00", "br.gov.bcb.pix") + tlv("01", key));
  const additional = tlv("62", tlv("05", txid));

  let payload =
    tlv("00", "01") + // payload format indicator
    merchantAccount +
    tlv("52", "0000") + // merchant category code
    tlv("53", "986") + // moeda: BRL
    (amount != null ? tlv("54", amount.toFixed(2)) : "") +
    tlv("58", "BR") + // país
    tlv("59", normalize(merchantName, 25)) +
    tlv("60", normalize(merchantCity, 15)) +
    additional +
    "6304"; // id+len do CRC; o valor é calculado sobre isto tudo

  return payload + crc16(payload);
}

// Configuração da escola (lida do .env; cai pra vazio se não setado).
// CPF/chave ficam no .env (fora do git) — não no código.
export const PIX_CONFIG = {
  key: (import.meta.env.VITE_PIX_KEY as string | undefined) ?? "",
  merchantName: (import.meta.env.VITE_PIX_MERCHANT_NAME as string | undefined) ?? "X BJJ SCHOOL",
  merchantCity: (import.meta.env.VITE_PIX_CITY as string | undefined) ?? "SAO PAULO",
  monthlyAmount: Number(import.meta.env.VITE_PIX_AMOUNT ?? 60),
};

export const isPixConfigured = Boolean(PIX_CONFIG.key);

/**
 * Payload da mensalidade — Pix de VALOR ABERTO (sem amount): o aluno digita
 * o valor no app do banco. Mantemos a chave fixa da escola.
 */
export function mensalidadePixPayload(): string {
  return buildPixPayload({
    key: PIX_CONFIG.key,
    merchantName: PIX_CONFIG.merchantName,
    merchantCity: PIX_CONFIG.merchantCity,
    // sem `amount` → Pix aberto
    txid: "MENSALIDADE",
  });
}
