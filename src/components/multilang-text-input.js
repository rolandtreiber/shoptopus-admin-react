import React, {useContext, useEffect, useState} from 'react'
import {SettingsContext} from "../contexts/settings-context";
import {InputField} from "./input-field";
import {Grid} from "@material-ui/core";
import {useFormik} from "formik";
import * as Yup from "yup";

const MultilangTextInput = ({field, title, value, width}) => {
    const {availableLanguages} = useContext(SettingsContext)

    const getInitialValues = () => {
        let initialValues = {}
        Object.keys(availableLanguages).forEach(lang => {
            initialValues[lang] = value[lang]
        })
        return initialValues
    }
    const initialValues = useState(getInitialValues)[0]

    const getValidationSchema = () => {
        let schema = {}
        Object.keys(availableLanguages).forEach(lang => {
            schema[lang] = Yup.string().max(255).required(title+' ('+availableLanguages[lang].label+') is required')
        })
        return schema
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object().shape(
            getValidationSchema()
        )
    })

    return <>
        {Object.keys(availableLanguages).map(lang => <Grid
            item
            md={width}
            xs={12}
        >
            {formik.initialValues && <InputField
                error={Boolean(formik.touched[lang] && formik.errors[lang])}
                fullWidth
                helperText={formik.touched[lang] && formik.errors[lang]}
                label={title+' ('+availableLanguages[lang].label+')'}
                name={lang}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values[lang]}
            />}
        </Grid>)}
    </>
}

export default MultilangTextInput