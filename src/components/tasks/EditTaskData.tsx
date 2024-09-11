import { Navigate, useLocation, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import { getTaskById } from "@/api/TaskAPI"
import EditTaskModal from "./EditTaskModal"

export default function EditTaskData() {

    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)  //Para tomar el parametro de la url
    const taskId = queryParams.get('editTask')! // Se le pone asi para que siempre sea string y tenga informacion
    console.log(taskId)


    const { data, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({projectId, taskId}),
        enabled: !!taskId  // con 2 ! se valida si es un boolean y si tiene data la variable de taskId retorna un true
    })


    console.log(data)

    if(isError) return <Navigate to={'/404'} />

    if(data) return <EditTaskModal data={data} taskId={taskId} />


}
