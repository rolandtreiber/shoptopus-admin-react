import {useCallback, useContext, useEffect, useState} from "react";
import {Box, Card, Divider, Link, List, ListItem, ListItemText} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Delete, Download, Edit} from "@mui/icons-material";
import TrButton from "../../../components/common/translated/translated-button";
import {APIContext} from "../../../contexts/api-context";
import {useParams} from "react-router-dom";
import {useMounted} from "../../../hooks/use-mounted";
import {useLanguage} from "../../../hooks/use-language";
import {ResourceUnavailable} from "../../../components/common/placeholder/resource-unavailable";
import {ResourceLoading} from "../../../components/common/placeholder/resource-loading";
import {DialogContext} from "../../../contexts/dialog-context";
import {FileDialog} from "../components/file-dialog";
import TrCardHeader from "../../../components/common/translated/translated-card-header";

const ProductFiles = () => {
  const {productId} = useParams();
  const mounted = useMounted();
  const [fileDialogOpen, setFileDialogOpen] = useState(false)
  const {
    fetchFiles,
    deleteFile,
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

  const getFiles = useCallback(async () => {
    setFilesState({isLoading: true});

    try {
      const {data: {data}} = await fetchFiles({
        page: 1,
        paginate: 200,
        "filters[fileable_id]": productId,
        "filters[type]": "[\"notEqual\", 1]"
      })
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
    getFiles().catch(e => console.log(e))
  }, [productId])

  const doDeleteFileContent = useCallback(async (id) => {
    try {
      return await deleteFile(id);
    } catch (err) {
      console.error(err);
    }
  }, [])

  const handleDeleteFileContent = useCallback(async (id) => {
    const call = () => doDeleteFileContent(id).then(result => {
      if (result?.status === 200) {
        getFiles()
      }
    })

    setCallback({method: call})
    setTitle('Are you sure?')
    setDescription('You are about to delete a file.')
    showGenericDialog(true)
  }, [productId])

  return (<div>
    <Card variant="outlined" sx={{mb: 2}}>
      <TrCardHeader title={"Files"}/>
      <Divider/>
      <Box sx={{m:1}}>
        {filesState.data ? (<>
          {filesState.data.length !== 0 ? <List>
            {filesState.data.map(f => (
              <ListItem key={f.id}
                        secondaryAction={
                          <>
                            <Link href={f.url} target={"_blank"}>
                              <IconButton>
                                <Download/>
                              </IconButton>
                            </Link>
                            <IconButton onClick={() => {
                              setSelectedFileData(f)
                              setFileDialogOpen(true)
                            }} edge="end" aria-label="delete">
                              <Edit/>
                            </IconButton>
                            <IconButton onClick={() => {
                              handleDeleteFileContent(f.id)
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
          </List> : <ResourceUnavailable message={"No Files have been uploaded yet."}/>}
        </>) : (
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

    <FileDialog
      open={fileDialogOpen}
      onSuccess={getFiles}
      onClose={() => setFileDialogOpen(false)}
      productId={productId}
      initialValues={selectedFileData}
    />
  </div>)
}

export default ProductFiles