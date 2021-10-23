import 'ol/ol.css'
import GeoJSON from 'ol/format/GeoJSON'
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer, Group } from 'ol/layer'
import Select from 'ol/interaction/Select'
import { click, pointerMove } from 'ol/events/condition'
import TileGrid from 'ol/tilegrid/TileGrid'
import { landParcelStyles, landCoverStyles, highlightStyle, pointerMoveStyle } from './map-styles'

const styleFunction = (feature) => {
  const label = `${feature.get('sheet_id')} ${feature.get('parcel_id')}`

  if (feature.get('land_cover_class_code') !== undefined) {
    const landCoverClassCode = feature.get('land_cover_class_code')

    const landCoverClassCodeStyle = landCoverStyles.find(({ Code }) => Code === landCoverClassCode)

    if (landCoverClassCodeStyle !== null && landCoverClassCodeStyle !== undefined) {
      landCoverClassCodeStyle.Polygon.getText().setText(label)
      return landCoverClassCodeStyle[feature.getGeometry().getType()]
    } else {
      landCoverStyles[0].Polygon.getText().setText(label)
      return landCoverStyles[0][feature.getGeometry().getType()]
    }
  } else {
    landParcelStyles.Polygon.getText().setText(label)
    return landParcelStyles[feature.getGeometry().getType()]
  }
}

const tilegrid = new TileGrid({
  resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75],
  origin: [-238375.0, 1376256.0]
})

const hightlightOnMouseOver = (parcelSource) => {
  document.querySelectorAll('#parcels tr').forEach(e => e.addEventListener('mouseover', () => {
    if (e.id) {
      const selectedFeature = parcelSource.getFeatureById(e.id)
      selectedFeature.setStyle(highlightStyle)
    }
  }))

  document.querySelectorAll('#parcels tr').forEach(e => e.addEventListener('mouseout', () => {
    if (e.id) {
      const selectedFeature = parcelSource.getFeatureById(e.id)
      selectedFeature.setStyle(landCoverStyles)
    }
  }))
}

const mapStyles = [
  'Road_27700',
  'Outdoor_27700',
  'Light_27700',
  'Leisure_27700']

const buildMapLayers = (parcelSource, apiKey) => {
  const parcelLayer = new VectorLayer({ source: parcelSource, style: styleFunction })

  const layers = []

  const mapStyleLayers = mapStyles.length

  for (let i = 0; i < mapStyleLayers; ++i) {
    layers.push(
      new TileLayer({
        title: 'Road',
        type: 'base',
        visible: false,
        source: new XYZ({
          url: `https://api.os.uk/maps/raster/v1/zxy/${mapStyles[i]}/{z}/{x}/{y}.png?key=${apiKey}`,
          tileGrid: tilegrid
        }),
        className: 'grayscale-invert'
      })
    )
  }

  layers.push(parcelLayer)

  return layers
}

export function displayMap (apiKey, sbi, parcels, coordinates) {
  console.log(parcels)
  const features = new GeoJSON().readFeatures(parcels)
  const parcelSource = new VectorSource({ features })
  const layers = buildMapLayers(parcelSource, apiKey)

  const layerGroup = [
    new Group({
      title: 'Base maps',
      layers
    })
  ]

  const view = new View({
    center: coordinates,
    zoom: 7,
    extent: [-238375.0, 0.0, 900000.0, 1376256.0],
    resolutions: tilegrid.getResolutions()
  })

  const map = new Map({ // eslint-disable-line no-unused-vars
    layers: layerGroup,
    target: 'map',
    view
  })

  const selectClick = new Select({
    condition: click
  })

  const selectPointerMove = new Select({
    condition: pointerMove,
    style: pointerMoveStyle
  })

  map.addInteraction(selectClick)
  map.addInteraction(selectPointerMove)
  map.getView().fit(parcelSource.getExtent(), { size: map.getSize(), maxZoom: 16 })

  selectClick.on('select', function (e) {
    window.location.href = `/parcel?sbi=${sbi}&sheetId=${e.selected[0].values_.sheet_id}&parcelId=${e.selected[0].values_.parcel_id}&mapStyle=${select.value}`
  })

  const select = document.getElementById('layer-select')

  function onChange () {
    const style = select.value
    const totalLayers = layers.length - 1

    for (let i = 0; i < totalLayers; ++i) {
      layers[i].setVisible(mapStyles[i] === style)
    }
  }

  select.addEventListener('change', onChange)

  onChange()

  hightlightOnMouseOver(parcelSource)
}
