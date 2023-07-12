import Price from "./price";
import {darkWarning} from "../../colors";

const RetailPrice = ({product}) => (
  <>
    <Price>{product.price}</Price>{parseFloat(product.final_price) !== parseFloat(product.price) && (<>(<Price negative color={darkWarning.main}>{product.price - product.final_price}</Price>)</>)}
  </>
)

export default RetailPrice
