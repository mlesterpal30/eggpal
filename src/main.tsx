import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

const fonts = {
    'geist': "'Geist', sans-serif",
}

const theme = extendTheme({ fonts })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ChakraProvider theme={theme }>
            <App />
        </ChakraProvider>
  </React.StrictMode>,
)
