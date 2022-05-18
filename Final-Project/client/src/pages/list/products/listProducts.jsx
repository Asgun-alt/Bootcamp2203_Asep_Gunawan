import React from 'react'
import './listProducts.scss'

import Sidebar from '../../../components/sidebar/sidebar'
import Navbar from '../../../components/navbar/navbar'
import TableProducts from '../../../components/table/products/tableProducts'

const ListProducts = () => {
    return (
        <div className='list'>
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <TableProducts />
            </div>
        </div>
    )
}

export default ListProducts