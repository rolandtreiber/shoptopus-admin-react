import {useTranslation} from "react-i18next";
import {TextField} from "@material-ui/core";

const TrTextField = ({children, ...props}) => {
  const { t } = useTranslation();
  
  return <TextField {...props}>{t(children)}</TextField>
}

export default TrTextField