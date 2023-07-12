import {useCurrency} from "./use-currency";

export const useRetailPrice = () => {
  const {getPriceText} = useCurrency()

  const getRetailPriceText = (product) => {
    return parseFloat(product.price) === parseFloat(product.final_price) ? getPriceText(product.price) : getPriceText(product.price) + ' (' + getPriceText(parseFloat(product.price) - parseFloat(product.final_price), true) + ')'
  }

  return {
    getRetailPriceText
  }
}
