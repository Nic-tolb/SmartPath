// URL de producción (workflow publicado). Para pruebas usa /webhook-test/... y pulsa "Listen for test event" en n8n
const WEBHOOK_URL = "https://finer-autograph-matriarch.ngrok-free.dev/webhook/smartpath-consulta";

const formulario = document.getElementById("formulario");
const campo = document.getElementById("mensaje");
const boton = document.getElementById("enviar");
const estado = document.getElementById("estado");
const resultado = document.getElementById("resultado");
const respuesta = document.getElementById("respuesta");
const lista = document.getElementById("cursos");
const sugerencias = document.getElementById("sugerencias");

// Edita esta lista para cambiar las consultas predeterminadas
const CONSULTAS = [
  "Quiero aprender a programar desde cero",
  "Quiero crear páginas web",
  "Quiero hacer mis páginas web interactivas",
  "Quiero aprender a manejar bases de datos"
];

CONSULTAS.forEach((texto) => {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "sugerencia";
  chip.textContent = texto;
  chip.addEventListener("click", () => {
    campo.value = texto;
    formulario.requestSubmit();
  });
  sugerencias.append(chip);
});

function mostrarEstado(texto, esError) {
  estado.textContent = texto;
  estado.classList.toggle("error", Boolean(esError));
}

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = campo.value.trim();
  if (!mensaje) return;

  boton.disabled = true;
  sugerencias.querySelectorAll("button").forEach((b) => (b.disabled = true));
  resultado.hidden = true;
  mostrarEstado("Buscando los mejores cursos para ti...");

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({ mensaje })
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const datos = await res.json();

    respuesta.textContent = datos.respuesta || "";
    lista.replaceChildren();
    (datos.cursos || []).forEach((c) => {
      const li = document.createElement("li");

      const titulo = document.createElement("span");
      titulo.className = "titulo";
      titulo.textContent = c.titulo;

      const nivel = document.createElement("span");
      nivel.className = "nivel";
      nivel.textContent = c.nivel;

      const descripcion = document.createElement("p");
      descripcion.className = "descripcion";
      descripcion.textContent = c.descripcion;

      li.append(titulo, nivel, descripcion);
      lista.append(li);
    });

    mostrarEstado("");
    resultado.hidden = false;
  } catch (err) {
    mostrarEstado(
      "No se pudo conectar con SmartPath. Revisa que n8n esté activo, que el workflow esté publicado y que el webhook permita CORS.",
      true
    );
  } finally {
    boton.disabled = false;
    sugerencias.querySelectorAll("button").forEach((b) => (b.disabled = false));
  }
});