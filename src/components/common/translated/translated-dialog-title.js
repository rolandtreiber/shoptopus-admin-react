import {useTranslation} from "react-i18next";
import {DialogTitle} from "@material-ui/core";

export const TrDialogTitle = ({children}) => {
    const { t } = useTranslation();

    return <DialogTitle>{t(children)}</DialogTitle>
}