import { 
    db, getDocs, collection, query, where 
} from './firebase.js';

document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === "March") {
        document.getElementById('adminLoginForm').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        
        // Set today's date as default
        const today = new Date();
        document.getElementById('adminDate').value = today.toISOString().split('T')[0];
    } else {
        alert('Incorrect password');
    }
});

document.getElementById('loadLogBtn').addEventListener('click', async () => {
    const store = document.getElementById('storeSelect').value;
    const date = document.getElementById('adminDate').value;
    
    const docRef = doc(db, "dailyLogs", `${store}_${date}`);
    const docSnap = await getDoc(docRef);
    
    const resultsDiv = document.getElementById('logResults');
    resultsDiv.innerHTML = '';
    
    if (docSnap.exists()) {
        const data = docSnap.data();
        
        for (const station in data) {
            if (station === 'timestamp') continue;
            
            const stationDiv = document.createElement('div');
            stationDiv.className = 'admin-station';
            stationDiv.innerHTML = `<h3>${station}</h3>`;
            
            const photosDiv = document.createElement('div');
            photosDiv.className = 'admin-photos';
            
            for (let i = 1; i <= 4; i++) {
                const photoKey = `photo${i}`;
                if (data[station][photoKey]) {
                    const img = document.createElement('img');
                    img.src = data[station][photoKey];
                    img.alt = `${station} photo ${i}`;
                    photosDiv.appendChild(img);
                }
            }
            
            stationDiv.appendChild(photosDiv);
            resultsDiv.appendChild(stationDiv);
        }
    } else {
        resultsDiv.innerHTML = '<p>No log found for this date.</p>';
    }
});