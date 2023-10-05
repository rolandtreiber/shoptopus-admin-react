import {PaidFileUploader} from "../../../components/common/file-upload/paid-file-uploader";
import {useState} from "react";

const ProductPaidFiles = ({productId}) => {
  const [files, setFiles] = useState()

  return (<div>
    <p>
      {JSON.stringify(files)}
    </p>
    <PaidFileUploader multiple={false} data={files} setData={setFiles}/>
  </div>)
}

export default ProductPaidFiles