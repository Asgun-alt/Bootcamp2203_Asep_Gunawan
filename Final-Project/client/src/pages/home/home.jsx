import React from 'react'
import './home.scss'

import Navbar from '../../components/navbar/navbar'
import Sidebar from '../../components/sidebar/sidebar'
import Widget from '../../components/widget/widget'
import SellingTable from '../../components/table/selling/sellingTable'

const Home = () => {

  return (
    <div className='home'>
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          
          <div className="widgets">
            <Widget type='user' />
            <Widget type='product' />
            <Widget type='selling' />
          </div>

          <div className="listContainer">
            <div className="listTitle">List Transactions</div>
            <SellingTable />
          </div>
        </div>
    </div>
  )
}

export default Home