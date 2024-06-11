import {useTranslation} from "react-i18next";
import {LoadingButton} from "@material-ui/lab";

const TrLoadingButton = ({children, ...props}) => {
  const { t } = useTranslation();

  return <LoadingButton {...props}>{t(children)}</LoadingButton>
}

export default TrLoadingButton