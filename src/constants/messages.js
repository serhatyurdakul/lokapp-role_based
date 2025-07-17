// Centralized user-facing general error messages.
// Keep this list minimal; only include messages that are displayed verbatim
// across multiple, unrelated pages. Context-specific texts (e.g. form
// validation details, success toasts, empty states) SHOULD NOT be added here.
//
// When you need another shared message, add it here instead of duplicating
// the literal string.

export const MSG_NETWORK_ERROR =
  "Bağlantı hatası. Lütfen internetinizi kontrol edin.";

export const MSG_TIMEOUT_ERROR =
  "Sunucu yanıt vermedi. Lütfen tekrar deneyin.";

export const MSG_TOKEN_EXPIRED =
  "Oturum süreniz doldu veya oturumunuz başka bir cihazda açıldı. Lütfen tekrar giriş yapın.";

export const MSG_UNKNOWN_ERROR =
  "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
