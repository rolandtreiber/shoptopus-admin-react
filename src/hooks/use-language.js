import React, {useCallback, useContext} from 'react'
import {SettingsContext} from "../contexts/settings-context";

export const useLanguage = () => {
  const {language} = useContext(SettingsContext)

  const getLang = useCallback((text) => {
    return text[language] ? text[language] : ''
  }, [language])

  return {
    getLang
  }
}
