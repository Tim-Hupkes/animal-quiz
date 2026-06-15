const traits = [
  "curious",
  "analytical",
  "bold",
  "social",
  "calm",
  "independent",
  "playful",
  "caring",
]

const profile = (
  curious,
  analytical,
  bold,
  social,
  calm,
  independent,
  playful,
  caring,
) => ({ curious, analytical, bold, social, calm, independent, playful, caring })

export const animalProfiles = {
  crow: profile(4, 4, 2, 2, 2, 3, 2, 2),
  fox: profile(3, 4, 3, 2, 3, 4, 2, 1),
  raccoon: profile(4, 3, 3, 2, 1, 3, 4, 1),
  octopus: profile(4, 4, 2, 1, 3, 4, 2, 1),
  bat: profile(3, 3, 2, 2, 3, 4, 1, 2),
  owl: profile(3, 4, 1, 1, 4, 3, 1, 2),
  eagle: profile(3, 3, 4, 1, 3, 4, 1, 1),
  shark: profile(1, 2, 4, 1, 3, 4, 1, 1),
  cat: profile(2, 2, 2, 1, 4, 4, 3, 2),
  dog: profile(2, 2, 3, 4, 2, 1, 3, 4),
  wolf: profile(2, 3, 4, 4, 2, 3, 2, 4),
  otter: profile(4, 2, 2, 4, 2, 2, 4, 3),
  capybara: profile(2, 1, 1, 4, 4, 2, 3, 4),
  parrot: profile(3, 2, 3, 4, 1, 2, 4, 2),
  penguin: profile(2, 2, 3, 4, 3, 1, 3, 4),
  pig: profile(3, 3, 2, 3, 4, 2, 3, 2),
  seal: profile(2, 2, 2, 3, 4, 2, 4, 3),
  tiger: profile(2, 3, 4, 1, 3, 4, 2, 2),
  lion: profile(1, 2, 4, 4, 3, 2, 2, 3),
  elephant: profile(2, 4, 3, 4, 4, 2, 1, 4),
  horse: profile(3, 2, 4, 3, 2, 4, 3, 2),
  goat: profile(4, 2, 4, 2, 2, 4, 3, 1),
  dolphin: profile(3, 3, 3, 4, 2, 1, 4, 4),
  hedgehog: profile(2, 2, 1, 1, 4, 4, 1, 3),
  turtle: profile(1, 2, 1, 1, 4, 4, 1, 2),
  squirrel: profile(4, 3, 3, 3, 1, 2, 4, 2),
  chameleon: profile(3, 3, 2, 3, 3, 2, 2, 2),
  butterfly: profile(4, 2, 2, 3, 2, 3, 4, 2),
  bee: profile(2, 3, 3, 4, 2, 1, 2, 4),
  ladybug: profile(2, 1, 2, 3, 3, 2, 4, 4),
  zebra: profile(2, 2, 3, 4, 3, 3, 2, 3),
  flamingo: profile(2, 2, 3, 4, 2, 4, 4, 2),
  hummingbird: profile(4, 2, 4, 3, 1, 3, 4, 2),
  monkey: profile(4, 2, 3, 4, 1, 2, 4, 2),
  deer: profile(3, 3, 1, 2, 4, 3, 1, 4),
  beaver: profile(2, 4, 3, 3, 3, 2, 1, 4),
  crocodile: profile(1, 3, 3, 1, 4, 4, 1, 1),
}

export const signatureAnimals = [
  ["crow", "parrot", "pig", "bat"],
  ["seal", "dolphin", "fox", "raccoon"],
  ["octopus", "shark", "dog", "chameleon"],
  ["owl", "horse", "otter", "goat"],
  ["turtle", "beaver", "wolf", "monkey"],
  ["elephant", "deer", "capybara", "ladybug"],
  ["bee", "eagle", "cat", "hedgehog"],
  ["tiger", "crocodile", "penguin", "squirrel"],
  ["lion", "hummingbird", "zebra", "butterfly"],
  ["owl", "horse", "flamingo", "capybara"],
]

const addProfile = (totals, animal, weight) => {
  const animalProfile = animalProfiles[animal]
  if (!animalProfile) return

  traits.forEach((trait) => {
    totals[trait] += animalProfile[trait] * weight
  })
}

const similarity = (userProfile, animalProfile) => {
  const distance = Math.sqrt(
    traits.reduce((total, trait) => {
      const difference = userProfile[trait] - animalProfile[trait]
      return total + difference ** 2
    }, 0),
  )
  const maximumDistance = Math.sqrt(traits.length * 3 ** 2)
  return Math.max(0, 1 - distance / maximumDistance)
}

const normaliseTotals = (totals) => {
  const highestTraitScore = Math.max(...Object.values(totals), 1)
  return Object.fromEntries(
    traits.map((trait) => [trait, (totals[trait] / highestTraitScore) * 4]),
  )
}

export function getAnimalResults(answers) {
  const totals = Object.fromEntries(traits.map((trait) => [trait, 0]))

  answers.forEach((answer) => {
    addProfile(totals, answer.mainAnimal, 2)
    addProfile(totals, answer.subAnimal, 1)
  })

  const userProfile = normaliseTotals(totals)

  const candidateAnimals = [...new Set(answers.map((answer) => answer.resultAnimal))]
  const anchorIndex = answers.reduce(
    (total, answer, index) => total + (answer.answerIndex + 1) * (index + 3) * 7,
    0,
  ) % answers.length
  const anchorAnimal = answers[anchorIndex].resultAnimal
  const ranked = candidateAnimals
    .map((animal) => ({
      animal,
      score: similarity(userProfile, animalProfiles[animal]) + (animal === anchorAnimal ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.animal.localeCompare(b.animal))

  const topTwoTotal = ranked[0].score + ranked[1].score
  const mainPercentage = Math.round((ranked[0].score / topTwoTotal) * 100)

  return {
    mainAnimal: ranked[0].animal,
    subAnimal: ranked[1].animal,
    mainPercentage,
    subPercentage: 100 - mainPercentage,
    ranked,
  }
}
