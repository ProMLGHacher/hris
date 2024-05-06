import { useEffect, useState } from 'react'
import { $api, baseURL } from '../shared/api'
import { useAppSelector } from '../redux/hooks'

type Order = {
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
}

export const OrdersList = () => {

    const user_role = useAppSelector(state => state.auth.role)

    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        $api.get<Order[]>('/orders')
            .then(e => {
                setOrders(e.data.filter(e => e.user.role === user_role))
            })
    }, [])

    return (
        <div className='flex flex-col gap-5 w-4/5 mx-auto my-14'>
            <p>Мои заказы</p>
            {
                orders.map(e => <div className='flex gap-5 items-center mt-5'>
                    <img className='w-[100px] h-[100px] rounded-full' src={`${baseURL}/avatars/${e.user.avatar}`} alt="" />
                    <div>
                        <p>{e.user.name} {e.user.lastname}</p>
                        <p>{e.service.title}</p>
                        <p>{e.service.price} RUB</p>
                        <p className={`${e.status === 'pending' ? 'text-yellow-500' : e.status === 'secsessful' ? 'text-green-500' : e.status === 'rejected' ? 'text-red-500' : 'text-blue-500'}`}>{e.status === 'pending' ? 'Ожидается' : e.status === 'secsessful' ? 'Успешно' : e.status === 'rejected' ? 'Отклонено' : 'В работе'}</p>
                    </div>
                </div>)
            }
        </div>
    )
}
