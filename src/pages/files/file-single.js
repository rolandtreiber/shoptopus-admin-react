import {useCallback, useContext, useEffect, useState} from 'react';
import {
  Box,
  Button,
  Container
} from '@material-ui/core';
import {useMounted} from '../../hooks/use-mounted';
import {Helmet} from "react-helmet-async";
import {SettingsContext} from "../../contexts/settings-context";
import {Link as RouterLink, useParams} from "react-router-dom";
import {ArrowLeft as ArrowLeftIcon} from "../../icons/arrow-left";
import {APIContext} from "../../contexts/api-context";
import {Edit} from "@mui/icons-material";
import {FileDialog} from "../products/components/file-dialog";
import {FileDetails} from "./components/file-details";
import {TrTypography} from "../../components/common/translated/translated-typography";

export const FileContent = () => {
  const mounted = useMounted();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const {appName} = useContext(SettingsContext)
  const [data, setData] = useState({isLoading: true})
  const {fetchFile} = useContext(APIContext)
  const {fileId} = useParams()

  const fetchData = useCallback(async () => {
    setData(() => ({isLoading: true}));

    try {
      const result = await fetchFile(fileId)

      if (mounted.current) {
        setData(() => ({
          isLoading: false,
          data: result.data.data,
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setData(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  useEffect(() => {
    fetchData().catch(e => console.log(e.message))
  }, [])

  return (
    <>
      <Helmet>
        <title>Files: List | {appName}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1
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
            <Box sx={{mb: 2}}>
              <Button
                color="primary"
                component={RouterLink}
                startIcon={<ArrowLeftIcon/>}
                to="/admin/content/files"
                variant="text"
              >
                Files
              </Button>
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <TrTypography
                color="textPrimary"
                variant="h4"
              >
                File
              </TrTypography>
              <Box sx={{flexGrow: 1}}/>
              <Button
                color="primary"
                onClick={() => setOpenEditDialog(true)}
                size="large"
                startIcon={<Edit fontSize="small"/>}
                variant="contained"
              >
                Edit
              </Button>
            </Box>
            {data.data && <FileDetails data={data}/>}
            {openEditDialog && data.data && <FileDialog
              onClose={() => setOpenEditDialog(false)}
              open={openEditDialog}
              onSuccess={fetchData}
              initialValues={data.data}
            />}
          </Box>
        </Container>
      </Box>
    </>
  );
};
