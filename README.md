# Habit Tracker

Aplicación web para registrar hábitos diarios y visualizar su cumplimiento 
a lo largo del tiempo mediante un calendario estilo "contribution graph".

Proyecto personal creado para practicar desarrollo fullstack (Node.js + 
Express + SQLite + JavaScript vanilla) tras graduarme, como parte de mi 
portafolio.

## Motivación

Quería un proyecto que fuera lo bastante pequeño para terminarlo, pero que 
tocara backend real (API REST, base de datos) y no solo frontend. La idea 
del habit tracker surgió porque es un problema que entiendo bien de primera 
mano y me permite iterar en funcionalidades sin que el alcance se descontrole.

## Stack tecnológico

- **Backend:** Node.js + Express
- **Base de datos:** SQLite (con `better-sqlite3`)
- **Frontend:** HTML + CSS + JavaScript vanilla (sin frameworks, de momento)

### ¿Por qué SQLite?

Elegí SQLite en vez de un motor cliente-servidor como PostgreSQL o MySQL por:

- **Cero configuración**: es un único archivo (`habit-tracker.db`), no requiere 
  instalar ni levantar un servidor de base de datos aparte para desarrollar.
- **Suficiente para el alcance del proyecto**: es una app de un solo usuario, 
  sin necesidad de concurrencia alta ni de escalar horizontalmente.
- **`better-sqlite3` es síncrono**, lo que simplifica el código en un proyecto 
  de este tamaño (sin tener que encadenar promesas para cada query).

Si el proyecto creciera (multiusuario, despliegue con varias instancias), 
migraría a PostgreSQL, pero para el objetivo actual SQLite es la opción más 
pragmática.

### ¿Por qué JavaScript vanilla en el frontend (sin React/Vue)?

Quería asegurarme de entender bien los fundamentos (manipulación del DOM, 
fetch, manejo de eventos) antes de depender de un framework que abstrae 
esas partes. Es una decisión deliberada para este proyecto, no un límite 
de conocimiento — más adelante puedo migrar la interfaz a React como 
segunda iteración.

## Demo en vivo

