import { useQuery} from '@tanstack/react-query'
import { getUser } from "@/api/AuthAPI";

export const useAuth = () => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 1, //Prueba 1 vez
        refetchOnWindowFocus: false // Cuando se cambia de pestaña en el navegador y se vuelve a la pestaña de la aplicacion no hacer reload por eso esta en false
    })

    return { data, isError, isLoading }
}