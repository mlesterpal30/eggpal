import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

interface UseNotificationHubOptions {
    onNotificationReceived?: (message: string, type: string) => void;
}

// Helper function: Create connection
const createConnection = (hubUrl: string): signalR.HubConnection => {
    return new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
            transport: signalR.HttpTransportType.ServerSentEvents,
            withCredentials: false,
        })
        .withAutomaticReconnect()
        .build();
};

// Helper function: Setup event listeners
const setupListeners = (connection: signalR.HubConnection, options: UseNotificationHubOptions) => {
    // Listen for harvest notifications
    connection.on('ReceiveNotification', (message: string, type: string) => {
        if (options.onNotificationReceived) {
            options.onNotificationReceived(message, type);
        }
    });
};

// Helper function: Start connection
const startConnection = (connection: signalR.HubConnection, isConnectingRef: React.MutableRefObject<boolean>) => {
    connection.start()
        .then(() => {
            isConnectingRef.current = false;
            console.log('NotificationHub: Connected');
        })
        .catch((error) => {
            isConnectingRef.current = false;
            console.error('NotificationHub: Connection failed', error);
        });
};

export const useNotificationHub = (options: UseNotificationHubOptions = {}) => {
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const isConnectingRef = useRef<boolean>(false);

    useEffect(() => {
        // Prevent duplicate connections (especially in React StrictMode)
        if (isConnectingRef.current || connectionRef.current) {
            return;
        }

        // Get base URL
        const apiBaseURL = 'http://localhost:5023/api';
        const baseURL = apiBaseURL.replace('/api', '');
        const hubUrl = `${baseURL}/notificationHub`;

        // 1. Create connection
        const connection = createConnection(hubUrl);

        // 2. Set up listeners
        setupListeners(connection, options);

        // 3. Start connection
        startConnection(connection, isConnectingRef);

        // Store connection
        connectionRef.current = connection;
        isConnectingRef.current = true;

        // Cleanup: Stop connection when component unmounts
        return () => {
            isConnectingRef.current = false;
            if (connectionRef.current) {
                connectionRef.current.stop()
                    .then(() => {
                        console.log('NotificationHub: Disconnected');
                    })
                    .catch((error) => {
                        console.error('NotificationHub: Error stopping', error);
                    });
            }
        };
    }, []); // Run once on mount

    return {
        connection: connectionRef.current,
    };
};
