import { 
    auth, db, storage, onAuthStateChanged, signOut,
    doc, setDoc, getDoc, Timestamp,
    ref, uploadBytes, getDownloadURL
} from './firebase.js';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('logDate').value = dateStr;
    
    // Check auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('storeName').textContent = `${user.uid} - Daily Log`;
            loadLogData(user.uid, dateStr);
        } else {
            window.location.href = 'index.html';
        }
    });
    
    // Setup event listeners
    document.getElementById('changeDateBtn').addEventListener('click', () => {
        const newDate = document.getElementById('logDate').value;
        onAuthStateChanged(auth, (user) => {
            if (user) {
                loadLogData(user.uid, newDate);
            }
        });
    });
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'index.html';
        });
    });
    
    // Setup photo upload buttons
    document.querySelectorAll('.upload-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling.previousElementSibling;
            const file = input.files[0];
            
            if (file) {
                const station = input.dataset.station;
                const index = input.dataset.index;
                
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const date = document.getElementById('logDate').value;
                        await uploadPhoto(user.uid, date, station, index, file);
                        loadLogData(user.uid, date);
                    }
                });
            }
        });
    });
});

async function loadLogData(storeId, date) {
    const docRef = doc(db, "dailyLogs", `${storeId}_${date}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Update photo previews for each station
        for (const station in data) {
            for (let i = 1; i <= 4; i++) {
                const photoKey = `photo${i}`;
                if (data[station][photoKey]) {
                    const img = document.querySelector(`.photo-input[data-station="${station}"][data-index="${i}"]`).nextElementSibling;
                    img.src = data[station][photoKey];
                }
            }
        }
    }
}

async function uploadPhoto(storeId, date, station, index, file) {
    try {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `dailyLogs/${storeId}/${date}/${station}_${index}`);
        await uploadBytes(storageRef, file);
        
        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        // Update Firestore
        const docRef = doc(db, "dailyLogs", `${storeId}_${date}`);
        const docSnap = await getDoc(docRef);
        
        const logData = docSnap.exists() ? docSnap.data() : {};
        if (!logData[station]) {
            logData[station] = {};
        }
        
        logData[station][`photo${index}`] = downloadURL;
        logData.timestamp = Timestamp.now();
        
        await setDoc(docRef, logData);
        
        console.log('Photo uploaded successfully');
    } catch (error) {
        console.error('Error uploading photo:', error);
    }
}