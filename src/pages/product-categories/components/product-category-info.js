import PropTypes from 'prop-types';
import {
  Card, CardContent,
  Divider,
  Grid,
  Paper,
  useMediaQuery
} from '@material-ui/core';
import {PropertyList} from '../../../components/common/property-list/property-list';
import {PropertyListItem} from '../../../components/common/property-list/property-list-item';
import {useLanguage} from "../../../hooks/use-language";
import styled from "@emotion/styled";
import NoImg from "../../../static/images/no-image.png";
import ProductCategoryTreeItem from "../partials/product-category-tree-item";
import ProductCategoryProductsTable from "../partials/product-category-products-table";
import TrCardHeader from "../../../components/common/translated/translated-card-header";
import {TrTypography} from "../../../components/common/translated/translated-typography";

export const ProductCategoryInfo = (props) => {
  const {onEdit, data, ...other} = props;
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const {getLang} = useLanguage()

  const align = mdDown ? 'vertical' : 'horizontal';

  const Product = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    padding: "0em 1em",
    lineHeight: '60px',
  }));

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item lg={8}
              spacing={3}
              sx={{
                height: 'fit-content',
                order: {
                  md: 2,
                  xs: 1
                }
              }}
              xs={12}
        >
          <Grid
            item
            xs={12}
          >

            <Card
              variant="outlined"
              {...other}
            >
              <TrCardHeader
                title="General Information"
              />
              <Divider/>
              <PropertyList>
                <PropertyListItem
                  align={align}
                  label="Name"
                  value={getLang(data.name)}
                />
                <PropertyListItem
                  align={align}
                  label="Description"
                  value={getLang(data.description)}
                />
                <PropertyListItem
                  align={align}
                  label="Slug"
                  value={data.slug}
                />
                <PropertyListItem
                  align={align}
                  label="Enabled"
                  value={data.enabled ? "Yes" : "No"}
                />
              </PropertyList>
            </Card>
            <Card
              variant="outlined"
              {...other}
              sx={{
                mt: 2
              }}
            >
              <TrCardHeader
                title="Products"
              />
              <Divider/>
              <CardContent>
                <ProductCategoryProductsTable data={data.products} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container item lg={4}
              spacing={3}
              sx={{
                height: 'fit-content',
                order: {
                  md: 2,
                  xs: 1
                }
              }}
              xs={12}
        >
          <Grid
            item
            xs={12}
          >

            <Card
              variant="outlined"
              {...other}
            >
              <TrCardHeader
                title="Images"
              />
              <CardContent>
                <TrTypography
                  color="textSecondary"
                  sx={{
                    color: 'primary.lightText',
                    mr: 3,
                    mb: 2
                  }}
                  variant="subtitle2"
                >
                  Header Image
                </TrTypography>

                <Paper variant={"outlined"}>
                  <img style={{"width": "100%"}} src={data.header_image ? data.header_image : NoImg}
                       alt="product-category-header-image"/>
                </Paper>

                <TrTypography
                  color="textSecondary"
                  sx={{
                    color: 'primary.lightText',
                    mr: 3,
                    mt: 2,
                    mb: 2
                  }}
                  variant="subtitle2"
                >
                  Menu Image
                </TrTypography>

                <Paper variant={"outlined"}>
                  <img style={{"width": "100%"}} src={data.menu_image ? data.menu_image : NoImg}
                       alt="product-category-header-image"/>
                </Paper>

              </CardContent>

            </Card>

            <Card
              variant="outlined"
              sx={{
                mt: 2
              }}
              {...other}
            >
              <TrCardHeader
                title="Tree starting from this category"
              />
              <CardContent>
                <ProductCategoryTreeItem category={data} topLevel={true}/>
                {data.children.map((c) => (
                  <ProductCategoryTreeItem key={c.id} category={c} topLevel={false}/>
                ))}
              </CardContent>
            </Card>

          </Grid>
        </Grid>

      </Grid>
    </>
  );
};

ProductCategoryInfo.propTypes = {
  onEdit: PropTypes.func,
  data: PropTypes.object.isRequired
};
