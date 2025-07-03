import { saveToken, getToken, clearToken } from './auth.js';
import { fetchGraphQL } from './graphql.js';

// Login logic
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async function(e) {
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
        const query = `{
            user {
                id
                login
                email
                xp
                grade
            }
        }`;
        const token = getToken();
        const data = await fetchGraphQL(token, query);
        let userInfo = document.getElementById('user-info');
        if (userInfo && data && data.user) {
            userInfo.innerHTML = `
                <p><strong>Login:</strong> ${data.user.login}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
                <p><strong>XP:</strong> ${data.user.xp}</p>
                <p><strong>Grade:</strong> ${data.user.grade}</p>
            `;
        }
    }
    fetchProfile();
}
