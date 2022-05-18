import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
    // check wether there is cart items in local storage
    // if there is items available in cart, set it to local storage
    // if not, set default state to empty array
    cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    cartTotalQuantity: 0,
    cartTtotalAmount: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {

            // check if product already exist in cart items
            const itemIndex = state.cartItems.findIndex((item) => item.product_id === action.payload.product_id)
            // if there is items in the cart, increment quantity by 1
            if (itemIndex >= 0) {
                state.cartItems[itemIndex].cartTotalQuantity += 1
                toast.info(`Added ${state.cartItems[itemIndex].product_name} quantity`, {
                    position: 'bottom-right'
                })
            } else {
                //store product when from addToCart function
                const tempProduct = { ...action.payload, cartTotalQuantity: 1 }
                state.cartItems.push(tempProduct)
                toast.success(`${action.payload.product_name} has been added to cart`, {
                    position: 'bottom-right'
                })
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))

        },

        removeFromCart(state, action) {
            const nextCartItem = state.cartItems.filter(
                (cartItem) => cartItem.product_id !== action.payload.product_id
            )

            state.cartItems = nextCartItem
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
            toast.error(`${action.payload.product_name} has been removed from cart`, {
                position: 'bottom-right'
            })
        },

        decreaseCart(state, action) {
            const itemIndex = state.cartItems.findIndex(
                (cartItem) => cartItem.product_id === action.payload.product_id
            )

            if (state.cartItems[itemIndex].cartTotalQuantity > 1) {
                state.cartItems[itemIndex].cartTotalQuantity -= 1
                toast.info(`Decreased ${action.payload.product_name} has been removed from cart`, {
                    position: 'bottom-right'
                })
            } else if (state.cartItems[itemIndex].cartTotalQuantity === 1) {
                const nextCartItem = state.cartItems.filter(
                    (cartItem) => cartItem.product_id !== action.payload.product_id
                )

                state.cartItems = nextCartItem
                toast.error(`${action.payload.product_name} has been removed from cart`, {
                    position: 'bottom-right'
                })
            }
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },

        clearCart(state, action) {
            state.cartItems = []

            toast.error(`Cart has been cleared`, {
                position: 'bottom-right'
            })
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
        },

        getTotals(state, action) {
            let { total, quantity } = state.cartItems.reduce((cartTotal, cartItem) => {
                const { price, cartTotalQuantity } = cartItem
                const itemTotal = price * cartTotalQuantity

                cartTotal.total += itemTotal
                cartTotal.quantity += cartTotalQuantity

                return cartTotal
            }, {
                total: 0,
                quantity: 0
            })

            state.cartTotalQuantity = quantity
            state.cartTtotalAmount = total
        }
    }
})

export const { addToCart, removeFromCart, decreaseCart, clearCart, getTotals } = cartSlice.actions
export default cartSlice.reducer