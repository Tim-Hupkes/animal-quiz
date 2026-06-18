# Klaviyo event schema

The React app sends one custom event when a visitor submits the result email form.

## Event

Metric name:

```text
Quiz Result Submitted
```

Endpoint:

```text
POST https://a.klaviyo.com/client/events?company_id=<VITE_KLAVIYO_PUBLIC_KEY>
```

The app also subscribes the same profile to the language-specific Klaviyo list:

```text
POST https://a.klaviyo.com/client/subscriptions?company_id=<VITE_KLAVIYO_PUBLIC_KEY>
```

## Required event properties

```json
{
  "email": "tim@example.com",
  "language": "nl",
  "main_animal": "Vos",
  "main_animal_slug": "fox",
  "main_animal_percentage": 82,
  "main_animal_description": "Localized main animal description",
  "main_animal_fact": "Localized main animal fun fact",
  "secondary_animal": "Uil",
  "secondary_animal_slug": "owl",
  "secondary_animal_percentage": 18,
  "secondary_animal_description": "Localized secondary animal description",
  "secondary_animal_fact": "Localized secondary animal fun fact",
  "quiz_completed_at": "2026-06-18T12:00:00.000Z",
  "quiz_version": "2026-06-18"
}
```

## Additional useful properties

```json
{
  "result_label": "Vos + Uil",
  "result_share_text": "Ik ben een Vos, met een vleugje Uil. Welk dier ben jij?",
  "quiz_url": "https://animals.timhupkes.com/quiz/nl",
  "share_url": "https://animals.timhupkes.com/quiz/nl?friend=fox&friendSub=owl",
  "source": "animal_quiz_result_page",
  "list_id": "UxALiV",
  "artwork_1_title": "Vos kunstprint",
  "artwork_1_description": "Een rustige kunstaanbeveling op basis van jouw quizuitslag.",
  "artwork_1_url": "https://animals.timhupkes.com/fox",
  "artwork_1_image_url": "https://animals.timhupkes.com/images/fox.jpg",
  "artwork_2_title": "Uil kunstprint",
  "artwork_2_description": "Een rustige kunstaanbeveling op basis van jouw quizuitslag.",
  "artwork_2_url": "https://animals.timhupkes.com/owl",
  "artwork_2_image_url": "https://animals.timhupkes.com/images/owl.jpg",
  "artwork_3_title": "Dierenkunst collectie",
  "artwork_3_description": "Ontdek speelse, elegante dierenkunst voor aan de muur.",
  "artwork_3_url": "https://animals.timhupkes.com/animal-art-collection",
  "artwork_3_image_url": "https://animals.timhupkes.com/images/animal-art-collection.jpg"
}
```

## Profile properties

The app also stores these profile properties on the Klaviyo profile:

```text
quiz_language
quiz_result
quiz_main_animal
quiz_main_animal_slug
quiz_main_animal_percentage
quiz_secondary_animal
quiz_secondary_animal_slug
quiz_secondary_animal_percentage
quiz_completed_at
quiz_version
quiz_share_url
```

Use event properties for the quiz result email. Use profile properties for segmentation and later newsletter personalization.

## Environment variables

Create a `.env` file locally or set these in the hosting environment:

```bash
VITE_KLAVIYO_PUBLIC_KEY=VeSX7A
VITE_KLAVIYO_LIST_ID_NL=UxALiV
VITE_KLAVIYO_LIST_ID_EN=RHyzBs
VITE_KLAVIYO_REVISION=2026-04-15
VITE_QUIZ_VERSION=2026-06-18
VITE_SITE_URL=https://animals.timhupkes.com
```

Only use the public Klaviyo key in React. Do not put a private Klaviyo API key in this app.
