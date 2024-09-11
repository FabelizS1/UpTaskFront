import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Router from './router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const queryClient = new QueryClient()  //Para agregar el React Query 

/*

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>   Para que el query sea accesible en toda la aplicacion
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>  Esta es la opcion del circulito que aparece del lado derecho
  </StrictMode>,

*/

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
