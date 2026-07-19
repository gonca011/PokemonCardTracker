const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const cardsRoot = path.join(projectRoot, "cards");
const sets = require(path.join(projectRoot, "sets.json"));

const allCards = [];

for (const expansion of sets) {
  const cardsJson = path.join(cardsRoot, expansion, "cards.json");

  if (!fs.existsSync(cardsJson)) {
    console.warn(`Não existe: ${cardsJson}`);
    continue;
  }

  const cardEntries = JSON.parse(fs.readFileSync(cardsJson, "utf8"));

  for (const card of cardEntries) {
    allCards.push({
      expansion,
      file: card
    });
  }
}

const output = path.join(cardsRoot, "all_cards.json");

fs.writeFileSync(output, JSON.stringify(allCards, null, 2));

console.log(`Foram guardadas ${allCards.length} cartas em ${output}`);