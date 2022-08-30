import React, {createContext, createRef, useEffect} from "react";
import {useSettings} from "./settings-context";

export const MapsRefContext = createContext();

export const MapsRefProvider = (props) => {
  const mapElement = createRef();
  const [loaded, setLoaded] = React.useState(false);
  const { settings } = useSettings()
  // const maps_api_key = process.env.REACT_APP_MAPS_API_KEY;

  useEffect(() => {
    const maps_api_key = settings && settings.google_maps_api_key
    function loadScript(src, position, id) {
      if (!position) {
        return;
      }

      const script = document.createElement('script');
      script.setAttribute('async', '');
      script.setAttribute('id', id);
      script.src = src;
      position.appendChild(script);
      script.addEventListener('load', function (e) {
        setLoaded(true)
      }, false);
    }
    if (typeof window !== 'undefined' && !loaded && maps_api_key !== undefined && maps_api_key !== null) {
      if (!document.querySelector('#google-maps')) {
        console.log('loading script')
        loadScript(
          'https://maps.googleapis.com/maps/api/js?key='+maps_api_key+'&libraries=places&language=en&region=GB',
          document.querySelector('head'),
          'google-maps',
        );
      }
      setLoaded(true)
    }
  }, [loaded, settings.google_maps_api_key])

  return (
    <MapsRefContext.Provider value={[{
      mapElement, loaded
    }]}>
      {props.children}
    </MapsRefContext.Provider>
  );
}