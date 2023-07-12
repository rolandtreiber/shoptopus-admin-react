import {Avatar} from "@material-ui/core";

const FullSpaceAvatar = ({children, src}) => {
  return (
    <div style={{width: '100%', position: "relative", display: "inline-block"}}>
      <div style={{marginTop: '100%'}}>
      </div>
      <Avatar sx={{position:"absolute", top: 0, left:0, bottom: 0, right: 0, width: "100%", height: "100%", borderRadius: 3}} src={src}>{children}</Avatar>
    </div>
  )
}

export default FullSpaceAvatar