
process.env.DB_FILE = 'test.db';
process.env.NODE_ENV = 'test';

const { test, before, after, beforeEach } = require('node:test');
const { once } = require('node:events');
const assert = require('node:assert');
const db = require('../server/db');
const app = require('../server/index');

let server;
let baseUrl;

before(async () => {
    server = app.listen(0); // puerto 0 = el sistema elige uno libre
    await once(server, 'listening');
    baseUrl = `http://localhost:${server.address().port}/api/habits`;
});

after(() => {
    server.close();
    db.close();
});

// Cada test empieza con las tablas vacías
beforeEach(() => {
    db.prepare('DELETE FROM habit_logs').run();
    db.prepare('DELETE FROM habits').run();
});

// Envía una petición y devuelve { status, data }
async function request(method, path, body) {
    const res = await fetch(baseUrl + path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    return { status: res.status, data: await res.json() };
}

// Crea un hábito y devuelve su id
async function crearHabito(name = 'Correr', type = 'salud') {
    const { data } = await request('POST', '', { name, type });
    return data.id;
}


test('POST / crea un hábito y responde 201', async () => {
    const { status, data } = await request('POST', '', { name: 'Correr', type: 'salud' });
    assert.strictEqual(status, 201);
    assert.strictEqual(data.name, 'Correr');
});

test('POST / sin nombre responde 400', async () => {
    const { status, data } = await request('POST', '', { name: '', type: 'salud' });
    assert.strictEqual(status, 400);
});

test('GET / lista los hábitos creados', async () => {
    await crearHabito('Leer', 'ocio');
    const { status, data } = await request('GET', '');
    assert.ok(Array.isArray(data));
    assert.strictEqual(status,200);
    assert.strictEqual(data.length,1);
    assert.strictEqual(data[0].name , 'Leer');
});

test('POST /:id/log marca un día y repetirlo da 409', async () => {
    const habit = await crearHabito('Leer','ocio');
    const primera = await request('POST', '/' + habit + '/log', { date : '2026-09-21'});
    const { status, data } = await request('POST', '/' + habit + '/log', { date : '2026-09-21'});
    assert.strictEqual(primera.status,201);
    assert.strictEqual(status, 409);
});

test('POST /:id/log en un hábito inexistente da 404', async () => {
    const {status, data} = await request('POST', '/999/log', { date : '2026-09-21'});
    assert.strictEqual(status,404);
});

test('DELETE /:id/logs/:date desmarca, y repetirlo da 404', async () => {
    const habit = await crearHabito('Leer','ocio');
    const marcar = await request('POST', '/' + habit + '/log', { date : '2026-09-21'});
    const primera = await request('DELETE', '/' + habit + '/logs/2026-09-21');
    const { status, data } = await request('DELETE', '/' + habit + '/logs/2026-09-21');
    assert.strictEqual(marcar.status,201);
    assert.strictEqual(primera.status,200);
    assert.strictEqual(status, 404);
});

test('PUT /:id edita, y con un id inexistente da 404', async () => {
    const habit = await crearHabito('Leer','ocio');
    const primera = await request('PUT', '/' + habit, {name: 'Cine', type: 'ocio'});
    const { status, data } = await request('PUT', '/9999', {name: 'Cine', type: 'ocio'});
    assert.strictEqual(primera.status,200);
    assert.strictEqual(status, 404);
});

test('DELETE /:id borra el hábito y sus logs', async () => {

    const habit = await crearHabito('Leer','ocio');
    const primera = await request('POST', '/' + habit + '/log', { date : '2026-09-21'});
    const antes = await request('GET', '/logs/2026-09-21');
    assert.strictEqual(antes.data.length, 1);
    const { status, data } = await request('DELETE', '/' + habit);
    const comprobar = await request('GET', '/logs/2026-09-21');
    assert.deepStrictEqual(primera.status, 201);
    assert.ok(Array.isArray(comprobar.data));
    assert.deepStrictEqual(comprobar.data.length,0);
    assert.deepStrictEqual(status,200);

});

test('GET /stats devuelve rachas por hábito y racha global', async () => {
    const id = await crearHabito('Leer', 'ocio');
    const hoy = new Date().toISOString().split('T')[0];
    await request('POST', '/' + id + '/log', { date: hoy });

    const { status, data } = await request('GET', '/stats');

    assert.strictEqual(status, 200);

    // Racha por hábito
    assert.strictEqual(data.habitStreaks.length, 1);
    assert.strictEqual(data.habitStreaks[0].name, 'Leer');
    assert.strictEqual(data.habitStreaks[0].current, 1);
    assert.strictEqual(data.habitStreaks[0].longest, 1);

    // Racha global: con un único hábito, coincide con la suya
    assert.strictEqual(data.globalStreak.current, 1);
    assert.strictEqual(data.globalStreak.longest, 1);

});