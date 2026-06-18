# Animal Quiz

Een tweetalige persoonlijkheidsquiz die je hoofddier en een tweede diermatch geeft.

- Nederlands: `https://animals.timhupkes.com/quiz/nl`
- English: `https://animals.timhupkes.com/quiz/en`

## Lokaal ontwikkelen

```bash
npm ci
npm run dev
```

## Controles

```bash
npm run lint
npm run build
npm run check:quiz
```

`npm run lint` controleert de broncode op veelvoorkomende fouten en onveilige React-patronen. `npm run check:quiz` simuleert 50.000 vaste quizrondes en faalt als een dier niet meer bereikbaar is als hoofduitslag.

## Klaviyo

De quiz stuurt na het e-mailformulier:

1. Een `Quiz Result Submitted` event met de volledige uitslag.
2. Een subscription naar de juiste taallijst.

Gebruik `.env.example` als basis voor de benodigde Vite-variabelen.

Documentatie:

- Event schema: `docs/klaviyo-event-schema.md`
- Flow setup en testprocedure: `docs/klaviyo-flow-setup.md`
- Email template: `docs/klaviyo-email-template.html`
