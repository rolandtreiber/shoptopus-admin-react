import {Card, CardContent, CardHeader, Divider, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";

export const RolesAndPermissionsGeneralInformationTab = () => {
  const {t} = useTranslation();

  return (<Card variant="outlined" sx={{mt: 2}}>
    <CardHeader title={t("General Information")}/>
    <Divider/>
    <CardContent>
      <Typography
        color="textPrimary"
      >
        Once you edit a role by assigning or removing a permission associated with it, already logged in users with the
        role will be shown a popup notification and be redirected to the Dashboard page.
      </Typography>
    </CardContent>
  </Card>)
}