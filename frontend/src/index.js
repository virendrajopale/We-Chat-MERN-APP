import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import Chatprovider from './Context/Chatprovider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <Chatprovider>
          <App />
        </Chatprovider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
