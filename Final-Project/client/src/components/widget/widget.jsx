import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import './widget.scss'

import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const Widget = ({type}) => {

  const [amountValue, setAmountValue] = useState({
    user: '',
    product: ''
  })
  

  useEffect(() => {
    
    async function productAmount () {
      const sumProduct = await fetch('http://localhost:3001/get_products')
      const resultProduct = await sumProduct.json()
      setAmountValue({product: resultProduct.length})
    }
    productAmount()
  }, [])

  let widgetData;
  //temporary data
  const percentage = 20

  switch(type){
    case 'user':
      widgetData={
        title: 'USERS',
        link: 'See all users',
        count: amountValue.user,
        icon: (<PersonPinOutlinedIcon className='icon' style={
          {
            color: 'crimson',
            backgroundColor: 'rgba(255, 0, 0, 0.2)'
          }
        } />)
      }
      break
    case 'product':
      widgetData={
        title: 'PRODUCTS',
        link: <Link to='/products' style={{textDecoration:'none'}}>See all users</Link>,
        count: amountValue.product,
        icon: (<LocalOfferOutlinedIcon className='icon' />)
      }
      break
    case 'selling':
      widgetData={
        title: 'SELLING',
        link: 'See all sellings',
        icon: (<ShoppingCartOutlinedIcon className='icon' style={
          {
            color: 'goldenrod',
            backgroundColor: 'rgba(218, 165, 32, 0.2)'
          }
        } />)
      }
      break

    default:
      break
  }

  return (
    <div className='widget'>
      <div className="left">
        <span className="title">{widgetData.title}</span>
        <span className="counter">{widgetData.count}</span>
        <span className="link">{widgetData.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive"><ArrowDropUpOutlinedIcon />{percentage}%</div>
        {widgetData.icon}
      </div>
    </div>
  )
}

export default Widget