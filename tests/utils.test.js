const { test } = require('node:test');
const assert = require('node:assert');
const { calculateStreaks } = require('../server/utils'); 

// Misma función auxiliar que en seed.js
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
}

test('sin fechas devuelve 0 y 0', () => {
    assert.deepStrictEqual(calculateStreaks([]), { current: 0, longest: 0 });
});

test('un solo día, hoy', () => {
    assert.deepStrictEqual(calculateStreaks([daysAgo(0)]),{current: 1, longest: 1});
});

test('tres días seguidos que terminan hoy', () => {
    assert.deepStrictEqual(calculateStreaks([daysAgo(2),daysAgo(1),daysAgo(0)]),{current: 3, longest: 3});
});

test('tres días seguidos que terminan ayer: la racha sigue viva', () => {
     assert.deepStrictEqual(calculateStreaks([daysAgo(3),daysAgo(2),daysAgo(1)]),{current: 3, longest: 3});
});

test('racha rota: la actual es 0 pero el récord se conserva', () => {
     assert.deepStrictEqual(calculateStreaks([daysAgo(6),daysAgo(5),daysAgo(4), daysAgo(3)]),{current: 0, longest: 4});
});

test('días con huecos entre medias', () => {
     assert.deepStrictEqual(calculateStreaks([daysAgo(5),daysAgo(2),daysAgo(0)]),{current: 1, longest: 1});
});

test('fechas desordenadas dan el mismo resultado que ordenadas', () => {
     assert.deepStrictEqual(calculateStreaks([daysAgo(0),daysAgo(2),daysAgo(1)]),{current: 3, longest: 3});
});

test('no modifica el array que recibe', () => {
    const entrada = [daysAgo(0), daysAgo(2), daysAgo(1)];
    const copia = [...entrada];

    calculateStreaks(entrada);

    assert.deepStrictEqual(entrada,copia);

});