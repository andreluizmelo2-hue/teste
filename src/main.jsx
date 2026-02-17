import React from 'react';
import { SyncProvider } from 'some-sync-library';  // Adjust the import as necessary
import App from './App';

const Main = () => (
    <SyncProvider>
        <App />
    </SyncProvider>
);

export default Main;