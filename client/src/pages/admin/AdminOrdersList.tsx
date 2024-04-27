import React, { useEffect, useState } from 'react'
import { $api } from '../../shared/api'

export const AdminOrdersList = () => {
    const [orders, setOrders] = useState<{ "id": number, "user_id": number, "service_id": number, "order_date": Date, "status": "pending" | "secsessful" | "rejected" | "accepted" }[]>([])

    useEffect(() => {
        $api.get('/orders')
            .then(e => {
                setOrders(e.data)
            })
    }, [])

    return (
        <div>
            {
                orders.map(e => <div className='flex gap-5 items-center'>
                    {e.status} " " {e.id}
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
