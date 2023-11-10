import {useContext, useState} from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Card, CardContent, Divider } from '@material-ui/core';
import { StatusSelect } from '../../common/status-select';
import statusOptions from '../../../data/product-statuses.json'
import {APIContext} from "../../../contexts/api-context";
import {LoadingButton} from "@material-ui/lab";
import TrCardHeader from "../../translated/TrCardHeader";

export const ProductStatus = (props) => {
  const { onSuccess, product, ...other } = props;
  const [status, setStatus] = useState(product.status);
  const {updateProduct} = useContext(APIContext)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSaveChanges = () => {
    setLoading(true)
    let formData = new FormData();
    formData.append("status", parseInt(status))
    formData.append("delete_files", "0")
    updateProduct(product.id, formData).then(response => {
      if (response.status === 200) {
        toast.success('Changes saved');
      }
      onSuccess();
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <>
      <Card
        variant="outlined"
        {...other}
      >
        <TrCardHeader
          title="Product Status"
          variant="outlined"
        />
        <Divider />
        <CardContent>
          <StatusSelect
            onChange={handleStatusChange}
            options={statusOptions}
            value={status}
          />
          <LoadingButton
            loading={loading}
            color="primary"
            onClick={handleSaveChanges}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Save Changes
          </LoadingButton>
        </CardContent>
      </Card>
    </>
  );
};

ProductStatus.propTypes = {
  product: PropTypes.object
};
