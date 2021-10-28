import React, {useCallback, useContext, useMemo} from 'react'
import {AuthContext} from "../contexts/oauth-context";

const useApi = () => {
  const {user, isAuthenticated, logout} = useContext(AuthContext)
  const token = isAuthenticated && user.access_token ? user.access_token : null

  const call = useCallback(async (method = 'GET', url, rawParams, tokenRequired = true) => {

    const Utf8ArrayToStr = (array) => {
      let out, i, len, c;
      let char2, char3;

      out = "";
      len = array.length;
      i = 0;
      while(i < len) {
        c = array[i++];
        switch(c >> 4)
        {
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
          case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
          case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(((c & 0x0F) << 12) |
              ((char2 & 0x3F) << 6) |
              ((char3 & 0x3F) << 0));
            break;
          default:
        }
      }

      return out;
    }

    const asyncPost = async (url, params) => {
      const formData  = new FormData();
      Object.keys(params).forEach((param) => {
        if (params[param] !== undefined && params[param] !== null) {
          if (typeof params[param] == 'string') {
            formData.append(param, params[param]);
          } else if(typeof params[param] == 'object' && param !== 'file' && param !== 'avatar' && param !== 'files' && param !== 'image' && param !== 'url') {
            formData.append(param, JSON.stringify(params[param]));
          } else if(param === 'files') {
            for (const file of params[param]) {
              formData.append("files[]", file);
            }
          } else {
            formData.append(param, params[param]);
          }
        }
      });

      let options = {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      }
      if (token) {
        options.headers = {...options.headers,
          'Authorization': 'Bearer '+token
        }
      }
      let response = await fetch(url, options);
      if (!response.ok) { throw response; }
      return await response.json();
    }

    const asyncGet = async (url, params) => {
      const urlObject = new URL(url);
      urlObject.search = new URLSearchParams(params).toString();
      let options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      if (token) {
        options.headers = {...options.headers,
          'Authorization': 'Bearer '+token
        }
      }
      let response = await fetch(url+urlObject.search, options);
      if (!response.ok) { throw response; }
      return await response.json();
    }

    const asyncDelete = async (url, params) => {
      let options = {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(params)
      }
      if (token) {
        options.headers = {...options.headers,
          'Authorization': 'Bearer '+token
        }
      }
      let response = await fetch(url, options);
      if (!response.ok) { throw response; }
      return await response.json();
    }

    const asyncPut = async (url, params) => {
      const formData = new FormData();
      Object.keys(params).forEach((param) => {
        if (params[param] !== undefined && params[param] !== null) {
          if (typeof params[param] == 'string') {
            formData.append(param, params[param]);
          } else if(typeof params[param] == 'object' && param !== 'file' && param !== 'avatar' && param !== 'files' && param !== 'image' && param !== 'url') {
            formData.append(param, JSON.stringify(params[param]));
          } else if(param === 'files') {
            for (const file of params[param]) {
              formData.append("files[]", file);
            }
          } else {
            formData.append(param, params[param]);
          }
        }
      });

      let options = {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      }
      if (token) {
        options.headers = {...options.headers,
          'Authorization': 'Bearer '+token
        }
      }
      let response = await fetch(url, options);
      if (!response.ok) { throw response; }
      return await response.json();
    }

    const params = Object.keys(rawParams)
      .filter(key => key !== 'token')
      .reduce((obj, key) => {
        obj[key] = rawParams[key];
        return obj;
      }, {});
    if (!token) {
      if (tokenRequired) {
        // history.push('/admin/login')
        return {
          error: 'Unauthenticated'
        };
      }
    }

    switch (method) {
      case "GET":
        return await asyncGet(url, params).then(data => {
          return data;
        }).catch(e => {
          if (e.status === 401) {
            logout()
          }
          return({
            error: 'Server error',
            info: e
          });
        });
      case "POST":
        return await asyncPost(url, params).then(data => {
          return data;
        }).catch(async e => {
          if (e.status === 401) {
            await logout()
          }
          if (await e.body) {
            const body = await e.body.getReader().read().then(({ value }) => {
              return Utf8ArrayToStr(value);
            });
            if (await body) {
              const info = JSON.parse(await body)
              return({
                error: 'Serverside validation error',
                info: info
              });
            } else {
              return({
                error: 'Server error',
              });
            }
          } else {
            return({
              error: 'Server error',
            });
          }
        });
      case "PUT":
        return await asyncPut(url, params).then(data => {
          return data;
        }).catch(e => {
          if (e.status === 401) {
            logout()
          }
          return({
            error: 'Server error',
            info: e
          });
        });
      case "DELETE":
        return await asyncDelete(url, params).then(data => {
          return data;
        }).catch(e => {
          if (e.status === 401) {
            logout()
          }
          return({
            error: 'Server error',
            info: e
          });
        });
      default:
        return await asyncGet(url, params).then(data => {
          return data;
        }).catch(e => {
          return({
            error: 'Server error',
            info: e
          });
        });
    }
  }, [isAuthenticated, token])

  const api_url = process.env.REACT_APP_API_URL;

  return useMemo(() => ({
    callLoginApi: async (params) => call('POST', api_url + 'login', params, false),
  }), [api_url, call])
}

export default useApi
