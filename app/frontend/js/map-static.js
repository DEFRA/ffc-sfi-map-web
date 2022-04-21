import proj4 from 'proj4'
import Map from 'ol/Map'
import { register } from 'ol/proj/proj4'
import { get } from 'ol/proj'
import { Point } from 'ol/geom'
import GeoJSON from 'ol/format/GeoJSON'
import MVT from 'ol/format/MVT'
import { Tile as TileLayer, Vector as VectorLayer, VectorTile } from 'ol/layer'
import { XYZ, Vector as VectorSource, VectorTile as VectorTileSource } from 'ol/source'
import View from 'ol/View'
import TileGrid from 'ol/tilegrid/TileGrid'
import { landCoverStyles, landParcelVectorStyles } from './map-styles'
import stylefunction from 'ol-mapbox-style/dist/stylefunction'
import { Attribution } from 'ol/control'

let map = new Map()
let parcelSource = new VectorSource()

proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs')
register(proj4)
const bng = get('EPSG:27700')
bng.setExtent([-238375.0, 0, 700000, 1300000])

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
    landParcelVectorStyles.Polygon.getText().setText(label)
    return landParcelVectorStyles[feature.getGeometry().getType()]
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

const satelliteLayer = (apiKey) => {
  console.log('satelliteLayer')
  return new TileLayer({
    ref: 'satellite',
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attributions: '&copy; ***Esri copyright statement***'
    }),
    visible: true,
    zIndex: 0
  })
}

const mapStyles = () => {
  const serviceUrl = 'https://api.os.uk/maps/vector/v1/vts/resources/styles?key=RKWayb4nhiz1nkRsGt9CVhid6mZaZI7p'
  const request = new XMLHttpRequest()
  request.open('GET', serviceUrl, false)
  request.send()

  if (request.status === 200) {
    console.log('style request', request.responseText)
    return JSON.parse(request.responseText)
  }
}

const basicVectorLayer = (styles) => {
  const serviceUrl = 'https://api.os.uk/maps/vector/v1/vts?key=RKWayb4nhiz1nkRsGt9CVhid6mZaZI7p'
  const request = new XMLHttpRequest()
  request.open('GET', serviceUrl, false)
  request.send()

  if (request.status === 200) {
    const response = JSON.parse(request.responseText)

    const extent = [response.fullExtent.xmin, response.fullExtent.ymin, response.fullExtent.xmax, response.fullExtent.ymax]
    const origin = [response.tileInfo.origin.x, response.tileInfo.origin.y]
    const resolutions = response.tileInfo.lods.map(l => l.resolution).slice(0, 16)
    const tileSize = response.tileInfo.rows
    const tiles = response.tiles[0]
    const wkid = response.tileInfo.spatialReference.latestWkid

    const options = {
      format: new MVT(),
      url: tiles,
      projection: 'EPSG:' + wkid,
      tileGrid: new TileGrid({
        extent,
        origin,
        resolutions,
        tileSize
      })
    }

    const source = new VectorTileSource(options)
    const layer = new VectorTile({ source: source })

    styles.layers.forEach(styleLayer => {
      if (styleLayer.paint && styleLayer.paint['icon-color']) {
        styleLayer.paint['icon-color'] = styleLayer.paint['icon-color'].replace(',0)', ',1)')
      }
    })

    stylefunction(layer, styles, 'esri', resolutions)

    let center = [-121099, 7161610]
    if (wkid === 27700) {
      const point = new Point(center)
      point.transform('EPSG:3857', 'EPSG:27700')
      center = point.getCoordinates()
    }

    return { layer, center, resolutions, wkid }
  }
}

const loadBasicMap = (apiKey, target, coordinates) => {
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

  return map
}

const loadVectorLayer = () => {
  const styles = mapStyles()
  return basicVectorLayer(styles)
}

const loadVectorMap = (target) => {
  const { layer, center, resolutions, wkid } = loadVectorLayer()

  console.log('VectorLayer', layer)
  map = new Map({ // eslint-disable-line no-unused-vars
    layers: [
      layer
    ],
    target,
    view: new View({
      projection: 'EPSG:' + wkid,
      center: center,
      zoom: Math.floor(resolutions.length / 2),
      resolutions: tilegrid.getResolutions()
    })
  })

  map.getControls().forEach(control => {
    if (control instanceof Attribution) {
      control.setCollapsed(false)
    }
  })

  return map
}

const initiateMap = (target, apiKey, coordinates, basicMap = true) => {
  return basicMap ? loadBasicMap(apiKey, target, coordinates) : loadVectorMap(target)
}

const getParcelSource = () => parcelSource

const removeAllParcels = () => {
  map.getLayers().forEach((layer) => {
    console.log(layer.className_)
    if (layer.className_) {
      layer.className_ === 'ol-layer' && map.removeLayer(layer)
    }
  })
}

const addParcel = (parcels, removeAll = true, fitExtent = true) => {
  removeAll && removeAllParcels()
  const features = new GeoJSON().readFeatures(parcels)
  parcelSource = new VectorSource({ features })
  const parcelLayer = new VectorLayer({ source: parcelSource, style: styleFunction })

  const { layer } = loadVectorLayer()

  map.addLayer(layer)
  map.addLayer(parcelLayer)
  fitExtent && map.getView().fit(parcelSource.getExtent(), { size: map.getSize(), maxZoom: 16 })
  return { parcelSource, parcelLayer }
}

export { initiateMap, addParcel, getParcelSource }
