¡Me encanta este proyecto! Es un caso de uso perfecto para React/Next.js que prioriza la **simplicidad y el rendimiento puro**. Si tu dispositivo es tan lento (especialmente una e-ink, donde el *refresco* es el cuello de botella), necesitamos asegurarnos de que el JavaScript sea mínimo y la carga inicial sea ultrarrápida.

Aquí tienes un plan detallado, centrado en la ligereza y el rendimiento, que llamaremos **"LeetCode Lite"**.

---

## Plan de Proyecto: LeetCode Lite

El objetivo principal es la **velocidad de carga y la estabilidad del DOM**, minimizando las re-renderizaciones y los efectos de JavaScript pesados.

### 1. Estructura de Datos (El Corazón del Proyecto)

Dado que quieres que sea extremadamente liviano, la clave es que todo el contenido esté pre-renderizado. Esto significa que el JSON debe contener toda la información de forma estructurada.

**`data/problems.json`**

```json
[
  {
    "id": "two-sum",
    "title": "001. Two Sum",
    "difficulty": "Easy",
    "description": "Dada una matriz de enteros nums y un entero target, devuelve los índices de los dos números tales que sumen target.",
    "solutions": [
      {
        "id": 1,
        "title": "Solución 1: Fuerza Bruta (N^2)",
        "explanation": "La forma más simple. Iteramos sobre todos los pares posibles...",
        "code_snippet": "function twoSum(nums, target) { /* código aquí */ }",
        "example": "Input: [2, 7, 11, 15], 9\nOutput: [0, 1]"
      },
      {
        "id": 2,
        "title": "Solución 2: Hash Map (Optimización O(N))",
        "explanation": "Usamos un mapa para almacenar los números que ya hemos visto...",
        "code_snippet": "function twoSumOpt(nums, target) { /* código aquí */ }",
        "example": "Input: [2, 7, 11, 15], 9\nOutput: [0, 1]"
      },
      // ... Solución 3
    ]
  },
  // ... Otros problemas
]
```

### 2. Estrategia de Next.js para la Ligereza

La clave para que sea "básicamente un HTML" es usar la pre-renderización estática (Static Site Generation - SSG).

#### A. Pre-renderización Estática (SSG)

*   **¿Por qué SSG?** Next.js genera todo el HTML en el momento de la compilación. El usuario recibe el HTML completo, lo que minimiza el tiempo de espera y el trabajo del dispositivo lento.
*   **Archivos a usar:** Usaremos `getStaticProps` y `getStaticPaths`.

#### B. Mínimo JavaScript (No Hydration)

Aunque Next.js añade un poco de JS por defecto (para la "hidratación"), al usar SSG, el contenido es visible inmediatamente. Podemos minimizar aún más el JS:

1.  **Componentes Simples:** Evita `useState` o `useEffect` complejos en el componente principal.
2.  **CSS Minimalista:** Usa estilos simples, quizás Tailwind CSS (configurado para purgar todo el CSS no usado) o CSS modular básico. Evita animaciones o transiciones.
3.  **NO usar el Router:** Como queremos que sea un sitio de navegación muy simple, no necesitamos el enrutador de Next.js (el `Link` o `useRouter`). Haremos la navegación usando simples *links de ancla* (`<a>`) o, si usamos un selector, que todo el contenido esté en la misma página y solo cambiemos el estado local.

### 3. Estructura de Componentes y Páginas

Necesitamos dos vistas principales:

#### 1. Página de Índice Principal (`pages/index.js`)

Esta página debe mostrar todos los problemas y servir como el "panel de control".

**Funcionalidad:**

*   **Listado de Problemas:** Una lista simple (o un `select`/dropdown) de todos los IDs y títulos disponibles.
*   **Redirección/Navegación:** Al seleccionar un problema, debe llevarte a la URL específica del problema.

**Uso de Datos (SSG):**

