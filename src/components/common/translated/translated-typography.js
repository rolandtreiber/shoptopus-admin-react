import {useTranslation} from "react-i18next";
import {Typography} from "@material-ui/core";

export const TrTypography = ({children, ...props}) => {
  const { t } = useTranslation();
  
  return <Typography
    {...props}
  >
    {t(children)}
  </Typography>
}