export const KLAVIYO_CONFIG = {
  publicApiKey: import.meta.env.VITE_KLAVIYO_PUBLIC_KEY || "VeSX7A",
  revision: import.meta.env.VITE_KLAVIYO_REVISION || "2026-04-15",
  quizVersion: import.meta.env.VITE_QUIZ_VERSION || "2026-06-18",
  siteUrl: import.meta.env.VITE_SITE_URL || "https://animals.timhupkes.com",
  subscribeEndpoint: "https://a.klaviyo.com/client/subscriptions",
  eventEndpoint: "https://a.klaviyo.com/client/events",
  listIds: {
    nl: import.meta.env.VITE_KLAVIYO_LIST_ID_NL || "UxALiV",
    en: import.meta.env.VITE_KLAVIYO_LIST_ID_EN || "RHyzBs",
  },
}
