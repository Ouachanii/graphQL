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
            }
        }`;
        const token = getToken();
        const data = await fetchGraphQL(token, query);
        console.log('GraphQL response:', data); // Debug log
        if (!data || !data.user) {
            let userStats = document.getElementById('user-stats');
            if (userStats) {
                userStats.innerHTML = '<p style="color:red">Failed to load user data.</p>';
            }
            return;
        }
        let userInfo = document.getElementById('user-info');
        if (userInfo) {
            userInfo.innerHTML = `
                <p><strong>Login:</strong> ${data.user.login}</p>
                <p><strong>Email:</strong> ${data.user.email}</p>
            `;
        }
        // Render Level graph (inspired by mmihit/GraphQl)
        // Ensure the required elements exist in the DOM
        let statsSection = document.getElementById('stats');
        if (statsSection && !document.getElementById('drawing-level')) {
            // Add missing containers if not present
            const drawingDiv = document.createElement('div');
            drawingDiv.id = 'drawing-level';
            drawingDiv.style.margin = '2rem 0';
            statsSection.appendChild(drawingDiv);
            const xpTextDiv = document.createElement('div');
            xpTextDiv.id = 'xp-text';
            statsSection.appendChild(xpTextDiv);
        }
        if (document.getElementById('drawing-level') && document.getElementById('xp-text')) {
            import('./utils/svg-graphs.js').then(({ LevelHelper }) => {
                new LevelHelper(data.user.grade, data.user.xp).createGraph();
            });
        }
        // Optionally, render Audit graph if you have the data and HTML elements
        // import('./utils/svg-graphs.js').then(({ AuditHelper }) => {
        //     new AuditHelper(done, received, bonus, ratio).createGraph();
        // });
    }
    fetchProfile();
}
