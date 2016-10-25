import React from 'react';
import { Map, Popup, GeoJson, TileLayer, Circle } from 'react-leaflet';

import * as countryGeoJson from './countries.geo.json'

const cities = [
  { id: 'NYC', countryId: 'USA', name: 'New York', total: 5000000, position: [40.785091, -73.968285] },
  { id: 'LDN', countryId: 'GBR', name: 'London', total: 500000, position: [51.505, -0.09] },
  { id: 'HEL', countryId: 'FIN', name: 'Helsinki', total: 100000, position: [60.17083, 24.93750] },
  { id: 'TKU', countryId: 'FIN', name: 'Turku', total: 80000, position: [60.454510, 22.264824] }
]

const countryColors = {
  'GBR': '#FF0000',
  'USA': '#00ff00',
  'FIN': '#0000ff'
}

const getCountryStyle = ( feature ) => {
  const color = countryColors[feature.id] ? countryColors[feature.id] : '#ff0000'
  const fillOpacity =  countryColors[feature.id] ? 0.5 : 0
  return {
    color: color,
    fillOpacity: fillOpacity,
    weight: 1
  }
}

const getCityColor = ( city ) => {
  const color = countryColors[city.countryId] ? countryColors[city.countryId] : '#cccccc'
  const fillOpacity =  countryColors[city.countryId] ? 0.8 : 0
  return color/*{
    color: color,
    fillOpacity: fillOpacity,
    weight: 2
  }*/
}
const handleFeature = ( feature, layer) => {
  layer.bindPopup(feature.properties.name);
  layer.on({
    mouseover: () => {
      layer.setStyle({
        weight:3,
      });

      //this.openPopup();
    },
    mouseout: () => {
      layer.setStyle({
        weight:1,
        opacity: 0.5
      });

      //this.closePopup();
    }
  })
}

class MapPoc extends React.Component {
  constructor(props){
    super(props)
    this.state = {zoom: 5}
  }
  zoomEnd(e){
    this.setState({zoom: e.target._zoom})
  }
  render() {
    return (
      <Map
        center={cities[0].position}
        zoom={this.state.zoom}
        onZoomEnd={(e)=>this.zoomEnd(e)}
      >

        <TileLayer
          url='https://api.mapbox.com/styles/v1/ericssonudn/ciuiy8uym006y2jml6xizki1p/tiles/256/{z}/{x}/{y}?access_token={accessToken}'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          accessToken='pk.eyJ1IjoiZXJpY3Nzb251ZG4iLCJhIjoiY2lyNWJsZGVmMDAxYmcxbm5oNjRxY2VnZCJ9.r1KILF4ik_gkwZ4BCyy1CA'
        />

      {
        cities.map( city => {
          const cityColor = getCityColor(city)

          return (
            <Circle center={city.position} radius={city.total / 10} color={ cityColor } >
              <Popup>
                <span>{city.name}</span>
              </Popup>
            </Circle>
          )
        })
      }

      {this.state.zoom < 6 &&
        <GeoJson
        data={countryGeoJson}
        style={getCountryStyle}
        onEachFeature={handleFeature}
        />}

      </Map>
    )
  }
}

export default MapPoc;
