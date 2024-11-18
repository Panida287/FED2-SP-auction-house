export async function getKey() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        console.error("Access token not found.");
        return null;  
    }
    return accessToken;
}