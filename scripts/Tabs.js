const SETS_FILE = "../sets.json";
const POKEMON_INDEX_FILE = "../pokemon_name_index.json";
const CARDS_BASE_PATH = "../cards/";

let currentCards = [];
let pokemonIndexReady = null;
let pokemonNameMatchers = [];

const cardsByContainer = new WeakMap();
const tabStates = new WeakMap();

function openPage(pageName, elmnt, color) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  const tablinks = document.getElementsByClassName("tablink");

  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }

  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
}

function filterSelection(element, filterName) {
  const scope = getTabScope(element);

  setActiveFilter(scope, filterName);
  applyFilters(scope);
  closeAllDropdowns();
}

function toggleDropdown(button) {
  const dropdown = button.nextElementSibling;
  const allDropdowns = document.getElementsByClassName("dropdown-content");

  for (let i = 0; i < allDropdowns.length; i++) {
    if (allDropdowns[i] !== dropdown) {
      allDropdowns[i].classList.remove("show");
    }
  }

  dropdown.classList.toggle("show");
}

function filterFunction(input) {
  const filter = normalizeSearchText(input.value);
  const dropdown = input.parentElement;
  const links = dropdown.getElementsByTagName("a");

  for (let i = 0; i < links.length; i++) {
    const textValue = links[i].textContent || links[i].innerText;
    links[i].style.display = normalizeSearchText(textValue).includes(filter) ? "" : "none";
  }
}

function closeAllDropdowns() {
  const dropdowns = document.getElementsByClassName("dropdown-content");

  for (let i = 0; i < dropdowns.length; i++) {
    dropdowns[i].classList.remove("show");
  }
}

function getTabScope(element) {
  return element?.closest(".tabcontent") || document;
}

function getTabState(scope) {
  if (!tabStates.has(scope)) {
    tabStates.set(scope, {
      activeFilter: "all",
      activeFilterClass: "",
      searchQuery: "",
      cards: [],
    });
  }

  return tabStates.get(scope);
}

function setActiveFilter(scope, filterName) {
  const state = getTabState(scope);

  state.activeFilter = filterName || "all";
  state.activeFilterClass = filterName === "all" ? "" : getFilterClass(filterName);
}

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCardSearchText(value) {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePokemonMatchText(value) {
  return normalizeCardSearchText(
    String(value || "")
      .replace(/♀/g, " female")
      .replace(/♂/g, " male")
  )
    .replace(/\bfemale\b/g, "f")
    .replace(/\bmale\b/g, "m")
    .replace(/\s+/g, " ")
    .trim();
}

function getFilterClass(value) {
  return normalizeSearchText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "sem-filtro";
}

function encodePathSegment(value) {
  return encodeURIComponent(value);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function loadJsonFile(url) {
  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return parseJsonContent(await response.text());
  } catch (fetchError) {
    return loadJsonFileWithXhr(url, fetchError);
  }
}

function parseJsonContent(content) {
  return JSON.parse(content.replace(/^\uFEFF/, ""));
}

function loadJsonFileWithXhr(url, previousError) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.overrideMimeType("application/json");
    request.open("GET", url, true);

    request.onload = function () {
      const loadedLocalFile = request.status === 0 && request.responseText;
      const loadedHttpFile = request.status >= 200 && request.status < 300;

      if (!loadedLocalFile && !loadedHttpFile) {
        reject(previousError);
        return;
      }

      try {
        resolve(parseJsonContent(request.responseText));
      } catch (parseError) {
        reject(parseError);
      }
    };

    request.onerror = function () {
      reject(previousError);
    };

    request.send();
  });
}

async function loadExpansions() {
  const containers = document.querySelectorAll(".expansionFilters");

  if (containers.length === 0) {
    return;
  }

  try {
    const expansions = await loadJsonFile(SETS_FILE);

    if (!Array.isArray(expansions)) {
      throw new Error("sets.json deve conter uma lista de expansoes.");
    }

    containers.forEach((container) => createExpansionFilters(container, expansions));
  } catch (error) {
    console.error("Erro ao carregar expansoes:", error);
    containers.forEach((container) => {
      container.textContent = "Nao foi possivel carregar o sets.json.";
    });
  }
}

