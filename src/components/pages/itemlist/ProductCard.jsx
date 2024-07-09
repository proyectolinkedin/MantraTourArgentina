import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
    <Card
        sx={{
            maxWidth: 500, // Aumentar el tamaño máximo
            m: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            },
        }}
    >
        <CardMedia
            component="img"
            height="200" // Aumentar la altura de la imagen
            image={product.image}
            alt={product.title}
        />
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {product.title}
            </Typography>
            <Typography variant="h6" color="text.primary">
                ${product.unit_price.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Stock: {product.stock}
            </Typography>
        </CardContent>
        <CardActions>
            <Button
                size="small"
                component={Link}
                to={`/ItemDetail/${product.id}`}
                sx={{ color: 'primary.main', textTransform: 'none' }}
            >
                Learn More
            </Button>
        </CardActions>
    </Card>
);

export default ProductCard;
