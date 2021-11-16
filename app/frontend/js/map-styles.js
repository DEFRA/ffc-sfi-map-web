import { Fill, Stroke, Style, Text } from 'ol/style'

const landCoverStyles = [{
  Name: 'BPSIneligibleFeature',
  Code: '000',
  Polygon: new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(168, 111, 0)'
    }),
    text: new Text({
      font: '10px Verdana',
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
      color: 'rgb(255, 236, 176)'
    }),
    text: new Text({
      font: '10px Verdana',
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
      color: 'rgba(136, 206, 102)'
    }),
    text: new Text({
      font: '10px Verdana',
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
      color: 'rgba(136, 206, 102)'
    }),
    text: new Text({
      font: '10px Verdana',
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
      color: 'rgba(30, 130, 76, 1)'
    }),
    text: new Text({
      font: '10px Verdana',
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
      color: 'rgba(252,141,98, 0.9)'
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
  landCoverStyles,
  highlightStyle,
  pointerMoveStyle,
  selectedStyle
}
