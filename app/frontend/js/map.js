import 'ol/ol.css'
import GeoJSON from 'ol/format/GeoJSON'
import Map from 'ol/Map'
import View from 'ol/View'
import { Fill, Stroke, Style } from 'ol/style'
import { BingMaps, Vector as VectorSource, OSM } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { get as getProjection } from 'ol/proj'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'

const styles = {
  Polygon: new Style({
    stroke: new Stroke({
      color: 'red',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(249, 6, 44, 0.1)'
    })
  })
}

const styleFunction = (feature) => {
  return styles[feature.getGeometry().getType()]
}

const createBingMapsSource = () => {
  return new BingMaps({
    key: 'AvlstdycF2zG8HdPPAPv29mJrVMFi3ixiv9Tt4LiqR3Bt9QQNE9wqK02H3IeOzAp',
    imagerySet: 'AerialWithLabelsOnDemand',
    culture: 'en-GB',
    maxZoom: 19
  })
}

const createprojection = () => {
  proj4.defs(
    'EPSG:27700',
    '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
      '+x_0=400000 +y_0=-100000 +ellps=airy ' +
      '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
      '+units=m +no_defs'
  )

  register(proj4)
  return getProjection('EPSG:27700')
}

export function displayMap (parcels, coordinates) {
  const features = new GeoJSON().readFeatures(parcels)
  const parcelSource = new VectorSource({ features })
  const parcelLayer = new VectorLayer({ source: parcelSource, style: styleFunction })
  const baseLayer = new TileLayer({ preload: Infinity, source: createBingMapsSource() })
  const projection = createprojection()

  const view = new View({
    center: coordinates,
    zoom: 14,
    projection
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
