import { collection, getDocs, query, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { db } from "../../../firebaseConfig"
import { AuthContext } from "../../../context/AuthContext"





const UserOrders = () => {
    const [myOrders, setMyOrders] = useState([])
    const {user} = useContext(AuthContext)

    useEffect(()=>{
        const ordersCollections = collection(db, "orders")
        let ordersFiltered = query(ordersCollections, where("email", "==", user.email))
        getDocs(ordersFiltered).then(res =>{
            const newArr = res.docChanges.map(order =>{
                return {...order.data(), id: order.id}
            })
            setMyOrders(newArr)
        }).catch(error => console.log(error))
    },[user.email])

    return (
    <div>
        <h1> estoy en mis compras</h1>
        {
            myOrders.map(order =>{
                return <div key={order.id} style={{border:"2px solid black"}}>
                    {
                        order?.items?.map(product=>{
                            return <div key={product.id}>
                                <h2>{product.title}</h2>
                                <h3>{product.quantity}</h3>   
                            </div>
                        })
                    }
                    <h4>el total de la orden es {order.total}</h4>

                </div>
            })
        }
    </div>
  )
}

export default UserOrders