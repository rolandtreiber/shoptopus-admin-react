import React, {useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import {Autocomplete, Box} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import throttle from 'lodash/throttle';

const autocompleteService = { current: null };

export default function MapsAutocomplete({placeUpdated, value, setValue}) {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    [],
  );

  useEffect(() => {
    placeUpdated(value?.place_id)
  }, [value, placeUpdated]);

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  useEffect(() => {
    console.log(options)
  }, [options])

  return (
    <Autocomplete
      getOptionLabel={(option) => (option.description)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      autoHighlight
      includeInputInList
      filterSelectedOptions
      value={value}
      fullWidth={true}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Add a location" variant="outlined" fullWidth />
      )}
      renderOption={(props, option) => {
        // const matches = option.structured_formatting.main_text_matched_substrings;

        return (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <Grid item>
              <LocationOnIcon style={{
                color: '#ebebeb',
                marginRight: 5,
            }} />
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="textSecondary">
                {option.description}
              </Typography>
            </Grid>
          </Box>
        );
      }}
    />
  );
}
