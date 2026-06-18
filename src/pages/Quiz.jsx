import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import animalQuizLogo from "../assets/animal-quiz-logo.png"
import { KLAVIYO_CONFIG } from "../config/klaviyo"
import { getArtworkRecommendations } from "../data/artwork"
import { questions } from "../data/questions"
import { getAnimalResults, signatureAnimals } from "../data/scoring"
import { isKlaviyoConfigured, submitQuizResultToKlaviyo } from "../services/klaviyo"

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function Quiz() {
  const { lang } = useParams()
  const language = lang === "en" ? "en" : "nl"
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [randomMessage, setRandomMessage] = useState("")
  const [shareStatus, setShareStatus] = useState("")
  const [subscribeEmail, setSubscribeEmail] = useState("")
  const [subscribeStatus, setSubscribeStatus] = useState("idle")
  const [subscribeMessage, setSubscribeMessage] = useState("")

  useEffect(() => {
    document.documentElement.lang = language
    document.title = language === "en" ? "Which animal are you?" : "Welk dier ben jij?"
  }, [language])

  // Taal toggle functie
  const switchLanguage = () => {
    const newLang = language === "nl" ? "en" : "nl"
    navigate(`/${newLang}${window.location.search}`)
  }

  const messages = {
    nl: [
      "Interessant... 👀",
      "Even denken...",
      "Jouw innerlijke dier wordt opgespoord...",
      "Resultaat bijna klaar...",
      "Momentje, we ondervragen nog een paar kraaien...",
      "Spannend... Dit kan alle kanten op gaan!"
    ],
    en: [
      "Interesting... 👀",
      "One moment...",
      "Tracking down your inner animal...",
      "Hold on, we're consulting a few crows...",
      "This could go either way!"
    ]
  }

  const animalInfo = {
    crow: {
      emoji: "🐦‍⬛",
      name: {
      nl: "Kraai",
      en: "Crow"
      },
      description: {
      nl: "Jij ziet verbanden waar anderen losse gebeurtenissen zien. Soms heb je het gevoel dat je een halve stap vóór de rest van de wereld loopt.",
      en: "You see connections where others see unrelated events. Sometimes it feels as though you're a step ahead of the rest of the world."
      },

      fact: {
        nl: "Kraaien herkennen menselijke gezichten jarenlang en kunnen die kennis zelfs doorgeven aan andere kraaien.",
        en: "Crows can recognize human faces for years and can even pass that knowledge on to other crows."
    }},


    fox: {
      emoji: "🦊",
      name: {
     nl: "Vos",
     en: "Fox"
      },
      description: {
        nl: "Je beweegt liever slim dan hard. Je observeert, legt verbanden en kiest bewust je richting. Daardoor bereik je vaak meer met minder gedoe.",
        en: "You prefer to move smart rather than fast. You observe, connect the dots, and choose your direction deliberately. As a result, you often achieve more with less effort."
      },
        fact: {
          nl: "Vossen gebruiken het aardmagnetisch veld als hulpmiddel bij het lokaliseren van prooi onder sneeuw.",
          en: "Foxes use Earth's magnetic field to help locate prey hidden beneath the snow."
    }},
  
    raccoon: {
      emoji: "🦝",
      name: {
        nl: "Wasbeer",
        en: "Raccoon"},
      description: {
        nl: "Jij bent slim genoeg om problemen op te lossen, maar soms ook nieuwsgierig genoeg om nieuwe problemen te creëren. Dat houdt het leven interessant.",
        en: "You’re smart enough to solve problems, but also curious enough to create new ones. That’s what keeps life interesting."
      },
        fact: {
          nl: "Wasberen kunnen complexe slotjes en mechanismen jarenlang onthouden nadat ze die één keer hebben opgelost.",
          en: "Raccoons can remember complex locks and mechanisms for years after figuring them out just once."
    }},

    octopus: {
      emoji: "🐙",
      name: {
        nl: "Octopus",
        en: "Octopus"},
      description: {
        nl: "Jij houdt ervan om dingen te begrijpen. Liefst allemaal tegelijk. Als iets ingewikkeld is, word je eerder nieuwsgierig dan afgeschrikt.",
        en: "You enjoy understanding how things work. Preferably all at once. When something is complicated, it makes you curious rather than intimidated."
      },
      fact: {
        nl: "Twee derde van de neuronen van een octopus zit niet in zijn hersenen maar in zijn armen.",
        en: "Two-thirds of an octopus's neurons are located in its arms rather than its brain."
    }},
    bat: {
      emoji: "🦇",
      name: {
        nl: "Vleermuis",
        en: "Bat"},
      description: {
        nl: "Jij hoeft niet altijd alles te zien om te weten waar je bent. Je vertrouwt verrassend vaak op gevoel, intuïtie en subtiele signalen.",
        en: "You don't always need to see everything to know where you are. You often rely on instinct, intuition, and subtle signals."},
      fact: {
        nl: "Bij sommige vleermuissoorten herkennen dieren individuele vrienden aan hun stem.",
        en: "Some bat species can recognize individual friends by their voices."
    }},
    owl: {
      emoji: "🦉",
      name: {
        nl: "Uil",
        en: "Owl"},
      description: {
        nl: "Er is een deel van jou dat eerst even wil begrijpen hoe iets werkt.",
        en: "There's a part of you that likes to understand how something works before diving in."},
      fact: {
        nl: "Bij sommige uilensoorten zitten de oren niet op dezelfde hoogte. Daardoor kunnen ze in het donker hun prooi met verbazingwekkende precisie lokaliseren.",
        en: "Some owl species have unevenly placed ears, helping them locate prey with astonishing accuracy in the dark."
    }},
    eagle: {
      emoji: "🦅",
      name: {
        nl: "Adelaar",
        en: "Eagle"},
      description: {
        nl: "Jij houdt graag overzicht. Je ziet snel waar je naartoe wilt en laat je onderweg niet gemakkelijk afleiden.",
        en: "You like to keep the bigger picture in view. You quickly see where you want to go and are not easily distracted along the way."},
      fact: {
        nl: "Adelaars kunnen kleine prooien vanaf meerdere kilometers afstand waarnemen.",
        en: "Eagles can spot small prey from several kilometres away."},
    },
    shark: {
      emoji: "🦈",
      name: {
        nl: "Haai",
        en: "Shark"},
      description: {
        nl: "Jij verspilt weinig tijd aan twijfelen. Als je eenmaal een richting kiest, ga je.",
        en: "You don't waste much time doubting. Once you choose a direction, you move."},
      fact: {
        nl: "Haaien bestonden al voordat de eerste bomen op aarde verschenen.",
        en: "Sharks existed before trees first appeared on Earth."},
    },
    cat: {
      emoji: "🐱",
      name: {
        nl: "Kat",
        en: "Cat"},

      description: {
        nl: "Jij hebt weinig behoefte aan groepsdruk. Dat iets populair is, betekent nog niet dat jij eraan mee hoeft te doen.",
        en: "You have little need for peer pressure. Just because something is popular doesn't mean you have to join in."},

      fact: {
        nl: "Katten kunnen met hun oren twee verschillende geluiden tegelijk volgen.",
        en: "Cats can use their ears to track two different sounds at the same time"},

    },
    dog: {
      emoji: "🐕",
      name: {
        nl: "Hond",
        en: "Dog"},
      description: {
        nl: "Jij hebt een radar voor verbinding. Je merkt vaak eerder dan anderen hoe het met iemand gaat.",
        en: "You have a radar for connection. You often notice how someone is feeling before other people do."},
      fact: {
        nl: "Honden kunnen soms aan iemands adem ruiken dat diegene stress ervaart, nog voordat er zichtbaar iets verandert.",
        en: "Dogs can sometimes smell stress on a person's breath before any visible signs appear."},
    },
    wolf: {
      emoji: "🐺",
      name: {
        nl: "Wolf",
        en: "Wolf"},
      description: {
        nl: "Jij bent zelfstandiger dan mensen denken, maar ook socialer dan mensen denken.",
        en: "You're more independent than people think, but also more social than they realize."},
      fact: {
        nl: "Wolven huilen niet alleen om hun locatie door te geven, maar ook om sociale banden te versterken.",
        en: "Wolves don't howl only to communicate their location, but also to strengthen social bonds."},
    },
    otter: {
      emoji: "🦦",
      name: {
        nl: "Otter",
        en: "Otter"},
      description: {
        nl: "Jij bent nieuwsgierig, speels en inventief. Leuk is voor jou een volkomen geldige reden om iets te doen.",
        en: "You're curious, playful, and inventive. Enjoying something is reason enough for you to do it."},
      fact: {
        nl: "Zeeotters bewaren soms jarenlang dezelfde steen als gereedschap in een huidplooi onder hun voorpoot.",
        en: "Sea otters sometimes keep the same favorite tool stone tucked under their arm for years."},
    },
    capybara: {
      emoji: "🦫",
      name: {
        nl: "Capibara",
        en: "Capybara"},
      description: {
        nl: "Jij hoeft niet overal een wedstrijd van te maken. Comfort, gezelligheid en een beetje zon zijn zwaar onderschat.",
        en: "You don't have to turn everything into a competition. Comfort, good company, and a little sunshine are seriously underrated."},
      fact: {
        nl: "Capibara's slapen soms met alleen hun neus boven het water.",
        en: "Capybaras sometimes sleep with only their noses above the water."},
    },
    parrot: {
      emoji: "🦜",
      name: {
        nl: "Papegaai",
        en: "Parrot"},
      description: {
        nl: "Jij denkt hardop. Terwijl anderen nog nadenken, ben jij al halverwege een gesprek.",
        en: "You're someone who thinks out loud. While others are still figuring things out, you're already halfway through a conversation."},
      fact: {
        nl: "Jonge papegaaien krijgen van hun ouders een uniek contactgeluid mee, en andere papegaaien gebruiken dat als hun naam.",
        en: "Young parrots are given a unique contact call by their parents, and other parrots use it as their name."},
    },
    penguin: {
      emoji: "🐧",
      name: {
        nl: "Pinguïn",
        en: "Penguin"},
      description: {
        nl: "Onder al je gezelligheid zit verrassend veel loyaliteit.",
        en: "Beneath all your warmth and friendliness lies a surprising amount of loyalty."},
      fact: {
        nl: "Pinguïns drinken ook zeewater; een speciale klier filtert het overtollige zout uit hun lichaam.",
        en: "Penguins can drink seawater; a special gland filters excess salt from their bodies."},
    },
    pig: {
      emoji: "🐷",
      name: {
        nl: "Varken",
        en: "Pig"},
      description: {
        nl: "Je geniet van het goede leven en voelt weinig behoefte om dat uit te leggen.",
        en: "You enjoy the good life and feel little need to explain yourself."},
      fact: {
        nl: "Varkens kunnen eenvoudige videogames leren spelen met een joystick.",
        en: "Pigs can learn to play simple video games using a joystick."},
    },
    seal: {
      emoji: "🦭",
      name: {
        nl: "Zeehond",
        en: "Seal"},
      description: {
        nl: "Comfort is niet hetzelfde als luiheid. Dat weet jij al lang.",
        en: "Comfort isn't the same as laziness. You've known that for a long time."},
      fact: {
        nl: "Zeehonden kunnen met hun snorharen het spoor van een zwemmende vis volgen, zelfs als die al minuten geleden verdwenen is.",
        en: "Seals can track the trail of a swimming fish with their whiskers, even minutes after it has disappeared."},
    },
    tiger: {
      emoji: "🐅",
      name: {
        nl: "Tijger",
        en: "Tiger"},
      description: {
        nl: "Je hebt meer daadkracht dan je soms laat zien.",
        en: "You have more drive and determination than you sometimes let on"},
      fact: {
        nl: "Een tijger kan de roep van een ander dier imiteren om prooien dichterbij te lokken.",
        en: "Tigers can imitate the calls of other animals to lure prey closer."},
    },
    lion: {
      emoji: "🦁",
      name: {
        nl: "Leeuw",
        en: "Lion"},
      description: {
        nl: "Er zit een natuurlijke waardigheid in je.",
        en: "There is a natural dignity about you."},
      fact: {
        nl: "De tong van een leeuw is ruw genoeg om vlees van een bot te schrapen.",
        en: "A lion's tongue is rough enough to scrape meat from a bone."},
    },
    elephant: {
      emoji: "🐘",
      name: {
        nl: "Olifant",
        en: "Elephant"},
      description: {
        nl: "Je hebt een talent voor onthouden wat echt belangrijk is, ook als anderen het allang vergeten zijn.",
        en: "You have a gift for remembering what truly matters, even long after others have forgotten"},
      fact: {
        nl: "Olifanten kunnen met hun poten trillingen in de grond voelen die kilometers verderop ontstaan.",
        en: "Elephants can detect vibrations through the ground from miles away."},
    },
    horse: {
      emoji: "🐎",
      name: {
        nl: "Paard",
        en: "Horse"},
      description: {
        nl: "Vrijheid voelt voor jou niet als luxe maar als een basisbehoefte.",
        en: "Freedom doesn't feel like a luxury to you: it feels like a basic need."},

      fact: {
        nl: "Paarden kunnen tijdens hun slaap één oog openhouden om hun omgeving in de gaten te houden.",
        en: "Horses can sleep with one eye open to keep watch on their surroundings."},
    },
    goat: {
      emoji: "🐐",
      name: {
        nl: "Geit",
        en: "Goat"},
      description: {
        nl: "Als iemand zegt dat iets niet kan, word je ineens nieuwsgierig.",
        en: "When someone says something can't be done, you suddenly become curious."},
      fact: {
        nl: "Sommige geiten lopen over bijna verticale rotswanden alsof het een gewoon wandelpad is.",
        en: "Some goats walk across near-vertical cliffs as if they were ordinary footpaths"},
    },
    dolphin: {
      emoji: "🐬",
      name: {
        nl: "Dolfijn",
        en: "Dolphin"},
      description: {
        nl: "Je houdt van contact, humor en mensen die een beetje kunnen meespelen.",
        en: "You enjoy connection, humor, and people who know how to play along"},
      fact: {
        nl: "Dolfijnen hebben unieke fluitjes als namen.",
        en: "Dolphins have unique signature whistles that function like names"},
    },
    hedgehog: {
      emoji: "🦔",
      name: {
        nl: "Egel",
        en: "Hedgehog"},
      description: {
        nl: "Je bepaalt zelf wanneer je dichtbij komt.",
        en: "You decide for yourself when to let someone get close."},
      fact: {
        nl: "Egels hebben tussen de 5000 en 7000 stekels.",
        en: "Hedgehogs have between 5,000 and 7,000 spines"},
    },
    turtle: {
      emoji: "🐢",
      name: {
        nl: "Schildpad",
        en: "Turtle"},
      description: {
        nl: "Je vertrouwt meer op je eigen tempo dan op de druk van buitenaf.",
        en: "You trust your own pace more than the pressure around you."},
      fact: {
        nl: "Schildpadden bestaan al langer dan krokodillen, slangen en de meeste zoogdieren.",
        en: "Turtles have existed longer than crocodiles, snakes, and most mammals."},
    },
    squirrel: {
      emoji: "🐿️",
      name: {
        nl: "Eekhoorn",
        en: "Squirrel"},
      description: {
        nl: "Je verzamelt ideeën, plannen en interessante dingen.",
        en: "You have a habit of collecting ideas, plans, and anything that sparks your curiosity."},
      fact: {
        nl: "Eekhoorns gebruiken hun staart als paraplu, deken en stuur tegelijk.",
        en: "A squirrel's tail can serve as a parasol, a blanket, or a rudder."},
    },
    chameleon: {
      emoji: "🦎",
      name: {
        nl: "Kameleon",
        en: "Chameleon"},
      description: {
        nl: "Je past je makkelijk aan nieuwe situaties aan.",
        en: "You adapt to new situations more easily than you realize"},
      fact: {
        nl: "De tong van een kameleon schiet sneller uit dan de meeste sportauto's optrekken.",
        en: "A chameleon's tongue shoots out faster than most sports cars can accelerate"},
    },
    butterfly: {
      emoji: "🦋",
      name: {
        nl: "Vlinder",
        en: "Butterfly"},
      description: {
        nl: "Je kunt verrassend makkelijk van perspectief veranderen.",
        en: "You can shift your perspective surprisingly easily."},
      fact: {
        nl: "Vlinders proeven met hun poten.",
        en: "Butterflies taste with their feet."},
    },
    bee: {
      emoji: "🐝",
      name: {
        nl: "Bij",
        en: "Bee"},
      description: {
        nl: "Je wordt blij van een groep waarin iedereen zijn eigen rol heeft.",
        en: "You thrive in a group where everyone has their own role to play."},

      fact: {
        nl: "Sommige bijen slapen samen in groepjes door zich vast te bijten aan een plant.",
        en: "Some bees sleep together in groups by gripping a plant with their jaws."},
    },
    ladybug: {
      emoji: "🐞",
      name: {
        nl: "Lieveheersbeestje",
        en: "Ladybug"},
      description: {
        nl: "Je brengt vaak meer lichtheid mee dan je zelf doorhebt.",
        en: "You bring more lightness to the world than you realize"},

      fact: {
        nl: "Lieveheersbeestjes kunnen uit hun poten een gele vloeistof afscheiden om roofdieren af te schrikken.",
        en: "Ladybugs can release a yellow fluid from their legs to deter predators"},
    },
    zebra: {
      emoji: "🦓",
      name: {
        nl: "Zebra",
        en: "Zebra"},
      description: {
        nl: "Je past in de groep zonder je eigenheid kwijt te raken.",
        en: "You fit into a group without losing what makes you unique."},
      fact: {
        nl: "De strepen van zebra's zorgen ervoor dat dazen en andere stekende vliegen veel minder vaak landen.",
      en: "A zebra's stripes make horseflies and other biting flies much less likely to land."},
    },

    flamingo: {
      emoji: "🦩",
      name: {
        nl: "Flamingo",
        en: "Flamingo"},
      description: {
        nl: "Je vindt het prima om een beetje anders te zijn dan de rest.",
        en: "You're perfectly comfortable being a little different from the rest."},
      fact: {
        nl: "Flamingo's bouwen torenvormige moddernesten om hun eieren boven het water te houden.",
        en: "Flamingos build tower-shaped mud nests to keep their eggs above the water."},
    },
    hummingbird: {
      emoji: "🐦",
      name: {
        nl: "Kolibrie",
        en: "Hummingbird"},
      description: {
        nl: "Je enthousiasme kan soms sneller bewegen dan de rest.",
        en: "Your enthusiasm sometimes moves faster than everyone around you."},
      fact: {
        nl: "Kolibries kunnen achteruit vliegen.",
        en: "Hummingbirds can fly backwards."},
    },
    monkey: {
      emoji: "🐒",
      name: {
        nl: "Aap",
        en: "Monkey"},
      description: {
        nl: "Je innerlijke stem heeft regelmatig het volwassen gesprek verlaten.",
        en: "Your inner voice doesn't always stay for the grown-up conversation."},
      fact: {
        nl: "Sommige apen hebben regionale 'tradities' die in andere groepen helemaal niet voorkomen.",
        en: "Some monkey groups have their own local traditions that don't exist in other groups."},
    },
    deer: {
      emoji: "🦌",
      name: {
        nl: "Hert",
        en: "Deer"},
      description: {
        nl: "Je merkt meer op dan mensen denken.",
        en: "You notice more than people realize"},
      fact: {
        nl: "Een hert kan verschillende geuren als het ware in lagen uit elkaar halen, zoals wij verschillende instrumenten in muziek horen.",
        en: "A deer can separate different scents into layers, much like we can distinguish different instruments in a piece of music."},
    },
    beaver: {
      emoji: "🦫",
      name: {
        nl: "Bever",
        en: "Beaver"},
      description:{
        nl: "Als iets de moeite waard is, bouw je liever iets stevigs.",
        en: "If something is worth doing, you'd rather build it to last."},
      fact: {
        nl: "Een bever kan onder water doorzichtige extra oogleden sluiten, alsof hij een duikbril draagt.",
        en: "A beaver can close transparent eyelids underwater, allowing it to see as if it were wearing goggles."},
    },
    crocodile: {
      emoji: "🐊",
      name: {
        nl: "Krokodil",
        en: "Crocodile"},
      description: {
        nl: "Je verspilt weinig energie. Je wacht liever op het juiste moment.",
        en: "You don't waste energy. You'd rather wait for the right moment."},
      fact: {
        nl: "Krokodillen hebben speciale kleppen in hun keel waardoor ze onder water hun bek kunnen openen zonder water binnen te krijgen.",
        en: "Crocodiles have special valves in their throats that allow them to open their mouths underwater without letting water in."},
    }
  }

  const copy = {
    nl: {
      eyebrow: "Ontdek je innerlijke dier",
      question: "Vraag",
      of: "van",
      back: "Terug",
      mainMatch: "hoofdmoot",
      subMatch: "vleugje",
      match: "match",
      funFact: "Leuk weetje",
      resultIntro: "Jouw dierencombinatie",
      withHint: "met een vleugje",
      playAgain: "Opnieuw spelen",
      menu: "Hoofdmenu",
      share: "Deel mijn resultaat",
      shared: "Link gekopieerd!",
      shareText: "Ik ben een {main}, met een vleugje {sub}. Welk dier ben jij?",
      friendIntro: "Een vriend deelde deze combinatie met je",
      friendResult: "Je vriend is {main}, met een vleugje {sub}.",
      compareTitle: "Jullie dieren naast elkaar",
      sameMain: "Jullie delen hetzelfde hoofddier.",
      sameSub: "Jullie hebben hetzelfde tweede dier.",
      different: "Jullie zijn een mooie mix van verschillende dieren.",
      subscribeText: "Ontvang jouw uitslag en mijn nieuwste dierenkunst.",
      subscribeButton: "Stuur mijn uitslag",
      subscribePlaceholder: "jouw@email.nl",
      subscribeConsent: "Je ontvangt je persoonlijke quizuitslag en schrijft je in voor inspiratie, toekomstige quizzen en updates over dierenkunst. Je kunt je altijd uitschrijven.",
      subscribeSuccess: "Dank je! Je uitslag is onderweg naar je inbox.",
      subscribeError: "Dat lukte niet. Controleer je e-mailadres en probeer het opnieuw.",
      subscribeInvalidEmail: "Vul een geldig e-mailadres in.",
      subscribeConfigMissing: "Vul eerst de Klaviyo-configuratie in.",
      socialShare: "Deel of vergelijk",
      shareFacebook: "Facebook",
      shareLinkedIn: "LinkedIn",
      shareX: "X",
      copyLink: "Kopieer link",
    },
    en: {
      eyebrow: "Discover your inner animal",
      question: "Question",
      of: "of",
      back: "Back",
      mainMatch: "main",
      subMatch: "hint",
      match: "match",
      funFact: "Fun fact",
      resultIntro: "Your animal combination",
      withHint: "with a hint of",
      playAgain: "Play again",
      menu: "Main menu",
      share: "Share my result",
      shared: "Link copied!",
      shareText: "I am a {main}, with a hint of {sub}. Which animal are you?",
      friendIntro: "A friend shared this combination with you",
      friendResult: "Your friend is a {main}, with a hint of {sub}.",
      compareTitle: "Your animals side by side",
      sameMain: "You share the same main animal.",
      sameSub: "You have the same second animal.",
      different: "You make a lovely mix of different animals.",
      subscribeText: "Get your result and my latest animal art.",
      subscribeButton: "Send my result",
      subscribePlaceholder: "you@email.com",
      subscribeConsent: "You will receive your personal quiz result and sign up for inspiration, future quizzes, and animal art updates. You can unsubscribe at any time.",
      subscribeSuccess: "Thank you! Your result is on its way to your inbox.",
      subscribeError: "That did not work. Check your email address and try again.",
      subscribeInvalidEmail: "Enter a valid email address.",
      subscribeConfigMissing: "Add the Klaviyo configuration first.",
      socialShare: "Share or compare",
      shareFacebook: "Facebook",
      shareLinkedIn: "LinkedIn",
      shareX: "X",
      copyLink: "Copy link",
    },
  }[language]

  const result = useMemo(
    () => (answers.length === questions.length ? getAnimalResults(answers) : null),
    [answers],
  )
  const friendMain = searchParams.get("friend")
  const friendSub = searchParams.get("friendSub")
  const hasFriendResult = Boolean(animalInfo[friendMain] && animalInfo[friendSub])
  const friendMainInfo = animalInfo[friendMain]
  const friendSubInfo = animalInfo[friendSub]

  const handleAnswer = (answer, answerIndex) => {
    const scoredAnswer = {
      ...answer,
      answerIndex,
      resultAnimal: signatureAnimals[currentQuestion][answerIndex],
    }
    const nextAnswers = [...answers.slice(0, currentQuestion), scoredAnswer]
    setAnswers(nextAnswers)

    if (currentQuestion === questions.length - 1) {
      const messageIndex = nextAnswers.reduce(
        (total, item) => total + item.resultAnimal.charCodeAt(0),
        0,
      ) % messages[language].length
      setRandomMessage(messages[language][messageIndex])
      setIsCalculating(true)

      setTimeout(() => {
        setCurrentQuestion(questions.length)
        setIsCalculating(false)
      }, 900)
      return
    }

    setCurrentQuestion((question) => question + 1)
  }

  const handleBack = () => {
    setCurrentQuestion((question) => Math.max(0, question - 1))
  }

  const restartQuiz = () => {
    setAnswers([])
    setCurrentQuestion(0)
    setShareStatus("")
    setSubscribeEmail("")
    setSubscribeStatus("idle")
    setSubscribeMessage("")
  }

  const getShareUrl = () => {
    const shareUrl = new URL(window.location.href)
    shareUrl.search = ""
    shareUrl.searchParams.set("friend", result.mainAnimal)
    shareUrl.searchParams.set("friendSub", result.subAnimal)
    return shareUrl.toString()
  }

  const getShareText = () => copy.shareText
    .replace("{main}", animalInfo[result.mainAnimal].name[language])
    .replace("{sub}", animalInfo[result.subAnimal].name[language])

  const getResultEventProperties = (email) => {
    const mainInfo = animalInfo[result.mainAnimal]
    const subInfo = animalInfo[result.subAnimal]
    const resultLabel = `${mainInfo.name[language]} + ${subInfo.name[language]}`
    const artworkRecommendations = getArtworkRecommendations({
      mainAnimal: result.mainAnimal,
      secondaryAnimal: result.subAnimal,
      language,
    })

    return {
      email,
      language,
      main_animal: mainInfo.name[language],
      main_animal_slug: result.mainAnimal,
      main_animal_percentage: result.mainPercentage,
      main_animal_description: mainInfo.description[language],
      main_animal_fact: mainInfo.fact[language],
      secondary_animal: subInfo.name[language],
      secondary_animal_slug: result.subAnimal,
      secondary_animal_percentage: result.subPercentage,
      secondary_animal_description: subInfo.description[language],
      secondary_animal_fact: subInfo.fact[language],
      quiz_completed_at: new Date().toISOString(),
      quiz_version: KLAVIYO_CONFIG.quizVersion,
      result_label: resultLabel,
      result_share_text: getShareText(),
      quiz_url: `${KLAVIYO_CONFIG.siteUrl}/quiz/${language}`,
      share_url: getShareUrl(),
      source: "animal_quiz_result_page",
      list_id: KLAVIYO_CONFIG.listIds[language],
      artwork_1_title: artworkRecommendations[0]?.title || "",
      artwork_1_description: artworkRecommendations[0]?.description || "",
      artwork_1_url: artworkRecommendations[0]?.url || "",
      artwork_1_image_url: artworkRecommendations[0]?.image_url || "",
      artwork_2_title: artworkRecommendations[1]?.title || "",
      artwork_2_description: artworkRecommendations[1]?.description || "",
      artwork_2_url: artworkRecommendations[1]?.url || "",
      artwork_2_image_url: artworkRecommendations[1]?.image_url || "",
      artwork_3_title: artworkRecommendations[2]?.title || "",
      artwork_3_description: artworkRecommendations[2]?.description || "",
      artwork_3_url: artworkRecommendations[2]?.url || "",
      artwork_3_image_url: artworkRecommendations[2]?.image_url || "",
    }
  }

  const handleSubscribe = async (event) => {
    event.preventDefault()
    setSubscribeStatus("loading")
    setSubscribeMessage("")

    const email = subscribeEmail.trim().toLowerCase()

    if (!isValidEmail(email)) {
      setSubscribeStatus("error")
      setSubscribeMessage(copy.subscribeInvalidEmail)
      return
    }

    if (!isKlaviyoConfigured(language)) {
      setSubscribeStatus("error")
      setSubscribeMessage(copy.subscribeConfigMissing)
      return
    }

    try {
      await submitQuizResultToKlaviyo({
        email,
        language,
        eventProperties: getResultEventProperties(email),
      })
      setSubscribeStatus("success")
      setSubscribeMessage(copy.subscribeSuccess)
      setSubscribeEmail("")
    } catch {
      setSubscribeStatus("error")
      setSubscribeMessage(copy.subscribeError)
    }
  }

  const handleShare = async () => {
    const shareUrl = getShareUrl()
    const shareText = getShareText()

    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: shareText,
          url: shareUrl,
        })
        return
      }
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      setShareStatus(copy.shared)
    } catch (error) {
      if (error?.name !== "AbortError") {
        await navigator.clipboard.writeText(shareUrl.toString())
        setShareStatus(copy.shared)
      }
    }
  }

  if (isCalculating) {
    return (
      <main className="quiz-shell loading-screen" aria-live="polite">
        <div className="loading-paw">🐾</div>
        <h1 className="loadingMessage">{randomMessage}</h1>
      </main>
    )
  }

  if (currentQuestion === questions.length && result) {
    const mainInfo = animalInfo[result.mainAnimal]
    const subInfo = animalInfo[result.subAnimal]
    const shareUrl = getShareUrl()
    const shareText = getShareText()
    const encodedShareUrl = encodeURIComponent(shareUrl)
    const encodedShareText = encodeURIComponent(shareText)
    const socialLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
      x: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedShareUrl}`,
    }
    const comparison = friendMain === result.mainAnimal
      ? copy.sameMain
      : friendSub === result.subAnimal
        ? copy.sameSub
        : copy.different

    return (
      <main className="quiz-shell result-page">
        <div className="topbar">
          <img className="quiz-logo" src={animalQuizLogo} alt="Tim Hupkes Art dieren quiz" />
          <button className="language-button" onClick={switchLanguage}>
            {language === "nl" ? "🇬🇧 English" : "🇳🇱 Nederlands"}
          </button>
        </div>

        <section className="result-card">
          <p className="eyebrow">{copy.resultIntro}</p>
          <div
            className="result-columns"
            aria-label={`${mainInfo.name[language]} ${copy.withHint} ${subInfo.name[language]}`}
          >
            <article className="animal-card animal-card-main">
              <header className="animal-card-header">
                <span className="animal-emoji" aria-hidden="true">{mainInfo.emoji}</span>
                <span className="match-percentage">{result.mainPercentage}% {copy.match}</span>
                <h1>{mainInfo.name[language]}</h1>
                <span className="result-label">{copy.mainMatch}</span>
              </header>
              <div className="animal-card-divider" aria-hidden="true"><span>✦</span></div>
              <div className="animal-card-copy">
                <p className="animal-description">{mainInfo.description[language]}</p>
                <p className="result-fact">
                  <strong>🐾 {copy.funFact}:</strong> {mainInfo.fact[language]}
                </p>
              </div>
            </article>

            <span className="result-plus" aria-hidden="true">+</span>

            <article className="animal-card animal-card-sub">
              <header className="animal-card-header">
                <span className="animal-emoji" aria-hidden="true">{subInfo.emoji}</span>
                <span className="match-percentage">{result.subPercentage}% {copy.match}</span>
                <h2>{subInfo.name[language]}</h2>
                <span className="result-label">{copy.subMatch}</span>
              </header>
              <div className="animal-card-divider" aria-hidden="true"><span>✦</span></div>
              <div className="animal-card-copy">
                <p className="animal-description">{subInfo.description[language]}</p>
                <p className="result-fact">
                  <strong>🐾 {copy.funFact}:</strong> {subInfo.fact[language]}
                </p>
              </div>
            </article>
          </div>
        </section>

        <div className="result-cta-panel">
          <form className="result-subscribe" onSubmit={handleSubscribe}>
            <label className="result-subscribe__label" htmlFor="result-email">
              {copy.subscribeText}
            </label>
            <div className="result-subscribe__row">
              <input
                id="result-email"
                className="result-subscribe__input"
                type="email"
                value={subscribeEmail}
                placeholder={copy.subscribePlaceholder}
                autoComplete="email"
                required
                onChange={(event) => setSubscribeEmail(event.target.value)}
              />
              <button
                className="primary-button result-subscribe__button"
                type="submit"
                disabled={subscribeStatus === "loading"}
              >
                {subscribeStatus === "loading" ? "..." : copy.subscribeButton}
              </button>
            </div>
            {subscribeMessage && (
              <p
                className={`result-subscribe__message result-subscribe__message--${subscribeStatus}`}
                role="status"
              >
                {subscribeMessage}
              </p>
            )}
            <p className="result-subscribe__consent">{copy.subscribeConsent}</p>
          </form>

          <div className="result-actions">
            <button className="secondary-button" onClick={restartQuiz}>{copy.playAgain}</button>
            <a className="secondary-button" href="https://animals.timhupkes.com">{copy.menu}</a>
          </div>

          <div className="social-share" aria-label={copy.socialShare}>
            <span>{copy.socialShare}</span>
            <a href={socialLinks.facebook} target="_blank" rel="noreferrer">{copy.shareFacebook}</a>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">{copy.shareLinkedIn}</a>
            <a href={socialLinks.x} target="_blank" rel="noreferrer">{copy.shareX}</a>
            <button type="button" onClick={handleShare}>{copy.copyLink}</button>
          </div>
        </div>

        {hasFriendResult && (
          <section className="comparison-card">
            <p className="eyebrow">{copy.compareTitle}</p>
            <div className="comparison-animals">
              <span>{mainInfo.emoji} {mainInfo.name[language]}</span>
              <span>↔</span>
              <span>{friendMainInfo.emoji} {friendMainInfo.name[language]}</span>
            </div>
            <p>{comparison}</p>
            <p className="friend-detail">
              {copy.friendResult
                .replace("{main}", friendMainInfo.name[language])
                .replace("{sub}", friendSubInfo.name[language])}
            </p>
          </section>
        )}

        {shareStatus && <p className="share-status" role="status">{shareStatus}</p>}
      </main>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const selectedAnswer = answers[currentQuestion]

  return (
    <main className="quiz-shell question-page">
      <div className="topbar">
        <img className="quiz-logo" src={animalQuizLogo} alt="Tim Hupkes Art dieren quiz" />
        <button className="language-button" onClick={switchLanguage}>
          {language === "nl" ? "🇬🇧 English" : "🇳🇱 Nederlands"}
        </button>
      </div>

      {hasFriendResult && currentQuestion === 0 && (
        <div className="friend-invite">
          <span>{friendMainInfo?.emoji} {friendSubInfo?.emoji}</span>
          <p>{copy.friendIntro}</p>
        </div>
      )}

      <section className="question-card">
        <p className="eyebrow">{copy.eyebrow}</p>
        <div className="progress-copy">
          <span>{copy.question} {currentQuestion + 1} {copy.of} {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <h1 className="question-title">{questions[currentQuestion].question[language]}</h1>

        <div className="answers">
          {questions[currentQuestion].answers[language].map((answer, index) => (
            <button
              className={`answer-button ${selectedAnswer?.mainAnimal === answer.mainAnimal && selectedAnswer?.subAnimal === answer.subAnimal ? "is-selected" : ""}`}
              key={`${answer.mainAnimal}-${answer.subAnimal}-${index}`}
              onClick={() => handleAnswer(answer, index)}
            >
              <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
              <span>{answer.text}</span>
            </button>
          ))}
        </div>

        <div className="question-footer">
          <button className="back-button" onClick={handleBack} disabled={currentQuestion === 0}>
            ← {copy.back}
          </button>
          <span className="paw-trail" aria-hidden="true">· 🐾 ·</span>
        </div>
      </section>
    </main>
  )
}

export default Quiz
