import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid
} from '@material-ui/core';
import { InputField } from '../../../components/common/input-fields/input-field';
import MultilangTextInput from "../../../components/common/input-fields/multilang-text-input";
import {TrDialogTitle} from "../../../components/common/translated/translated-dialog-title";

const compositionOptions = ['Leather', 'Metal'];
const tagOptions = ['Watch', 'Style'];

export const ProductInfoDialog = (props) => {
  const { open, onClose, product } = props;
  console.log(product)
  const formik = useFormik({
    initialValues: {
      description: product?.description || '',
      sku: product?.sku || '',
      submit: null,
      tags: product?.tags || [],
      stock: product?.stock || 0,
      backup_stock: product?.backup_stock || 0,
    },
    validationSchema: Yup.object().shape({
      description: Yup.string().max(500).required('Description is required'),
      sku: Yup.string().max(255).required('SKU is required'),
      tags: Yup.array(),
      stock: Yup.number().min(0).required('Stock is required'),
      backup_stock: Yup.number().min(0).required('Backup stock is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        toast.success('ProductSingle updated');
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        onClose?.();
      } catch (err) {
        console.error(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <Dialog
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          width: '100%'
        }
      }}
      TransitionProps={{
        onExited: () => formik.resetForm()
      }}
    >
      <TrDialogTitle>
        Edit Product
      </TrDialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            md={12}
            xs={12}
          >
            <MultilangTextInput
                width={12}
                title={"Name"}
                field={"name"}
                value={product.name}
            />
          </Grid>
          <Grid
            item
            md={12}
            xs={12}
          >
            <MultilangTextInput
                width={12}
                title={"Short Description"}
                field={"short_description"}
                value={product.short_description}
            />
            <InputField
              error={Boolean(formik.touched.sku && formik.errors.sku)}
              fullWidth
              helperText={formik.touched.sku && formik.errors.sku}
              label="SKU"
              name="sku"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.sku}
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <InputField
              error={Boolean(formik.touched.stock && formik.errors.stock)}
              fullWidth
              helperText={formik.touched.stock && formik.errors.stock}
              label="Stock"
              name="stock"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.stock}
            />
          </Grid>
          <Grid
              item
              md={6}
              xs={12}
          >
            <InputField
                error={Boolean(formik.touched.backup_stock && formik.errors.backup_stock)}
                fullWidth
                helperText={formik.touched.backup_stock && formik.errors.backup_stock}
                label="Backup stock"
                name="backup_stock"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.backup_stock}
            />
          </Grid>
        {/*  <Grid*/}
        {/*    item*/}
        {/*    xs={12}*/}
        {/*  >*/}
        {/*    <InputField*/}
        {/*      error={Boolean(formik.touched.description && formik.errors.description)}*/}
        {/*      fullWidth*/}
        {/*      helperText={formik.touched.description && formik.errors.description}*/}
        {/*      label="Description"*/}
        {/*      multiline*/}
        {/*      name="description"*/}
        {/*      onBlur={formik.handleBlur}*/}
        {/*      onChange={formik.handleChange}*/}
        {/*      rows={4}*/}
        {/*      value={formik.values.description}*/}
        {/*    />*/}
        {/*  </Grid>*/}
        {/*  <Grid*/}
        {/*    item*/}
        {/*    xs={12}*/}
        {/*  >*/}
        {/*    <AutocompleteField*/}
        {/*      error={Boolean(formik.touched.composition*/}
        {/*        && formik.errors.composition)}*/}
        {/*      filterSelectedOptions*/}
        {/*      helperText={formik.touched.composition && formik.errors.composition}*/}
        {/*      label="Composition"*/}
        {/*      multiple*/}
        {/*      onChange={(event, value) => {*/}
        {/*        formik.setFieldValue('composition',*/}
        {/*          value);*/}
        {/*      }}*/}
        {/*      options={compositionOptions}*/}
        {/*      placeholder="Feature"*/}
        {/*      value={formik.values.composition}*/}
        {/*    />*/}
        {/*  </Grid>*/}
        {/*  <Grid*/}
        {/*    item*/}
        {/*    xs={12}*/}
        {/*  >*/}
        {/*    <AutocompleteField*/}
        {/*      error={Boolean(formik.touched.tags && formik.errors.tags)}*/}
        {/*      filterSelectedOptions*/}
        {/*      helperText={formik.touched.tags && formik.errors.tags}*/}
        {/*      label="Tags"*/}
        {/*      multiple*/}
        {/*      onChange={(event, value) => { formik.setFieldValue('tags', value); }}*/}
        {/*      options={tagOptions}*/}
        {/*      placeholder="Tag"*/}
        {/*      value={formik.values.tags}*/}
        {/*    />*/}
        {/*  </Grid>*/}
        {/*  <Grid*/}
        {/*    item*/}
        {/*    md={6}*/}
        {/*    sx={{*/}
        {/*      alignItems: 'center',*/}
        {/*      display: 'flex'*/}
        {/*    }}*/}
        {/*    xs={12}*/}
        {/*  >*/}
        {/*    <Checkbox*/}
        {/*      checked={formik.values.chargeTax}*/}
        {/*      onChange={(event) => {*/}
        {/*        formik.setFieldValue('chargeTax',*/}
        {/*          event.target.checked);*/}
        {/*      }}*/}
        {/*    />*/}
        {/*    <TrTypography*/}
        {/*      color="textPrimary"*/}
        {/*      variant="body1"*/}
        {/*    >*/}
        {/*      Charge tax on this product*/}
        {/*    </TrTypography>*/}
        {/*  </Grid>*/}
        {/*  {formik.errors.submit && (*/}
        {/*    <Grid*/}
        {/*      item*/}
        {/*      xs={12}*/}
        {/*    >*/}
        {/*      <FormHelperText error>*/}
        {/*        {formik.errors.submit}*/}
        {/*      </FormHelperText>*/}
        {/*    </Grid>*/}
        {/*  )}*/}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onClose}
          variant="text"
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => { formik.handleSubmit(); }}
          variant="contained"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductInfoDialog.defaultProps = {
  open: false
};

ProductInfoDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  product: PropTypes.object
};
