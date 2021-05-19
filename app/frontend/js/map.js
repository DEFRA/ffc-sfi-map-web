import 'ol/ol.css'
import GeoJSON from 'ol/format/GeoJSON'
import Map from 'ol/Map'
import View from 'ol/View'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { BingMaps, Vector as VectorSource } from 'ol/source'
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
    }),
    text: new Text({
      font: '6px Verdana',
      fill: new Fill({ color: 'white' }),
      stroke: new Stroke({ color: 'black', width: 0.5 })
    })
  })
}

const styleFunction = (feature) => {
  const label = `${feature.get('sheet_id')}-${feature.get('parcel_id')}`
  styles.Polygon.getText().setText(label)
  return styles[feature.getGeometry().getType()]
}

const createBingMapsSource = () => {
  return new BingMaps({
    key: 'AvlstdycF2zG8HdPPAPv29mJrVMFi3ixiv9Tt4LiqR3Bt9QQNE9wqK02H3IeOzAp',
    imagerySet: 'RoadOnDemand',
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

export function displayMap (parcels, coordinates, layers, mapStyles) {
  const features = new GeoJSON().readFeatures(parcels)
  const parcelSource = new VectorSource({ features })
  const parcelLayer = new VectorLayer({ source: parcelSource, style: styleFunction, visible: true })
  // const baseLayer = new TileLayer({ preload: Infinity, source: createBingMapsSource() })
  const projection = createprojection()

  for (let i = 0, ii = mapStyles.length; i < ii; ++i) {
    layers.push(
      new TileLayer({
        visible: false,
        preload: Infinity,
        source: new BingMaps({
          key: 'AvlstdycF2zG8HdPPAPv29mJrVMFi3ixiv9Tt4LiqR3Bt9QQNE9wqK02H3IeOzAp',
          imagerySet: mapStyles[i]
          // use maxZoom 19 to see stretched tiles instead of the BingMaps
          // "no photos at this zoom level" tiles
          // maxZoom: 19
        })
      })
    )
  }

  layers.push(parcelLayer)

  const view = new View({
    center: coordinates,
    zoom: 13,
    projection
  })

  const map = new Map({ // eslint-disable-line no-unused-vars
    layers: layers,
    target: 'map',
    view
  })
}
