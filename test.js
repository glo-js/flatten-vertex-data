var flatten = require('./')
var test = require('tape')

test('flattens nested vertex data into a typed array', function (t) {
  t.deepEqual(flatten([ [1, 2, 5], [1, 4, 2] ]),
    new Float32Array([ 1, 2, 5, 1, 4, 2 ]),
    'flattens nested array')

  t.doesNotThrow(flatten.bind(null, [ [1, 2, 5], [1, 4, 2] ], new Float32Array(6)))
  t.throws(flatten.bind(null, [ [1, 2, 5], [1, 4, 2] ], new Float32Array(3)))

  t.deepEqual(flatten([ 1, 2, 5, 1, 4, 2 ]),
    new Float32Array([ 1, 2, 5, 1, 4, 2 ]),
    'handles flat array')

  t.ok(flatten([ [1, 2, 5], [1, 4, 2] ], 'uint16') instanceof Uint16Array,
    'flattens nested array to type string')

  t.ok(flatten([1, 2, 5, 1, 4, 2], 'uint16') instanceof Uint16Array,
    'flat array to type string')

  t.ok(flatten([ [1, 2, 5], [1, 4, 2] ]) instanceof Float32Array,
    'flattens nested array to float32')

  var existing = new Float32Array(4)
  t.equal(flatten(new Float32Array([2, 4, 4, 8]), existing), existing, 'sends to existing typed array')
  t.deepEqual(existing, new Float32Array([2, 4, 4, 8]), 'sends to existing typed array')
  t.equal(flatten([ [2, 4], [4, 8] ], existing), existing, 'sends to existing typed array')
  t.deepEqual(existing, new Float32Array([2, 4, 4, 8]), 'sends to existing typed array')
  t.equal(flatten([ 2, 4, 4, 8 ], existing), existing, 'sends to existing')
  t.deepEqual(existing, new Float32Array([2, 4, 4, 8]), 'sends to existing typed array')

  t.deepEqual(flatten(new Float32Array([0, 1, 2, 3]), 'array'), [0, 1, 2, 3], 'handles array type')

  t.deepEqual(flatten([new Float32Array([0, 1]), new Float32Array([2, 3])], 'array'), [0, 1, 2, 3], 'handles nested typed arrays')

  t.throws(flatten.bind(null), 'no arg throws err')

  t.end()
})

test('handles bad values', function (t) {
  /*eslint no-sparse-arrays: 0*/
  t.ok(flatten([, NaN, undefined, null]).every(isNaN))
  t.ok(flatten([[, NaN], [undefined, null]]).every(isNaN))

  t.end()
})

test('accepts range for sub-array', function (t) {
  var array = new Float32Array([ 2, 3, 5, 4 ])
  t.deepEqual(flatten([ [ 1, 6 ] ], array, 2),
    new Float32Array([ 2, 3, 1, 6 ]))

  t.deepEqual(flatten([ [ 1, 6 ] ], 'float32', 2),
    new Float32Array([ 0, 0, 1, 6 ]))

  array = new Float32Array([ 2, 3, 5, 4 ])
  t.deepEqual(flatten([ 1, 6 ], array, 2),
    new Float32Array([ 2, 3, 1, 6 ]))

  t.deepEqual(flatten([ 1, 6 ], 'float32', 2),
    new Float32Array([ 0, 0, 1, 6 ]))
  t.end()
})
