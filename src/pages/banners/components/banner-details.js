import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Divider, Grid,
  useMediaQuery,
} from '@material-ui/core';
import {useLanguage} from "../../../hooks/use-language";
import {useTheme} from "@material-ui/core/styles";
import {useSettings} from "../../../contexts/settings-context";
import {PropertyListItem} from "../../../components/common/property-list/property-list-item";
import {PropertyList} from "../../../components/common/property-list/property-list";
import NoImg from "../../../static/images/no-image.png";
import TrCardHeader from "../../../components/common/translated/translated-card-header";

export const BannerDetails = (props) => {
  const {data, ...other} = props;
  const {getLang} = useLanguage()
  const theme = useTheme()
  const {settings} = useSettings()
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const align = mdDown ? 'vertical' : 'horizontal';

  return (
    <Grid container spacing={3}>
      <Grid container item lg={12}
            spacing={3}
            sx={{height: 'fit-content'}}
            xs={12}
      >
        <Grid
          item
          xs={12}
          marginTop={2}
        >
          <Card
            variant="outlined"
            {...other}
          >
            <TrCardHeader
              title="Details"
            />
            <Divider/>
            <Box>
              <PropertyList>
                <PropertyListItem
                  align={align}
                  label="Background Image"
                >
                  <img style={{"width": "100%"}} src={data.background_image?.url ? data.background_image.url : NoImg}
                       alt="product-category-header-image"/>
                </PropertyListItem>
                <PropertyListItem
                  align={align}
                  label="Title"
                  value={getLang(data.title)}
                />
                <PropertyListItem
                  align={align}
                  label="Description"
                  value={getLang(data.description)}
                />
                <PropertyListItem
                  align={align}
                  label="Show Button"
                  value={data.show_button ? "Yes" : "No"}
                />
                {data.show_button && <>
                  <PropertyListItem
                    align={align}
                    label="Button Label"
                    value={getLang(data.button_text)}
                  />
                  <PropertyListItem
                    align={align}
                    label="Button URL"
                    value={data.button_url}
                  />
                </>}
              </PropertyList>
            </Box>
          </Card>
        </Grid>

      </Grid>

    </Grid>
  )
    ;
};

BannerDetails.propTypes = {
  data: PropTypes.object.isRequired
};
