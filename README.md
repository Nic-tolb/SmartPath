# SmartPath

Buscador semántico de cursos con RAG. El estudiante escribe lo que quiere aprender y SmartPath le recomienda los cursos más adecuados con una respuesta conversacional.

## Cómo funciona

```
Frontend → Webhook de n8n → Embedding → Búsqueda en Qdrant → LLM → Frontend
```

1. El frontend envía la consulta a un webhook de n8n.
2. La consulta se convierte en un vector con `openai/text-embedding-3-small`.
3. Qdrant devuelve los 2 cursos más cercanos.
4. `openai/gpt-4o-mini` redacta la recomendación usando solo esos cursos.
5. El frontend muestra la respuesta y los cursos como una ruta.

## Tecnologías

| Parte | Herramienta |
|---|---|
| Frontend | HTML, CSS y JavaScript, sin dependencias |
| Orquestación | n8n |
| Exposición pública | ngrok |
| Embeddings y LLM | OpenRouter |
| Base vectorial | Qdrant (colección `smartpath_cursos`, 1536 dimensiones, distancia Cosine) |

## Cursos disponibles

| Curso | Nivel |
|---|---|
| Fundamentos de programación | Principiante |
| HTML y CSS | Principiante |
| JavaScript | Intermedio |
| Bases de datos relacionales y MySQL | Intermedio |

## Archivos

- `index.html`: estructura de la página.
- `styles.css`: estilos, con modo claro y oscuro.
- `app.js`: consultas predeterminadas, envío de la consulta y dibujo de resultados.

Los workflows de n8n no están incluidos en este repositorio.

## Puesta en marcha

Necesitas n8n y Qdrant en ejecución, con el workflow de consulta publicado y expuesto por ngrok.

1. Clona el repositorio.
2. En la primera línea de código de `app.js`, cambia `WEBHOOK_URL` por la URL de tu webhook.
3. Abre `index.html` en el navegador.

Las claves de OpenRouter se configuran en n8n y nunca deben escribirse en el código.

## API

Petición:

```http
POST /webhook/smartpath-consulta
Content-Type: application/json

{ "mensaje": "quiero aprender a crear páginas web" }
```

Respuesta:

```json
{
  "respuesta": "texto conversacional",
  "cursos": [
    {
      "id_curso": "curso-02",
      "titulo": "HTML y CSS",
      "nivel": "Principiante",
      "descripcion": "..."
    }
  ]
}
```
