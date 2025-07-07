export function saveJWT(jwt) {
    localStorage.setItem('jwt', jwt);
}

export function getJWT() {
    return localStorage.getItem('jwt');
}

export function clearJWT() {
    localStorage.removeItem('jwt');
}
