import 'ol/ol.css'
import GeoJSON from 'ol/format/GeoJSON'
import Map from 'ol/Map'
import View from 'ol/View'
import { Fill, Stroke, Style } from 'ol/style'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'

const styles = {
  Polygon: new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 3
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })
}

const styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()]
}

export function displayMap (parcels, center) {
  const features = new GeoJSON().readFeatures(parcels)
  const parcelSource = new VectorSource({ features })
  const parcelLayer = new VectorLayer({ source: parcelSource, style: styleFunction })
  const baseLayer = new TileLayer({ source: new OSM() })
  const view = new View({
    center: center,
    zoom: 13,
    projection: 'EPSG:4326'
  })

  const map = new Map({ // eslint-disable-line no-unused-vars
    layers: [
      baseLayer,
      parcelLayer
    ],
    target: 'map',
    view
  })
}
