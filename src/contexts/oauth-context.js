import {createContext, useContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import {authApi} from '../api/auth';
import {APIContext} from "./api-context";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  accessToken: null
};

const handlers = {
  SET_ACCESS_TOKEN: (state, action) => {
    const {accessToken} = action.payload;

    return {
      ...state,
      accessToken
    }
  },
  INITIALIZE: (state, action) => {
    const {isAuthenticated, user} = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const {user} = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const {user} = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

export const AuthContext = createContext({
  ...initialState,
  method: 'oAuth',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const {children} = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const {callLoginApi, callMeApi, setAccessToken} = useContext(APIContext)

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          dispatch({
            type: 'SET_ACCESS_TOKEN',
            payload: {
              accessToken
            }
          });

          setAccessToken(accessToken)
          const user = await callMeApi(accessToken);

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: user.data.data
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await callLoginApi({email, password})

    if (response.data) {
      const accessToken = response.data?.data?.auth?.token;
      if (accessToken) {
        const user = response.data.data.auth.user;
        localStorage.setItem('accessToken', accessToken);
        setAccessToken(accessToken)
        dispatch({
          type: 'LOGIN',
          payload: {
            user,
            accessToken
          }
        });
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem('accessToken');
    dispatch({type: 'LOGOUT'});
  };

  const register = async (email, name, password) => {
    const accessToken = await authApi.register({email, name, password});
    const user = await authApi.me(accessToken);

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'oAuth',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
