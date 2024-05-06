import { useEffect, useState } from 'react'
import { Category, Service, baseURL, getCategories, getServices } from '../shared/api'
import DropDown from '../shared/ui/DropDown'
import { Link } from 'react-router-dom'

export const Services = () => {

    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined)

    const [services, setServices] = useState<Service[]>([])

    useEffect(() => {
        getCategories().then(e => {
            console.log(e);
            
            setCategories(e)
            setSelectedCategory(e[0].id)
        })
    }, [])

    useEffect(() => {
        getServices(selectedCategory).then(e => {
            setServices(e)
        })
    }, [selectedCategory])

    return (
        <div className='w-[90%] max-w-[1444px] m-auto mt-12'>
            <div className='flex justify-end'>
                <DropDown value={selectedCategory} elements={categories.map(e => {
                    return { title: e.name, value: e.id }
                })} onChange={(e) => {
                    setSelectedCategory(e)
                }} />
            </div>
            {
                !!services.length || 'Данных нет'
            }
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {!!services.length && services.map((product) => (
                    <Link to={`/service/${product.id}`} key={product.id} className="group">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                            <img
                                src={product.image && `${baseURL}/avatars/${product.image}`}
                                className="h-full w-full object-cover object-center group-hover:opacity-75"
                            />
                        </div>
                        <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">{product.price} RUB</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
