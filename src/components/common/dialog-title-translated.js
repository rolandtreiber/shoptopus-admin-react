import {useTranslation} from "react-i18next";
import {DialogTitle} from "@material-ui/core";

export const DialogTitleTranslated = ({title}) => {
    const { t } = useTranslation();

    return <DialogTitle>{t(title)}</DialogTitle>
}