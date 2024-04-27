import { PhotoIcon } from '@heroicons/react/24/solid'
import { FormEvent, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { updateProfileThunk, uploadAvatarThunk } from '../redux/slices/authSlice'
import { OrdersList } from '../components/OrdersList'

export const Profile = () => {

    const { email: stateEmail, lastname: stateLastname, name: stateName } = useAppSelector(state => state.auth)
    const [avatar, setAvatar] = useState<File | undefined | null>(undefined)
    const [name, setName] = useState(stateName)
    const [lastname, setLastname] = useState(stateLastname)
    const [email, setEmail] = useState(stateEmail)
    const dispatch = useAppDispatch()


    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (avatar) {
            dispatch(uploadAvatarThunk(avatar))
        }
        dispatch(updateProfileThunk({
            name,
            email,
            lastname
        }))
    }

    return (
        <>
            <form className='w-4/5 mx-auto my-14' onSubmit={onSubmit}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Профиль</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Не волнуйтесь! Эта информация будет видна только нашим менеджерам.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-full">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Аваратка
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input onChange={e => {
                                                    setAvatar(e.target.files?.[0])
                                                }} id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                        <p>{avatar?.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Персолнальные данные</h2>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Имя
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value)
                                        }}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Фамилия
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        value={lastname}
                                        onChange={(e) => {
                                            setLastname(e.target.value)
                                        }}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                        }}
                                        className="input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
            <OrdersList />
        </>
    )
}
