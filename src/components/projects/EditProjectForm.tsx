import ProjectForm from './ProjectForm'
import { Link, useNavigate } from 'react-router-dom'
import { Project, ProjectFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query' // useQueryClient puede ejecutar la que reinicia o invalida los datos previos
import { updateProject } from '@/api/ProjectAPI'
import { toast } from 'react-toastify'


type EditProjectFormProps = {
    data: ProjectFormData
    projectId: string//Project['_id']
}


export default function EditProjectForm({data, projectId} : EditProjectFormProps) {

    
    
console.log("*data: ")
console.log(data)

    const navigate = useNavigate()
 
    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: 
    {
        projectName: data.projectName,    // Asi se muestra la informacion de los clientes
        clientName: data.clientName,
        description: data.description
    }})

    
    /*const initialValues : ProjectFormData = 
    {
        projectName: data.projectName,    // Asi se muestra la informacion de los clientes
        clientName: data.clientName,
        description: data.description
    }*/

    /*const initialValues : ProjectFormData = { 
        projectName: "",
        clientName: "",
        description: ""
    }*/
    

    //const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})


    const queryClient = useQueryClient() // Esto invalida los queries esto elimina la informacion de cache y otras consultas
    
    const { mutate } = useMutation({
        mutationFn: updateProject,  // Funcion de la mutacion
        onError: (error) => {    // En caso de error
           toast.error(error.message)
        },
        onSuccess: (data) => { // En caso de exitoso
            queryClient.invalidateQueries({queryKey: ['projects']}) // Este el de la pagina del dashboard
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]}) // Este el del editar
            toast.success(data)
            navigate('/')  // Esto se hace con el hook de navigate
        }
    })


    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,  // Solo se le puede pasar una variable al mutate por eso se le pasa el formData y el projectId
            projectId
        }
        mutate(data)

        //console.log("formData:" + formData)
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>

                <nav className="my-5 ">
                    <Link
                        className=" bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to='/'
                    >Volver a Proyectos</Link>
                </nav>

                <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >

                    <ProjectForm 
                        register={register}
                        errors={errors}
                    />
                    
                    <input
                        type="submit"
                        value='Guardar Cambios'
                        className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />  
                </form>
            </div>
        </>
    )
}
