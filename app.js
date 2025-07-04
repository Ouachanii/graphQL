import { saveToken, getToken, clearToken } from './auth.js';
import { fetchGraphQL } from './graphql.js';
import { createRatioGraph } from './svg-graphs.js';

// Login logic
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = '';
        // Real authentication: get token from GraphQL API
        try {
            // Try Basic Auth header for login
            const basicAuth = btoa(username + ':' + password);
            const res = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + basicAuth
                },
                body: JSON.stringify({ login: username, password })
            });
            let data;
            try {
                data = await res.json();
            } catch (jsonErr) {
                data = null;
            }
            if (!res.ok) {
                console.error('Login failed:', res.status, data);
                errorDiv.textContent = 'Login failed: ' + (data && data.error ? data.error : res.statusText);
                return;
            }
            if (data) {
                saveToken(data);
                window.location.href = 'index.html';
            } else {
                errorDiv.textContent = 'Login failed: No token received.';
            }
        } catch (err) {
            errorDiv.textContent = 'Login failed: ' + err.message;
        }
    });
}

// Dashboard logic
if (window.location.pathname.endsWith('index.html')) {
    if (!getToken()) {
        window.location.href = 'login.html';
    }
    let logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            clearToken();
            window.location.href = 'login.html';
        };
    }
    async function fetchProfile() {
        const query = `
        query {
            
            user {
                id
                login
                campus
                
                attrs
                totalUp
                totalDown
                transactions ( where: {eventId: {_eq: 41}}, order_by: {createdAt:asc}){
                amount
                type
                createdAt
                }
            }
            transaction{
                id
                type
                amount 	
                objectId 	
                userId 	
                createdAt 	
                path
            }
        }`;
        const token = getToken();
        if (!token) {
            console.error('No token found, redirecting to login.');
            window.location.href = 'login.html';
            return;
        }
        console.log('Fetching profile with token:', token); // Debug log
        const data = await fetchGraphQL(token, query);
        console.log('GraphQL response:', data); // Debug log
        if (!data || !data.user) {
            let userStats = document.getElementById('user-stats');
            if (userStats) {
                userStats.innerHTML = '<p style="color:red">Failed to load user data.</p>';
            }
            return;
        }
        console.log('User data:', data.user[0]);
        console.log('User transactions:', data.transaction);
        let userInfo = document.getElementById('user-info');
        let userProgress = document.getElementById('user-progress');
        if (userInfo) {
            userInfo.innerHTML = `
                <h2>User Informations</h2>
                <p><strong>Login:</strong> ${data.user[0].login}</p>                
                <p><strong>FullName:</strong> ${data.user[0].attrs.firstName + ' ' + data.user[0].attrs.lastName}</p>
                <p><strong>Gender:</strong> ${data.user[0].attrs.gender}</p>

                <p><strong>Campus:</strong> ${data.user[0].campus}</p>                                
                <p><strong>Email:</strong> ${data.user[0].attrs.email}</p>
                <p><strong>Phone number:</strong> ${data.user[0].attrs.tel}</p>

            `;
        }
        let auditRatio = data.user[0].totalUp / data.user[0].totalDown;
        let transactions = data.user[0].transactions || [];
        let level = 0;
        let xp = 0;

        for (let i = transactions.length - 1; i >= 0; i--) {
            if (transactions[i].type === 'level') {
                level = transactions[i].amount;
                break;
            }
        }
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].type === 'xp') {
                xp += parseInt(transactions[i].amount);
            }
        }
        if (userProgress) {
            userProgress.innerHTML = `
                <h2>User Progress</h2>
                <p><strong>Level:</strong> ${level}</p>
                <p><strong>Total XP:</strong> ${xp}</p>
                <p><strong>Transactions:</strong> ${data.user[0].login}</p>
                <p><strong>Audit ratio:</strong> ${auditRatio.toFixed(2) || 0}</p>
                <p><strong>Total Up:</strong> ${data.user[0].totalUp}</p>
                <p><strong>Total Down:</strong> ${data.user[0].totalDown}</p>
            `;
        }
     
        createRatioGraph(data.user[0].totalUp * 100, data.user[0].totalDown * 100);
    }
    fetchProfile();
}
