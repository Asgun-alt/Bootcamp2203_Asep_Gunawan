import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './updateProduct.scss'

import Sidebar from '../../../components/sidebar/sidebar'
import Navbar from '../../../components/navbar/navbar'

import TextField from '@mui/material/TextField';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined"


const DetailProduct = () => {

  const navigate = useNavigate()
  const {productId} = useParams() 

  const [file, setFile] = useState('')
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch(`http://localhost:3001/products/${productId}`, {method: 'GET'})
        const getResponse = await response.json()
        setProductName(getResponse[0].product_name)
        setDescription(getResponse[0].description)
        setPrice(getResponse[0].price)
    }
    fetchData()
  }, [productId])

  const handleUpdateProduct = async (event) => {
    event.preventDefault()

    try {

      let updateFormData = new FormData()
      updateFormData.append('save_productImage', file)
      updateFormData.append('productName', productName)
      updateFormData.append('description', description)
      updateFormData.append('price', price)

      navigate('/products')
      await fetch(`http://localhost:3001/product/${productId}`, {
        method: 'PUT',
        body: updateFormData
      })
      
    } catch (error) {
        console.error(error.message)
    }
  }

  return (
    <div className='new'>
      <Sidebar />

      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1 className="title">Detail Product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" />
          </div>
          <div className="right">
            <form onSubmit={handleUpdateProduct}>
              <div className="formInput">
                <label htmlFor='fileInput'>Image: <DriveFolderUploadOutlinedIcon className='icon' /></label>
                <input type="file" id='fileInput' onChange={event => setFile(event.target.files[0])} style={{display: 'none'}} />
              </div>

              <div className="formInput">
                <label>Product Name</label>
                <input 
                  type='text' 
                  value={productName}
                  onChange={event => setProductName(event.target.value)}
                />
              </div>

              <div className="formInput">  
                <label>Description</label>
                <TextField
                  fullWidth 
                  id="fullWidth"
                  multiline
                  rows={5}
                  type='text' 
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                  variant="standard"
                />
              </div>

              <div className="formInput">
                <label>Price</label>
                <input 
                  type='text' 
                  value={price}
                  onChange={event => setPrice(event.target.value)}
                />
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailProduct