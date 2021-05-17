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

const features = new GeoJSON().readFeatures(parcels)
const parcelSource = new VectorSource({ features })
const parcelLayer = new VectorLayer({ source: parcelSource, style: styleFunction })
const baseLayer = new TileLayer({ source: new OSM() })
const view = new View({
  center: [-0.466925, 53.956291],
  zoom: 14,
  projection: 'EPSG:4326'
})

const map = new Map({
  layers: [
    baseLayer,
    parcelLayer
  ],
  target: 'map',
  view
})
