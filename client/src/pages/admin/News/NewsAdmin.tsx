import { FormEvent, useState } from "react"
import { createNew } from "../../../shared/api"

export const NewsAdmin = () => {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState('')
    const [href, setHref] = useState("")

    const clear = () => {
        setTitle('')
        setDescription('')
        setCategory('')
        setHref('')
    }

    const save = (event: FormEvent) => {
        event.preventDefault()
        createNew({
            title: title,
            description: description,
            category: category,
            href: href
        }).then(e => {
            if (e == 200) {
                clear()
            } else {
                alert('чтото не так')
            }
        })
    }

    return (
        <form className="mx-auto w-4/5 mt-12" onSubmit={save}>
            <div className="space-y-12">
                <div className=" pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Новая запись</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        На этой страничке можно добавить новый пост в блоге
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                Заголовок
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        id="username"
                                        className="input"
                                        placeholder="Заголовок"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                Текст
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="about"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={''}
                                />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-600">Тут не забудьте написать новость</p>
                        </div>
                    </div>
                    <div className="flex gap-6 mt-8">
                        <div className="flex-1">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Внешняя ссылка
                            </label>
                        <div className="mt-2">
                                <input
                                    type="url"
                                    value={href}
                                    onChange={e => setHref(e.target.value)}
                                    id="first-name"
                                    className="input"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Категория
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    id="last-name"
                                    className="input"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" onClick={clear} className="text-sm font-semibold leading-6 text-gray-900">
                    Очистить
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Сохранить
                </button>
            </div>
        </form>
    )
}
