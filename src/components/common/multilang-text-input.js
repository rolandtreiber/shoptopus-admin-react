import {useContext, useEffect, useState} from 'react'
import {useTranslation} from "react-i18next";
import {SettingsContext} from "../../contexts/settings-context";
import {InputField} from "./input-field";
import {Grid, TextField} from "@material-ui/core";
import {useFormik} from "formik";
import * as Yup from "yup";

const MultilangTextInput = ({title, nullable = false, value = null, width, onChange, showErrors = false, rows = null, setValid = () => {}}) => {
    const {availableLanguages} = useContext(SettingsContext)
    const { t } = useTranslation();

    const getInitialValues = () => {
        let initialValues = {}
        if (value) {
            Object.keys(availableLanguages).forEach(lang => {
                initialValues[lang] = value[lang]
            })
        } else {
            Object.keys(availableLanguages).forEach(lang => {
                initialValues[lang] = ''
            })
        }
        return initialValues
    }
    const initialValues = useState(getInitialValues)[0]

    const getValidationSchema = () => {
        let schema = {}
        Object.keys(availableLanguages).forEach(lang => {
            schema[lang] = Yup.string().max(500).required(title+' ('+availableLanguages[lang].label+') is required')
        })
        return schema
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: Yup.object().shape(
            nullable ? {} : getValidationSchema()
        )
    })

    useEffect(() => {
        onChange(formik.values)
    }, [formik.values])

    useEffect(() => {
        Object.keys(availableLanguages).forEach(lang => {
            formik.setFieldTouched(lang)
        })
    }, [])

    useEffect(() => {
        setValid(formik.isValid)
    }, [formik.isValid])

    return <>
        {Object.keys(availableLanguages).map((lang, index) => <Grid
            item
            md={width}
            xs={12}
            key={title+'-'+index}
        >
            {formik.initialValues && (rows === null ? (
              <InputField
                error={Boolean((formik.touched[lang] && formik.errors[lang]) && (showErrors && formik.errors[lang]))}
                fullWidth
                helperText={Boolean((formik.touched[lang] && formik.errors[lang]) && (showErrors && formik.errors[lang])) && formik.errors[lang]}
                label={t(title)+' ('+availableLanguages[lang].label+')'}
                name={lang}
                onBlur={formik.handleBlur}
                onChange={e => {
                    formik.setFieldValue(lang, e.currentTarget.value);
                }}
                value={formik.values[lang]}
              />
            ) : (
              <TextField
                error={Boolean((formik.touched[lang] && formik.errors[lang]) && (showErrors && formik.errors[lang]))}
                fullWidth
                multiline={true}
                maxRows={rows}
                helperText={Boolean((formik.touched[lang] && formik.errors[lang]) && (showErrors && formik.errors[lang])) && formik.errors[lang]}
                label={t(title)+' ('+availableLanguages[lang].label+')'}
                name={lang}
                onBlur={formik.handleBlur}
                onChange={e => {
                    formik.setFieldValue(lang, e.currentTarget.value);
                }}
                value={formik.values[lang]}
              />
            ))}
        </Grid>)}
    </>
}

export default MultilangTextInput