🔗 [https://habit-tracker-4jv1.onrender.com](https://habit-tracker-4jv1.onrender.com)

> ⚠️ Desplegado en el plan gratuito de Render, que apaga el servicio 
> tras 15 minutos de inactividad. La primera carga tras un rato sin 
> visitas puede tardar 30-50 segundos en responder mientras el 
> servicio "despierta".

La demo usa datos de ejemplo (no datos personales reales) y se 
regenera en cada despliegue mediante un script de seed, ya que 
cualquier visitante puede crear, editar o borrar hábitos libremente 
al no haber sistema de autenticación (ver "Ideas para una v2").

## Funcionalidades

### Hechas
- [x] Crear hábitos (nombre + tipo/categoría)
- [x] Listar hábitos existentes
- [x] Marcar/desmarcar un hábito como completado en el día actual, con 
  estado visual (botón verde + texto alternante)
- [x] Prevención de duplicados (no se puede marcar el mismo hábito dos veces 
  el mismo día)
- [x] Feedback de éxito/error al marcar un hábito
- [x] Calendario visual tipo "contribution graph" (combina todos los hábitos, 
  más oscuro = más hábitos completados ese día)
- [x] Editar/eliminar hábitos
- [x] Estadísticas (racha actual, racha más larga)
- [x] Deployment (Render, capa gratuita)

### En progreso
- [ ] Mejorar el diseño visual del frontend (por ahora es funcional pero básico)
  - [x] Estética de botones
  - [x] Calendario
  - [ ] Distribución del espacio
  - [ ] Estadísticas

### Por hacer
- [ ] Modo oscuro
- [ ] Testing
- [ ] Reorganizar lista de hábitos
  - [ ] Por orden alfabético
  - [ ] Por categoría
  - [ ] Por fecha de creación


## Decisiones técnicas destacadas

### Borrado en cascada de hábitos
Al eliminar un hábito, también se eliminan automáticamente todos sus 
registros (`habit_logs`) asociados. SQLite no hace esto solo con las 
foreign keys activadas — al contrario, las bloquea si hay filas 
dependientes — así que el endpoint `DELETE /api/habits/:id` ejecuta 
dos sentencias en orden: primero borra los logs, luego el hábito.

### Prevención de registros duplicados
La tabla `habit_logs` tiene una restricción `UNIQUE(habit_id, date)`, 
así que no es posible marcar el mismo hábito dos veces el mismo día 
a nivel de base de datos (no solo de interfaz). El backend captura 
ese error específico (`SQLITE_CONSTRAINT_UNIQUE`) y responde con 
`409 Conflict`, y el frontend usa `response.ok` para distinguir un 
guardado exitoso de uno rechazado y mostrar el mensaje correcto.

### Edición inline en vez de modal
Al editar un hábito, la fila de la lista se transforma en un 
formulario editable en el sitio, en vez de abrir un modal o navegar 
a otra pantalla. Prioricé mantener el contexto visual — el usuario 
ve exactamente qué fila está editando sin que aparezca nada nuevo 
en pantalla.

### Estado del botón "marcar como hecho" sincronizado con el backend
Al cargar la página, además de pedir la lista de hábitos, se hace una 
petición a `GET /api/habits/logs/:date` con la fecha de hoy para saber 
qué hábitos ya están marcados. Ese resultado se convierte en un `Set` 
de ids para comprobar el estado de cada hábito en O(1) al renderizar. 
El botón alterna entre "Marcar como hecho" y "Desmarcar" llamando a 
`POST /:id/log` o `DELETE /:id/logs/:date` según corresponda, y tras 
cada cambio se vuelve a ejecutar el flujo de inicialización completo 
para mantener el estado siempre sincronizado con la base de datos, 
en vez de asumir el nuevo estado solo en memoria.

### Cálculo de rachas
Las rachas se calculan en el backend con una función auxiliar (`calculateStreaks`) 
que recibe un array de fechas y determina la racha más larga histórica y la 
racha actual (solo cuenta si el último día registrado es hoy o ayer; si no, 
la racha actual es 0 aunque haya habido una racha larga en el pasado). 
La misma función se reutiliza tanto para la racha de un hábito individual 
como para la racha global (días con al menos un hábito completado), 
pasándole distintos conjuntos de fechas.

### Datos de ejemplo para la demo pública
Como la app no tiene autenticación, cualquiera con el link puede crear, 
editar o eliminar hábitos. Para evitar exponer datos personales y que 
la demo se pueda "ensuciar" con el tiempo, existe un script (`seed.js`) 
que puebla la base de datos con hábitos ficticios variados (algunos con 
rachas activas, alguno roto, alguno sin actividad reciente). El archivo 
de base de datos de producción (`seed.db`) es distinto al de desarrollo 
local (`habit-tracker.db`), seleccionado mediante la variable de entorno 
`DB_FILE`. Además, el plan gratuito de Render usa almacenamiento efímero, 
así que el propio script de seed se reejecuta en cada build, lo que 
"resetea" la demo automáticamente cada vez que el servicio se reinicia 
tras estar inactivo.

## Ideas para una v2

Cosas que valoré añadir pero decidí dejar fuera del alcance de esta 
primera versión, para no descontrolar el proyecto:

- **Autenticación y multiusuario**: registro/login, y que cada usuario 
  vea solo sus propios hábitos. Implicaría añadir hasheo de contraseñas, 
  gestión de sesiones/tokens, y una columna `user_id` en el esquema 
  actual. Lo dejo como posible proyecto independiente o v2, una vez 
  esta versión esté pulida.


## Cómo ejecutarlo en local

```bash
git clone https://github.com/eabreuf03-droid/habit-tracker.git
cd habit-tracker
npm install
npm run dev
```

Luego abre `http://localhost:3000` en el navegador.

## Estructura del proyecto

## Estructura del proyecto

```
habit-tracker/
├── server/
│   ├── index.js
│   ├── db.js
│   ├── seed.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── routes/
│       ├── habits.js
│       └── utils.js
└── public/
    ├── index.html
    ├── stats.html
    ├── css/
    │   └── style.css
    └── js/
        ├── api.js
        ├── app.js
        ├── calendar.js
        └── stats.js
```
