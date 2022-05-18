import React from 'react'
import './listUsers.scss'

import Sidebar from '../../../components/sidebar/sidebar'
import Navbar from '../../../components/navbar/navbar'
import UserTable from '../../../components/table/users/tableUsers'

const ListUsers = () => {
    return (
        <div className='list'>
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <UserTable />
            </div>
        </div>
    )
}

export default ListUsers