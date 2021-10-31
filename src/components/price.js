import React, {useContext} from "react";
import {SettingsContext} from "../contexts/settings-context";

const Price = ({children, color, negative}) => {
  const {currency} = useContext(SettingsContext)
  const getDisplayText = () => {
    let display = negative ? '-' : ''
    display += currency.side === 'left' ? currency.symbol : ''
    display += children
    display += currency.side === 'right' ? currency.symbol : ''
    return display
  }
  return <span style={{color, whiteSpace: 'nowrap'}}>{getDisplayText()}</span>
}

export default Price
