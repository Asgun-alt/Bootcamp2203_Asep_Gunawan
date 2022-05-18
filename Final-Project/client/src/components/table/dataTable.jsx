import React, {useState, useEffect} from 'react'
import './dataTable.scss'
import { Link } from 'react-router-dom'

import { DataGrid } from '@mui/x-data-grid';


const DataTable = () => {
    
    const userColumn = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "name",
            headerName: "name",
            width: 230,
            renderCell: (params) => {
                return (
                    <div className="cellWithImg">
                        <img className="cellImg" src={'http://localhost:3001/' + params.value.user_image} alt="avatar" />
                        {params.value.username}
                    </div>
                );
            },
        },
        {
            field: "email",
            headerName: "email",
            width: 230,
        },
    ]
    

    const [users, setUsers] = useState([])
    const fetchData = async () => {
        const response = await fetch('http://localhost:3001/contacts')
        const userData = await response.json()
        setUsers(userData)
        // console.log(userData)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const rowData = users?.map(user => {
        return {
            id: user?.user_id,
            // name: user?.username.user?.params.user_image,
            name: {
                username: user?.username,
                user_image: user?.user_image},
            email: user?.email
        }
    })

    const actionColumn = [
        {field: 'action', headerName:'Action', width:200, renderCell:()=>{
            return (
                <div className='cellAction'>
                    <Link to='/users/testparams' style={{textDecoration:'none'}}>
                        <div className="detailButton">Detail</div>
                    </Link>
                    <div className="deleteButton">Delete</div>
                </div>
            )
        }}
    ]

    console.log(rowData)

    return (
        <div className='dataTable'>
            <div className="tableTitle">
                Register New User
                <Link to='/users/register' className='link'>
                    Register
                </Link>
            </div>
            <DataGrid
                className="datagrid"
                rows={rowData}
                columns={userColumn.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
            />
        </div>
    )
}

export default DataTable 