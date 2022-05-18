import React, { useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {removeFromCart, addToCart, decreaseCart, clearCart, getTotals} from '../../redux/slices/cartSlice'
import {Link, useNavigate} from 'react-router-dom'
import './cartList.scss'

import Sidebar from '../../components/sidebar/sidebar'
import Navbar from '../../components/navbar/navbar'

import {
    Button, ButtonGroup,Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Box
} from '@mui/material'

const CartList = () => {

    const cart = useSelector((state) => state.cart)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getTotals())
    }, [cart, dispatch])
    
    const handleRemoveFromCart = (cartItem) => {
        dispatch(removeFromCart(cartItem))
    }

    const handleDecreaseCart = (cartItem) => {
        dispatch(decreaseCart(cartItem))
    }

    const handleIncreaseCart = (cartItem) => {
        dispatch(addToCart(cartItem))
    }

    const handleClearCart = () => {
        dispatch(clearCart())
    }

    const saveCartData = async(cartItem) => {

        const body = {
            product: cartItem.product_name,
            image: cartItem.product_image,
            description: cartItem.description,
            price: cartItem.price,
            total: cartItem.price * cartItem.cartTotalQuantity,
            quantity: cartItem.cartTotalQuantity
        }
        navigate('/')
        
        await fetch('http://localhost:3001/save_cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        dispatch(clearCart())
    }

    return (
        <div className='Cart'>
            <Sidebar />
            <div className="CartContainer">
                <Navbar />

                <div className="CartListContainer">
                    <div className="listTitle">List Items</div>
                        <TableContainer component={Paper} className='table'>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell className='tableCell'>Product</TableCell>
                                    <TableCell className='tableCell'>Description</TableCell>
                                    <TableCell className='tableCell'>Price</TableCell>
                                    <TableCell className='tableCell'>Total</TableCell>
                                    <TableCell className='tableCell'>Quantity</TableCell>
                                    <TableCell className='tableCell'>Action</TableCell>
                                </TableRow>
                                </TableHead>
                                {cart.cartItems.length === 0 ? (
                                        <>
                                        <span>Cart is empty</span>
                                        <Link to='/catalog'>
                                            <Button>Go add some product</Button>
                                        </Link>
                                        </>
                                    ) : (
                                        <>
                                        {cart.cartItems?.map((cartItem) => (
                                            <>
                                <TableBody key={cartItem.product_id}>
                                    <TableRow>
                                        <TableCell className='tableCell'>
                                            <div className="cellWrapper">
                                                <img src={`http://localhost:3001/`+cartItem.product_image} alt="" className='image' />
                                                {cartItem.product_name}
                                            </div>
                                        </TableCell>
                                        <TableCell className='tableCell'>{cartItem.description}</TableCell>
                                        <TableCell className='tableCell'>{cartItem.price}</TableCell>
                                        <TableCell className='tableCell'>Rp: {cartItem.price * cartItem.cartTotalQuantity}</TableCell>
                                        <TableCell className='tableCell'>
                                            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                                                <ButtonGroup variant="outlined" aria-label="outlined button group">
                                                    <Button onClick={() => handleDecreaseCart(cartItem)}>-</Button>
                                                    <Button disableElevation>{cartItem.cartTotalQuantity}</Button>
                                                    <Button onClick={() => handleIncreaseCart(cartItem)}>+</Button>
                                                </ButtonGroup>
                                            </Box>
                                        </TableCell>
                                        <TableCell className='tableCell'>
                                            <Button variant="outlined" onClick={() => handleRemoveFromCart(cartItem)}>Remove</Button>
                                            <Button variant="outlined" onClick={() => saveCartData(cartItem)} style={{marginRight: '2%'}}>Check Out</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                </>
                                        ))}
                                    </>
                                    )}
                            </Table>
                        </TableContainer>
                        <Button variant="outlined" onClick={() => handleClearCart()}>Clear</Button>
                </div>
            </div>
        </div>
    )
}

export default CartList