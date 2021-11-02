import React, {createContext, useState} from "react"
import axios from "axios"

const APIContext = createContext([{}, () => {}])

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
    params.filters && params.filters.map(item => filters.push('filters['+item[0]+']='+item[1]))
    for (let i = 0; i < filters.length; i++) {
        filtersString += filters[i]
      filtersString+= i !== filters.length-1 ? '&' : ''
    }

    return await createAxios().get(url + "?" + urlParams+filtersString, config)
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

    params["_method"] = "patch"
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
        if (key !== 'accessToken') { headers[key] = value }
      }
    }

    return headers
  }

  const api_url = process.env.REACT_APP_API_URL;
  const admin_api_url = process.env.REACT_APP_API_URL+'admin/';
  const [accessToken, setAccessToken] = useState()

  const shoptopusApiContext = React.useMemo(
    () => ({
      callLoginApi: async (params) => await post(api_url + "login", params, makeHeaders()),
      callMeApi: async (token) => await post(api_url + "me", {}, makeHeaders({
          accessToken: token
        })),
      fetchProducts: async (params) => await get(admin_api_url + "products", params, makeHeaders()),
      fetchProductInformation: async (id) => await get(admin_api_url + "product/"+id, {}, makeHeaders()),
      getProductsPageSummary: async () => await get(admin_api_url + "products/summary", {}, makeHeaders()),
      getAppMetaInformation: async () => await get(api_url + "meta", {}, makeHeaders()),

      // Product variants
      deleteProductVariant: async (productId, variantId) => await del(admin_api_url + 'product/' + productId + '/variant/' + variantId, {}, makeHeaders()),
      setAccessToken
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
