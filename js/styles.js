module.exports = [
  {
    name: 'default',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 20,
    petalCountMax: 40,
    petalLengthMin: 0.1,
    petalLengthMax: 0.7,
    petalWidthMin: 0.4,
    petalWidthMax: 0.5,
    curveAmountBMin: 0.08,
    curveAmountBMax: 0.2,
    curveAmountCMin: 0.2,
    curveAmountCMax: 0.6,
    curveAmountDMin: 0.2,
    curveAmountDMax: 0.5,
    layersMin: 6,
    layersMax: 10
  },
  {
    name: 'textureTest-1',
    textureNames: ['angelaeye.jpg'],
    petalCountMin: 20,
    petalCountMax: 40,
    petalLengthMin: 0.1,
    petalLengthMax: 0.7,
    petalWidthMin: 0.4,
    petalWidthMax: 0.5,
    curveAmountBMin: 0.08,
    curveAmountBMax: 0.2,
    curveAmountCMin: 0.2,
    curveAmountCMax: 0.6,
    curveAmountDMin: 0.2,
    curveAmountDMax: 0.5,
    layersMin: 6,
    layersMax: 10
  },
  {
    name: 'textureTest-2',
    textureNames: ['yes2.jpg'],
    petalCountMin: 20,
    petalCountMax: 40,
    petalLengthMin: 0.1,
    petalLengthMax: 0.7,
    petalWidthMin: 0.4,
    petalWidthMax: 0.5,
    curveAmountBMin: 0.08,
    curveAmountBMax: 0.2,
    curveAmountCMin: 0.2,
    curveAmountCMax: 0.6,
    curveAmountDMin: 0.2,
    curveAmountDMax: 0.5,
    layersMin: 6,
    layersMax: 10
  },
  {
    name: 'fast, for debugging',
    shaderIndexes: [0],
    petalCountMin: 1,
    petalCountMax: 2,
    petalLengthMin: 0.6,
    petalLengthMax: 0.7,
    petalWidthMin: 0.5,
    petalWidthMax: 0.6,
    curveAmountBMin: 0.1,
    curveAmountBMax: 0.15,
    curveAmountCMin: 0.4,
    curveAmountCMax: 0.45,
    curveAmountDMin: 0.6,
    curveAmountDMax: 0.67,
    layersMin: 1,
    layersMax: 2
  },
  {
    name: 'default, more tightly constrained with more extreme medians',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 80,
    petalCountMax: 100,
    petalLengthMin: 0.6,
    petalLengthMax: 0.7,
    petalWidthMin: 0.5,
    petalWidthMax: 0.6,
    curveAmountBMin: 0.1,
    curveAmountBMax: 0.15,
    curveAmountCMin: 0.4,
    curveAmountCMax: 0.45,
    curveAmountDMin: 0.6,
    curveAmountDMax: 0.67,
    layersMin: 6,
    layersMax: 10
  },
  {
    name: 'tree-like spirals',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 40,
    petalCountMax: 100,
    petalLengthMin: 4.0,
    petalLengthMax: 6.0,
    petalWidthMin: 0.41,
    petalWidthMax: 0.41,
    curveAmountBMin: 0.74,
    curveAmountBMax: 0.74,
    curveAmountCMin: 0.34,
    curveAmountCMax: 0.34,
    curveAmountDMin: 1.74,
    curveAmountDMax: 1.74,
    layersMin: 1,
    layersMax: 2
  },
  {
    name: 'tree-like spirals with more variation',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 10,
    petalCountMax: 60,
    petalLengthMin: 0.1,
    petalLengthMax: 6.0,
    petalWidthMin: 0.41,
    petalWidthMax: 1.41,
    curveAmountBMin: 0.74,
    curveAmountBMax: 0.74,
    curveAmountCMin: 0.34,
    curveAmountCMax: 0.34,
    curveAmountDMin: 1.74,
    curveAmountDMax: 1.74,
    layersMin: 2,
    layersMax: 4
  },
  {
    name: 'tree-like spirals, hairy/spikey',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 100,
    petalCountMax: 200,
    petalLengthMin: 0.5,
    petalLengthMax: 6.0,
    petalWidthMin: 0.1,
    petalWidthMax: 0.5,
    curveAmountBMin: 0.74,
    curveAmountBMax: 0.74,
    curveAmountCMin: 0.34,
    curveAmountCMax: 0.34,
    curveAmountDMin: 1.0,
    curveAmountDMax: 2.0,
    layersMin: 8,
    layersMax: 12
  },
  {
    name: 'tree-like spirals, hairy/spikey',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 100,
    petalCountMax: 200,
    petalLengthMin: 0.5,
    petalLengthMax: 6.0,
    petalWidthMin: 0.1,
    petalWidthMax: 0.5,
    curveAmountBMin: 0.74,
    curveAmountBMax: 0.74,
    curveAmountCMin: 0.34,
    curveAmountCMax: 0.34,
    curveAmountDMin: 1.74,
    curveAmountDMax: 1.74,
    layersMin: 8,
    layersMax: 12
  },
  {
    name: 'spikey af #2',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 36,
    petalCountMax: 36,
    petalLengthMin: 1.86,
    petalLengthMax: 1.86,
    petalWidthMin: 0.05,
    petalWidthMax: 0.05,
    curveAmountBMin: 1.20,
    curveAmountBMax: 1.25,
    curveAmountCMin: 0.40,
    curveAmountCMax: 0.45,
    curveAmountDMin: 0.01,
    curveAmountDMax: 0.02,
    layersMin: 3,
    layersMax: 3
  },
  {
    name: 'seashell',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 72,
    petalCountMax: 78,
    petalLengthMin: 0.6,
    petalLengthMax: 0.65,
    petalWidthMin: 0.50,
    petalWidthMax: 0.55,
    curveAmountBMin: 0.10,
    curveAmountBMax: 0.15,
    curveAmountCMin: 0.01,
    curveAmountCMax: 0.05,
    curveAmountDMin: 0.30,
    curveAmountDMax: 0.35,
    layersMin: 6,
    layersMax: 6
  },
  {
    name: 'thin hair',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 20,
    petalCountMax: 60,
    petalLengthMin: 3.40,
    petalLengthMax: 3.50,
    petalWidthMin: 0.1,
    petalWidthMax: 0.2,
    curveAmountBMin: 1.20,
    curveAmountBMax: 1.30,
    curveAmountCMin: 1.40,
    curveAmountCMax: 1.45,
    curveAmountDMin: 0.60,
    curveAmountDMax: 0.80,
    layersMin: 40,
    layersMax: 50
  },
  {
    name: 'mature, hairy (oooo that sounds naughty...no, im not into that)',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 120,
    petalCountMax: 130,
    petalLengthMin: 3.40,
    petalLengthMax: 3.50,
    petalWidthMin: 0.1,
    petalWidthMax: 0.2,
    curveAmountBMin: 1.20,
    curveAmountBMax: 1.30,
    curveAmountCMin: 1.40,
    curveAmountCMax: 1.45,
    curveAmountDMin: 0.30,
    curveAmountDMax: 0.40,
    layersMin: 20,
    layersMax: 26
  },
  {
    name: 'pointy, but star-shaped',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 24,
    petalCountMax: 48,
    petalLengthMin: 0.40,
    petalLengthMax: 0.50,
    petalWidthMin: 0.45,
    petalWidthMax: 0.55,
    curveAmountBMin: 0.1,
    curveAmountBMax: 0.15,
    curveAmountCMin: 0.18,
    curveAmountCMax: 0.22,
    curveAmountDMin: 1.15,
    curveAmountDMax: 1.35,
    layersMin: 4,
    layersMax: 8
  },
  {
    name: 'pointy',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 32,
    petalCountMax: 38,
    petalLengthMin: 0.40,
    petalLengthMax: 0.50,
    petalWidthMin: 0.45,
    petalWidthMax: 0.55,
    curveAmountBMin: 0.1,
    curveAmountBMax: 0.15,
    curveAmountCMin: 0.18,
    curveAmountCMax: 0.22,
    curveAmountDMin: 0.30,
    curveAmountDMax: 0.40,
    layersMin: 4,
    layersMax: 8
  },
  {
    name: 'lots of variety',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 12,
    petalCountMax: 24,
    petalLengthMin: 1.0,
    petalLengthMax: 6.0,
    petalWidthMin: 0.5,
    petalWidthMax: 6.1,
    curveAmountBMin: 6.0,
    curveAmountBMax: 8.0,
    curveAmountCMin: 0.1,
    curveAmountCMax: 6.2,
    curveAmountDMin: 0.05,
    curveAmountDMax: 2.2,
    layersMin: 2,
    layersMax: 60
  },
  {
    name: 'super tall, spikey/hairy, spiral-y',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 12,
    petalCountMax: 300,
    petalLengthMin: 1.0,
    petalLengthMax: 1.0,
    petalWidthMin: 0.5,
    petalWidthMax: 2.1,
    curveAmountBMin: 6.0,
    curveAmountBMax: 8.0,
    curveAmountCMin: 0.1,
    curveAmountCMax: 0.2,
    curveAmountDMin: 0.05,
    curveAmountDMax: 0.2,
    layersMin: 2,
    layersMax: 6
  },
  {
    name: 'super tall, spikey/hairy, spiral-y #2',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 12,
    petalCountMax: 300,
    petalLengthMin: 1.0,
    petalLengthMax: 1.0,
    petalWidthMin: 0,
    petalWidthMax: 0.1,
    curveAmountBMin: 6.0,
    curveAmountBMax: 8.0,
    curveAmountCMin: 0.1,
    curveAmountCMax: 0.2,
    curveAmountDMin: 0.05,
    curveAmountDMax: 0.2,
    layersMin: 2,
    layersMax: 6
  },
  {
    name: 'super tall, spikey, alien #2',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 8,
    petalCountMax: 20,
    petalLengthMin: 1.0,
    petalLengthMax: 1.0,
    petalWidthMin: 0,
    petalWidthMax: 0.1,
    curveAmountBMin: 6.0,
    curveAmountBMax: 8.0,
    curveAmountCMin: 0.1,
    curveAmountCMax: 0.2,
    curveAmountDMin: 0.05,
    curveAmountDMax: 0.2, // the angle we curve up at on the end
    layersMin: 2,
    layersMax: 6
  },
  {
    name: 'coney, spikey',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 100,
    petalCountMax: 140,
    petalLengthMin: 4.5,
    petalLengthMax: 6.9,
    petalWidthMin: 0.4,
    petalWidthMax: 0.6,
    curveAmountBMin: 0.6,
    curveAmountBMax: 0.8,
    curveAmountCMin: 0.9,
    curveAmountCMax: 0.99,
    curveAmountDMin: 0.9,
    curveAmountDMax: 0.99,
    layersMin: 2,
    layersMax: 20
  },
  {
    name: 'a bit hairy',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 40,
    petalCountMax: 60,
    petalLengthMin: 0.6,
    petalLengthMax: 0.7,
    petalWidthMin: 0.01,
    petalWidthMax: 0.2,
    curveAmountBMin: 0.1,
    curveAmountBMax: 0.15,
    curveAmountCMin: 0.4,
    curveAmountCMax: 0.45,
    curveAmountDMin: 0.6,
    curveAmountDMax: 0.67,
    layersMin: 6,
    layersMax: 10
  },
  {
    name: 'more extreeeeme',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 4,
    petalCountMax: 200,
    petalLengthMin: 0.1,
    petalLengthMax: 3.0,
    petalWidthMin: 0.1,
    petalWidthMax: 3.0,
    curveAmountBMin: 0.01,
    curveAmountBMax: 3.0,
    curveAmountCMin: 0.01,
    curveAmountCMax: 3.0,
    curveAmountDMin: 0.01,
    curveAmountDMax: 3.0,
    layersMin: 2,
    layersMax: 40
  },
  {
    name: 'extreeeeme but not so lengthy',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 4,
    petalCountMax: 50,
    petalLengthMin: 0.1,
    petalLengthMax: 1.0,
    petalWidthMin: 0.1,
    petalWidthMax: 3.0,
    curveAmountBMin: 0.1,
    curveAmountBMax: 1.0,
    curveAmountCMin: 0.1,
    curveAmountCMax: 1.0,
    curveAmountDMin: 0.9,
    curveAmountDMax: 1.0,
    layersMin: 2,
    layersMax: 40
  },
  {
    name: 'tallness',
    shaderIndexes: [0,1,2,3,4,5,6,7,8,9,10,11,12,13],
    petalCountMin: 50,
    petalCountMax: 75,
    petalLengthMin: 1.20,
    petalLengthMax: 1.60,
    petalWidthMin: 0.4,
    petalWidthMax: 0.8,
    curveAmountBMin: 0.1,
    curveAmountBMax: 0.2,
    curveAmountCMin: 0.2,
    curveAmountCMax: 0.3,
    curveAmountDMin: 0.0,
    curveAmountDMax: 0.4,
    layersMin: 4,
    layersMax: 8
  }
]
