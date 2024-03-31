import React, { useEffect, useState } from 'react'
import { Category, Service, getCategories, getServices } from '../shared/api'
import DropDown from '../shared/ui/DropDown'

export const Services = () => {

    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined)

    const [services, setServices] = useState<Service[]>([])

    useEffect(() => {
        getCategories().then(e => {
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
        <div className='flex items-end flex-col'>
            <DropDown value={selectedCategory} elements={categories.map(e => {
                return { title: e.name, value: e.id }
            })} onChange={(e) => {
                setSelectedCategory(e)
            }} />
            {
                !!services.length || 'Данных нет'
            }
            {
                !!services.length && services.map(e => <div>
                    {e.title}
                </div>)
            }
        </div>
    )
}
