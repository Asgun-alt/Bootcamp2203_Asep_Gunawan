import React from 'react'
import './productCards.scss'

import Sidebar from '../../../components/sidebar/sidebar'
import Navbar from '../../../components/navbar/navbar'
import ProductCard from '../../../components/card/productCard'

const ProductCatalog = () => {
    return (
        <div className='list'>
            <Sidebar />
            <div className="listContainer">
                <Navbar />

                <ProductCard />
            </div>
        </div>
    )
}

export default ProductCatalog