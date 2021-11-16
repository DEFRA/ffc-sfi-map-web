import 'ol/ol.css'
import Map from 'ol/Map'
import GeoJSON from 'ol/format/GeoJSON'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import View from 'ol/View'
import TileGrid from 'ol/tilegrid/TileGrid'
import { landParcelStyles, landCoverStyles } from './map-styles'

let map = new Map()

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

const baseLayer = (apiKey) => {
  const serviceUrl = 'https://api.os.uk/maps/raster/v1/zxy'
  return new TileLayer({
    source: new XYZ({
      url: serviceUrl + '/Road_27700/{z}/{x}/{y}.png?key=' + apiKey,
      tileGrid: tilegrid
    }),
    className: 'grayscale-invert'
  })
}

const initiateMap = (target, apiKey, coordinates) => {
  map = new Map({ // eslint-disable-line no-unused-vars
    layers: [
      baseLayer(apiKey)
    ],
    target,
    view: new View({
      center: coordinates,
      zoom: 7,
      extent: [-238375.0, 0.0, 900000.0, 1376256.0],
      resolutions: tilegrid.getResolutions()
    })
  })
}

const addParcel = (parcels) => {
  map.getLayers().forEach((layer) => {
    layer.className_ === 'ol-layer' && map.removeLayer(layer)
  })

  const features = new GeoJSON().readFeatures(parcels)
  const parcelSource = new VectorSource({ features })
  const parcelLayer = new VectorLayer({ source: parcelSource, style: styleFunction })

  map.addLayer(parcelLayer)
  map.getView().fit(parcelSource.getExtent(), { size: map.getSize(), maxZoom: 16 })
}

export { initiateMap, addParcel }
