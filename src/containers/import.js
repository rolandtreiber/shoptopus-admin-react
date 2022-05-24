import React, {useCallback, useContext, useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {
  Alert,
  Box, Button,
  Container, Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import {SettingsContext} from "../contexts/settings-context";
import {useDropzone} from 'react-dropzone';
import {APIContext} from "../contexts/api-context";
import {getFileFromBlob} from "../utils/file-operations";
import {NotInterested, Check} from "@material-ui/icons";

const acceptedMimeTypes = [
  'application/vnd.ms-excel',
  'application/msexcel',
  'application/x-msexcel',
  'application/x-ms-excel',
  'application/x-excel',
  'application/x-dos_ms_excel',
  'application/xls',
  'application/x-xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

export const Import = () => {
  const {validateImportFile, processImportFile} = useContext(APIContext)
  const [file, setFile] = useState()
  const [validationResult, setValidationResult] = useState()
  const [columnNames, setColumnNames] = useState([])
  const [validatedData, setValidatedData] = useState([])

  const handleDrop = useCallback((files) => {
    setFile(URL.createObjectURL(files[0]))
  })

  const onValidate = async (file) => {
    try {
      let formData = new FormData();
      const fileBlob = await fetch(file).then(r => r.blob())
      fileBlob.name = "import.xls";
      formData.append("file", getFileFromBlob(fileBlob))
      validateImportFile(formData).then(result => {
        setValidationResult(result.data)
      }).catch(e => {
        setValidationResult({
          message: "File upload failed. Please check the file type, extension and columns."
        })
      })
    } catch (err) {
      console.error(err);
    }
  }

  const onProcessImport = async () => {
    try {
      let formData = new FormData();
      const fileBlob = await fetch(file).then(r => r.blob())
      formData.append("file", getFileFromBlob(fileBlob))
      processImportFile(formData).then(result => {
        setValidationResult(result.data)
        if (result.data.status === 'success') {
          setValidatedData([])
          setColumnNames([])
        }
      }).catch(e => {
        setValidationResult({
          message: "File upload failed. Please check the file type, extension and columns."
        })
      })
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (file) {
      onValidate(file).catch()
    }
  }, [file])

  useEffect(() => {
    if (validationResult?.details?.length > 0) {
      let headers = ['Valid'];
      validationResult?.details[0].data.forEach(item => {
        headers.push(item.field ? item.field : item.relationship ? item.relationship : '');
      })
      setColumnNames(headers)
      setValidatedData(validationResult?.details)
    }
  }, [validationResult])

  const {language, appName} = useContext(SettingsContext)

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: acceptedMimeTypes,
    maxFiles: 1,
    minSize: 0,
    onDrop: handleDrop
  });

  return (
    <>
      <Helmet>
        <title>Import Data | {appName}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          marginBottom: "15px"
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Box sx={{py: 4}}>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Import Data
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              alignItems: 'center',
              borderColor: 'neutral.200',
              borderRadius: 1,
              borderStyle: 'dashed',
              borderWidth: 1,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              justifyContent: 'center',
              outline: 'none',
              width: '100%',
              py: 2,
              minHeight: 200,
              ...(isDragActive && {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              }),
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              },
            }}
            {...getRootProps()}
          >
            <h3>Drop file or click to select</h3>
            <input {...getInputProps()} />
          </Box>
        </Container>
      </Box>
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          padding: "15px"
        }}
      >
        {validationResult?.status === "success" ? (
          <Alert severity="success">{validationResult?.message}{'  '}
            {validatedData.length > 0 && <Button onClick={onProcessImport} variant={"contained"}>Import</Button>}
          </Alert>
        ) : (
          <>
          {validationResult?.message && <Alert severity="warning">{validationResult?.message}</Alert>}
          </>
        )}
        {validatedData.length > 0 && (
          <>
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {columnNames.map(columnName => <TableCell key={columnName}>{columnName}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validatedData.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell sx={{color: row.valid ? "rgb(40, 117, 21)" : "rgb(117, 21, 21)"}} align="center">{row.valid ? <Check/> : <NotInterested/>}</TableCell>
                      {row.data.map(item => (
                        <TableCell sx={{backgroundColor: item.errors ? "rgba(117, 21, 21,0.3)" : "rgba(40, 117, 21, 0.3)"}} key={Math.random()} align="left">
                          {item.raw_value}
                          {item.errors && (
                            <ul>
                              {item.errors.map(error =>
                                <li>{error}</li>
                              )}
                            </ul>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </>
  )
}