import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import ProjectForm from "@/components/projects/ProjectForm"
import { useMutation } from '@tanstack/react-query'
import { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"
import { toast } from "react-toastify"


export default function CreateProjectView() {



    const navigate = useNavigate()

    // Estos son los valores del Type del Backend
    const initialValues : ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }
    // El register para los formularios
    // HandleSubmit para el submit
    // formState para los errores
    const {register, handleSubmit, formState: {errors}} = useForm({defaultValues: initialValues})


    // Asi se haria el insert con mutation
    //const mutation = useMutation({
    const {mutate} = useMutation({
        mutationFn: createProject,  // mutationFn - Esta es la funcion que se va a llamar cuando se quiera hacer la mutacion
        onError: (error) => {       /// Esto si da un error, se le pasa un valor de error
            toast.error(error.message) // El error se recupera con .message
        },
        onSuccess: (data) => {   // Aqui toma lo que esta retornando el createProject
            toast.success(data)  // Este se ejecuta si el mutationFn es correcto
            navigate('/')
        }
    })

    
    const handleForm = (formData : ProjectFormData) => mutate(formData) // Asi llama a la mutacion, aqui se llama solo a la funcion mutate y se le pasa formData

    /*const handleForm = async (formData : ProjectFormData) => { 
        await mutation.mutateAsync(formData)  // Aqui se le llama a la funcion mutation
    }*/


    //Esta es otra forma de mutate
    /*const handleForm = (formData : ProjectFormData) => { 
        await mutation.mutate(formData)  // Aqui se le llama a la funcion mutation
    }*/



    /*const handleForm = async (formData : ProjectFormData) => { asi seria sin mutation
        //console.log(data)
        const data = await createProject(formData)
        toast.success(data)
        navigate('/')
    }*/



/*

Este formulario sirve para crear y editar



        <form
                    className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate         Se coloca asi para que valide con react hook form
                >
*/


  return (
    <>
    <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Crear Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>

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
                        value='Crear Proyecto'
                        className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />  
        </form>
    </div>
    </>
  )
}