```javascript
// pages/index.js
import problemsData from '../data/problems.json';

export function getStaticProps() {
  const problemsList = problemsData.map(p => ({ 
    id: p.id, 
    title: p.title 
  }));
  return { props: { problemsList } };
}

// ... componente de React que renderiza la lista ...
```

#### 2. Página del Problema (`pages/problems/[id].js`)

Este es el caballo de batalla. Aquí es donde se muestra el problema y las soluciones.

**Estrategia de URL:** `myapp.com/problems/two-sum?sol=2`

*   **`[id]`:** Identificador del problema.
*   **`?sol=X`:** Parámetro opcional para seleccionar la solución (por defecto, la solución 1).

**Uso de Datos (SSG con `getStaticPaths` y `getStaticProps`):**

```javascript
// pages/problems/[id].js
import problemsData from '../../data/problems.json';

// 1. Define todas las rutas estáticamente
export function getStaticPaths() {
  const paths = problemsData.map(p => ({
    params: { id: p.id }
  }));
  return { paths, fallback: false }; // fallback: false = 404 si no existe
}

// 2. Carga los datos específicos de esa ruta
export function getStaticProps({ params }) {
  const problem = problemsData.find(p => p.id === params.id);
  return { props: { problem } };
}

// Componente React
function ProblemPage({ problem }) {
    // Implementar lógica simple para mostrar la solución seleccionada
    // Podrías usar un estado local o leer el query param (si usas router, pero mejor evitarlo).
    // Para simplificar al máximo, usaremos navegación interna sin router.
    
    return (
        <main>
            <h1>{problem.title}</h1>
            <p>Dificultad: {problem.difficulty}</p>
            <p className="description">{problem.description}</p>

            {/* Selector de Soluciones (Navegación simple sin JS complejo) */}
            <nav>
                {problem.solutions.map(sol => (
                    // Aquí es donde harías la selección. 
                    // Opción A (Más ligera): Usa JS local para cambiar el estado.
                    // Opción B (Más simple): Si quieres cero JS, tendrías que hacer 3 páginas estáticas por problema (NO recomendado).
                ))}
            </nav>

            <SolutionView currentSolution={/* Solución seleccionada */} />
        </main>
    );
}
```

### 4. La Clave de la UX en Dispositivos Lentos (El Selector)

El mayor impacto en tu dispositivo lento será la **re-renderización**. Queremos que la selección del problema o de la solución sea lo más rápida posible.

#### A. Estrategia del Selector de Soluciones

Necesitas un pequeño trozo de estado en el componente `ProblemPage` para saber qué solución mostrar.

```javascript
// Dentro de ProblemPage
const [selectedSolutionId, setSelectedSolutionId] = useState(1);
const currentSolution = problem.solutions.find(s => s.id === selectedSolutionId);

return (
    // ...
    <nav className="solution-selector">
        {problem.solutions.map(sol => (
            <button 
                key={sol.id} 
                onClick={() => setSelectedSolutionId(sol.id)}
                // Estilos para indicar la activa
            >
                {sol.title}
            </button>
        ))}
    </nav>

    <SolutionView solution={currentSolution} />
);
```

**Nota sobre e-Ink:** Evita que el cambio de solución haga un *scroll* forzado o un cambio radical de diseño, ya que el refresco de tinta electrónica es lento y molesto.

#### B. Estrategia de Selector de Problemas

Dado que el dispositivo es lento, es mejor que el cambio de problema sea una **navegación completa a una nueva página SSG** (`/problems/otro-problema`), en lugar de cargar todos los problemas en un solo estado.

Para la e-ink, el selector de problemas podría ser un simple `select` HTML:

```html
{/* En ProblemPage o en un Sidebar */}
<select onChange={(e) => window.location.href = `/problems/${e.target.value}`}>
    <option value="">Selecciona un Problema</option>
    {/* Puedes pasar la lista de problemas como prop desde getStaticProps si quieres el selector siempre visible */}
    {problemsList.map(p => (
        <option key={p.id} value={p.id}>{p.title}</option>
    ))}
</select>
```
Usar `window.location.href` es más robusto y simple que `next/router` para este caso de uso ultra-ligero.

