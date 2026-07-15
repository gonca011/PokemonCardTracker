// Inicializa o banco de dados no Local Storage se ainda não existir
function inicializarBanco() {
  if (!localStorage.getItem("banco")) {
    const banco = {
      utilizadores: [],
    };
    localStorage.setItem("banco", JSON.stringify(banco));
  }
}

// Obter o banco de dados do Local Storage
function obterBanco() {
  if (!localStorage.getItem("banco")) {
    inicializarBanco(); // Initialize banco if it doesn't exist
  } else {
    // updateBanco(); // Update banco from server if it exists
    return JSON.parse(localStorage.getItem("banco")) || {};
  }
}

// Salvar o banco de dados no Local Storage
function salvarBanco(banco) {
  localStorage.setItem("banco", JSON.stringify(banco));
  makePost(); // Send updated data to the server
}

// Adicionar Utilizador
function adicionarUtilizador(login, password, nome, tipo) {
  let banco = obterBanco();
  banco.utilizadores.push({ id: Date.now(), login, password, nome, tipo });
  salvarBanco(banco);
}

// Funções para Utilizadores
function listarUtilizadores() {
  console.table(obterBanco().utilizadores);
}
function recuperarUtilizador(id) {
  return obterBanco().utilizadores.find((user) => user.id === id);
}
function deletarUtilizador(id) {
  let banco = obterBanco();
  banco.utilizadores = banco.utilizadores.filter((user) => user.id !== id);
  salvarBanco(banco);
}

//POST request send data

function makePost() {
  const data = localStorage.getItem("banco");

  if (data) {
    try {
      const parsedData = JSON.parse(data); // Parse full banco object

      fetch("http://localhost:3000/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData), // Send entire banco object
      })
        .then((res) => res.json())
        .then((data) => console.log("POST:", data))
        .catch((error) => console.error("Error:", error));
    } catch (err) {
      console.error("Failed to parse JSON from localStorage:", err);
    }
  } else {
    console.warn("No 'banco' data found in localStorage.");
  }
}

function makeGet() {
  return fetch("http://localhost:3000/api/data")
    .then((res) => res.json())
    .then((data) => {
      // Return the banco object (adjust if your server wraps it)
      console.log(data);
      return data.received || data;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return null;
    });
}

function updateBancoFromServer() {
  makeGet().then((serverBanco) => {
    if (serverBanco) {
      localStorage.setItem("banco", JSON.stringify(serverBanco));
      console.log("Banco updated from server:", serverBanco);
    } else {
      console.warn("Could not update banco from server.");
    }
  });
}