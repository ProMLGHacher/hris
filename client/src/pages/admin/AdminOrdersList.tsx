import { useEffect, useState } from 'react'
import { $api, baseURL } from '../../shared/api'
import DropDown from '../../shared/ui/DropDown'

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

    const [status, setStatus] = useState('Все')

    return (
        <div className='flex flex-col gap-5 '>
            <div className='flex gap-5 mt-10 justify-end w-[90%] max-w-[1444px] mx-auto'>
                <DropDown value={status} elements={[{ title: 'Все', value: 'Все' }, { title: 'Ожидается', value: 'pending' }, { title: 'Успешно', value: 'secsessful' }, { title: 'Отклонено', value: 'rejected' }, { title: 'В работе', value: 'accepted' }]} onChange={e => setStatus(e)} />
            </div>
            {
                orders.filter(e => status === 'Все' || e.status === status).map(e => <div className='flex gap-5 items-center mt-5'>
                    <img className='w-[100px] h-[100px] rounded-full' src={`${baseURL}/avatars/${e.user.avatar}`} alt="" />
                    <div>
                        <p>{e.user.name} {e.user.lastname}</p>
                        <p>{e.service.title}</p>
                        <p>{e.service.price} RUB</p>
                        <p>{e.status}</p>
                        <p className={`${e.status === 'pending' ? 'text-yellow-500' : e.status === 'secsessful' ? 'text-green-500' : e.status === 'rejected' ? 'text-red-500' : 'text-blue-500'}`}>{e.status === 'pending' ? 'Ожидается' : e.status === 'secsessful' ? 'Успешно' : e.status === 'rejected' ? 'Отклонено' : 'В работе'}</p>
                        <div className='flex gap-5'>
                            <button onClick={() => {
                                $api.patch('/orders', { order_id: e.id, status: 'secsessful' })
                                    .finally(() => {
                                        $api.get('/orders')
                                            .then(e => {
                                                setOrders(e.data)
                                            })
                                    })
                            }} className='button w-min'>Готово</button>
                            <button onClick={() => {
                                $api.patch('/orders', { order_id: e.id, status: 'accepted' })
                                    .finally(() => {
                                        $api.get('/orders')
                                            .then(e => {
                                                setOrders(e.data)
                                            })
                                    })
                            }} className='button w-min'>Принято</button>
                            <button onClick={() => {
                                $api.patch('/orders', { order_id: e.id, status: 'rejected' })
                                    .finally(() => {
                                        $api.get('/orders')
                                            .then(e => {
                                                setOrders(e.data)
                                            })
                                    })
                            }} className='button w-min'>Отклонено</button>
                        </div>
                    </div>
                    <div className='flex gap-5 flex-col'>
                        <a className='text-blue-500 hover:underline p-2 rounded-md border border-blue-500' href={`mailto:${e.email}`}>{e.email}</a>
                        <a className='text-blue-500 hover:underline p-2 rounded-md border border-blue-500' href={`tel:${e.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}`}>{e.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}</a>
                    </div>
                </div>)
            }
        </div>
    )
}