async function loadPokemonIndex() {
  if (pokemonIndexReady) {
    return pokemonIndexReady;
  }

  pokemonIndexReady = loadJsonFile(POKEMON_INDEX_FILE)
    .then((pokemonIndex) => {
      pokemonNameMatchers = createPokemonNameMatchers(pokemonIndex);
      return pokemonNameMatchers;
    })
    .catch((error) => {
      console.error("Erro ao carregar pokemon_name_index.json:", error);
      pokemonNameMatchers = [];
      return pokemonNameMatchers;
    });

  return pokemonIndexReady;
}

function createPokemonNameMatchers(pokemonIndex) {
  if (!pokemonIndex || typeof pokemonIndex !== "object") {
    return [];
  }

  const matchers = [];

  Object.entries(pokemonIndex).forEach(([key, value]) => {
    const hasNumericKey = /^\d+$/.test(String(key));
    const spriteId = hasNumericKey ? key : value;
    const pokemonName = hasNumericKey ? value : key;

    if (!spriteId || !pokemonName) {
      return;
    }

    getPokemonNameAliases(pokemonName).forEach((alias) => {
      const matchName = normalizePokemonMatchText(alias.name);

      if (!matchName) {
        return;
      }

      matchers.push({
        name: alias.name,
        searchName: normalizeCardSearchText(alias.name),
        matchName,
        matchText: ` ${matchName} `,
        priority: alias.priority,
        spriteId: String(spriteId).trim(),
      });
    });
  });

  return matchers.sort((first, second) => second.matchName.length - first.matchName.length);
}

function getPokemonNameAliases(pokemonName) {
  const name = String(pokemonName).trim();
  const aliases = [{ name, priority: 0 }];
  const formSuffixes = [
    "Original Cap",
    "Partner Cap",
    "Hoenn Cap",
    "Sinnoh Cap",
    "Unova Cap",
    "Kalos Cap",
    "Alola Cap",
    "World Cap",
    "Rock Star",
    "Pop Star",
    "Mega X",
    "Mega Y",
    "Single Strike",
    "Rapid Strike",
    "Altered",
    "Origin",
    "Incarnate",
    "Therian",
    "Cosplay",
    "Starter",
    "Belle",
    "Libre",
    "Phd",
    "Alola",
    "Galar",
    "Hisui",
    "Gmax",
    "Mega",
  ];
  let hasBaseAlias = false;

  formSuffixes.forEach((suffix) => {
    const suffixPattern = new RegExp(`\\s+${escapeRegExp(suffix)}$`, "i");

    if (suffixPattern.test(name)) {
      aliases.push({ name: name.replace(suffixPattern, "").trim(), priority: 0 });
      hasBaseAlias = true;
    }
  });

  if (hasBaseAlias) {
    aliases[0].priority = 1;
  }

  const uniqueAliases = new Map();

  aliases.forEach((alias) => {
    if (!alias.name) {
      return;
    }

    const aliasKey = normalizeCardSearchText(alias.name);
    const existingAlias = uniqueAliases.get(aliasKey);

    if (!existingAlias || alias.priority < existingAlias.priority) {
      uniqueAliases.set(aliasKey, alias);
    }
  });

  return Array.from(uniqueAliases.values());
}

function getBasePokemonData(cardName) {
  const cardMatchText = ` ${normalizePokemonMatchText(cardName)} `;
  let bestMatch = null;

  pokemonNameMatchers.forEach((matcher) => {
    const matchIndex = cardMatchText.indexOf(matcher.matchText);

    if (matchIndex === -1) {
      return;
    }

    if (
      !bestMatch ||
      matchIndex < bestMatch.matchIndex ||
      (matchIndex === bestMatch.matchIndex && matcher.priority < bestMatch.priority) ||
      (
        matchIndex === bestMatch.matchIndex &&
        matcher.priority === bestMatch.priority &&
        matcher.matchName.length > bestMatch.matchName.length
      )
    ) {
      bestMatch = { ...matcher, matchIndex };
    }
  });

  if (bestMatch) {
    return {
      pokemonName: bestMatch.name,
      pokemonSearchName: bestMatch.searchName,
      spriteId: bestMatch.spriteId,
    };
  }

  return {
    pokemonName: cardName,
    pokemonSearchName: normalizeCardSearchText(cardName),
    spriteId: "",
  };
}

