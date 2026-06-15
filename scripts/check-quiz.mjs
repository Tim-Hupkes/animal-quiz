import { questions } from "../src/data/questions.js"
import {
  animalProfiles,
  getAnimalResults,
  signatureAnimals,
} from "../src/data/scoring.js"

let seed = 20260615
const random = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

const resultCounts = Object.fromEntries(
  Object.keys(animalProfiles).map((animal) => [animal, 0]),
)

for (let run = 0; run < 50000; run += 1) {
  const answers = questions.map((question, questionIndex) => {
    const answerIndex = Math.floor(random() * question.answers.nl.length)
    return {
      ...question.answers.nl[answerIndex],
      answerIndex,
      resultAnimal: signatureAnimals[questionIndex][answerIndex],
    }
  })

  resultCounts[getAnimalResults(answers).mainAnimal] += 1
}

const unreachableAnimals = Object.entries(resultCounts)
  .filter(([, count]) => count === 0)
  .map(([animal]) => animal)

if (unreachableAnimals.length > 0) {
  throw new Error(`Unreachable result animals: ${unreachableAnimals.join(", ")}`)
}

console.log(
  `Quiz check passed: ${questions.length} questions and ${Object.keys(resultCounts).length} reachable result animals.`,
)
