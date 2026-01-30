import "temporal-polyfill/global";
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './routes';
import LogoLoader from './components/LogoLoader';

const fonts = {
    'geist': "'Geist', sans-serif",
    'londrina': "'Londrina Shadow', sans-serif",
    'rubik': "'Rubik Mono One', monospace",
}

const theme = extendTheme({ fonts })

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const AppWithLoader = () => {
    const [showLoader, setShowLoader] = useState(true);

    if (showLoader) {
        return <LogoLoader onComplete={() => setShowLoader(false)} />;
    }

    return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
                <AppWithLoader />
            </ChakraProvider>
        </QueryClientProvider>
)
