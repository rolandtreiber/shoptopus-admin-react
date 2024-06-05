import {Card, CardContent, Divider} from "@material-ui/core";
import TrCardHeader from "../../components/common/translated/translated-card-header";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const RolesAndPermissionsGeneralInformationTab = () => {

  return (<Card variant="outlined" sx={{mt: 2}}>
    <TrCardHeader title={"General Information"}/>
    <Divider/>
    <CardContent>
      <TrTypography
        color="textPrimary"
      >
        Once you edit a role by assigning or removing a permission associated with it, already logged in users with the
        role will be shown a popup notification and be redirected to the Dashboard page.
      </TrTypography>
    </CardContent>
  </Card>)
}