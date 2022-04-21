import { Fill, Stroke, Style, Text } from 'ol/style'
import { pattern, orangeLinesPattern, redLinesPattern } from './pattern-style'

const landCoverStyles = [{
  Name: 'BPSIneligibleFeature',
  Code: '000',
  Polygon: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
    fill: new Fill({
      color: redLinesPattern
    }),
    text: new Text({
      font: '18px Verdana',
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({ color: 'black', width: 0.1 })
    })
  })
},
{
  Name: 'ArableLand',
  Code: '110',
  Polygon: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
    fill: new Fill({
      color: orangeLinesPattern
    }),
    text: new Text({
      font: '18px Verdana',
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({ color: 'black', width: 0.1 })
    })
  })
},
{
  Name: 'PermanentGrassLand',
  Code: '130',
  Polygon: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
    fill: new Fill({
      color: pattern
    }),
    text: new Text({
      font: '18px Verdana',
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({ color: 'black', width: 0.1 })
    })
  })
},
{
  Name: 'PermanentGrassLand',
  Code: '131',
  Polygon: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
    fill: new Fill({
      color: pattern
    }),
    text: new Text({
      font: '18px Verdana',
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({ color: 'black', width: 0.1 })
    })
  })
},
{
  Name: 'PermanentCrops',
  Code: '140',
  Polygon: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
    fill: new Fill({
      color: pattern
    }),
    text: new Text({
      font: '18px Verdana',
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({ color: 'black', width: 0.1 })
    })
  })
}]

const landParcelStyles = {
  Polygon: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(252,141,98, 0.5)'
    }),
    text: new Text({
      font: '8px Verdana',
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({ color: 'black', width: 0.3 })
    })
  })
}

const landParcelVectorStyles = {
  Polygon: new Style({
    stroke: new Stroke({
      color: 'rgba(51,51,102, 1)',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(51,51,153, 0.3)'
    }),
    text: new Text({
      font: '8px Verdana',
      fill: new Fill({ color: 'black' }),
      stroke: new Stroke({ color: 'black', width: 0.3 })
    })
  })
}

const selectedStyle = new Style({
  fill: new Fill({
    color: 'rgba(141,160,203, 0.5)'
  }),
  stroke: new Stroke({
    color: 'black',
    width: 1
  }),
  text: new Text({
    font: '8px Verdana',
    fill: new Fill({ color: 'black' }),
    stroke: new Stroke({ color: 'black', width: 0.3 })
  })
})

const highlightStyle = new Style({
  fill: new Fill({
    color: 'rgba(0, 0, 255, 0.5)'
  }),
  stroke: new Stroke({
    color: 'black',
    width: 1
  })
})

const pointerMoveStyle = new Style({
  stroke: new Stroke({
    color: 'blue',
    width: 3
  }),
  fill: new Fill({
    color: 'rgba(0, 0, 255, 0.1)'
  })
})

export {
  landParcelStyles,
  landParcelVectorStyles,
  landCoverStyles,
  highlightStyle,
  pointerMoveStyle,
  selectedStyle
}
