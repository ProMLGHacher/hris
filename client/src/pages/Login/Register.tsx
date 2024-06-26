import { FormEvent, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { Link, useNavigate } from "react-router-dom"
import { regThunk } from "../../redux/slices/regSlice"

export const Register = () => {

    const loginState = useAppSelector(state => state.register)

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | undefined>("")
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const formSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const regPromise = dispatch(regThunk({
            username: login,
            password: password
        }))
        regPromise.then(e => {
            if (e.type == 'regThunk/rejected') {
                setError(e.payload)
            }
            if (e.type == 'regThunk/fulfilled') {
                navigate('/login')
            }
        })
    }

    // useEffect(() => {
    //     if (!loginError) return
    //     setError(loginError)
    // }, [loginError])

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Регистрация
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" onSubmit={formSubmit}>
                    <div>
                        <label htmlFor="login" className="block text-sm font-medium leading-6 text-gray-900">
                            Login
                        </label>
                        <div className="mt-2">
                            <input
                                id="login"
                                name="login"
                                type="text"
                                autoComplete="username"
                                required
                                className="input"
                                value={login}
                                onChange={(e) => {
                                    setError('')
                                    setLogin(e.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="input"
                                value={password}
                                onChange={(e) => {
                                    setError('')
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="button"
                        >
                            { loginState.loading ? "Loading..." : 'Sign in'}
                        </button>
                    </div>
                    <p className="text-red-600 text-center">{error}</p>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    )
}
