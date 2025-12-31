import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { RouterProvider } from "react-router-dom";
import router from './routes';

const fonts = {
    'geist': "'Geist', sans-serif",
}

const theme = extendTheme({ fonts })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
  </React.StrictMode>,
)
