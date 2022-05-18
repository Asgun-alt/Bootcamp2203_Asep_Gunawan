import React, {useContext} from 'react'
import { useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import './navbar.scss'
import {DarkModeContext} from '../../context/darkModeContext'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Navbar = () => {

  const { dispatch } = useContext(DarkModeContext)
  const {cartTotalQuantity} = useSelector((state) => state.cart)

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchOutlinedIcon />
        </div>

        <div className="items">
          <Link to='/cart_list' style={{textDecoration:'none'}}>
            <div className="item">
              <ShoppingCartIcon />
              <div className="counter">{cartTotalQuantity}</div>
            </div>
          </Link>

          <div className="item">
            <DarkModeOutlinedIcon className='icon' onClick={() => dispatch({type: 'TOGGLE'})} />
          </div>
          <div className="item">
            <img src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="profile" className='avatar' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar