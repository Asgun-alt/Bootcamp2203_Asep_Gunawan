import React, {useState, useEffect} from 'react'
import './sellingTable.scss'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const SellingTable = () => {

       // fetch data products from db
        const [selling, setSelling] = useState([])
        const fetchData = async () => {
            const response = await fetch('http://localhost:3001/selling')
            const sellingData = await response.json()
            setSelling(sellingData)
        }
        useEffect(() => {
            fetchData()
        }, [])

    return (
        <TableContainer component={Paper} className='table'>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell className='tableCell'>Product</TableCell>
                <TableCell className='tableCell'>Description</TableCell>
                <TableCell className='tableCell'>Date</TableCell>
                <TableCell className='tableCell'>Price</TableCell>
                <TableCell className='tableCell'>Total</TableCell>
                <TableCell className='tableCell'>Quantity</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {selling.map((data) => (
                <TableRow key={data.selling_id}>
                <TableCell className='tableCell'>
                    <div className="cellWrapper">
                        <img src={`http://localhost:3001/` + data.image} alt="" className='image' />
                        {data.product}
                    </div>
                </TableCell>
                <TableCell className='tableCell'>{data.description}</TableCell>
                <TableCell className='tableCell'>{data.date}</TableCell>
                <TableCell className='tableCell'>{data.price}</TableCell>
                <TableCell className='tableCell'>{data.total}</TableCell>
                <TableCell className='tableCell'>{data.quantity}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    )
}

export default SellingTable