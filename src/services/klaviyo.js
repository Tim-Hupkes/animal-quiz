import { KLAVIYO_CONFIG } from "../config/klaviyo"

export function getKlaviyoListId(language) {
  return KLAVIYO_CONFIG.listIds[language] || ""
}

export function isKlaviyoConfigured(language) {
  return Boolean(KLAVIYO_CONFIG.publicApiKey && getKlaviyoListId(language))
}

export async function subscribeQuizResult({ email, language, resultLabel }) {
  const listId = getKlaviyoListId(language)

  if (!KLAVIYO_CONFIG.publicApiKey || !listId) {
    throw new Error("KLAVIYO_CONFIG_MISSING")
  }

  const response = await fetch(
    `${KLAVIYO_CONFIG.subscribeEndpoint}?company_id=${encodeURIComponent(KLAVIYO_CONFIG.publicApiKey)}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/vnd.api+json",
        revision: KLAVIYO_CONFIG.revision,
      },
      body: JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
            custom_source: "Animal quiz result page",
            profile: {
              data: {
                type: "profile",
                attributes: {
                  email,
                  locale: language,
                  properties: {
                    quiz_language: language,
                    quiz_result: resultLabel,
                  },
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: "SUBSCRIBED",
                      },
                    },
                  },
                },
              },
            },
          },
          relationships: {
            list: {
              data: {
                type: "list",
                id: listId,
              },
            },
          },
        },
      }),
    },
  )

  if (!response.ok) {
    throw new Error("KLAVIYO_SUBSCRIBE_FAILED")
  }
}
