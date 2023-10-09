import {useCallback, useContext, useEffect, useState} from 'react';
import {Outlet, Link as RouterLink, useLocation, useParams} from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Container,
  Divider,
  Skeleton,
  Tab,
  Tabs,
  Typography
} from '@material-ui/core';
import { ActionsMenu } from '../../components/common/actions/actions-menu';
import { ConfirmationDialog } from '../../components/modal/confirmation-dialog';
// import { Status } from '../../components/common/status';
import { useDialog } from '../../hooks/use-dialog';
import { useMounted } from '../../hooks/use-mounted';
import { ArrowLeft as ArrowLeftIcon } from '../../icons/arrow-left';
import { ExclamationOutlined as ExclamationOutlinedIcon } from '../../icons/exclamation-outlined';
import {APIContext} from "../../contexts/api-context";
import {useLanguage} from "../../hooks/use-language";

export const ProductSingle = () => {
  const mounted = useMounted();
  const location = useLocation();
  const [
    discontinueDialogOpen,
    handleOpenDiscontinueDialog,
    handleCloseDiscontinueDialog
  ] = useDialog();
  const [archiveOpen, handleOpenArchiveDialog, handleCloseArchiveDialog] = useDialog();
  const [productState, setProductState] = useState({ isLoading: true });
  const {fetchProduct} = useContext(APIContext)
  const {productId} = useParams();
  const {getLang} = useLanguage()
  const [tabs, setTabs] = useState([]);

  const getProduct = useCallback(async () => {
    setProductState(() => ({ isLoading: true }));

    try {
      const {data: {data}} = await fetchProduct(productId)
      const result = data;

      if (mounted.current) {
        setProductState(() => ({
          isLoading: false,
          data: result
        }));
      }
    } catch (err) {
      console.error(err);

      if (mounted.current) {
        setProductState(() => ({
          isLoading: false,
          error: err.message
        }));
      }
    }
  }, []);

  useEffect(() => {
    getProduct().catch(console.error);
  }, []);

  const handleSendInvoice = () => {
    toast.error('This action is not available on demo');
  };

  const handleDiscontinueProduct = () => {
    handleCloseDiscontinueDialog();
    toast.error('This action is not available on demo');
  };

  const handleArchiveProduct = () => {
    handleCloseArchiveDialog();
    toast.error('This action is not available on demo');
  };

  const actions = [
    {
      label: 'Send Invoice to Customer',
      onClick: handleSendInvoice
    },
    {
      label: 'Discontinue Product',
      onClick: handleOpenDiscontinueDialog
    },
    {
      label: 'Archive Product',
      onClick: handleOpenArchiveDialog
    }
  ];

  useEffect(() => {
    if (productState && productState.data?.virtual === true) {
      setTabs([
        {
          href: '/admin/products/'+productId,
          label: 'Info'
        },
        {
          href: '/admin/products/'+productId+'/ratings',
          label: 'Ratings'
        },
        {
          href: '/admin/products/'+productId+'/insights',
          label: 'Insights'
        },
        {
          href: '/admin/products/'+productId+'/preview',
          label: 'Preview'
        },
        {
          href: '/admin/products/'+productId+'/files',
          label: 'Files'
        },
        {
          href: '/admin/products/'+productId+'/paid-files',
          label: 'Paid Files'
        }
      ])
    } else {
      setTabs([
        {
          href: '/admin/products/'+productId,
          label: 'Info'
        },
        {
          href: '/admin/products/'+productId+'/variants',
          label: 'Variants'
        },
        {
          href: '/admin/products/'+productId+'/ratings',
          label: 'Ratings'
        },
        {
          href: '/admin/products/'+productId+'/insights',
          label: 'Insights'
        },
        {
          href: '/admin/products/'+productId+'/preview',
          label: 'Preview'
        },
        {
          href: '/admin/products/'+productId+'/files',
          label: 'Files'
        },
      ])
    }
  }, [productState])

  const renderContent = () => {
    if (productState.isLoading) {
      return (
        <Box sx={{ py: 4 }}>
          <Skeleton height={42} />
          <Skeleton />
          <Skeleton />
        </Box>
      );
    }

    if (productState.error) {
      return (
        <Box sx={{ py: 4 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'neutral.100',
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <ExclamationOutlinedIcon />
            <Typography
              color="textSecondary"
              sx={{ mt: 2 }}
              variant="body2"
            >
              {productState.error}
            </Typography>
          </Box>
        </Box>
      );
    }

    const reload = {
      callback: getProduct
    }

    return (
      <>
        <Box sx={{ py: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Button
              color="primary"
              component={RouterLink}
              startIcon={<ArrowLeftIcon />}
              to="/admin/products"
              variant="text"
            >
              Products
            </Button>
          </Box>
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
              {getLang(productState.data.name)}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <ActionsMenu actions={actions} />
          </Box>
          <Tabs
            allowScrollButtonsMobile
            sx={{ mt: 4 }}
            value={tabs.findIndex((tab) => tab.href === location.pathname)}
            variant="scrollable"
          >
            {tabs.map((option) => (
              <Tab
                component={RouterLink}
                key={option.href}
                label={option.label}
                to={option.href}
              />
            ))}
          </Tabs>
          <Divider />
        </Box>
        <Outlet context={[productState, reload]} />
        <ConfirmationDialog
          message="Are you sure you want to discontinue this product? This can't be undone."
          onCancel={handleCloseDiscontinueDialog}
          onConfirm={handleDiscontinueProduct}
          open={discontinueDialogOpen}
          title="Discontinue ProductSingle"
          variant="error"
        />
        <ConfirmationDialog
          message="Are you sure you want to archive this order? This can't be undone."
          onCancel={handleCloseArchiveDialog}
          onConfirm={handleArchiveProduct}
          open={archiveOpen}
          title="Archive ProductSingle"
          variant="error"
        />
      </>
    );
  };

  return (
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
        {renderContent()}
      </Container>
    </Box>
  );
};
