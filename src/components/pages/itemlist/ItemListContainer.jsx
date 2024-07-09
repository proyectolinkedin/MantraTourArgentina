import { useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import { Grid, Container, Typography, CircularProgress, Box } from '@mui/material';
import ProductCard from './ProductCard';

const ItemListContainer = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let refCollection = collection(db, 'products');
        getDocs(refCollection)
            .then((res) => {
                let newArray = res.docs.map((product) => {
                    return { ...product.data(), id: product.id };
                });
                setProducts(newArray);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
                Destinos
            </Typography>
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={product.id}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ItemListContainer;
