
const FullWidthSquareBox = ({children, style = {}}) => {
  return (
    <div style={{...style, width: '100%', position: "relative", display: "inline-block"}}>
      <div style={{marginTop: '100%'}}>
        {children}
      </div>
    </div>
  )
}
export default FullWidthSquareBox