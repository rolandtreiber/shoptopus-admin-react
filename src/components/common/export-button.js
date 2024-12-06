import {useContext} from "react";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {APIContext} from "../../contexts/api-context";
import axios from "axios";
import {ChevronDown as ChevronDownIcon} from "../../icons/chevron-down";
import {usePopover} from "../../hooks/use-popover";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../../contexts/oauth-context";

const ExportButton = ({
                        name,
                        modelsSimple,
                        modelsExtended,
                        modelTemplate,
                        showTemplate = false,
                        showExtended = true
                      }) => {
  const {accessToken} = useContext(APIContext)
  const app_url = process.env.REACT_APP_API_URL;
  const [anchorRef, open, handleOpen, handleClose] = usePopover();
  const { t } = useTranslation();
  const {can} = useContext(AuthContext)

  const getDateString = () => {
    const date = new Date()
    return date.getHours() + "-" + date.getMinutes() + "-" + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
  }

  const initiateExportDownload = (name, models, type = 'export') => {
    const params = {
      name: name,
    }

    const urlParams = new URLSearchParams(Object.keys(params).filter(key => key !== 'filters').reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {}))

    models.forEach(m => {
      urlParams.append('models[]', m)
    })

    axios({
      url: app_url + "io/" + type + "?" + urlParams.toString(),
      method: 'GET',
      responseType: 'blob',
      headers: {
        "Authorization": "Bearer " + accessToken,
      }
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name + "_" + getDateString() + '.xlsx');
      document.body.appendChild(link);
      link.click();
    });

  }

  const initiateTemplateDownload = (name, model) => {
    const params = {
      name: name,
    }

    const urlParams = new URLSearchParams(Object.keys(params).filter(key => key !== 'filters').reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {}))

    urlParams.append('model', model)

    axios({
      url: app_url + "io/template?" + urlParams.toString(),
      method: 'GET',
      responseType: 'blob',
      headers: {
        "Authorization": "Bearer " + accessToken,
      }
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name + "_" + getDateString() + '.xlsx');
      document.body.appendChild(link);
      link.click();
    });

  }

  const menuItems = [
    {
      name: t('Simple'),
      callback: () => initiateExportDownload(name + '-simple', modelsSimple)
    },
  ]

  if (showExtended) {
    menuItems.push({
      name: t('Extended'),
      callback: () => initiateExportDownload(name + '-extended', modelsExtended)
    })
  }

  if (showTemplate) {
    menuItems.push({
      name: t('Template'),
      callback: () => initiateTemplateDownload(name + '-template', modelTemplate)
    })
  }

  return (
    <>
      <Button
        color="primary"
        sx={{
          marginLeft: '5px'
        }}
        disabled={!can('export.can.create')}
        ref={anchorRef}
        startIcon={<ChevronDownIcon/>}
        onClick={handleOpen}
        size="large"
        variant="contained"
      >
        {t("Export")}
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        open={open}
        onClose={handleClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {
          menuItems && menuItems.map(menuItem => (
            <MenuItem key={menuItem.name} onClick={() => {
              menuItem.callback()
              handleClose()
            }}>
              {`${menuItem.name}`}
            </MenuItem>
          ))
        }
      </Menu>
    </>
  )

}

export default ExportButton