function createExpansionFilters(container, expansions) {
  container.innerHTML = "";

  expansions.forEach((expansion) => {
    container.appendChild(createExpansionFilter(expansion));
  });
}

function createExpansionFilter(expansion) {
  const link = document.createElement("a");

  link.href = "#";
  link.textContent = expansion;
  link.dataset.expansion = expansion;
  link.dataset.filter = getFilterClass(expansion);

  link.addEventListener("click", function (event) {
    event.preventDefault();
    selectExpansion(this, expansion);
  });

  return link;
}

function selectExpansion(element, expansion) {
  const scope = getTabScope(element);

  setActiveFilter(scope, expansion);
  closeAllDropdowns();
  loadCards(expansion, getCardContainer(element));
}

function getCardContainer(element) {
  const currentTab = element?.closest(".tabcontent");

  return currentTab?.querySelector(".cardContainer") || document.getElementById("cardContainer");
}

async function loadCards(expansion, container = document.getElementById("cardContainer")) {
  if (!container) {
    return;
  }

  const cardsJsonUrl = `${CARDS_BASE_PATH}${encodePathSegment(expansion)}/cards.json`;
  showCardMessage(container, `A carregar cartas de ${expansion}...`);

  try {
    const cardEntries = await loadJsonFile(cardsJsonUrl);

    if (!Array.isArray(cardEntries)) {
      throw new Error("cards.json deve conter uma lista de ficheiros.");
    }

    await loadPokemonIndex();

    const cards = cardEntries
      .map((cardEntry) => createCardModel(cardEntry, expansion))
      .filter(Boolean);

    storeCards(container, cards);
    renderCards(container, cards);
  } catch (error) {
    console.error(`Erro ao carregar cartas de ${expansion}:`, error);
    storeCards(container, []);
    showCardMessage(
      container,
      `Nao foi possivel carregar ${cardsJsonUrl}. Cria esse cards.json com a lista de imagens da expansao.`
    );
  }
}

function storeCards(container, cards) {
  const scope = getTabScope(container);
  const state = getTabState(scope);

  currentCards = cards;
  state.cards = cards;
  cardsByContainer.set(container, cards);
}

function createCardModel(cardEntry, expansion) {
  if (typeof cardEntry === "string") {
    return createCardModelFromFileName(cardEntry, expansion);
  }

  if (!cardEntry || typeof cardEntry !== "object") {
    return null;
  }

  const image = cardEntry.image || cardEntry.fileName || cardEntry.filename || cardEntry.src;

  if (!image) {
    return null;
  }

  const parsedCard = parseCardFileName(image, expansion);
  const name = cardEntry.name || parsedCard.name;
  const pokemonData = getBasePokemonData(name);

  return {
    name,
    image,
    expansion: cardEntry.expansion || expansion,
    searchName: normalizeCardSearchText(cardEntry.searchName || name),
    cardNumber: cardEntry.cardNumber || parsedCard.cardNumber,
    setSize: cardEntry.setSize || parsedCard.setSize,
    pokemonName: pokemonData.pokemonName,
    pokemonSearchName: pokemonData.pokemonSearchName,
    spriteId: pokemonData.spriteId,
    types: getCardTypes(cardEntry),
  };
}

