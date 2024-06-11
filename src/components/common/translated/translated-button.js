import {Button} from "@material-ui/core";
import {useTranslation} from "react-i18next";

const TrButton = ({children, ...props}) => {
  const { t } = useTranslation();
  
  return <Button {...props}>{t(children)}</Button>
}

export default TrButton