import React, {useContext, useState} from "react";
import MapsAutocomplete from "./autocomplete";
import Map from "./map";
import {MapsRefContext} from "../../../contexts/maps-ref-context";

export default function LocationFinder({location, width, height, updateLocation, mapStyles, markers = []}) {
  const [placeId, setPlaceId] = useState();
  const { loaded } = useContext(MapsRefContext)[0]
  const [value, setValue] = React.useState(null);

  const getElements = () => {
    if (loaded) {
      return (
        <div>
          <MapsAutocomplete placeUpdated={setPlaceId} value={value} setValue={setValue}/>
          <Map markers={markers}
               mapStyles={mapStyles}
               locationUpdated={updateLocation}
               placeId={placeId}
               location={location}
               height={height-56}
               clearAutocomplete={() => setValue(null)}
          />
        </div>
      )
    }
  }

  return (
    <div style={{width: width, minHeight: height, overflow: 'auto', paddingTop:10}}>
      {getElements()}
    </div>
  )

}
