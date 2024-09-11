import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"


type NoteDetailProps = {
    note: Note
}

/*

            {canDelete && (
                <button
                    type="button"
                    className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
                    onClick={() => mutate({projectId, taskId, noteId: note._id})}  Donde se pasa la informacion del projectId, taskId y noteId
                >Eliminar</button>
            )}

*/


export default function NoteDetail({ note }: NoteDetailProps) {

    const { data, isLoading } = useAuth()

    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])

    const params = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    
    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})  // Aqui va a actualizar la informacion de la lista de notas
        }
    })

    if (isLoading) return 'Cargando...'

    return (
        <div className="p-3 flex justify-between items-center">
            <div>
                <p>
                    {note.content} por: <span className="font-bold">{note.createdBy.name}</span>
                </p>
                <p className="text-xs text-slate-500">
                    {formatDate(note.createdAt)}
                </p>
            </div>

            {canDelete && (
                <button
                    type="button"
                    className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
                    onClick={() => mutate({projectId, taskId, noteId: note._id})}
                >Eliminar</button>
            )}
        </div>
    )
}
