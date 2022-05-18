import React, {useState, useEffect} from 'react'
import './tableUsers.scss'
import { Link } from 'react-router-dom'

import { DataGrid } from '@mui/x-data-grid';


const UserTable = () => {
    
    const userColumn = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "username",
            headerName: "username",
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
        {
            field: "role",
            headerName: "role",
            width: 230,
        },
        {field: 'action', headerName:'Action', width:200, renderCell:(params)=>{
            return (
                <div className='cellAction'>
                    <Link to={`/users/${params.value.user_id}`} style={{textDecoration:'none'}}>
                        <div className="detailButton">Detail</div>
                    </Link>
                    <div className="deleteButton" onClick={() => handlerDeleteUser(params.value.user_id)}>Delete</div>
                </div>
            )
        }}
    ]

        // delete data handler
        const handlerDeleteUser= async (handlerDelete) => {
            await fetch(`http://localhost:3001/user/delete/${handlerDelete}`, {
                    method: 'DELETE'
                })
                window.location = "/products"
        }
    

    const [users, setUsers] = useState([])
    const fetchData = async () => {
        const response = await fetch('http://localhost:3001/users')
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
            username: {
                username: user?.username,
                user_image: user?.user_image
            },
            email: user?.email,
            role: user?.role,
            action: {
                user_id: user?.user_id
            }
        }
    })

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
                columns={userColumn}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
            />
        </div>
    )
}

export default UserTable 