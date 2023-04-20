import { GoogleMap, Marker,useJsApiLoader } from '@react-google-maps/api'
import React, { useEffect, useState } from 'react'

const center = {lat:4.835363, lng:-75.665808}

const divStyle = {
    background: 'white',
    border: '1px solid #ccc',
    padding: 15
  };

function MapViewGoogleApi({data}) {

    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAtxVSjHZmHYeMPRmnagb9Y0IjqrZCW80k"
    })

    const [markers, setMarkers] = useState([])

    useEffect(() => {
      setMarkers(data)
    
      
    }, [data])

    const onClick = () => {
  console.info('I have been clicked!')
};
    

    if(!isLoaded) return "Loading"
  return (
   <GoogleMap 
    center={center} 
    zoom={13} 
    mapContainerStyle={{width:"100%", height:"100%"}}
    options={{
        zoomControl:false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
    }}
    >
        {markers.length > 0 && markers.map(ad => (
            <Marker key={ad._id} position={{lat: Number(ad.latitude), lng: Number(ad.longitude)}} />
        ))}
   </GoogleMap>
  )
}

export default MapViewGoogleApi
