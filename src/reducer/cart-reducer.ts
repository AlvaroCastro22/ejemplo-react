import { db } from "../data/db"
import type { CartItem, Guitar } from "../types"

export type CartActions = {
    type:'add-to-cart',
    payload:{item:Guitar}
}|{
    type:'remove-from-cart',
    payload:{id:Guitar['id']}
}|{
    type:'decrease-quantity',
    payload:{id:Guitar['id']}
}|{
    type:'increase-quantity',
    payload:{id:Guitar['id']}
}|{
    type:'clear-cart'
}

export type CartState = {
    data:Guitar[],
    cart:CartItem[]
}

const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState: CartState ={
    data:db,
    cart:initialCart()
}
export const cartReducer = (state:CartState=initialState,action:CartActions)=>{
     const MIN_ITEMS = 1
    const MAX_ITEMS = 5
if (action.type==="add-to-cart") {
    const itemExists = state.cart.findIndex(guitar => guitar.id === action.payload.item.id)
    if(itemExists >= 0 ) { // existe en el carrito
            if(state.cart[itemExists].quantity >= MAX_ITEMS) return {...state}
            const updatedCart = [...state.cart]
            updatedCart[itemExists].quantity++
            return {
                ...state,
                cart:updatedCart
            }
        } else {
            const newItem : CartItem = {...action.payload.item, quantity : 1}
            return {
                ...state,
                cart:[...state.cart,newItem]
            }
        }
}
if(action.type==="remove-from-cart"){
    return{
        ...state,
        cart:state.cart.filter(guitar => guitar.id !== action.payload.id)
    }
}
if (action.type==="decrease-quantity") {
    const updatedCart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        return {
            ...state,
            cart:updatedCart
        }
    
}
if (action.type==="increase-quantity") {
    const updatedCart = state.cart.map( item => {
            if(item.id === action.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        return {
            ...state,
            cart:updatedCart
        }
    
}
if (action.type==="clear-cart") {
    return {
        ...state,
        cart:[]
    }
    
}


return state
}