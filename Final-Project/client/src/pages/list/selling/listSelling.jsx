import React from 'react'
import './listSelling.scss'

import Sidebar from '../../../components/sidebar/sidebar'
import Navbar from '../../../components/navbar/navbar'
import SellingTable from '../../../components/table/selling/sellingTable'

const ListSelling = () => {
    return (
        <div className='selling'>
        <Sidebar />
        <div className="sellingContainer">
            <Navbar />

            <div className="listContainer">
                <div className="listTitle">List Transactions</div>
                <SellingTable />
            </div>
        </div>
    </div>
    )
}

export default ListSelling