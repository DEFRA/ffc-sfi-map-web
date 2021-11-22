
import Map from 'ol/Map'
import { initiateMap, addParcel, getParcelSource } from './map-static'

let map = new Map()
let landParcels = {}

const getParcelCovers = (sbi, sheetId, parcelId) => {
  const request = new XMLHttpRequest()
  request.open('GET', `/parcel-cover?sbi=${sbi}&sheetId=${sheetId}&parcelId=${parcelId}`, false)
  request.send()

  if (request.status === 200) {
    return JSON.parse(request.responseText)
  }
}

const getCurrentExtent = () => {
  return map.getView().calculateExtent(map.getSize())
}

const getFeaturesInExtent = () => {
  const extent = getCurrentExtent()
  console.log('extent: ' + extent)
  const featureCollection = {
    type: 'FeatureCollection',
    crs: { type: 'name', properties: { name: 'EPSG:27700' } },
    features: []
  }

  getParcelSource().forEachFeatureInExtent(extent, (feature) => {
    console.log('feature: ' + feature.get('parcel_id'))
    const sbi = feature.get('sbi')
    const sheetId = feature.get('sheet_id')
    const parcelId = feature.get('parcel_id')
    const parcelCovers = getParcelCovers(sbi, sheetId, parcelId)
    console.log(parcelCovers)
    featureCollection.features = [...featureCollection.features, ...parcelCovers.parcels.features]
  })

  addParcel(featureCollection, true, false)
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
  map = initiateMap(target, apiKey, coordinates) // eslint-disable-line no-unused-vars
  addParcel(parcels)
  zoomEvent()
}