### 5. Estilización (El Minimalismo Absoluto)

Dado que quieres algo "básicamente un HTML", la estilización debe ser puramente funcional.

**Recomendación:** Usa CSS Vanilla o un framework ultra-minimalista como **Pure CSS** o simplemente escribe el CSS esencial.

**Puntos clave para e-Ink:**

1.  **Alto Contraste:** Usa blanco de fondo y negro muy oscuro para el texto.
2.  **Fuentes Legibles:** `serif` o `sans-serif` básicos (como Arial o Georgia). Evita fuentes web si puedes.
3.  **Mínimo Espaciado/Márgenes:** Las pantallas e-ink suelen ser pequeñas, aprovecha el espacio.
4.  **Bloques de Código Simples:** El código debe estar dentro de etiquetas `<code>` o `<pre>` y usar una fuente monoespaciada, pero sin *syntax highlighting* complejo basado en JS (usa CSS si es absolutamente necesario, pero el blanco y negro es mejor).

### Resumen del Stack y Flujo

| Aspecto | Decisión | Razón |
| :--- | :--- | :--- |
| **Framework** | Next.js (SSG) | Genera HTML puro y rápido. |
| **Hosting** | Vercel (o cualquier hosting estático) | No requiere servidor. Máxima velocidad. |
| **Estructura de Datos**| JSON local | Carga instantánea, no requiere API. |
| **Navegación** | Links de ancla (`<a>`) y `window.location.href` | Evita la complejidad y el JS pesado del Next.js Router. |
| **Selector de Solución**| `useState` simple | Pequeña cantidad de JS necesaria para cambiar el contenido dentro de la página sin recargar. |
| **Estilización** | CSS Vanilla o Minimalista | Priorizar el contraste y evitar animaciones/transiciones. |¡Me encanta este proyecto! Es un caso de uso perfecto para React/Next.js que prioriza la **simplicidad y el rendimiento puro**. Si tu dispositivo es tan lento (especialmente una e-ink, donde el *refresco* es el cuello de botella), necesitamos asegurarnos de que el JavaScript sea mínimo y la carga inicial sea ultrarrápida.

Aquí tienes un plan detallado, centrado en la ligereza y el rendimiento, que llamaremos **"LeetCode Lite"**.

---

## Plan de Proyecto: LeetCode Lite

El objetivo principal es la **velocidad de carga y la estabilidad del DOM**, minimizando las re-renderizaciones y los efectos de JavaScript pesados.

### 1. Estructura de Datos (El Corazón del Proyecto)

Dado que quieres que sea extremadamente liviano, la clave es que todo el contenido esté pre-renderizado. Esto significa que el JSON debe contener toda la información de forma estructurada.

**`data/problems.json`**

```json
[
  {
    "id": "two-sum",
    "title": "001. Two Sum",
    "difficulty": "Easy",
    "description": "Dada una matriz de enteros nums y un entero target, devuelve los índices de los dos números tales que sumen target.",
    "solutions": [
      {
        "id": 1,
        "title": "Solución 1: Fuerza Bruta (N^2)",
        "explanation": "La forma más simple. Iteramos sobre todos los pares posibles...",
        "code_snippet": "function twoSum(nums, target) { /* código aquí */ }",
        "example": "Input: [2, 7, 11, 15], 9\nOutput: [0, 1]"
      },
      {
        "id": 2,
        "title": "Solución 2: Hash Map (Optimización O(N))",
        "explanation": "Usamos un mapa para almacenar los números que ya hemos visto...",
        "code_snippet": "function twoSumOpt(nums, target) { /* código aquí */ }",
        "example": "Input: [2, 7, 11, 15], 9\nOutput: [0, 1]"
      },
      // ... Solución 3
    ]
  },
  // ... Otros problemas
]
```

