import 'simplebar/dist/simplebar.min.css';
import 'nprogress/nprogress.css';
import {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {Toaster} from 'react-hot-toast';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import {AuthProvider} from './contexts/oauth-context';
import {APIProvider} from "./contexts/api-context";
import {SettingsProvider} from './contexts/settings-context';
import {App} from './app';

ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <APIProvider>
            <AuthProvider>
              <SettingsProvider>
                <App/>
                <Toaster position="bottom-right"/>
              </SettingsProvider>
            </AuthProvider>
          </APIProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>, document.getElementById('root')
);
