// database.js

// IndexedDB setup for local storage and sync management

// Open (or create) the database
const openDatabase = () => {
    const request = indexedDB.open('MyDatabase', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create an object store if it doesn’t already exist
        if (!db.objectStoreNames.contains('MyStore')) {
            db.createObjectStore('MyStore', { keyPath: 'id' });
        }
    };

    request.onsuccess = (event) => {
        console.log('Database opened successfully');
        const db = event.target.result;
        // You can start using the database here
    };

    request.onerror = (event) => {
        console.error('Database error: ', event.target.error);
    };
};

// Add data to the database
const addData = (data) => {
    const request = indexedDB.open('MyDatabase', 1);

    request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['MyStore'], 'readwrite');
        const store = transaction.objectStore('MyStore');
        store.add(data);

        transaction.oncomplete = () => {
            console.log('Data added successfully');
        };

        transaction.onerror = (event) => {
            console.error('Transaction error: ', event.target.error);
        };
    };
};

// Example usage
openDatabase();
// addData({ id: 1, name: 'Test Data' });
