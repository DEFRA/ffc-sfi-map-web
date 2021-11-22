import 'ol/ol.css'
import GeoJSON from 'ol/format/GeoJSON'
import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer, Group } from 'ol/layer'
import Select from 'ol/interaction/Select'
import { click, pointerMove } from 'ol/events/condition'
import TileGrid from 'ol/tilegrid/TileGrid'
import { landParcelStyles, landCoverStyles, highlightStyle, selectedStyle } from './map-styles'
import { initiateMap, addParcel } from './map-static'

const eligibleLandCoverCodes = ['110', '130']

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

const getParcelCovers = (sbi, sheetId, parcelId) => {
  const request = new XMLHttpRequest()
  request.open('GET', `/parcel-cover?sbi=${sbi}&sheetId=${sheetId}&parcelId=${parcelId}`, true)
  request.send()
  request.onload = () => {
    const response = JSON.parse(request.response)

    let landCover = ''
    let eligibleLandCoverTotal = 0

    for (const cover of response.covers) {
      if (eligibleLandCoverCodes.includes(cover.land_cover_class_code)) eligibleLandCoverTotal = eligibleLandCoverTotal + cover.area_ha
      landCover += `<strong>${cover.description}:</strong> ${cover.area_ha.toFixed(4)}ha<br />`
    }

    addParcel(response.parcels)

    document.getElementById('parcelCover').style.display = 'block'
    document.getElementById('parcelId').innerHTML = `${response.sheetId}${response.parcelId}`
    document.getElementById('parcelCoverInfo').innerHTML = `<br />
          <strong>Total Area:</strong> ${response.totalArea.toFixed(4)}ha
          <br />
          <strong>Total Eligible Area:</strong> ${eligibleLandCoverTotal.toFixed(4)}ha
          <br /><br />
          ${landCover}`
  }
}

const resetSelectAll = () => {
  const selectAll = document.getElementById('selectAllParcels')
  selectAll.checked = false
}

const selectLayer = (map, sbi) => {
  const selectClick = new Select({
    toggleCondition: click,
    style: selectedStyle
  })

  selectClick.on('select', function (e) {
    if (e.selected.length) {
      const parcelId = `${e.selected[0].values_.sheet_id}${e.selected[0].values_.parcel_id}`
      const parcelArea = document.getElementById(`parcelArea_${parcelId}`)
      if (parcelArea) {
        addSelectButtonEventListener()
        getParcelCovers(sbi, e.selected[0].values_.sheet_id, e.selected[0].values_.parcel_id)
      }
    }
  })

  map.addInteraction(selectClick)

  return selectClick
}

const addSelectButtonEventListener = () => {
  const selectButton = document.getElementById('selectParcelLink')
  if (selectButton) {
    selectButton.addEventListener('click', () => {
      console.log('select parcel link clicked')
    })
  }
}

const selectPointerMove = (map) => {
  const selectMove = new Select({
    condition: pointerMove,
    style: highlightStyle
  })

  map.addInteraction(selectMove)
}

const convertToParcelSheetId = (parcelId) => {
  return parcelId.match(/(.{1,6})/g)
}

const selectAllChecked = (selectAll) => {
  const parcels = document.querySelectorAll('input[name="parcels"]').length
  const selectedParcels = document.querySelectorAll('input[name="parcels"]:checked').length
  selectAll.checked = parcels === selectedParcels
}

const selectAllParcels = (selectfeatures, parcelSource) => {
  const selectAll = document.getElementById('selectAllParcels')
  selectAllChecked(selectAll)

  selectAll.addEventListener('change', () => {
    const checkBoxes = document.getElementsByClassName('govuk-checkboxes__input')
    for (const checkbox of checkBoxes) {
      checkbox.checked = selectAll.checked
      addToSelectFeatures(selectfeatures, parcelSource, checkbox, checkbox.id)
    }
  })
}

const addToSelectFeatures = (selectfeatures, parcelSource, target, id) => {
  console.log(target)
  const parcelId = convertToParcelSheetId(target.id)
  const parcelFeatures = parcelSource.getFeatures()
  for (const feature of parcelFeatures) {
    if (feature.get('parcel_id') === parcelId[1] && feature.get('sheet_id') === parcelId[0]) {
      target.checked ? selectfeatures.push(feature) : selectfeatures.remove(feature)
    }
  }
}

const addCheckboxEventListener = (checkbox, selectfeatures, parcelSource) => {
  checkbox.addEventListener('change', (e) => {
    addToSelectFeatures(selectfeatures, parcelSource, e.target, e.target.id)
    e.target.id !== 'selectAllParcels' && resetSelectAll()
  })
}

const checkBoxSelection = (parcelSource, selectfeatures) => {
  const checkBoxes = document.getElementsByClassName('govuk-checkboxes__input')
  for (const checkbox of checkBoxes) {
    addCheckboxEventListener(checkbox, selectfeatures, parcelSource)
  }
}

const parcelSelection = (map, allowSelect, selectedParcels, parcelSource, sbi) => {
  if (allowSelect) {
    document.getElementById('parcelCover').style.display = 'none'

    const selectClick = selectLayer(map, sbi)
    const selectfeatures = selectClick.getFeatures()
    checkBoxSelection(parcelSource, selectfeatures)
    selectPointerMove(map)
    preParcelSelection(selectedParcels, parcelSource, selectfeatures)
    selectAllParcels(selectfeatures, parcelSource)
  }
}

const preParcelSelection = (selectedParcels, parcelSource, selectfeatures) => {
  for (const parcel of selectedParcels) {
    const parcelId = convertToParcelSheetId(parcel.id)
    const parcelFeatures = parcelSource.getFeatures()
    for (const feature of parcelFeatures) {
      if (feature.get('parcel_id') === parcelId[1] && feature.get('sheet_id') === parcelId[0]) {
        selectfeatures.push(feature)
      }
    }
  }
}

const selectMapStyle = (layers) => {
  const select = document.getElementById('layer-select')

  const onChange = () => {
    const style = select.value
    const totalLayers = layers.length - 1

    for (let i = 0; i < totalLayers; ++i) {
      layers[i].setVisible(mapStyles[i] === style)
    }
  }

  select.addEventListener('change', onChange)

  onChange()
}

export function displayInteractiveMap (apiKey, sbi, parcels, coordinates, selectedParcels = [], allowSelect = false, target = 'map') {
  initiateMap('parcelCoverMap', apiKey, coordinates)

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
    target,
    view
  })

  parcelSelection(map, allowSelect, selectedParcels, parcelSource, sbi)
  map.getView().fit(parcelSource.getExtent(), { size: map.getSize(), maxZoom: 16 })
  selectMapStyle(layers)
}
