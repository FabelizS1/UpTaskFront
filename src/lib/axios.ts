import axios from 'axios'
//import {VITE_API_URL } from "vite-env"

//console.log("URL: " + `${ VITE_API_URL }`)


console.log("URL: " + `${import.meta.env.VITE_API_URL}`)
//console.log("URL CON API PRODUCT: " + `${import.meta.env.VITE_API_URL}/api/projects}`)

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL      /// Se crea una instancia de un cliente de AXIOS y se conectan a la BD
})



api.interceptors.request.use( config => { // este tipo de interseptor request se ejecuta antes de la peticion, response se ejecuta despues de la peticion
    const token = localStorage.getItem('AUTH_TOKEN')
    if(token) {
        config.headers.Authorization = `Bearer ${token}` // Esto para la ejecucion del header de la autorizacion
    }
    return config
})

export default api