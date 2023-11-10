import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Divider, Grid, IconButton, Link, Typography,
  useMediaQuery,
} from '@material-ui/core';
import {useLanguage} from "../../../hooks/use-language";
import {useTheme} from "@material-ui/core/styles";
import {useSettings} from "../../../contexts/settings-context";
import {PropertyListItem} from "../../common/property-list/property-list-item";
import {PropertyList} from "../../common/property-list/property-list";
import {Star as StarIcon} from "../../../icons/star";
import {format} from "date-fns";
import {useContext} from "react";
import {EmailClientContext} from "../../../contexts/email-client-context";
import {Mail as MailIcon} from "../../../icons/mail";
import {NorthEast} from "@material-ui/icons";
import {ResourceUnavailable} from "../../common/placeholder/resource-unavailable";
import TrCardHeader from "../../translated/TrCardHeader";

export const RatingDetails = (props) => {
  const {data, ...other} = props;
  const {getLang} = useLanguage()
  const theme = useTheme()
  const {settings} = useSettings()
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const align = mdDown ? 'vertical' : 'horizontal';

  const getStars = (rating) => {
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars = [...stars, (<StarIcon key={'star-' + i} style={{'color': '#cebf17'}}/>)]
    }
    return stars
  }

  const {
    setAddresses,
    setSubject,
    setInitialBody,
    showEmailClient
  } = useContext(EmailClientContext)[1]
  const setupEmailClient = (user) => {
    setInitialBody('<h1>Hello ' + user.name + '</h1>')
    setAddresses([user.name + ' <' + user.email + '>'])
    setSubject('Hello ' + user.name)
    showEmailClient()
  }
  // onClick={() => setupEmailClient(customerData.data)}

  return (
    <Grid container spacing={3}>
      <Grid container item lg={8}
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
                  label="Rating"
                  value={getStars(data.data?.rating)}
                />
                <PropertyListItem
                  align={align}
                  label="Title"
                  value={data.data?.title}
                />
                <PropertyListItem
                  align={align}
                  label="Description"
                  value={data.data?.description}
                />
                <PropertyListItem
                  align={align}
                  label="Left at"
                  value={format(new Date(data.data?.created_at), 'dd MMM yyyy HH:ii')}
                />
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
              title="Customer"
              action={
                <Link href={'/admin/customers/' + data.data.user.id} target={"_blank"}>
                  <IconButton size="small">
                    <NorthEast fontSize="small"/>
                  </IconButton>
                </Link>}
            />
            <Divider/>
            <Box>
              <PropertyList>
                <PropertyListItem
                  align={align}
                  label="Name"
                  value={data.data.user?.name}
                />
                <PropertyListItem
                  align={align}
                  label="Email"
                >
                  <Typography
                    color="textSecondary"
                    variant="body2"
                  >
                    {data.data.user?.email}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={() => setupEmailClient(data.data.user)}
                    sx={{
                      bottom: 8,
                      color: 'text.secondary',
                      position: 'absolute',
                      right: 8
                    }}
                  >
                    <MailIcon/>
                  </IconButton>
                </PropertyListItem>
                <PropertyListItem
                  align={align}
                  label="Last seen"
                  value={format(new Date(data.data.user?.last_seen), 'dd MMM yyyy HH:ii')}
                />
              </PropertyList>
            </Box>
          </Card>
        </Grid>

      </Grid>

      <Grid container item lg={4}
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
              title="Rated"
            />
            <Divider/>
            <Box>
              {data.data?.ratable && data.data.ratable[0] !== null ? <PropertyList>
                <PropertyListItem
                  align={align}
                  label="Entity"
                  value={data.data.rated}
                />
                <PropertyListItem
                  align={align}
                  label="Slug"
                  value={data.data.ratable[0].slug}
                />
                <PropertyListItem
                  align={align}
                  label="ID"
                  value={data.data.ratable[0].id}
                />
              </PropertyList> : <ResourceUnavailable message={"The resource was deleted."}/>}
            </Box>
          </Card>
        </Grid>

      </Grid>

    </Grid>
  )
    ;
};

RatingDetails.propTypes = {
  data: PropTypes.object.isRequired
};
