import { NavLink, Outlet } from "react-router-dom"
import { classNames } from "../../shared/utils"

export const Admin = () => {
    return (
        <div className="grid grid-cols-navbar gap-8 min-h-svh">
            <div className="flex flex-col gap-4 bg-gray-800 p-6">
                <NavLink className={({ isActive }) => classNames(
                    isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium'
                )} to={'/admin/news'}>
                    Новости
                </NavLink>
                <NavLink className={({ isActive }) => classNames(
                    isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium'
                )} to={'/admin/categories'}>
                    Категории
                </NavLink>
                <NavLink className={({ isActive }) => classNames(
                    isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium'
                )} to={'/admin/services'}>
                    Услуги
                </NavLink>
                <NavLink className={({ isActive }) => classNames(
                    isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'rounded-md px-3 py-2 text-sm font-medium'
                )} to={'/admin/orders'}>
                    Заказы
                </NavLink>
            </div>
            <Outlet />
        </div>
    )
}
