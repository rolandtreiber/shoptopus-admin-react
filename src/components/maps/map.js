import React, {useCallback, useContext, useEffect, useState} from "react";
import {MapsRefContext} from "../../contexts/maps-ref-context";

export default function Map({placeId, locationUpdated, height, location, mapStyles = null, markers, clearAutocomplete, style = {}}) {
  const {mapElement} = useContext(MapsRefContext)[0];
  const [mapMarkers, setMapMarkers] = useState([])
  const [currentMarker, setCurrentMarker] = useState();
  const [map, setMap] = useState();
  const [onClickListener, setOnclickListener] = useState()

  const currentMapMarkers = useCallback((markers) => {
    if (map) {
      let markersLocal = []
      // Clear previous state of markers
      mapMarkers.forEach(m => m.setMap(null))
      // Set new ones
      markers.forEach(m => {
        if (m.icon) {
          const icon = {
            url: m.icon,
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0,0),
            anchor: new window.google.maps.Point(15, 0)
          };
          markersLocal.push(
            new window.google.maps.Marker({
              position: {...m.position},
              title: m.title,
              map: map,
              icon: icon
            })
          )
        } else {
          markersLocal.push(
            new window.google.maps.Marker({
              position: {...m.position},
              title: m.title,
              map: map
            })
          )
        }
      })
      setMapMarkers(markersLocal)
      return markers
    }
  }, [map, mapMarkers])

  useEffect(() => {
    currentMapMarkers(markers)
    // eslint-disable-next-line
  }, [markers, map])

  useEffect(() => {
    if (map) {
      map.panTo(location)
    }
  }, [location, map])

  const placeMarker = useCallback((location) => {
    if (map) {
      if (currentMarker) {
        currentMarker.setMap(null);
      }
      setCurrentMarker(new window.google.maps.Marker({
        position: location,
        map: map
      }));
      map.panTo(location);
    }
  }, [map, currentMarker])

  useEffect(() => {
    if (window.google) {
      setMap(new window.google.maps.Map(mapElement.current));
    }
  }, [mapElement, window.google]);

  useEffect(() => {
    if (map) {
      onClickListener && window.google.maps.event.removeListener(onClickListener)
      setOnclickListener(window.google.maps.event.addListener(map, 'click', function (event) {
        clearAutocomplete()
        placeMarker(event.latLng, map);
        locationUpdated({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        })
      }))
    }
    // eslint-disable-next-line
  }, [map, currentMarker, locationUpdated, placeMarker])

  useEffect(() => {
    if (map) {
      mapStyles && map.setOptions({styles: mapStyles})
    }
  }, [map, mapStyles])

  useEffect(() => {
    if (map) {
      map.setCenter(location);
      map.setZoom(13);
      placeMarker(location)
    }
    // eslint-disable-next-line
  }, [map, location])

  useEffect(() => {
    const showPlace = (location) => {

      if (map) {
        placeMarker(location);
        map.setCenter(location);
        locationUpdated(location)
      }
    }

    const setMarkerByPlaceId = (placeId) => {
      if (map) {
        const service = new window.google.maps.places.PlacesService(map);
        const request = {
          placeId: placeId,
          fields: ['geometry']
        }
        service.getDetails(request,
          (place) => showPlace(
            {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
          ));
      }
    }

    if (map && placeId) {
      setMarkerByPlaceId(placeId)
    }
  }, [placeId, map])

  return (
    <div style={style}>
      <div style={{display: "block", height: height, width: '100%'}} ref={mapElement}/>
    </div>
  )
}
