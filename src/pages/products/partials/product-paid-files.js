import {useCallback, useContext, useEffect, useState} from "react";
import {Box, Card, Divider, List, ListItem, ListItemText} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Delete, Download, Edit} from "@mui/icons-material";
import TrButton from "../../../components/common/translated/translated-button";
import {APIContext} from "../../../contexts/api-context";
import {useParams} from "react-router-dom";
import {useMounted} from "../../../hooks/use-mounted";
import {useLanguage} from "../../../hooks/use-language";
import {ResourceUnavailable} from "../../../components/common/placeholder/resource-unavailable";
import {ResourceLoading} from "../../../components/common/placeholder/resource-loading";
import {ProductPaidFileDialog} from "../components/product-paid-file-dialog";
import {DialogContext} from "../../../contexts/dialog-context";
import TrCardHeader from "../../../components/common/translated/translated-card-header";

const ProductPaidFiles = () => {
  const [file, setFile] = useState()
  const {productId} = useParams();
  const mounted = useMounted();
  const [fileDialogOpen, setFileDialogOpen] = useState(false)
  const {
    getPaidFilesForProduct,
    deletePaidFileFromProduct,
    downloadPaidFile
  } = useContext(APIContext)
  const [filesState, setFilesState] = useState({
    isLoading: true,
    data: null
  })
  const {getLang} = useLanguage()
  const [selectedFileData, setSelectedFileData] = useState()
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]

  const getPaidFiles = useCallback(async () => {
    setFilesState({isLoading: true});

    try {
      const {data: {data}} = await getPaidFilesForProduct(productId)
      const result = data;

      if (mounted.current) {
        setFilesState(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setFilesState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, [productId]);

  useEffect(() => {
    getPaidFiles().catch(e => console.log(e))
  }, [productId])

  const doDeletePaidFileContent = useCallback(async (id) => {
    try {
      return await deletePaidFileFromProduct(productId, id);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const handleDeletePaidFileContent = useCallback(async (id) => {
    const call = () => doDeletePaidFileContent(id).then(result => {
      if (result?.status === 200) {
        getPaidFiles()
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete a paid file.')
    showGenericDialog(true)
  }, [productId])

  const doDownloadPaidFile = async (file) => {
    try {
      return await downloadPaidFile(productId, file.id);
    } catch (err) {
      console.error(err);
    }
  }

  const handleDownloadPaidFile = async (file) => {
    doDownloadPaidFile(file).then((response) => {
      // create file link in browser's memory
      const contentType = response.headers['content-type'];
      const href = URL.createObjectURL(new Blob([response.data], {type: contentType}));

      // create "a" HTML element with href to file & click
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', file.original_file_name ? file.original_file_name : file.file_name); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  }

  return (<div>
    <Card variant="outlined" sx={{mb: 2}}>
      <TrCardHeader title={"Files"}/>
      <Divider/>
      <Box sx={{m:1}}>
        {filesState.data ? (<List>
          {filesState.data.map(f => (
            <ListItem key={f.id}
                      secondaryAction={
                        <>
                          <IconButton onClick={() => handleDownloadPaidFile(f)}
                                      edge="end" aria-label="delete">
                            <Download/>
                          </IconButton>
                          <IconButton onClick={() => {
                            setSelectedFileData(f)
                            setFileDialogOpen(true)
                          }} edge="end" aria-label="delete">
                            <Edit/>
                          </IconButton>
                          <IconButton onClick={() => {
                            handleDeletePaidFileContent(f.id)
                          }} edge="end" aria-label="delete">
                            <Delete/>
                          </IconButton>
                        </>
                      }
            >
              <ListItemText sx={{width: "40%"}}>{getLang(f.title)}</ListItemText>
              <ListItemText sx={{width: "40%"}}>{f.original_file_name}</ListItemText>
            </ListItem>
          ))}
        </List>) : (
          <>
            {filesState.isLoading ? (<ResourceLoading/>) : (<ResourceUnavailable/>)}
          </>
        )}

      </Box>
    </Card>
    <Box sx={{width: "100%", textAlign: "right"}}>
      <TrButton variant="contained" onClick={() => {
        setSelectedFileData(null)
        setFileDialogOpen(true);
      }}>Upload</TrButton>
    </Box>

    <ProductPaidFileDialog
      open={fileDialogOpen}
      onSuccess={getPaidFiles}
      onClose={() => setFileDialogOpen(false)}
      productId={productId}
      initialValues={selectedFileData}
    />
  </div>)
}

export default ProductPaidFiles