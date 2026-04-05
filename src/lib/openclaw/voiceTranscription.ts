import path from "node:path";

const DEFAULT_VOICE_MIME = "audio/webm";
const DEFAULT_VOICE_BASENAME = "voice-note";

const MIME_EXTENSION_MAP: Record<string, string> = {
  "audio/mp4": ".m4a",
  "audio/mpeg": ".mp3",
  "audio/ogg": ".ogg",
  "audio/wav": ".wav",
  "audio/webm": ".webm",
  "audio/x-m4a": ".m4a",
  "audio/x-wav": ".wav",
};

type MediaUnderstandingDecision = {
  outcome?: string;
  attachments?: Array<{
    attempts?: Array<{
      reason?: string;
    }>;
  }>;
};

export type OpenClawVoiceTranscriptionResult = {
  transcript: string | null;
  provider: string | null;
  model: string | null;
  decision: MediaUnderstandingDecision | null;
  ignored: boolean;
};

export const normalizeVoiceMimeType = (value: string | null | undefined): string => {
  const trimmed = value?.trim().toLowerCase() ?? "";
  if (!trimmed) return DEFAULT_VOICE_MIME;
  const [baseType] = trimmed.split(";", 1);
  return MIME_EXTENSION_MAP[baseType] ? baseType : trimmed.startsWith("audio/") ? baseType : DEFAULT_VOICE_MIME;
};

export const inferVoiceFileExtension = (
  fileName: string | null | undefined,
  mimeType: string | null | undefined,
): string => {
  const trimmedName = fileName?.trim() ?? "";
  const nameExtension = path.extname(trimmedName).toLowerCase();
  if (nameExtension && Object.values(MIME_EXTENSION_MAP).includes(nameExtension)) {
    return nameExtension;
  }
  return MIME_EXTENSION_MAP[normalizeVoiceMimeType(mimeType)] ?? MIME_EXTENSION_MAP[DEFAULT_VOICE_MIME];
};

export const sanitizeVoiceFileName = (
  fileName: string | null | undefined,
  mimeType: string | null | undefined,
): string => {
  const extension = inferVoiceFileExtension(fileName, mimeType);
  const rawBase = path.basename(fileName?.trim() || DEFAULT_VOICE_BASENAME, path.extname(fileName?.trim() || ""));
  const sanitizedBase =
    rawBase.replace(/[^a-z0-9._-]+/gi, "-").replace(/-+/g, "-").replace(/^[-.]+|[-.]+$/g, "") ||
    DEFAULT_VOICE_BASENAME;
  const normalizedBase = sanitizedBase.toLowerCase();
  return normalizedBase.endsWith(extension) ? normalizedBase : `${normalizedBase}${extension}`;
};

export const buildVoiceTranscriptionErrorMessage = (
  decision: MediaUnderstandingDecision | null | undefined,
): string => {
  if (!decision) return "Transkript alınamadı.";
  const outcome = decision.outcome?.trim() || "unknown";
  const reasons = (decision.attachments ?? [])
    .flatMap((attachment) => attachment.attempts ?? [])
    .map((attempt) => attempt.reason?.trim() ?? "")
    .filter(Boolean);
  const detail = reasons[0] ? ` ${reasons[0]}` : "";
  switch (outcome) {
    case "disabled":
      return `Ses transkripsiyonu devre dışı.${detail}`.trim();
    case "no-attachment":
      return "Transkript için ses dosyası alınamadı.";
    case "scope-deny":
      return `Bu istek için ses transkripsiyonu engellendi.${detail}`.trim();
    case "skipped":
      return `Ses transkripsiyonu atlandı.${detail}`.trim();
    default:
      return `Transkript alınamadı.${detail}`.trim();
  }
};

export const shouldIgnoreVoiceTranscription = (params: {
  transcript: string | null | undefined;
  decision: MediaUnderstandingDecision | null | undefined;
}): boolean => {
  const transcript = params.transcript?.trim() ?? "";
  if (transcript) return false;
  const reasons = (params.decision?.attachments ?? [])
    .flatMap((attachment) => attachment.attempts ?? [])
    .map((attempt) => attempt.reason?.trim().toLowerCase() ?? "")
    .filter(Boolean);
  return reasons.some((reason) =>
    [
      "missing text",
      "empty transcript",
      "no speech",
      "no audio detected",
      "no transcript text",
    ].some((snippet) => reason.includes(snippet)),
  );
};

export const transcribeVoice = async (params: {
  buffer: Buffer;
  fileName?: string | null;
  mimeType?: string | null;
}): Promise<OpenClawVoiceTranscriptionResult> => {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Ses transkripsiyon için GROQ_API_KEY gerekli.");
  }

  const mimeType = normalizeVoiceMimeType(params.mimeType);
  const fileName = sanitizeVoiceFileName(params.fileName, mimeType);

  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(params.buffer)], { type: mimeType }), fileName);
  formData.append("model", "whisper-large-v3-turbo");
  formData.append("response_format", "json");

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Groq Whisper API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as { text?: string };
  const transcript = data.text?.trim() ?? "";

  if (!transcript) {
    return {
      transcript: null,
      provider: "groq",
      model: "whisper-large-v3-turbo",
      decision: null,
      ignored: true,
    };
  }

  return {
    transcript,
    provider: "groq",
    model: "whisper-large-v3-turbo",
    decision: null,
    ignored: false,
  };
};

/** @deprecated Use transcribeVoice instead */
export const transcribeVoiceWithOpenClaw = transcribeVoice;
