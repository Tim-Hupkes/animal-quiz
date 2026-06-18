# Klaviyo flow setup

## Lists

Create or verify these two lists:

```text
Dutch Animal Quiz / Animal Art
List ID: UxALiV

English Animal Quiz / Animal Art
List ID: RHyzBs
```

If the IDs change, update `.env`:

```bash
VITE_KLAVIYO_LIST_ID_NL=<new Dutch list ID>
VITE_KLAVIYO_LIST_ID_EN=<new English list ID>
```

## Recommended flow architecture

The app sends two calls after email submit:

1. `Quiz Result Submitted` event with all result data.
2. List subscription to the correct language list.

Use this setup in Klaviyo:

```text
Dutch quiz result email flow
Trigger: Metric > Quiz Result Submitted
Trigger filter: language equals nl
Email: Dutch quiz result email

English quiz result email flow
Trigger: Metric > Quiz Result Submitted
Trigger filter: language equals en
Email: English quiz result email

Dutch welcome / animal art flow
Trigger: Added to list > Dutch Animal Quiz / Animal Art

English welcome / animal art flow
Trigger: Added to list > English Animal Quiz / Animal Art
```

This is more reliable than trying to make the result email depend on list subscription timing. The result email should be metric-triggered because the metric contains the fresh quiz result.

## Exact trigger configuration

### Dutch quiz results email

1. Create flow.
2. Trigger: `Metric`.
3. Metric: `Quiz Result Submitted`.
4. Trigger filter: `language equals nl`.
5. Optional flow filter: `Properties about someone > email is set`.
6. Add email immediately after trigger.
7. Use the Dutch version of `docs/klaviyo-email-template.html`.

### English quiz results email

1. Create flow.
2. Trigger: `Metric`.
3. Metric: `Quiz Result Submitted`.
4. Trigger filter: `language equals en`.
5. Optional flow filter: `Properties about someone > email is set`.
6. Add email immediately after trigger.
7. Use the English copy in `docs/klaviyo-email-template.html`.

### Dutch welcome / animal art flow

1. Create flow.
2. Trigger: `List`.
3. List: `Dutch Animal Quiz / Animal Art`.
4. Add a short delay if you want the quiz result email to arrive first, for example `1 hour`.
5. Continue with your welcome / animal art sequence.

### English welcome / animal art flow

1. Create flow.
2. Trigger: `List`.
3. List: `English Animal Quiz / Animal Art`.
4. Add a short delay if you want the quiz result email to arrive first, for example `1 hour`.
5. Continue with your welcome / animal art sequence.

## Recommended segments

```text
Quiz users - Dutch
Definition: quiz_language equals nl

Quiz users - English
Definition: quiz_language equals en

Main animal - Fox
Definition: quiz_main_animal_slug equals fox

High main match
Definition: quiz_main_animal_percentage is at least 75

Recent quiz users
Definition: quiz_completed_at is in the last 30 days
```

Repeat animal-specific segments only for animals you actually want to target with campaigns.

## Testing procedure

### Test the event

1. Open the local quiz.
2. Finish the quiz.
3. Submit an email address you can receive mail on.
4. In Klaviyo, open the profile for that email address.
5. Check the profile activity feed for `Quiz Result Submitted`.
6. Open the event and verify the properties listed in `docs/klaviyo-event-schema.md`.

### Test dynamic email content

1. Open the result email inside the Klaviyo flow.
2. Choose `Preview & test`.
3. Select a recent `Quiz Result Submitted` event.
4. Confirm these fields render:
   - `event.main_animal`
   - `event.main_animal_percentage`
   - `event.main_animal_description`
   - `event.main_animal_fact`
   - `event.secondary_animal`
   - `event.secondary_animal_percentage`
   - `event.secondary_animal_description`
   - `event.secondary_animal_fact`
   - `event.artwork_1_title`
   - `event.artwork_1_url`

### Test Dutch vs English routing

1. Complete `/quiz/nl` and submit a test email.
2. Confirm the profile is added to list `UxALiV`.
3. Confirm the Dutch result flow receives the event.
4. Confirm the English result flow does not receive the event.
5. Complete `/quiz/en` with another test email.
6. Confirm the profile is added to list `RHyzBs`.
7. Confirm the English result flow receives the event.
8. Confirm the Dutch result flow does not receive the event.

### Test single opt-in

1. Open each list settings page in Klaviyo.
2. Confirm consent is set to single opt-in.
3. Submit a new email through the quiz.
4. Confirm the profile is immediately subscribed, without waiting for confirmation email.
5. Confirm the list-triggered welcome flow starts.

If the profile appears in Klaviyo but no flow starts, check:

- The flow trigger is correct.
- The flow is live, not draft/manual.
- The trigger filters match the event property `language`.
- The profile has not already been through that flow and is blocked by flow re-entry settings.
- The list trigger uses the exact list ID that the app sends.

## What is still needed

Replace placeholder artwork data in `src/data/artwork.js` with real product URLs and image URLs.

Provide or host:

- A stable public logo URL for the email template.
- Real artwork product URLs.
- Real artwork image URLs.
- Newsletter preference center URL, if different from Klaviyo's default manage-preferences tag.
