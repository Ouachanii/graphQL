export async function fetchGraphQL(jwt, query) {
    try {
        const response = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({ query: query })
        });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('jwt'); // Clear token on auth error
                window.location.href = 'login.html';
                return null;
            }
            throw new Error(`HTTP error status ${response.status}`);
        }
        const data = await response.json();
        if (!data.data) {
            // Check for GraphQL auth errors
            if (data.errors && data.errors.some(e => e.message && (e.message.includes('JWT') || e.message.includes('token') || e.message.includes('expired')))) {
                window.location.href = 'login.html';
                localStorage.removeItem('jwt'); // Clear token on auth error

                return null;
            }
            console.error('GraphQL full response error:', data);
        }
        return data.data || null;
    } catch (error) {
        console.error("GraphQL query failed:", error);
        return null;
    }
}
