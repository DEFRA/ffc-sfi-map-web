
import Map from 'ol/Map'
import { initiateMap, addParcel, getParcelSource } from './map-static'

let map = new Map()
let landParcels = {}
let featureCollection = {}

const getParcelCoversPost = (parcels) => {
  const request = new XMLHttpRequest()
  request.open('POST', '/land-cover', false)
  request.send(JSON.stringify(parcels))

  if (request.status === 200) {
    return JSON.parse(request.responseText)
  }
}

const getCurrentExtent = () => {
  return map.getView().calculateExtent(map.getSize())
}

const getFeaturesInExtent = () => {
  const extent = getCurrentExtent()
  const parcels = []

  getParcelSource().forEachFeatureInExtent(extent, (feature) => {
    const sbi = feature.get('sbi')
    const sheetId = feature.get('sheet_id')
    const parcelId = feature.get('parcel_id')
    console.log(checkFeatures(sheetId, parcelId))
    parcels.push({ sbi, sheetId, parcelId })
  })

  featureCollection = getParcelCoversPost(parcels)
  console.log('featureCollection: ' + JSON.stringify(featureCollection))
  addParcel(featureCollection, false, false)
}

const checkFeatures = (sheetId, parcelId) => {
  console.log('checkFeatures: ' + JSON.stringify(featureCollection.features))
  const features = featureCollection?.features
  if (features) {
    const foundFeature = features.map(feature => feature.properties.sheetId === sheetId && feature.properties.parcelId === parcelId)
    return foundFeature.length
  }

  return 0
}

const zoomEvent = () => {
  let currentZoom = map.getView().getZoom()
  map.on('moveend', (e) => {
    const newZoom = map.getView().getZoom()
    if (newZoom !== currentZoom) {
      currentZoom === 9 && addParcel(landParcels, true, false)
      currentZoom = newZoom
      console.log('zoom end, new zoom: ' + newZoom)
      newZoom === 9 && getFeaturesInExtent()
    }
  })
}

export function displayMap (apiKey, sbi, parcels, coordinates, target = 'map') {
  landParcels = parcels
  map = initiateMap(target, apiKey, coordinates, false) // eslint-disable-line no-unused-vars
  addParcel(parcels)
  zoomEvent()
}
