import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig"

import { getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";

const ItemlistContainer = () =>{

    const [products, setProducts] = useState([])

    useEffect(()=>{
        let refCollection = collection(db, "products")
        getDocs(refCollection)
        .then((res) => {
           let newArray= res.docs.map(product => {
                return {...product.data(), id: product.id}
            })
            setProducts(newArray);
        })
        .catch((err) =>console.log(err));
    },[])

    console.log(products);

    return(
        <div>
        <h1>Estoy en el shop</h1>
        {products.map((product)=>{
            return(
                <Link key={product.id} to={`/ItemDetail/${product.id}`}>
                <div style={{border:"2px solid red"}}>
                    <img src={product.image} style={{width: "300px"}} alt="" />
                    <h2>{product.title}</h2>
                    <h4>{product.unit_price}</h4>
                    <h4>{product.stock}</h4>

                </div>
                </Link>
            )
        })

        }
        </div>
    )
}

export default ItemlistContainer