import { KLAVIYO_CONFIG } from "../config/klaviyo"

const EVENT_NAME = "Quiz Result Submitted"

export function getKlaviyoListId(language) {
  return KLAVIYO_CONFIG.listIds[language] || ""
}

export function isKlaviyoConfigured(language) {
  return Boolean(KLAVIYO_CONFIG.publicApiKey && getKlaviyoListId(language))
}

async function postToKlaviyo(endpoint, payload) {
  const response = await fetch(
    `${endpoint}?company_id=${encodeURIComponent(KLAVIYO_CONFIG.publicApiKey)}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/vnd.api+json",
        revision: KLAVIYO_CONFIG.revision,
      },
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const responseText = await response.text().catch(() => "")
    throw new Error(responseText || "KLAVIYO_REQUEST_FAILED")
  }
}

function createProfileProperties({ language, eventProperties }) {
  return {
    quiz_language: language,
    quiz_result: eventProperties.result_label,
    quiz_main_animal: eventProperties.main_animal,
    quiz_main_animal_slug: eventProperties.main_animal_slug,
    quiz_main_animal_percentage: eventProperties.main_animal_percentage,
    quiz_secondary_animal: eventProperties.secondary_animal,
    quiz_secondary_animal_slug: eventProperties.secondary_animal_slug,
    quiz_secondary_animal_percentage: eventProperties.secondary_animal_percentage,
    quiz_completed_at: eventProperties.quiz_completed_at,
    quiz_version: eventProperties.quiz_version,
    quiz_share_url: eventProperties.share_url,
  }
}

export async function trackQuizResultSubmitted({ email, language, eventProperties }) {
  await postToKlaviyo(KLAVIYO_CONFIG.eventEndpoint, {
    data: {
      type: "event",
      attributes: {
        properties: eventProperties,
        metric: {
          data: {
            type: "metric",
            attributes: {
              name: EVENT_NAME,
            },
          },
        },
        profile: {
          data: {
            type: "profile",
            attributes: {
              email,
              locale: language,
              properties: createProfileProperties({ language, eventProperties }),
            },
          },
        },
      },
    },
  })
}

export async function subscribeQuizResult({ email, language, eventProperties }) {
  const listId = getKlaviyoListId(language)

  if (!KLAVIYO_CONFIG.publicApiKey || !listId) {
    throw new Error("KLAVIYO_CONFIG_MISSING")
  }

  await postToKlaviyo(KLAVIYO_CONFIG.subscribeEndpoint, {
    data: {
      type: "subscription",
      attributes: {
        custom_source: `Animal quiz result page (${language})`,
        profile: {
          data: {
            type: "profile",
            attributes: {
              email,
              locale: language,
              properties: createProfileProperties({ language, eventProperties }),
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
  })
}

export async function submitQuizResultToKlaviyo({ email, language, eventProperties }) {
  if (!isKlaviyoConfigured(language)) {
    throw new Error("KLAVIYO_CONFIG_MISSING")
  }

  await trackQuizResultSubmitted({ email, language, eventProperties })
  await subscribeQuizResult({ email, language, eventProperties })
}
