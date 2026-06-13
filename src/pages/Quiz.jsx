import { useParams, Link, useNavigate } from "react-router-dom"
import { questions } from "../data/questions"
import { useState } from "react"


function Quiz() {
  const { lang } = useParams()
  const language = lang === "en" ? "en" : "nl"
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [mainScores, setMainScores] = useState({})
  const [subScores, setSubScores] = useState({})
  const [isCalculating, setIsCalculating] = useState(false)
  const [randomMessage, setRandomMessage] = useState("")

  // Taal toggle functie
  const switchLanguage = () => {
    const newLang = language === "nl" ? "en" : "nl"
    navigate(`/${newLang}`)
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
        en: "ome owl species have unevenly placed ears, helping them locate prey with astonishing accuracy in the dark."
    }},
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
        en: "hen someone says something can't be done, you suddenly become curious."},
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

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages[language].length)
    return messages[language][randomIndex]
  }

  const topMainAnimal = Object.keys(mainScores).length > 0
    ? Object.entries(mainScores).sort((a, b) => b[1] - a[1])[0][0]
    : null

  const topSubAnimal = Object.keys(subScores).length > 0
    ? Object.entries(subScores).sort((a, b) => b[1] - a[1])[0][0]
    : null

  const handleAnswer = (answer) => {
    setMainScores(prev => ({
      ...prev,
      [answer.mainAnimal]: (prev[answer.mainAnimal] || 0) + 1
    }))
    setSubScores(prev => ({
      ...prev,
      [answer.subAnimal]: (prev[answer.subAnimal] || 0) + 1
    }))

    if (currentQuestion === questions.length - 1) {
      setRandomMessage(getRandomMessage())
      setIsCalculating(true)

      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setIsCalculating(false)
      }, 1000)
      return
    }

    setCurrentQuestion(currentQuestion + 1)
  }

  // Show calculating screen
  if (isCalculating) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1 className="loadingMessage">{randomMessage}</h1>
      </div>
    )
  }

  // Show result screen
  if (currentQuestion === questions.length) {
    return (
      <>
        {/* Taalknop */}
        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <button 
            onClick={switchLanguage}
            style={{
              background: "none",
              border: "1px solid #ccc",
              borderRadius: "20px",
              padding: "0.3rem 0.8rem",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            {language === "nl" ? "🇬🇧 English" : "🇳🇱 Nederlands"}
          </button>
        </div>

        <h2 className="result-main-animal">
          {animalInfo[topMainAnimal]?.emoji || "🐾"} {animalInfo[topMainAnimal]?.name[language] || (language === "en" ? "Animal" : "Dier")}
        </h2>
        <p className="result-description">
          {animalInfo[topMainAnimal]?.description[language] || (language === "en" ? "No description available" : "Geen beschrijving beschikbaar")}
        </p>
        <p className="result-fact">
          {language === "en" ? "🐾 Fun fact:" : "🐾 Leuk weetje:"}{" "}
          {animalInfo[topMainAnimal]?.fact[language] || (language === "en" ? "No fact available" : "Geen weetje beschikbaar")}
        </p >
        <p className="result-sub-animal">
          {language === "en" ? "With a hint of" : "Met een vleugje"} {animalInfo[topSubAnimal]?.emoji || ""} {animalInfo[topSubAnimal]?.name[language] || (language === "en" ? " animal" : "dier")}</p>
        
        <p className="result-sub-description">{animalInfo[topSubAnimal]?.description[language] || (language === "en" ? "No description available" : "Geen beschrijving beschikbaar")}</p>

        <p className="result-fact">
          {language === "en" ? "🐾 Fun fact:" : "🐾 Leuk weetje:"}{" "}
          {animalInfo[topSubAnimal]?.fact[language] || (language === "en" ? "No fact available" : "Geen weetje beschikbaar")}
        </p>

        <a href="https://animals.timhupkes.com">
          <button className="answer-button">
            {language === "en" ? "Main menu" : "Hoofdmenu"}
          </button>
        </a>
      </>
    )
  }

  // Show quiz question
  return (
    <>
      {/* Taalknop */}
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button 
          onClick={switchLanguage}
          style={{
            background: "none",
            border: "1px solid #ccc",
            borderRadius: "20px",
            padding: "0.3rem 0.8rem",
            cursor: "pointer",
            fontSize: "0.9rem"
          }}
        >
          {language === "nl" ? "🇬🇧 English" : "🇳🇱 Nederlands"}
        </button>
      </div>

      <h2 className="question-title">
        {questions[currentQuestion]?.question[language]}
      </h2>

      {questions[currentQuestion]?.answers[language].map((answer) => (
        <button 
          className="answer-button"
          key={answer.text || answer}
          onClick={() => handleAnswer(answer)}
        >
          {answer.text || answer}
        </button>
      ))}
    </>
  )
}

export default Quiz