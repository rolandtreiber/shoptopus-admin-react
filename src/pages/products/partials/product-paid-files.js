import {useCallback, useContext, useEffect, useState} from "react";
import {Box, Button, Card, CardContent, CardHeader, List, ListItem, ListItemText} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {APIContext} from "../../../contexts/api-context";
import {useParams} from "react-router-dom";
import {useMounted} from "../../../hooks/use-mounted";
import {useLanguage} from "../../../hooks/use-language";
import {ResourceUnavailable} from "../../../components/common/placeholder/resource-unavailable";
import {ResourceLoading} from "../../../components/common/placeholder/resource-loading";
import {ProductPaidFileDialog} from "../../../components/page-components/product/product-paid-file-dialog";
import {DialogContext} from "../../../contexts/dialog-context";

const ProductPaidFiles = () => {
  const [file, setFile] = useState()
  const {productId} = useParams();
  const [isUploading, setIsUploading] = useState(false)
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
  const [selectdFileData, setSelectdFileData] = useState()
  const {
    setCallback,
    setTitle,
    showGenericDialog,
    setDescription
  } = useContext(DialogContext)[1]

  const getPaidFiles = useCallback(async () => {
    setFilesState({ isLoading: true });

    try {
      const {data: {data}} = await getPaidFilesForProduct(productId)
      const result = data;

      if (mounted.current) {
        console.log('setting file state')
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

  return (<div>
    <Card variant="outlined" sx={{mb: 2}}>
      <CardHeader title={"Files"}/>
      <CardContent>
        {filesState.data ? (<List>
          {filesState.data.map(f => (
            <ListItem key={f.id}
              secondaryAction={
                <IconButton onClick={() => {
                  handleDeletePaidFileContent(f.id)
                }} edge="end" aria-label="delete">
                  <DeleteIcon/>
                </IconButton>
              }
            >
              <ListItemText sx={{width: "80%"}}>{getLang(f.title)}</ListItemText>
            </ListItem>
          ))}
        </List>) : (
          <>
            {filesState.isLoading ? (<ResourceLoading/>) : (<ResourceUnavailable/>)}
          </>
        )}

      </CardContent>
    </Card>
    <Box sx={{width: "100%", textAlign: "right"}}>
      <Button variant="contained" onClick={() => setFileDialogOpen(true)}>Upload</Button>
    </Box>

    <ProductPaidFileDialog
      open={fileDialogOpen}
      onSuccess={getPaidFiles}
      onClose={() => setFileDialogOpen(false)}
      productId={productId}
      fileData={selectdFileData}
    />
  </div>)
}

export default ProductPaidFiles