import { FormEvent, useState } from "react"
import { createCategories } from "../../shared/api"
import { isAxiosError } from "axios"

export const CategoriesAdmin = () => {

    const [name, setName] = useState("")

    const clear = () => {
        setName('')
    }

    const save = (event: FormEvent) => {
        event.preventDefault()
        createCategories({
            name: name,
        }).then(e => {
            console.log(e);

            if (e == 201) {
                clear()
            }
        })
            .catch(e => {
                if (isAxiosError(e)) {
                    if (e.response?.status == 409) {
                        return alert('такая категория уже существует')
                    }
                }
                alert('чтото не так')
            })
    }

    return (
        <form className="mx-auto w-4/5 mt-12" onSubmit={save}>
            <div className="space-y-12">
                <div className=" pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Новая категория</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        На этой страничке можно добавить новую категорию
                    </p>

                    <div className="sm:col-span-4 mt-7">
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                            Категория
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="input"
                                    placeholder="Введите название категории"
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
