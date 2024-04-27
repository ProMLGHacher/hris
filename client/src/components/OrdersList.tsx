import { useEffect, useState } from 'react'
import { $api } from '../shared/api'

export const OrdersList = () => {

    const [orders, setOrders] = useState<{ "id": number, "user_id": number, "service_id": number, "order_date": Date, "status": "pending" | "secsessful" | "rejected" }[]>([])

    useEffect(() => {
        $api.get('/orders')
            .then(e => {
                setOrders(e.data)
            })
    }, [])

    return (
        <div>
            {
                JSON.stringify(orders)
            }
        </div>
    )
}
