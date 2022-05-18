import axios from 'axios'
axios.defaults.withCredentials = true


export async function onRegistration(registrationData) {
    return await axios.post(
        'http://localhost:3001/api/register',
        registrationData
    )
}

export async function onLogin(loginData) {
    return await axios.post('http://localhost:3001/api/login', loginData)
}

export async function onLogout() {
    return await axios.get('http://localhost:3001/api/logout')
}

export async function fetchProtectedInfo() {
    return await axios.get('http://localhost:3001/api/protected')
}