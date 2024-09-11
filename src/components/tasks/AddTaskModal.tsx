import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import TaskForm from './TaskForm';
import { useForm } from 'react-hook-form'
import { TaskFormData } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '@/api/TaskAPI';
import { toast } from 'react-toastify';


export default function AddTaskModal() {

/*

 <Transition appear show={true} as={Fragment}>  Con show={true} se ve la modal



 <Transition appear show={show} as={Fragment}> Con show se va a mostrar o no la modal
*/


/** Obtener projectId */
const params = useParams()  // Recuperar informacion de la url
const projectId = params.projectId!

const navigate = useNavigate()


const location = useLocation()  // Con esto se puede ver las opciones del parametro que se esta pasando
console.log(location) // Eszte imprime todas las opciones que se le estan pasando y se puede validar cual se va a tomaR
console.log(location.search)

const queryParams = new URLSearchParams(location.search)
console.log(queryParams)
const modalTask = queryParams.get('newTask') // Para obtener la informacion del parametro newTask
const show = modalTask ? true : false


const initialValues : TaskFormData = {
    name: '',
    description: ''
}


const { register, handleSubmit, reset, formState: {errors}  } = useForm({defaultValues: initialValues})


const handleCreateTask = (formData: TaskFormData) => {
    const data = {
        formData,
        projectId
    }
    mutate(data)
    console.log(formData)
}


const queryClient = useQueryClient() 



const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error) => {
        toast.error(error.message)
    },
    onSuccess: (data) => {
        console.log("Add Task!")
        queryClient.invalidateQueries({queryKey: ['project', projectId]})
        toast.success(data)
        reset()
        navigate(location.pathname, {replace: true})
    }
})


/*

navigate(location.pathname, {replace: true}   con este replace se limpia el querystring de newtask

*/
    return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true}) }>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl  my-5"
                                    >
                                        Nueva Tarea
                                    </Dialog.Title>

                                    <p className="text-xl font-bold">Llena el formulario y crea  {''}
                                        <span className="text-fuchsia-600">una tarea</span>
                                    </p>


                                    <form
                                        className='mt-10 space-y-3'
                                        onSubmit={handleSubmit(handleCreateTask)}
                                        noValidate
                                    >
                                        <TaskForm 
                                            register={register}
                                            errors={errors}
                                        />

                                        <input
                                            type="submit"
                                            className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                                            value='Guardar Tarea'
                                        />  
                                    </form>




                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}