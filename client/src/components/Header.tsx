import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { Link, NavLink } from 'react-router-dom'
import { logOut } from '../redux/slices/authSlice'
import { baseURL } from '../shared/api'
import { classNames } from '../shared/utils'

export default function Header() {

  const [navigation, setNavigation] = useState<{ name: string, href: string }[]>([])

  const token = useAppSelector(state => state.auth.token)
  const role = useAppSelector(state => state.auth.role)

  const avatar = useAppSelector(state => state.auth.avatar)
  console.log(avatar);


  useEffect(() => {

    if (role == 'USER') {
      setNavigation([
        { name: 'Главная', href: '/' },
        { name: 'Новости', href: '/news' },
        { name: 'Услуги', href: '/services' },
      ])
    }
    else if (role == 'ADMIN') {
      setNavigation([
        { name: 'Главная', href: '/' },
        { name: 'Новости', href: '/news' },
        { name: 'Услуги', href: '/services' },
        { name: 'Админка', href: '/admin' },
      ])
    } else {
      setNavigation([
        { name: 'Главная', href: '/' },
        { name: 'Новости', href: '/news' },
        { name: 'Услуги', href: '/services' },
        
      ])
    }
  }, [role])

  const dispatch = useAppDispatch()

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => classNames(
                          isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  {
                    token ? <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-[50%]"
                          src={avatar ? `${baseURL}/avatars/${avatar}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/1200px-Missing_avatar.svg.png"}
                          alt=""
                        />
                      </Menu.Button>
                    </div> :
                      <Link to={'/login'} ><img
                        className="h-8 w-8 rounded-full"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/1200px-Missing_avatar.svg.png"
                        alt=""
                      /></Link>
                  }
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <NavLink
                            to="/profile"
                            className={({ isActive }) => classNames(isActive || active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Профиль
                          </NavLink>
                        )}
                      </Menu.Item>
                      {
                        role == 'ADMIN' && <Menu.Item>
                          {({ active }) => (
                            <NavLink
                              to="/admin"
                              className={({ isActive }) => classNames(isActive || active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Админка
                            </NavLink>
                          )}
                        </Menu.Item>
                      }
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              dispatch(logOut())
                            }}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 w-full text-start')}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => classNames(isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </NavLink>
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}