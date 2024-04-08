import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import App from "../App";
import { useAppSelector } from "../redux/hooks";
import { Login } from "../pages/Login/Login";
import { Register } from "../pages/Login/Register";
import { NewsAdmin } from "../pages/admin/News/NewsAdmin";
import { News } from "../pages/News";
import { Profile } from "../pages/Profile";
import { Admin } from "../pages/admin/Admin";
import { CategoriesAdmin } from "../pages/admin/CategoriesAdmin";
import { Services } from "../pages/Services";
import { ServicesAdmin } from "../pages/admin/ServicesAdmin";
import { Service } from "../pages/Service";


const authRouter = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/login',
                element: <Navigate to={'/'} />
            },
            {
                path: '/register',
                element: <Navigate to={'/'} />
            },
            {
                path: '/reg',
                element: <Navigate to={'/'} />
            },
            {
                path: '/news',
                element: <News />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            {
                path: '/services',
                element: <Services />
            },
            {
                path: '/service/:id',
                element: <Service />
            },
            {
                path: '/admin',
                element: <Admin />,
                children: [
                    {
                        path: '/admin/news',
                        element: <NewsAdmin />
                    },
                    {
                        path: '/admin/categories',
                        element: <CategoriesAdmin />
                    },
                    {
                        path: '/admin/services',
                        element: <ServicesAdmin />
                    },
                ]
            },
            {
                path: '*',
                element: <Navigate to={'/'} />
            }
        ]
    },
])

const nonAuthRouter = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <Navigate to={'/'} />,
        children: [
            {
                path: '/login',
                element: <Login />,
                errorElement: '404'
            },
            {
                path: '/register',
                element: <Register />,
                errorElement: '404'
            },
            {
                path: '/news',
                element: <News />
            },
            {
                path: '/services',
                element: <Services />
            },
            {
                path: '/service/:id',
                element: <Service />
            },
            {
                path: '*',
                element: <Navigate to={'/'} />
            }
        ]
    },
])

const adminRouter = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/login',
                element: <Navigate to={'/'} />
            },
            {
                path: '/register',
                element: <Navigate to={'/'} />
            },
            {
                path: '/news',
                element: <News />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            {
                path: '/services',
                element: <Services />
            },
            {
                path: '/service/:id',
                element: <Service />
            },
            {
                path: '/admin',
                element: <Admin />,
                children: [
                    {
                        path: '/admin/news',
                        element: <NewsAdmin />
                    },
                    {
                        path: '/admin/categories',
                        element: <CategoriesAdmin />
                    },
                    {
                        path: '/admin/services',
                        element: <ServicesAdmin />
                    },
                ]
            },
            {
                path: '*',
                element: <Navigate to={'/'} />
            }
        ]
    },
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