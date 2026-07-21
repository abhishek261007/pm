import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

import { AppContextProvider } from './context/AppContextProvider';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <HelmetProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </HelmetProvider>
  </BrowserRouter>
);