function createCardModelFromFileName(fileName, expansion) {
  const parsedCard = parseCardFileName(fileName, expansion);
  const pokemonData = getBasePokemonData(parsedCard.name);

  return {
    name: parsedCard.name,
    image: fileName,
    expansion,
    searchName: normalizeCardSearchText(parsedCard.name),
    cardNumber: parsedCard.cardNumber,
    setSize: parsedCard.setSize,
    pokemonName: pokemonData.pokemonName,
    pokemonSearchName: pokemonData.pokemonSearchName,
    spriteId: pokemonData.spriteId,
    types: [],
  };
}

function parseCardFileName(fileName, expansion) {
  const baseName = String(fileName).replace(/\.[^/.]+$/, "");
  const expansionPattern = escapeRegExp(expansion);
  const exactMatch = baseName.match(
    new RegExp(`^(.+) \\(${expansionPattern}\\s+(.+?)-(.+?)\\)(?:\\(\\d+\\))?$`, "i")
  );

  if (exactMatch) {
    return {
      name: cleanCardName(exactMatch[1]),
      cardNumber: exactMatch[2].trim(),
      setSize: exactMatch[3].trim(),
    };
  }

  return {
    name: extractCardNameFromBaseName(baseName),
    ...extractCardNumberData(baseName),
  };
}

function cleanCardName(name) {
  return String(name).replace(/\s+/g, " ").trim();
}

function extractCardNameFromBaseName(baseName) {
  const cleanBaseName = String(baseName).replace(/\(\d+\)$/, "");
  const metadataStart = cleanBaseName.lastIndexOf(" (");

  if (metadataStart === -1) {
    return cleanCardName(cleanBaseName);
  }

  return cleanCardName(cleanBaseName.slice(0, metadataStart));
}

function extractCardNumberData(baseName) {
  const cleanBaseName = String(baseName).replace(/\(\d+\)$/, "");
  const numberMatch = cleanBaseName.match(/([a-z]*\d+[a-z]?|\d+[a-z]?|No\.?\s*\d+)-(\d+)\)?$/i);

  return {
    cardNumber: numberMatch ? numberMatch[1].trim() : "",
    setSize: numberMatch ? numberMatch[2].trim() : "",
  };
}

function getCardTypes(card) {
  if (Array.isArray(card.types)) {
    return card.types;
  }

  if (card.type) {
    return [card.type];
  }

  return [];
}

function renderCards(container, cards) {
  const scope = getTabScope(container);

  container.innerHTML = "";

  if (cards.length === 0) {
    showCardMessage(container, "Esta expansao nao tem cartas listadas.");
    return;
  }

  if (shouldGroupCards(scope)) {
    renderGroupedCards(container, cards);
  } else {
    renderFlatCards(container, cards);
  }

  applyFilters(scope);
}

function shouldGroupCards(scope) {
  return ["Pesquisa", "Coleção", "ListaDesejos"].includes(scope?.id);
}

function renderFlatCards(container, cards) {
  cards.forEach((card) => {
    container.appendChild(createCardElement(card));
  });
}

function renderGroupedCards(container, cards) {
  groupCardsByPokemon(cards).forEach((group) => {
    container.appendChild(createPokemonGroupElement(group));
  });
}

function groupCardsByPokemon(cards) {
  const groupsByPokemon = new Map();

  cards.forEach((card) => {
    const groupKey = card.pokemonSearchName || card.searchName;

    if (!groupsByPokemon.has(groupKey)) {
      groupsByPokemon.set(groupKey, {
        name: card.pokemonName || card.name,
        searchName: groupKey,
        spriteId: card.spriteId,
        cards: [],
      });
    }

    groupsByPokemon.get(groupKey).cards.push(card);
  });

  return Array.from(groupsByPokemon.values()).sort((first, second) =>
    first.name.localeCompare(second.name, "pt", { sensitivity: "base" })
  );
}

function createPokemonGroupElement(group) {
  const groupElement = document.createElement("section");
  const cardsContainer = document.createElement("div");

  groupElement.className = "pokemon-group show";
  groupElement.dataset.name = group.searchName;
  groupElement.dataset.spriteId = group.spriteId || "";

  cardsContainer.className = "pokemon-group-cards";

  group.cards.forEach((card) => {
    cardsContainer.appendChild(createCardElement(card));
  });

  groupElement.appendChild(createPokemonGroupHeader(group));
  groupElement.appendChild(cardsContainer);

  return groupElement;
}

