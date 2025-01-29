import {useTranslation} from "react-i18next";
import {Typography} from "@material-ui/core";

export const TrTypography = ({children, ...props}) => {
  const { t } = useTranslation();

  if (props.disabled !== undefined && props.disabled === true) {
    delete props.disabled
    delete props.onClick
    props.color = "neutral.300"
    props = {...props, sx: {...props.sx, cursor: "default"}}
  }
  props.whatever = 1
  
  return <Typography
    {...props}
  >
    {t(children)}
  </Typography>
}