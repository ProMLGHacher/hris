import { useEffect, useState } from 'react'
import { $api, baseURL } from '../../shared/api'

export const AdminOrdersList = () => {
    const [orders, setOrders] = useState<{
        "id": number,
        "user_id": number,
        "service_id": number,
        "order_date": Date,
        "user": { "id": number, "login": string, "name": string, "lastname": string, "email": string, "role": "ADMIN" | "USER", "avatar": string },
        "service": { "id": number, "title": string, "description": string, "category_id": number, "price": number, "image": string },
        "adress": string,
        "email": string,
        "lastname": string,
        "message": string,
        "name": string,
        "phone": string,
        "status": "pending" | "secsessful" | "rejected" | "accepted"
    }[]>([])

    useEffect(() => {
        $api.get('/orders')
            .then(e => {
                setOrders(e.data)
            })
    }, [])

    return (
        <div>
            {
                orders.map(e => <div className='flex gap-5 items-center mt-5'>
                    <img className='w-[100px] h-[100px] rounded-full' src={`${baseURL}/avatars/${e.user.avatar}`} alt="" />
                    <div>
                        <p>{e.user.name} {e.user.lastname}</p>
                        <p>{e.service.title}</p>
                        <p>{e.service.price}</p>
                        <p className={`${e.status === 'pending' ? 'text-yellow-500' : e.status === 'secsessful' ? 'text-green-500' : e.status === 'rejected' ? 'text-red-500' : 'text-blue-500'}`}>{e.status === 'pending' ? 'Ожидается' : e.status === 'secsessful' ? 'Успешно' : e.status === 'rejected' ? 'Отклонено' : 'Принято'}</p>
                    </div>
                    <button onClick={() => {
                        $api.patch('/orders', { order_id: e.id, status: 'secsessful' })
                            .finally(() => {
                                $api.get('/orders')
                                    .then(e => {
                                        setOrders(e.data)
                                    })
                            })
                    }} className='button w-min'>secsessful</button>
                    <button onClick={() => {
                        $api.patch('/orders', { order_id: e.id, status: 'rejected' })
                            .finally(() => {
                                $api.get('/orders')
                                    .then(e => {
                                        setOrders(e.data)
                                    })
                            })
                    }} className='button w-min'> rejected</button>
                </div>)
            }
        </div>
    )
}
