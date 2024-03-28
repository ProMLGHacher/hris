import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import App from "../App";
import { useAppSelector } from "../redux/hooks";
import { Login } from "../pages/Login/Login";


const authRouter = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Navigate to={'/'} />
    }
])

const nonAuthRouter = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: '404'
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: '404'
    },
    {
        path: '/reg',
        element: <App />,
        errorElement: '404'
    }
])

const adminRouter = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Navigate to={'/'} />
    }
])

const AppRouter = () => {

    const token = useAppSelector(state => state.auth.token)
    const role = useAppSelector(state => state.auth.role)
    console.log(role);
    

    if (!token) return <RouterProvider router={nonAuthRouter} />
    if (role == 'ADMIN') return <RouterProvider router={adminRouter} />
    if (role == 'USER') return <RouterProvider router={authRouter} />
}

export default AppRouter