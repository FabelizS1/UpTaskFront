import api from "@/lib/axios";
import { Project, ProjectFormData, dashboardProjectSchema, editProjectSchema, projectSchema } from "../types";
import { isAxiosError } from "axios";


export async function createProject(formData: ProjectFormData) {
    try {
        
        console.log("URL: " + `${import.meta.env.VITE_API_URL}`)
        console.log("URL CON API PRODUCT: " + `${import.meta.env.VITE_API_URL}/api/projects}`)

        const { data } = await api.post('/projects', formData)  // api/ no se le coloca porque ya lo tiene el axios de la variable de entorno
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) { // Con esto se valida si hubo un error isAxiosError, y si hay un error en response
            throw new Error(error.response.data.error) // Este es el valor del error.response.data.error
        }
    }
}

export async function getProjects() {
    const token = localStorage.getItem('AUTH_TOKEN')

    console.log("Entro al metodo!")
    try {
        console.log("Antes DATA Response:")

        /*const { data } = await api('/projects', {   /// Aqui se usa este interseptor    api.interceptors.request.use  que esta en Axios por eso se elimina este
            headers: {
                Authorization : `Bearer ${token} `
            }
        })*/


        const { data } = await api('/projects')
        const response = dashboardProjectSchema.safeParse(data)

        console.log("DATA Response:" + response)

        if(response.success) {
            return response.data  // Esta es la data
        }
    } catch (error) {
        console.log("ERROR en la API")

        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}



export async function getProjectById(id: Project['_id']) {  // Aqui es que tiene que ser de tipo Project y tomar el _id
    try {
        const { data } = await api(`/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if(response.success) {
            console.log("data2:" + response.data)
            return response.data
        }
       //return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getFullProject(id: Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

type ProjectAPIType = {
    formData: ProjectFormData
    projectId: Project['_id']
}

export async function updateProject({formData, projectId} : ProjectAPIType ) {
    try {
        console.log("updateProject")
        const { data } = await api.put<string>(`/projects/${projectId}`, formData)  // Indica que la respuesta es un string
        console.log("updateProject 2")
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteProject(id: Project['_id']) {
    try {
        const url = `/projects/${id}`
        const { data } = await api.delete<string>(url)  // Para eliminar
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}