// src/components/ItemListContainer.jsx
import { useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import { Grid, Container, Typography } from '@mui/material';
import ProductCard from './ProductCard';

const ItemListContainer = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let refCollection = collection(db, 'products');
        getDocs(refCollection)
            .then((res) => {
                let newArray = res.docs.map((product) => {
                    return { ...product.data(), id: product.id };
                });
                setProducts(newArray);
            })
            .catch((err) => console.log(err));
    }, []);

    console.log(products);

    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom>
                Destinos
            </Typography>
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ItemListContainer;