### 2. Estrategia de Next.js para la Ligereza

La clave para que sea "básicamente un HTML" es usar la pre-renderización estática (Static Site Generation - SSG).

#### A. Pre-renderización Estática (SSG)

*   **¿Por qué SSG?** Next.js genera todo el HTML en el momento de la compilación. El usuario recibe el HTML completo, lo que minimiza el tiempo de espera y el trabajo del dispositivo lento.
*   **Archivos a usar:** Usaremos `getStaticProps` y `getStaticPaths`.

#### B. Mínimo JavaScript (No Hydration)

Aunque Next.js añade un poco de JS por defecto (para la "hidratación"), al usar SSG, el contenido es visible inmediatamente. Podemos minimizar aún más el JS:

1.  **Componentes Simples:** Evita `useState` o `useEffect` complejos en el componente principal.
2.  **CSS Minimalista:** Usa estilos simples, quizás Tailwind CSS (configurado para purgar todo el CSS no usado) o CSS modular básico. Evita animaciones o transiciones.
3.  **NO usar el Router:** Como queremos que sea un sitio de navegación muy simple, no necesitamos el enrutador de Next.js (el `Link` o `useRouter`). Haremos la navegación usando simples *links de ancla* (`<a>`) o, si usamos un selector, que todo el contenido esté en la misma página y solo cambiemos el estado local.

### 3. Estructura de Componentes y Páginas

Necesitamos dos vistas principales:

#### 1. Página de Índice Principal (`pages/index.js`)

Esta página debe mostrar todos los problemas y servir como el "panel de control".

**Funcionalidad:**

*   **Listado de Problemas:** Una lista simple (o un `select`/dropdown) de todos los IDs y títulos disponibles.
*   **Redirección/Navegación:** Al seleccionar un problema, debe llevarte a la URL específica del problema.

**Uso de Datos (SSG):**

```javascript
// pages/index.js
import problemsData from '../data/problems.json';

export function getStaticProps() {
  const problemsList = problemsData.map(p => ({ 
    id: p.id, 
    title: p.title 
  }));
  return { props: { problemsList } };
}

// ... componente de React que renderiza la lista ...
```

#### 2. Página del Problema (`pages/problems/[id].js`)

Este es el caballo de batalla. Aquí es donde se muestra el problema y las soluciones.

**Estrategia de URL:** `myapp.com/problems/two-sum?sol=2`

*   **`[id]`:** Identificador del problema.
*   **`?sol=X`:** Parámetro opcional para seleccionar la solución (por defecto, la solución 1).

**Uso de Datos (SSG con `getStaticPaths` y `getStaticProps`):**

```javascript
// pages/problems/[id].js
import problemsData from '../../data/problems.json';

// 1. Define todas las rutas estáticamente
export function getStaticPaths() {
  const paths = problemsData.map(p => ({
    params: { id: p.id }
  }));
  return { paths, fallback: false }; // fallback: false = 404 si no existe
}

// 2. Carga los datos específicos de esa ruta
export function getStaticProps({ params }) {
  const problem = problemsData.find(p => p.id === params.id);
  return { props: { problem } };
}

// Componente React
function ProblemPage({ problem }) {
    // Implementar lógica simple para mostrar la solución seleccionada
    // Podrías usar un estado local o leer el query param (si usas router, pero mejor evitarlo).
    // Para simplificar al máximo, usaremos navegación interna sin router.
    
    return (
        <main>
            <h1>{problem.title}</h1>
            <p>Dificultad: {problem.difficulty}</p>
            <p className="description">{problem.description}</p>

            {/* Selector de Soluciones (Navegación simple sin JS complejo) */}
            <nav>
                {problem.solutions.map(sol => (
                    // Aquí es donde harías la selección. 
                    // Opción A (Más ligera): Usa JS local para cambiar el estado.
                    // Opción B (Más simple): Si quieres cero JS, tendrías que hacer 3 páginas estáticas por problema (NO recomendado).
                ))}
            </nav>

            <SolutionView currentSolution={/* Solución seleccionada */} />
        </main>
    );
}
```

