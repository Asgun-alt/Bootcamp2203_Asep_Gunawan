import React, {useState, useEffect, Fragment} from 'react'
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {addToCart} from '../../redux/slices/cartSlice'
import './productCard.scss'

import {Card, CardActions, CardContent, CardMedia, Button, Typography, Grid} from '@mui/material'

const ProductCard = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    navigate('/cart_list')
  }

    // fetch data products from db
    const [products, setProducts] = useState([])
    const fetchData = async () => {
        const response = await fetch('http://localhost:3001/get_products')
        const productData = await response.json()
        setProducts(productData)
    }
    useEffect(() => {
        fetchData()
    }, [])

  return (
    <Fragment>
    <Grid sx={{ flexGrow: 1 }} container spacing={1}>
    <Grid item xs={12}>
      <Grid container justifyContent="center" marginTop='2%'>

      {products?.map((product) => {
        return (
          <Card sx={{ maxWidth: 300}} style={{margin: '2%'}} key={product.product_id} >
          <CardMedia
            component="img"
            height="400"
            image={'http://localhost:3001/'+product.product_image}
            alt="product image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {product.product_name}
            </Typography>
            <Typography gutterBottom variant="h7" component="div">
              {product.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small" onClick={() => handleAddToCart(product)}>Add To Cart</Button>
          </CardActions>
        </Card>
        )
      })}

        </Grid>
      </Grid>
    </Grid>
    </Fragment>
  )
}

export default ProductCard