import {Fragment} from "react";

const OrderTabItems = ({data}) => {
  return (
    <Fragment>
      <h1>Items</h1>
      <div>{JSON.stringify(data)}</div>
    </Fragment>
  )
}

export default OrderTabItems