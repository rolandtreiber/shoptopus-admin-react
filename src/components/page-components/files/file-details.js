import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Divider, Grid, Link,
  useMediaQuery,
} from '@material-ui/core';
import {useLanguage} from "../../../hooks/use-language";
import {PropertyListItem} from "../../common/property-list/property-list-item";
import {PropertyList} from "../../common/property-list/property-list";
import TrCardHeader from "../../translated/TrCardHeader";

export const FileDetails = (props) => {
  const {data, ...other} = props;
  const {getLang} = useLanguage()
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
                  label="Title"
                  value={getLang(data.data?.title)}
                />
                <PropertyListItem
                  align={align}
                  label="Description"
                  value={getLang(data.data?.description)}
                />
                <PropertyListItem
                  align={align}
                  label="URL"
                >
                  <Link href={data.data?.url} target={"_blank"}>{data.data?.url}</Link>
                </PropertyListItem>
              </PropertyList>
            </Box>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
        >
          <Card
            variant="outlined"
            {...other}
          >
            <TrCardHeader
              title="Related Entity"
            />
            <Divider/>
            <Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
    ;
};

FileDetails.propTypes = {
  data: PropTypes.object.isRequired
};
