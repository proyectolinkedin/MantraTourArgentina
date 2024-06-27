// src/components/ProductCard.jsx

import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Card sx={{ maxWidth: 345, m: 2 }}>
            <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.unit_price} 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" component={Link} to={`/ItemDetail/${product.id}`}>
                    Learn More
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
