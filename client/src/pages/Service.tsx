import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { $api, baseURL } from '../shared/api'
import SendService from '../shared/ui/SendService'

export const Service = () => {

    const { id } = useParams()

    const [service, setService] = useState<{
        "id": number,
        "title": number,
        "description": number,
        "category_id": number,
        "price": number,
        "image": string
    }>()

    useEffect(() => {
        $api.get<{
            "id": number,
            "title": number,
            "description": number,
            "category_id": number,
            "price": number,
            "image": string
    }>('/services/' + id).then(e => {
            setService(e.data)
        })
    }, [])

    if (!id) {
        return <></>
    }

    return (
        <>
            <div className='grid grid-cols-2 max-w-7xl mx-auto gap-8 mt-12'>
                <img className='bg-slate-50 rounded-2xl w-full' src={`${baseURL}/avatars/${service?.image}`} alt="" />
                <div className='flex flex-col'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-3xl font-bold'>{service?.title}</h1>
                        <p className='text-xl italic'>{service?.price} RUB</p>
                    </div>
                    <p className='mt-8'>{service?.description}</p>
                </div>
            </div>
            <SendService service_id={id} />
        </>
    )
}
