const CustomerTabLog = ({data}) => {
  return (
    <>
      <h1>Logs</h1>
      <div>{JSON.stringify(data)}</div>
    </>
  )
}

export default CustomerTabLog