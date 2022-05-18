import React, {useState, useEffect} from 'react'
import './tableProducts.scss'
import { Link } from 'react-router-dom'

import { DataGrid } from '@mui/x-data-grid';
// import DetailProduct from '../../../pages/detail/product/detailProduct'


const TableProducts = () => {
    
    const productColumn = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "product_name",
            headerName: "product_name",
            width: 400,
            renderCell: (params) => {
                return (
                    <div className="cellWithImg">
                        <img className="cellImg" src={'http://localhost:3001/' + params.value.product_image} alt="avatar" />
                        {params.value.product_name}
                    </div>
                );
            },
        },
        {
            field: "description",
            headerName: "description",
            width: 300,
        },
        {
            field: "price",
            headerName: "price",
            width: 90,
        },
        {field: 'action', headerName:'Action', width:200, renderCell:(params)=>{
            return (
                <div className='cellAction'>
                    <Link to={`/products/${params.value.product_id}`} style={{textDecoration:'none'}}>
                        <div className="detailButton">Update</div>
                    </Link>
                    <button className="deleteButton" onClick={() => handlerDeleteProduct(params.value.product_id)}>Delete</button>
                </div>
            )
        }}
    ]

    // delete data handler
    const handlerDeleteProduct = async (handlerDelete) => {
        await fetch(`http://localhost:3001/product/delete/${handlerDelete}`, {
                method: 'DELETE'
            })
            window.location = "/products"
    }
    
    // fetch data products from db
    const [products, setProducts] = useState([])
    const fetchData = async () => {
        const response = await fetch('http://localhost:3001/get_products')
        const productData = await response.json()
        setProducts(productData)
    }
    useEffect(() => {
        fetchData()
    }, [])

    const rowData = products?.map(product => {
        return {
            id: product?.product_id,
            product_name: {
                product_name: product?.product_name,
                product_image: product?.product_image
            },
            description: product?.description,
            price: product?.price,
            action: {
                product_id: product?.product_id
            }
        }
    })

    return (
        <div className='dataTable'>
            <div className="tableTitle">
                List Product
                <Link to='/products/add' className='link'>
                    Add Product
                </Link>
            </div>
            <DataGrid
                className="datagrid"
                rows={rowData}
                columns={productColumn}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
            />
        </div>
    )
}

export default TableProducts 