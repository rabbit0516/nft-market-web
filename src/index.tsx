import React from 'react';
import ReactDOM from "react-dom/client";
import { UseWalletProvider } from './use-wallet/src'
import Provider from './context';
import '@1stquad/react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './assets/animated.css';
import './assets/style.scss';
import 'react-toastify/dist/ReactToastify.css'
import 'react-tabs/style/react-tabs.css';

import App from './components/app';
import { ToastContainer } from 'react-toastify';
import config from './config.json'
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
     <UseWalletProvider
        // chainId={config.chainId}
        connectors={{
            walletconnect: {
                rpcUrl: config.rpc[0]
            }
        }}>
            <Provider>
            <App />
            <ToastContainer />
        </Provider>
    </UseWalletProvider>
)

