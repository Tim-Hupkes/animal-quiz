const artworkByAnimal = {
  crow: { slug: "crow", title: { nl: "Kraai kunstprint", en: "Crow art print" } },
  fox: { slug: "fox", title: { nl: "Vos kunstprint", en: "Fox art print" } },
  owl: { slug: "owl", title: { nl: "Uil kunstprint", en: "Owl art print" } },
  eagle: { slug: "eagle", title: { nl: "Adelaar kunstprint", en: "Eagle art print" } },
  butterfly: { slug: "butterfly", title: { nl: "Vlinder kunstprint", en: "Butterfly art print" } },
}

const fallbackArtworks = [
  {
    slug: "animal-art-collection",
    title: {
      nl: "Dierenkunst collectie",
      en: "Animal art collection",
    },
    description: {
      nl: "Ontdek speelse, elegante dierenkunst voor aan de muur.",
      en: "Explore playful, elegant animal artwork for your walls.",
    },
  },
  {
    slug: "new-arrivals",
    title: {
      nl: "Nieuwe dierenprints",
      en: "New animal prints",
    },
    description: {
      nl: "Bekijk de nieuwste illustraties en kunstprints.",
      en: "Browse the newest illustrations and art prints.",
    },
  },
  {
    slug: "gift-card",
    title: {
      nl: "Cadeau voor dierenliefhebbers",
      en: "Gift for animal lovers",
    },
    description: {
      nl: "Een rustig cadeau-idee voor iemand met een lievelingsdier.",
      en: "A gentle gift idea for someone with a favourite animal.",
    },
  },
]

const getArtworkUrl = (slug) => `https://animals.timhupkes.com/${slug}`
const getImageUrl = (slug) => `https://animals.timhupkes.com/images/${slug}.jpg`

function createAnimalArtwork(animalSlug, language) {
  const artwork = artworkByAnimal[animalSlug]
  if (!artwork) return null

  return {
    title: artwork.title[language],
    description:
      language === "en"
        ? "A calm artwork recommendation inspired by your quiz result."
        : "Een rustige kunstaanbeveling op basis van jouw quizuitslag.",
    url: getArtworkUrl(artwork.slug),
    image_url: getImageUrl(artwork.slug),
  }
}

export function getArtworkRecommendations({ mainAnimal, secondaryAnimal, language }) {
  const recommendations = [
    createAnimalArtwork(mainAnimal, language),
    createAnimalArtwork(secondaryAnimal, language),
    ...fallbackArtworks.map((artwork) => ({
      title: artwork.title[language],
      description: artwork.description[language],
      url: getArtworkUrl(artwork.slug),
      image_url: getImageUrl(artwork.slug),
    })),
  ].filter(Boolean)

  return recommendations.slice(0, 3)
}
