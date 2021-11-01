import React, {useContext} from 'react'
import {SettingsContext} from "../contexts/settings-context";

export const useCurrency = () => {
  const {currency} = useContext(SettingsContext)

  const getPriceText = (value, negative) => {
    let display = negative ? '-' : ''
    display += currency.side === 'left' ? currency.symbol : ''
    display += value
    display += currency.side === 'right' ? currency.symbol : ''
    return display
  }

  return {getPriceText}
}
