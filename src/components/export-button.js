import React, {useContext, useState} from "react";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {Download as DownloadIcon} from '../icons/download';
import {APIContext} from "../contexts/api-context";
import axios from "axios";
import {ChevronDown as ChevronDownIcon} from "../icons/chevron-down";
import {usePopover} from "../hooks/use-popover";

const ExportButton = ({
                        name,
                        modelsSimple,
                        modelsExtended,
                        modelTemplate,
                        showTemplate = false,
                        showExtended = true
                      }) => {
  const {accessToken} = useContext(APIContext)
  const app_url = process.env.REACT_APP_URL;
  const [anchorRef, open, handleOpen, handleClose] = usePopover();

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

  const menuItems = [
    {
      name: 'Simple',
      callback: () => initiateExportDownload(name + '-simple', modelsSimple)
    },
  ]

  if (showExtended) {
    menuItems.push({
      name: 'Extended',
      callback: () => initiateExportDownload(name + '-extended', modelsExtended)
    })
  }

  if (showTemplate) {
    menuItems.push({
      name: 'Template',
      callback: () => initiateExportDownload(name + '-template', modelTemplate)
    })
  }

  return (
    <>
      <Button
        color="primary"
        sx={{
          marginLeft: '5px'
        }}
        ref={anchorRef}
        startIcon={<ChevronDownIcon/>}
        onClick={handleOpen}
        // onClick={() => initiateExportDownload(name, models)}
        size="large"
        variant="contained"
      >
        Export
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