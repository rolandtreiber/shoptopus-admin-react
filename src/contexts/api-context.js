import React, {createContext, useState} from "react"
import axios from "axios"

const APIContext = createContext([{}, () => {
}])

const APIProvider = ({children}) => {

  // ApiHelper
  const createAxios = () => {
    const standardConfig = {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }

    let axiosAPI = axios.create(standardConfig)

    axiosAPI.interceptors.response.use(
      (response) => response,
      (error) => {
        const {response} = error

        // console.log(response)
        if (response.status === 401) {
          // logout()
          return
        }

        throw error
      },
    )

    return axiosAPI
  }

  const get = async (url, params = null, headers = {}) => {
    let config = {headers: headers}

    const urlParams = new URLSearchParams(Object.keys(params).filter(key => key !== 'filters').reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {})).toString()

    let filtersString = params.filters ? urlParams.length > 0 ? '&' : '?' : ''
    let filters = []
    params.filters && params.filters.map(item => filters.push('filters[' + item[0] + ']=' + item[1]))
    for (let i = 0; i < filters.length; i++) {
      filtersString += filters[i]
      filtersString += i !== filters.length - 1 ? '&' : ''
    }

    return await createAxios().get(url + "?" + urlParams + filtersString, config)
  }

  const postAsMultipartFormData = async (url, params = {}, headers = {}) => {
    let config = {headers: {
      ...headers,
        "Content-Type" : "multipart/form-data"
      }}
    return await createAxios().post(url, params, config)
  }

  const post = async (url, params = {}, headers = {}) => {
    let config = {headers: headers}
    return await createAxios().post(url, params, config)
  }

  const put = async (url, params = {}, headers = {}) => {
    let config = {headers: headers}

    params["_method"] = "put"
    return await createAxios().post(url, params, config)
  }

  const patch = async (url, params = {}, headers = {}) => {
    let config = {headers: headers}

    if (params instanceof FormData) {
      params.append('_method', "patch")
    } else {
      params["_method"] = "patch"
    }
    return await createAxios().post(url, params, config)
  }

  const del = async (url, params = {}, headers = {}) => {
    let config = {headers: headers}

    params["_method"] = "delete"
    return await createAxios().post(url, params, config)
  }

  const makeHeaders = (extraHeaders = null) => {
    let headers = {
      version: 1,
    }
    // If a token is available, include it
    if (accessToken || extraHeaders?.accessToken) {
      const t = (accessToken !== undefined && accessToken !== null) ? accessToken : extraHeaders.accessToken
      headers["Authorization"] = "Bearer " + t
    }

    if (extraHeaders) {
      for (const [key, value] of Object.entries(extraHeaders)) {
        if (key !== 'accessToken') {
          headers[key] = value
        }
      }
    }

    return headers
  }

  const api_url = process.env.REACT_APP_API_URL;
  const admin_api_url = process.env.REACT_APP_API_URL + 'admin/';
  const app_url = process.env.REACT_APP_URL
  const [accessToken, setAccessToken] = useState()

  const shoptopusApiContext = React.useMemo(
    () => ({
      callLoginApi: async (params) => await post(api_url + "auth/login", params, makeHeaders()),
      callMeApi: async (token) => await post(api_url + "auth/me", {}, makeHeaders({
        accessToken: token
      })),

      // Reports
      fetchReportsOverview: async (params) => await post(admin_api_url + "reports/overview", params, makeHeaders()),
      fetchReportsSales: async (params) => await post(admin_api_url + "reports/sales", params, makeHeaders()),

      // Products
      fetchProducts: async (params) => await get(admin_api_url + "products", params, makeHeaders()),
      fetchProduct: async (productId) => await get(admin_api_url + "product/" + productId, {}, makeHeaders()),
      saveProduct: async (params) => await post(admin_api_url + "product", params, makeHeaders()),
      updateProduct: async (productId, params) => await patch(admin_api_url + "product/" + productId, params, makeHeaders()),
      deleteProduct: async (productId) => await del(admin_api_url + "product/" + productId, {}, makeHeaders()),

      // Product variants
      fetchProductVariants: async (productId, params) => await get(admin_api_url + "product/" + productId + '/variants', params, makeHeaders()),
      fetchProductVariant: async (productId, productVariantId) => await get(admin_api_url + "product/" + productId + "/variant/" + productVariantId, {}, makeHeaders()),
      saveProductVariant: async (productId, params) => await post(admin_api_url + "product/" + productId + "/variant", params, makeHeaders()),
      updateProductVariant: async (productId, productVariantId, params) => await patch(admin_api_url + "product/" + productId + "/variant/" + productVariantId, params, makeHeaders()),
      deleteProductVariant: async (productId, productVariantId) => await del(admin_api_url + 'product/' + productId + '/variant/' + productVariantId, {}, makeHeaders()),

      // Product Categories
      fetchProductCategories: async (params) => await get(admin_api_url + "product-categories", params, makeHeaders()),
      fetchProductCategoriesSelectData: async (params) => await get(admin_api_url + "product-categories/select-data", {}, makeHeaders()),
      fetchProductCategory: async (categoryId) => await get(admin_api_url + "product-category/" + categoryId, {}, makeHeaders()),
      saveProductCategory: async (params) => await postAsMultipartFormData(admin_api_url + "product-category", params, makeHeaders()),
      updateProductCategory: async (categoryId, params) => await patch(admin_api_url + "product-category/" + categoryId, params, makeHeaders()),
      deleteProductCategory: async (categoryId) => await del(admin_api_url + "product-category/" + categoryId, {}, makeHeaders()),

      // Product Attributes
      fetchProductAttributes: async (params) => await get(admin_api_url + "product-attributes", params, makeHeaders()),
      fetchProductAttribute: async (attributeId) => await get(admin_api_url + "product-attribute/" + attributeId, {}, makeHeaders()),
      saveProductAttribute: async (params) => await post(admin_api_url + "product-attribute", params, makeHeaders()),
      updateProductAttribute: async (attributeId, params) => await patch(admin_api_url + "product-attribute/" + attributeId, params, makeHeaders()),
      deleteProductAttribute: async (attributeId) => await del(admin_api_url + "product-attribute/" + attributeId, {}, makeHeaders()),

      // Product Attribute Options
      fetchProductAttributeOptions: async (attributeId, params) => await get(admin_api_url + "product-attribute/" + attributeId + "/options", params, makeHeaders()),
      saveProductAttributeOption: async (attributeId, params) => await post(admin_api_url + "product-attribute" + attributeId + "/option", params, makeHeaders()),
      updateProductAttributeOption: async (attributeId, attributeOptionId, params) => await put(admin_api_url + "product-attribute/" + attributeId + "/option/" + attributeOptionId, params, makeHeaders()),
      deleteProductAttributeOption: async (attributeId, attributeOptionId) => await del(admin_api_url + "product-attribute/" + attributeId + "/option/" + attributeOptionId, {}, makeHeaders()),

      // Product Tags
      fetchProductTags: async (params) => await get(admin_api_url + "product-tags", params, makeHeaders()),
      fetchProductTag: async (productTagId) => await get(admin_api_url + "product-tag/" + productTagId, {}, makeHeaders()),
      saveProductTag: async (params) => await post(admin_api_url + "product-tag", params, makeHeaders()),
      updateProductTag: async (productTagId, params) => await patch(admin_api_url + "product-tag/" + productTagId, params, makeHeaders()),
      deleteProductTag: async (productTagId) => await del(admin_api_url + "product-tag/" + productTagId, {}, makeHeaders()),

      // Orders
      fetchOrders: async (params) => await get(admin_api_url + "orders", params, makeHeaders()),
      fetchOrder: async (orderId) => await get(admin_api_url + "order/" + orderId, {}, makeHeaders()),
      updateOrder: async (orderId, params) => await patch(admin_api_url + "order/" + orderId, params, makeHeaders()),
      deleteOrder: async (orderId) => await del(admin_api_url + "order/" + orderId, {}, makeHeaders()),

      // Discount Rules
      fetchDiscountRules: async (params) => await get(admin_api_url + "discount-rules", params, makeHeaders()),
      fetchDiscountRule: async (discountRuleId) => await get(admin_api_url + "discount-rule/" + discountRuleId, {}, makeHeaders()),
      saveDiscountRule: async (params) => await post(admin_api_url + "discount-rule", params, makeHeaders()),
      updateDiscountRule: async (discountRuleId, params) => await put(admin_api_url + "discount-rule/" + discountRuleId, params, makeHeaders()),
      deleteDiscountRule: async (discountRuleId) => await del(admin_api_url + "discount-rule/" + discountRuleId, {}, makeHeaders()),

      // Voucher Codes
      fetchVoucherCodes: async (params) => await get(admin_api_url + "voucher-codes", params, makeHeaders()),
      fetchVoucherCode: async (voucherCodeId) => await get(admin_api_url + "voucher-code/" + voucherCodeId, {}, makeHeaders()),
      saveVoucherCode: async (params) => await post(admin_api_url + "voucher-code", params, makeHeaders()),
      updateVoucherCode: async (voucherCodeId, params) => await put(admin_api_url + "voucher-code/" + voucherCodeId, params, makeHeaders()),
      deleteVoucherCode: async (voucherCodeId) => await del(admin_api_url + "voucher-code/" + voucherCodeId, {}, makeHeaders()),

      // Delivery Types
      fetchDeliveryTypes: async (params) => await get(admin_api_url + "delivery-types", params, makeHeaders()),
      fetchDeliveryType: async (deliveryTypeId) => await get(admin_api_url + "delivery-type/" + deliveryTypeId, {}, makeHeaders()),
      saveDeliveryType: async (params) => await post(admin_api_url + "delivery-type", params, makeHeaders()),
      updateDeliveryType: async (deliveryTypeId, params) => await patch(admin_api_url + "delivery-type/" + deliveryTypeId, params, makeHeaders()),
      deleteDeliveryType: async (deliveryTypeId) => await del(admin_api_url + "delivery-type/" + deliveryTypeId, {}, makeHeaders()),

      // Delivery Rules
      fetchDeliveryRules: async (deliveryRuleId, params) => await get(admin_api_url + "delivery-rules", params, makeHeaders()),
      saveDeliveryRule: async (deliveryTypeId, params) => await post(admin_api_url + "delivery-type/" + deliveryTypeId + "/delivery-rule", params, makeHeaders()),
      updateDeliveryRule: async (deliveryTypeId, deliveryRuleId, params) => await put(admin_api_url + "delivery-type/" + deliveryTypeId + "/delivery-rule/" + deliveryRuleId, params, makeHeaders()),
      deleteDeliveryRule: async (deliveryTypeId, deliveryRuleId) => await del(admin_api_url + "delivery-type/" + deliveryTypeId + "/delivery-rule/" + deliveryRuleId, {}, makeHeaders()),

      // System Users
      fetchUsers: async (params) => await get(admin_api_url + "users", params, makeHeaders()),
      fetchUser: async (userId) => await get(admin_api_url + "user/" + userId, {}, makeHeaders()),
      saveUser: async (params) => await post(admin_api_url + "user", params, makeHeaders()),
      updateUser: async (userId, params) => await put(admin_api_url + "user/" + userId, params, makeHeaders()),
      deleteUser: async (userId) => await del(admin_api_url + "user/" + userId, {}, makeHeaders()),

      // Customers
      fetchCustomers: async (params) => await get(admin_api_url + "customers", params, makeHeaders()),
      fetchCustomer: async (customerId) => await get(admin_api_url + "customer/" + customerId, {}, makeHeaders()),
      saveCustomer: async (params) => await post(admin_api_url + "customer", params, makeHeaders()),
      updateCustomer: async (customerId, params) => await put(admin_api_url + "customer/" + customerId, params, makeHeaders()),
      deleteCustomer: async (customerId) => await del(admin_api_url + "customer/" + customerId, {}, makeHeaders()),

      // Payments
      fetchPayments: async (params) => await get(admin_api_url + "payments", params, makeHeaders()),
      fetchPayment: async (paymentId) => await get(admin_api_url + "payment/" + paymentId, {}, makeHeaders()),
      savePayment: async (params) => await post(admin_api_url + "payment", params, makeHeaders()),
      updatePayment: async (paymentId, params) => await put(admin_api_url + "payment/" + paymentId, params, makeHeaders()),
      deletePayment: async (paymentId) => await del(admin_api_url + "payment/" + paymentId, {}, makeHeaders()),

      // Banners
      fetchBanners: async (params) => await get(admin_api_url + "banners", params, makeHeaders()),
      fetchBanner: async (bannerId) => await get(admin_api_url + "banner/" + bannerId, {}, makeHeaders()),
      saveBanner: async (params) => await post(admin_api_url + "banner", params, makeHeaders()),
      updateBanner: async (bannerId, params) => await put(admin_api_url + "banner/" + bannerId, params, makeHeaders()),
      deleteBanner: async (bannerId) => await del(admin_api_url + "banner/" + bannerId, {}, makeHeaders()),

      // Ratings
      fetchRatings: async (params) => await get(admin_api_url + "ratings", params, makeHeaders()),
      saveRating: async (params) => await post(admin_api_url + "rating", params, makeHeaders()),
      deleteRating: async (ratingId) => await del(admin_api_url + "rating/" + ratingId, {}, makeHeaders()),

      // Custom/Functional
      getProductsPageSummary: async () => await get(admin_api_url + "products/summary", {}, makeHeaders()),
      getAppMetaInformation: async () => await get(api_url + "meta", {}, makeHeaders()),
      getSharedOptions: async () => await get(api_url + "shared-options", {}, makeHeaders()),

      // Files
      fetchFiles: async (params) => await get(admin_api_url + "files", params, makeHeaders()),
      fetchFile: async (fileId) => await get(admin_api_url + "file/" + fileId, {}, makeHeaders()),
      saveFile: async (params) => await post(admin_api_url + "file", params, makeHeaders()),
      updateFile: async (fileId, params) => await put(admin_api_url + "file/" + fileId, params, makeHeaders()),
      deleteFile: async (fileId) => await del(admin_api_url + "file/" + fileId, {}, makeHeaders()),

      // Email
      getUserOptions: async () => {
        if (accessToken) {
          return await get(admin_api_url + `get-users`, {}, makeHeaders())
        }
      },
      sendEmail: async (params) => await post(admin_api_url+`send-email`, params, makeHeaders()),

      // Bulk operations

      // Orders
      bulkUpdateOrderStatus: async (params) => await post(admin_api_url + "orders/bulk/status", params, makeHeaders()),

      // Products
      bulkDeleteProducts: async (params) => await del(admin_api_url + "products/bulk", params, makeHeaders()),
      bulkArchiveProducts: async (params) => await post(admin_api_url + "products/bulk/archive", params, makeHeaders()),

      // Product Categories
      bulkDeleteProductCategories: async (params) => await del(admin_api_url + "product-categories/bulk", params, makeHeaders()),
      bulkUpdateProductCategoriesAvailability: async (params) => await post(admin_api_url + "product-categories/bulk/availability", params, makeHeaders()),

      // Product Attributes
      bulkDeleteProductAttributes: async (params) => await del(admin_api_url + "product-attributes/bulk", params, makeHeaders()),
      bulkUpdateProductAttributesAvailability: async (params) => await post(admin_api_url + "product-attributes/bulk/availability", params, makeHeaders()),

      // Product Tags
      bulkDeleteProductTags: async (params) => await del(admin_api_url + "product-tags/bulk", params, makeHeaders()),
      bulkUpdateProductTagsAvailability: async (params) => await post(admin_api_url + "product-tags/bulk/availability", params, makeHeaders()),

      // Discount Rules
      bulkDeleteDiscountRules: async (params) => await del(admin_api_url + "discount-rules/bulk", params, makeHeaders()),
      bulkExpireDiscountRules: async (params) => await post(admin_api_url + "discount-rules/bulk/expire", params, makeHeaders()),
      bulkStartDiscountRules: async (params) => await post(admin_api_url + "discount-rules/bulk/start", params, makeHeaders()),
      bulkActivateDiscountRulesForPeriod: async (params) => await post(admin_api_url + "discount-rules/bulk/activate", params, makeHeaders()),

      // Voucher Codes
      bulkDeleteVoucherCodes: async (params) => await del(admin_api_url + "voucher-codes/bulk", params, makeHeaders()),
      bulkExpireVoucherCodes: async (params) => await post(admin_api_url + "voucher-codes/bulk/expire", params, makeHeaders()),
      bulkStartVoucherCodes: async (params) => await post(admin_api_url + "voucher-codes/bulk/start", params, makeHeaders()),
      bulkActivateVoucherCodesForPeriod: async (params) => await post(admin_api_url + "voucher-codes/bulk/activate", params, makeHeaders()),

      // Delivery Types
      bulkDeleteDeliveryTypes: async (params) => await del(admin_api_url + "delivery-types/bulk", params, makeHeaders()),
      bulkUpdateDeliveryTypesAvailability: async (params) => await post(admin_api_url + "delivery-types/bulk/availability", params, makeHeaders()),

      // Payments
      bulkUpdatePaymentStatuses: async (params) => await post(admin_api_url + "payments/bulk/status", params, makeHeaders()),

      // Banners
      bulkDeleteBanners: async (params) => await del(admin_api_url + "banners/bulk", params, makeHeaders()),
      bulkUpdateBannersAvailability: async (params) => await post(admin_api_url + "banners/bulk/availability", params, makeHeaders()),

      // Ratings
      bulkUpdateRatingsAvailability: async (params) => await post(admin_api_url + "ratings/bulk/availability", params, makeHeaders()),
      bulkUpdateRatingsVerifiedStatus: async (params) => await post(admin_api_url + "ratings/bulk/verified-status", params, makeHeaders()),

      // Files
      bulkDeleteFiles: async (params) => await del(admin_api_url + "files/bulk", params, makeHeaders()),

      // Upload
      validateImportFile: async (params) => await post(app_url + "io/validate", params, makeHeaders()),
      processImportFile: async (params) => await post(app_url + "io/import", params, makeHeaders()),

      // Notifications
      getNotifications: async (params) => await get(app_url + "notifications", params, makeHeaders()),
      clearNotifications: async (params) => await patch(app_url + "notifications/clear", params, makeHeaders()),

      accessToken,
      setAccessToken,
    }),
    [accessToken],
  )

  return (
    <APIContext.Provider value={shoptopusApiContext}>
      {children}
    </APIContext.Provider>
  )
}

export {APIContext, APIProvider}
