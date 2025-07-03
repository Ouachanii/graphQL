// Handles GraphQL queries using fetch

export async function fetchGraphQL(token, query) {
    try {
        const response = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });
        if (!response.ok) {
            throw new Error(`HTTP error status ${response.status}`);
        }
        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error("GraphQL query failed:", error);
        return null;
    }
}
