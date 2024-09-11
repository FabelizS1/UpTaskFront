import { useDroppable } from '@dnd-kit/core'

type DropTaskProps = {
    status: string
}

export default function DropTask({status} : DropTaskProps) {

    const { isOver, setNodeRef } = useDroppable({  // Con setNodeRef se va a decir donde se va a poner la funcionalidad para pasar el elemento
        id: status
    })

    const style = {
        opacity: isOver ? 0.4 : undefined
    }

/*

Esta es la area donde se va a arrastrar la tarea

*/

    return (
        <div
            style={style}
            ref={setNodeRef}
            className="text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500"
        >
            Soltar tarea aquí
        </div>
    )
}
