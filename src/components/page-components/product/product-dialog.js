import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControlLabel,
    FormHelperText,
    Grid, InputLabel, Switch
} from '@material-ui/core';
import {InputField} from '../../common/input-field';
import {useContext, useEffect, useState} from "react";
import {APIContext} from "../../../contexts/api-context";
import {useNestedValidation} from "../../../hooks/use-nested-validation";
import {getFileFromBlob} from "../../../utils/file-operations";
import MultilangTextInput from "../../common/multilang-text-input";
import {Uploader} from "../../common/uploader";
import {SettingsContext} from "../../../contexts/settings-context";
import CategoryTreeSelect from "../../common/category-tree-select";
import AttributeTreeSelect from "../../common/attribute-tree-select";
import TagPicker from "../../common/tag-picker";
import {LoadingButton} from "@material-ui/lab";

export const ProductDialog = (props) => {
    const {open, onClose, onSuccess, product, ...other} = props;
    const {saveProduct, updateProduct} = useContext(APIContext)
    const [name, setName] = useState()
    const [shortDescription, setShortDescription] = useState()
    const [description, setDescription] = useState()
    const [attachments, setAttachments] = useState([])
    const [showErrors, setShowErrors] = useState(false)
    const {setValidation, isValid} = useNestedValidation()
    const {sharedOptions} = useContext(SettingsContext)
    const [tags, setTags] = useState([])
    const [categories, setCategories] = useState([])
    const [attributes, setAttributes] = useState([])
    const [loading, setLoading] = useState(false)

    const getFileBlobs = async (files) => {
        return await Promise.all(files.map(async (file) => {
            return await fetch(file).then(r => r.blob())
        }));
    }

    useEffect(() => {
        if (product) {
            setName(product.name)
            setShortDescription(product.short_description)
            setDescription(product.description)
            setAttachments(product.images.map(img => img.url))
            setCategories(product.categories.map(c => c.id))
            setTags(product.tags.map(t => t.id))
            setAttributes(() => {
                let selection = [];
                product.attributes.forEach(attr => {
                    selection = [...selection, attr.id, attr.option.id]
                })
                return [...selection]
            })
            formik.values.sku = product.sku
            formik.values.stock = product.stock
            formik.values.price = product.price
            formik.values.enabled = product.enabled
            formik.values.virtual = product.virtual
        } else {
            setDescription(null)
            setAttachments([])
            setAttributes([])
            formik.values.sku = ''
            formik.values.stock = ''
            formik.values.price = ''
            formik.values.enabled = true
            formik.values.virtual = false
        }
    }, [product])

    const formik = useFormik({
        initialValues: {
            price: '',
            stock: '',
            sku: '',
            enabled: true,
            submit: 'null'
        },
        validationSchema: Yup.object().shape({
            price: Yup.number().min(0).required('Please enter a valid price'),
            stock: Yup.number().min(0).required('Please enter valid stock'),
            sku: Yup.string().required('Please enter a SKU'),
        }),
        onSubmit: async (values, helpers) => {
            setLoading(true)
            try {
                let formData = new FormData();
                if (attachments && attachments.length > 0) {
                    const attachmentBlobs = await getFileBlobs(attachments)
                    attachmentBlobs.forEach(attachmentBlob => {
                        formData.append("attachments[]", getFileFromBlob(attachmentBlob))
                    })
                } else {
                    formData.append("attachments", "none")
                }
                formData.append("name", JSON.stringify(name))
                formData.append("short_description", JSON.stringify(shortDescription))
                formData.append("description", JSON.stringify(description))
                formData.append("enabled", formik.values.enabled)
                formData.append("price", formik.values.price)
                formData.append("stock", formik.values.stock)
                formData.append("sku", formik.values.sku)

                attributes.map(attribute => {
                    formData.append("product_attributes[" + attribute.attributeId + "]", attribute.optionId)
                })

                categories.map(category => formData.append('product_categories[]', category))
                tags.map(tag => formData.append('product_tags[]', tag))
                if (product) {
                    isValid && updateProduct(product.id, formData).then(response => {
                        toast.success('ProductSingle updated');
                        helpers.setStatus({success: true});
                        helpers.setSubmitting(false);
                        helpers.resetForm();
                        onSuccess();
                        onClose?.();
                    }).finally(() => setLoading(false))
                } else {
                    formData.append("virtual", formik.values.virtual)
                    isValid && saveProduct(formData).then(response => {
                        toast.success('ProductSingle created');
                        helpers.setStatus({success: true});
                        helpers.setSubmitting(false);
                        helpers.resetForm();
                        onSuccess();
                        onClose?.();
                    }).finally(() => setLoading(false))
                }
            } catch (err) {
                console.error(err);
                helpers.setStatus({success: false});
                helpers.setErrors({submit: err.message});
                helpers.setSubmitting(false);
            }
        }
    });

    return (
        <Dialog
            onClose={onClose}
            open={open}
            TransitionProps={{
                onExited: () => formik.resetForm()
            }}
            maxWidth={'xl'}
            {...other}
        >
            <DialogTitle>
                {product ? 'Update' : 'Create'} Product
            </DialogTitle>
            <DialogContent>
                <Grid item xs={12}>
                    <Uploader title={"Files"} multiple={true} data={attachments} setData={setAttachments}/>
                </Grid>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Attributes</InputLabel>
                        <AttributeTreeSelect selection={attributes} setSelection={setAttributes}
                                             attributes={sharedOptions?.attributes}/>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputLabel>Categories</InputLabel>
                        <CategoryTreeSelect selection={categories} setSelection={setCategories}
                                            categories={sharedOptions?.categories}/>
                    </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                    <InputLabel>Tags</InputLabel>
                    <TagPicker tags={sharedOptions?.tags} selection={tags} setSelection={setTags}/>
                </Grid>
                <Grid container spacing={2} mt={1}>
                    <MultilangTextInput
                        value={name}
                        width={12}
                        title={"Name"}
                        field={"name"}
                        onChange={setName}
                        showErrors={showErrors}
                        setValid={(valid) => {
                            setValidation({name: valid})
                        }}
                    />
                </Grid>
                <Grid container spacing={2} mt={1}>
                    <MultilangTextInput
                        value={shortDescription}
                        width={12}
                        title={"Short description"}
                        field={"short_description"}
                        onChange={setShortDescription}
                        showErrors={showErrors}
                        setValid={(valid) => {
                            setValidation({short_description: valid})
                        }}
                        rows={4}
                    />
                </Grid>
                <Grid container spacing={2} mt={1}>
                    <MultilangTextInput
                        value={description}
                        width={12}
                        title={"Description"}
                        field={"description"}
                        onChange={setDescription}
                        showErrors={showErrors}
                        setValid={(valid) => {
                            setValidation({description: valid})
                        }}
                        rows={4}
                    />
                </Grid>
                <Grid item xs={12} mt={1}>
                    <InputField
                        error={Boolean(formik.touched.sku && formik.errors.sku)}
                        fullWidth
                        helperText={formik.touched.sku && formik.errors.sku}
                        label="SKU"
                        name="sku"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.sku}
                        type={"text"}
                    />
                </Grid>
                <Grid item xs={12} mt={1}>
                    <InputField
                        error={Boolean(formik.touched.price && formik.errors.price)}
                        fullWidth
                        helperText={formik.touched.price && formik.errors.price}
                        label="Price"
                        name="price"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.price}
                        type={"number"}
                    />
                </Grid>
                <Grid item xs={12} mt={1}>
                    <InputField
                        error={Boolean(formik.touched.stock && formik.errors.stock)}
                        fullWidth
                        helperText={formik.touched.stock && formik.errors.stock}
                        label="Stock"
                        name="stock"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.stock}
                        type={"number"}
                    />
                </Grid>
                <Grid item xs={12} mt={1}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formik.values.enabled}
                                onChange={event => {
                                    formik.setFieldValue("enabled", event.currentTarget.checked);
                                }}
                                color="primary"
                                inputProps={{'aria-label': 'controlled'}}
                            />
                        }
                        label={formik.values.enabled ? "Enabled" : "Disabled"}
                    />
                </Grid>
                {!product && <Grid item xs={12} mt={1}>
                    <FormControlLabel
                      control={
                          <Switch
                            checked={formik.values.virtual}
                            onChange={event => {
                                formik.setFieldValue("virtual", event.currentTarget.checked);
                            }}
                            color="primary"
                            inputProps={{'aria-label': 'controlled'}}
                          />
                      }
                      label={formik.values.virtual ? "Virtual" : "Physical"}
                    />
                </Grid>}
                {formik.errors.submit && (
                    <Grid
                        item
                        xs={12}
                    >
                        <FormHelperText error>
                            {formik.errors.submit}
                        </FormHelperText>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={onClose}
                    variant="text"
                >
                    Cancel
                </Button>
                <LoadingButton
                    color="primary"
                    loading={loading}
                    onClick={() => {
                        setShowErrors(true)
                        formik.handleSubmit();
                    }}
                    variant="contained"
                >
                    {product ? 'Update' : 'Create'} Product
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};

ProductDialog.defaultProps = {
    open: false
};

ProductDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};