### 4. La Clave de la UX en Dispositivos Lentos (El Selector)

El mayor impacto en tu dispositivo lento será la **re-renderización**. Queremos que la selección del problema o de la solución sea lo más rápida posible.

#### A. Estrategia del Selector de Soluciones

Necesitas un pequeño trozo de estado en el componente `ProblemPage` para saber qué solución mostrar.

```javascript
// Dentro de ProblemPage
const [selectedSolutionId, setSelectedSolutionId] = useState(1);
const currentSolution = problem.solutions.find(s => s.id === selectedSolutionId);

return (
    // ...
    <nav className="solution-selector">
        {problem.solutions.map(sol => (
            <button 
                key={sol.id} 
                onClick={() => setSelectedSolutionId(sol.id)}
                // Estilos para indicar la activa
            >
                {sol.title}
            </button>
        ))}
    </nav>

    <SolutionView solution={currentSolution} />
);
```

**Nota sobre e-Ink:** Evita que el cambio de solución haga un *scroll* forzado o un cambio radical de diseño, ya que el refresco de tinta electrónica es lento y molesto.

#### B. Estrategia de Selector de Problemas

Dado que el dispositivo es lento, es mejor que el cambio de problema sea una **navegación completa a una nueva página SSG** (`/problems/otro-problema`), en lugar de cargar todos los problemas en un solo estado.

Para la e-ink, el selector de problemas podría ser un simple `select` HTML:

```html
{/* En ProblemPage o en un Sidebar */}
<select onChange={(e) => window.location.href = `/problems/${e.target.value}`}>
    <option value="">Selecciona un Problema</option>
    {/* Puedes pasar la lista de problemas como prop desde getStaticProps si quieres el selector siempre visible */}
    {problemsList.map(p => (
        <option key={p.id} value={p.id}>{p.title}</option>
    ))}
</select>
```
Usar `window.location.href` es más robusto y simple que `next/router` para este caso de uso ultra-ligero.

### 5. Estilización (El Minimalismo Absoluto)

Dado que quieres algo "básicamente un HTML", la estilización debe ser puramente funcional.

**Recomendación:** Usa CSS Vanilla o un framework ultra-minimalista como **Pure CSS** o simplemente escribe el CSS esencial.

**Puntos clave para e-Ink:**

1.  **Alto Contraste:** Usa blanco de fondo y negro muy oscuro para el texto.
2.  **Fuentes Legibles:** `serif` o `sans-serif` básicos (como Arial o Georgia). Evita fuentes web si puedes.
3.  **Mínimo Espaciado/Márgenes:** Las pantallas e-ink suelen ser pequeñas, aprovecha el espacio.
4.  **Bloques de Código Simples:** El código debe estar dentro de etiquetas `<code>` o `<pre>` y usar una fuente monoespaciada, pero sin *syntax highlighting* complejo basado en JS (usa CSS si es absolutamente necesario, pero el blanco y negro es mejor).

### Resumen del Stack y Flujo

| Aspecto | Decisión | Razón |
| :--- | :--- | :--- |
| **Framework** | Next.js (SSG) | Genera HTML puro y rápido. |
| **Hosting** | Vercel (o cualquier hosting estático) | No requiere servidor. Máxima velocidad. |
| **Estructura de Datos**| JSON local | Carga instantánea, no requiere API. |
| **Navegación** | Links de ancla (`<a>`) y `window.location.href` | Evita la complejidad y el JS pesado del Next.js Router. |
| **Selector de Solución**| `useState` simple | Pequeña cantidad de JS necesaria para cambiar el contenido dentro de la página sin recargar. |
| **Estilización** | CSS Vanilla o Minimalista | Priorizar el contraste y evitar animaciones/transiciones. |