function createPokemonGroupHeader(group) {
  const header = document.createElement("div");
  const title = document.createElement("h2");

  header.className = "pokemon-group-header";
  title.className = "pokemon-group-title";
  title.textContent = group.name;

  if (group.spriteId) {
    const sprite = document.createElement("img");

    sprite.src = `../img/${encodePathSegment(group.spriteId)}.png`;
    sprite.alt = group.name;
    sprite.className = "pokemon-sprite";
    sprite.loading = "lazy";
    header.appendChild(sprite);
  }

  header.appendChild(title);

  return header;
}

function createCardElement(card) {
  const column = document.createElement("div");
  const content = document.createElement("div");
  const image = document.createElement("img");
  const title = document.createElement("h4");
  const expansionClass = getFilterClass(card.expansion);

  column.classList.add("column", "show", "pokemon-card", "card-item", expansionClass);
  column.dataset.name = card.searchName;
  column.dataset.image = card.image;
  column.dataset.expansion = normalizeSearchText(card.expansion);
  column.dataset.expansionFilter = expansionClass;
  column.dataset.number = card.cardNumber;
  column.dataset.setSize = card.setSize;
  column.dataset.pokemonName = card.pokemonSearchName;

  card.types.forEach((type) => {
    column.classList.add(getFilterClass(type));
  });

  content.className = "content card-content";
  image.src = `${CARDS_BASE_PATH}${encodePathSegment(card.expansion)}/${encodePathSegment(card.image)}`;
  image.alt = card.name;
  image.loading = "lazy";
  title.className = "card-title";
  title.textContent = card.name;

  content.appendChild(image);
  content.appendChild(title);
  column.appendChild(content);

  return column;
}

function applyFilters(scope) {
  const state = getTabState(scope);
  const cards = scope.querySelectorAll(".pokemon-card");

  cards.forEach((cardElement) => {
    const matchesSearch = matchesSearchQuery(cardElement, state.searchQuery);
    const matchesFilter = matchesActiveFilter(cardElement, state.activeFilterClass);

    cardElement.classList.toggle("show", matchesSearch && matchesFilter);
  });

  updateVisibleGroups(scope);
}

function matchesSearchQuery(cardElement, searchQuery) {
  return (
    !searchQuery ||
    (cardElement.dataset.name || "").includes(searchQuery) ||
    (cardElement.dataset.pokemonName || "").includes(searchQuery)
  );
}

function matchesActiveFilter(cardElement, activeFilterClass) {
  return (
    !activeFilterClass ||
    cardElement.classList.contains(activeFilterClass) ||
    cardElement.dataset.expansionFilter === activeFilterClass
  );
}

function setupSearchInputs() {
  document.querySelectorAll(".pokemon-search").forEach((input) => {
    const scope = getTabScope(input);
    const state = getTabState(scope);

    state.searchQuery = normalizeCardSearchText(input.value);

    input.addEventListener("input", function () {
      state.searchQuery = normalizeCardSearchText(this.value);
      applyFilters(scope);
    });
  });
}

function updateVisibleGroups(scope) {
  scope.querySelectorAll(".pokemon-group").forEach((group) => {
    const hasVisibleCards = Boolean(group.querySelector(".pokemon-card.show"));

    group.classList.toggle("show", hasVisibleCards);
  });
}

function showCardMessage(container, message) {
  container.innerHTML = "";

  const status = document.createElement("p");
  status.className = "card-status";
  status.textContent = message;
  container.appendChild(status);
}

window.addEventListener("click", function (event) {
  if (!event.target.closest(".dropdown-item1")) {
    closeAllDropdowns();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const defaultOpen = document.getElementById("defaultOpen");

  setupSearchInputs();

  if (defaultOpen) {
    defaultOpen.click();
  }

  loadPokemonIndex();
  loadExpansions();
});
