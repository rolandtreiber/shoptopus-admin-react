import {CardHeader} from "@material-ui/core";
import {useTranslation} from "react-i18next";

const TrCardHeader = (props) => {
  const { t } = useTranslation();
  
  return <CardHeader
    action={props.actions}
    title={t(props.title)}
  />
}

export default TrCardHeader