import {Card, CardContent, Divider, Typography} from "@material-ui/core";
import TrCardHeader from "../../components/translated/TrCardHeader";

export const RolesAndPermissionsGeneralInformationTab = () => {

  return (<Card variant="outlined" sx={{mt: 2}}>
    <TrCardHeader title={"General Information"}/>
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