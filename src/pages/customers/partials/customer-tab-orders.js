import React from "react"

const CustomerTabOrders = ({data}) => {
  return (
    <>
    <h1>Orders</h1>
    <div>{JSON.stringify(data)}</div>
    </>
  )
}

export default CustomerTabOrders