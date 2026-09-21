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

## Funcionalidades

### Hechas
- [x] Crear hábitos (nombre + tipo/categoría)
- [x] Listar hábitos existentes
- [x] Marcar un hábito como completado en el día actual
- [x] Prevención de duplicados (no se puede marcar el mismo hábito dos veces 
  el mismo día)
- [x] Feedback de éxito/error al marcar un hábito
- [x] Calendario visual tipo "contribution graph" (combina todos los hábitos, 
  más oscuro = más hábitos completados ese día)

### En progreso
- [ ] Mejorar el diseño visual del frontend (por ahora es funcional pero básico)
- [ ] Editar/eliminar hábitos

### Por hacer
- [ ] Estadísticas (racha actual, racha más larga)
- [ ] Modo oscuro


## Cómo ejecutarlo en local

```bash
git clone https://github.com/eabreuf03-droid/habit-tracker.git
cd habit-tracker
npm install
npm run dev
```

Luego abre `http://localhost:3000` en el navegador.

## Estructura del proyecto

```
habit-tracker/
├── server/
│   ├── index.js
│   ├── db.js
│   └── routes/
│       └── habits.js
└── public/
    ├── index.html
    ├── css/
    └── js/
```
