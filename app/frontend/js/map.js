import 'ol/ol.css'
import GeoJSON from 'ol/format/GeoJSON'
import Map from 'ol/Map'
import View from 'ol/View'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { BingMaps, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { get as getProjection } from 'ol/proj'
import Select from 'ol/interaction/Select'
import { click, pointerMove } from 'ol/events/condition'
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
  const label = `${feature.get('sheet_id')} ${feature.get('parcel_id')}`
  styles.Polygon.getText().setText(label)
  return styles[feature.getGeometry().getType()]
}

const createProjection = () => {
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

export function displayMap (sbi, parcels, coordinates) {
  const features = new GeoJSON().readFeatures(parcels)
  const parcelSource = new VectorSource({ features })
  const parcelLayer = new VectorLayer({ source: parcelSource, style: styleFunction, visible: true })
  const projection = createProjection()

  const layers = []

  const mapStyles = [
    'RoadOnDemand',
    'Aerial',
    'AerialWithLabelsOnDemand',
    'CanvasDark',
    'OrdnanceSurvey']

  const mapStyleLayers = mapStyles.length

  for (let i = 0; i < mapStyleLayers; ++i) {
    layers.push(
      new TileLayer({
        visible: false,
        preload: Infinity,
        source: new BingMaps({
          key: 'AvlstdycF2zG8HdPPAPv29mJrVMFi3ixiv9Tt4LiqR3Bt9QQNE9wqK02H3IeOzAp',
          imagerySet: mapStyles[i]
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

  const selectClick = new Select({
    condition: click
  })
  const selectPointerMove = new Select({
    condition: pointerMove,
    style: new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    })
  })

  map.addInteraction(selectClick)
  map.addInteraction(selectPointerMove)

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
  var highlightStyle = new Style({
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    }),
    stroke: new Stroke({
      color: 'blue',
      width: 3
    })
  })

  document.querySelectorAll('#parcels tr').forEach(e => e.addEventListener('mouseover', () => {
    if (e.id) {
      const selectedFeature = parcelSource.getFeatureById(e.id)
      selectedFeature.setStyle(highlightStyle)
    }
  }))

  document.querySelectorAll('#parcels tr').forEach(e => e.addEventListener('mouseout', () => {
    if (e.id) {
      const selectedFeature = parcelSource.getFeatureById(e.id)
      selectedFeature.setStyle(styles.Polygon)
    }
  }))
}
