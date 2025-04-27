import { 
    auth, signInWithCustomToken, onAuthStateChanged, signOut 
} from './firebase.js';

const storeCodes = {
    "HeadHouse": "0101",
    "Mobile": "0000",
    "D": "1010",
    "Baggage": "1111",
    "Departures": "1110",
    "Connector": "0001"
};

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const storeSelect = document.getElementById('store');
    const codeInput = document.getElementById('code');
    const rememberMe = document.getElementById('rememberMe').checked;
    
    const storeName = storeSelect.value;
    const enteredCode = codeInput.value;
    
    if (storeCodes[storeName] === enteredCode) {
        // For simplicity, we'll use the store name as both UID and custom token
        // In a real app, you'd generate a proper custom token on your server
        const customToken = storeName;
        
        try {
            const userCredential = await signInWithCustomToken(auth, customToken);
            
            if (rememberMe) {
                localStorage.setItem('rememberedStore', storeName);
            } else {
                localStorage.removeItem('rememberedStore');
            }
            
            window.location.href = 'log.html';
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    } else {
        alert('Invalid code for the selected store.');
    }
});

// Check for remembered store on page load
window.addEventListener('DOMContentLoaded', () => {
    const rememberedStore = localStorage.getItem('rememberedStore');
    if (rememberedStore) {
        document.getElementById('store').value = rememberedStore;
        document.getElementById('rememberMe').checked = true;
    }
});

// Handle admin login link
document.querySelector('.admin-link a').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'admin.html';
});