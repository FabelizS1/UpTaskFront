//import { DndContext, DragEndEvent } from '@dnd-kit/core'
//import {Task} from "@/types/index"
/*import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"*/
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { Project, TaskProject, TaskStatus } from "@/types/index"
import TaskCard from "./TaskCard"
import { statusTranslations } from "@/locales/es"
import DropTask from "./DropTask"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStatus } from '@/api/TaskAPI'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'


type TaskListProps = {
    tasks: TaskProject[], //Task[]
    canEdit: boolean
}

export default function TaskList({ tasks, canEdit }: TaskListProps) {

  console.log("Tasks: ", tasks)

  type GroupedTasks = {
    [key: string]: TaskProject[] //Task[]
  }

  const initialStatusGroups: GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: [],
}


/*
const statusTranslations : {[key:string] : string} = {
    pending: 'Pendiente',
    onHold: 'En Espera',
    inProgress: 'En Progreso',
    underReview: 'En Revision',
    completed: 'Completado',
}
*/

const params = useParams()
const projectId = params.projectId!
const queryClient = useQueryClient()


const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
        toast.error(error.message)
    },
    onSuccess: (data) => {
        toast.success(data)
        //queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    }
})


const statusStyles : {[key:string] : string} = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500',
}


  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];

    //console.log("currentGroup: " , currentGroup)
    //console.log("acc[task.status]: " , acc[task.status])

    currentGroup = [...currentGroup, task]

    console.log("currentGroup: ", currentGroup)

    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  console.log("groupedTasks: ", groupedTasks)




  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e

    if (over && over.id) {  /// Esto se ejecuta si se suelta la tarea aqui
        const taskId = active.id.toString()  // Id de la tarea
        const status = over.id as TaskStatus // estatus
        mutate({ projectId, taskId, status })



        // Esto se hace para no esperar que se ejecute toda la mutacion para esperar colocar el valor
        //'project', projectId,   Viene de ProjectDetailsView, prevData: Project es de tipo Project
        queryClient.setQueryData(['project', projectId], (prevData: Project) => {  // setQueryData , permite agregar valores adicionales para que no espere a  que se invaliden los query, 
            const updatedTasks = prevData.tasks.map((task) => {
                if(task._id === taskId) { // Si los ids son iguales a la tarea que se esta arrastrando
                    return {
                        ...task,  // Copia de la tarea actual mas el estatus en la parte de abajo, se dejan las tareas anteriores y a la nueva solo se le actualiza el estatus
                        status    // se agrega el estatus a la tarea
                    }
                }
                return task
            })

            return {
                ...prevData,  // toma una copia de las tareas 
                tasks: updatedTasks  // Toma la tarea actualizada
            }
        })
    }
}

/*

        {Object.entries(groupedTasks).map(([status, tasks]) => (  donde status es el key y tasks el task de la iteracion
            <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                <ul className='mt-5 space-y-5'>
                    {tasks.length === 0 ? (
                        <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                    ) : (
                        tasks.map(task => <TaskCard key={task._id} task={task} />)
                    )}
                </ul>
            </div>
        ))}

*/


  return (
    <>
    <h2 className="text-5xl font-black my-10">Tareas</h2>

    <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
    <DndContext  onDragEnd={handleDragEnd} >


        {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>

                <h3 
                className={`capitalize text-xl font-light border border-slate-300 bg-white border-t-8 p-3 ${statusStyles[status]}  `}>
                    {statusTranslations[status]}</h3>

                    <DropTask status={status} />

                <ul className='mt-5 space-y-5'>
                    {tasks.length === 0 ? (
                        <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                    ) : (
                        tasks.map(task => <TaskCard key={task._id} task={task} canEdit={canEdit}/>)
                    )}
                </ul>
            </div>
        ))}
        </DndContext>
    </div>
    </>
  )
}
