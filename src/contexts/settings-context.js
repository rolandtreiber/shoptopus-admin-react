import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {APIContext} from "./api-context";

const initialSettings = {
  direction: 'ltr',
  language: 'en',
  pinSidebar: true,
  theme: 'light',
  available_locales: {
    en: "English"
  },
  currency: {
    name: "GBP",
    side: "left",
    symbol: "£"
  },
  app_name: 'Shoptopus'
};

export const restoreSettings = () => {
  let settings = null;

  try {
    const storedData = window.localStorage.getItem('settings');

    if (storedData) {
      settings = JSON.parse(storedData);
    } else {
      settings = {
        direction: 'ltr',
        language: 'en',
        pinSidebar: true,
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light',
        available_locales: {
          en: "English"
        },
        currency: {
          name: "GBP",
          side: "left",
          symbol: "£"
        },
        app_name: 'Shoptopus'
      };
    }
  } catch (err) {
    console.error(err);
    // If stored data is not a strigified JSON this will fail,
    // that's why we catch the error
  }

  return settings;
};

export const storeSettings = (settings) => {
  window.localStorage.setItem('settings', JSON.stringify(settings));
};

export const SettingsContext = createContext({
  settings: initialSettings,
  saveSettings: () => { }
});

export const SettingsProvider = (props) => {
  const { children } = props;
  const [settings, setSettings] = useState(initialSettings);
  const {getAppMetaInformation} = useContext(APIContext)

  const fetchMetaInformation = useCallback(async (localSettings) => {

    try {
      const result = await getAppMetaInformation()
      return {
        ...localSettings,
        available_locales: result.data.data.locales,
        currency: result.data.data.default_currency
      }
    } catch (e) {console.log(e)}
  }, [])

  const fetchLocalSettings = useCallback(async () => {
    return restoreSettings()
  }, [])

  const getMergedSettings = useCallback(async () => {
    const localSettings = await fetchLocalSettings()
    return await fetchMetaInformation(localSettings)
  }, [])

  useEffect(() => {
    getMergedSettings().then(r => setSettings(r))
  }, []);

  const saveSettings = (updatedSettings) => {
    setSettings(updatedSettings);
    storeSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveSettings,
        language: settings.language,
        availableLanguages: settings.available_locales,
        appName: settings.app_name
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const SettingsConsumer = SettingsContext.Consumer;

export const useSettings = () => useContext(SettingsContext);
