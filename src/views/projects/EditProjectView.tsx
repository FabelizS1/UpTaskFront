import { Navigate, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getProjectById } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"

export default function EditProjectView() {
    const params = useParams() /// Tiene los parametros
    
    const projectId = params.projectId!   // Con el ! se indica que el valor siempre va a existir
    

    // Asi es que se pasa la informacion aunque deja la informacion en el localstorage
    const { data, isLoading, isError } = useQuery({ // Aqui se le pasa la opcion de data, el isLoading si se le va a agregar un spinner o un isError
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId), // Si se va a pasar un parametro se le debe pasar un callback
        retry: false  // El default son 3 va intentando conectarse hasta que arroja el error o mensaje, tambien se puede colocar un retry: 10, si se coloca en false, intenta una vez sino envia el mensaje de error
    })

    console.log('data: ' , data)
    console.log('isLoading: ', isLoading)


    
    if(isLoading) return 'Cargando...'   /// Aqui se coloca el cargando
    if(isError) return <Navigate to='/404' /> // Este si da error
    if(data) return <EditProjectForm data={data} projectId={projectId} />

}

