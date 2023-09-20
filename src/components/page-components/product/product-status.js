import {useContext, useState} from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Button, Card, CardContent, CardHeader, Divider } from '@material-ui/core';
import { StatusSelect } from '../../common/status-select';
import statusOptions from '../../../data/product-statuses.json'
import {APIContext} from "../../../contexts/api-context";

export const ProductStatus = (props) => {
  const { onSuccess, product, ...other } = props;
  const [status, setStatus] = useState(product.status);
  const {updateProduct} = useContext(APIContext)

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSaveChanges = () => {
    let formData = new FormData();
    formData.append("status", parseInt(status))
    formData.append("delete_files", "0")
    updateProduct(product.id, formData).then(response => {
      if (response.status === 200) {
        toast.success('Changes saved');
      }
      onSuccess();
    })
  };

  return (
    <>
      <Card
        variant="outlined"
        {...other}
      >
        <CardHeader
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
          <Button
            color="primary"
            onClick={handleSaveChanges}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

ProductStatus.propTypes = {
  product: PropTypes.object
};
