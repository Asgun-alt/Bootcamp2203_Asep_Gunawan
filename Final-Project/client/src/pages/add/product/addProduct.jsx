import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import './addProduct.scss'

import Sidebar from '../../../components/sidebar/sidebar'
import Navbar from '../../../components/navbar/navbar'

import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined"


const AddProduct = ({ title }) => {

  const navigate = useNavigate()

  const [file, setFile] = useState("")

  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const handleSubmitForm = async (event) => {
    event.preventDefault()

    let formData = new FormData()
    formData.append('save_productImage', file)
    formData.append('productName', productName)
    formData.append('description', description)
    formData.append('price', price)

    navigate('/products')
    await fetch('http://localhost:3001/product/addproduct', {
      method: 'POST',
      body: formData,
    })

  }

  return (
    <div className='new'>
      <Sidebar />

      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1 className="title">{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" />
          </div>
          <div className="right">
            <form onSubmit={handleSubmitForm}>
              <div className="formInput">
                <label htmlFor='fileInput'>Image: <DriveFolderUploadOutlinedIcon className='icon' /></label>
                <input type="file" id='fileInput' onChange={event => setFile(event.target.files[0])} style={{display: 'none'}} />
              </div>

              <div className="formInput">
                <label>Product Name</label>
                <input 
                  type='text' 
                  placeholder='Product Name' 
                  value={productName}
                  onChange={event => setProductName(event.target.value)}
                />
              </div>

              <div className="formInput">
                <label>Description</label>
                <input 
                  type='text' 
                  placeholder='Description'
                  value={description}
                  onChange={event => setDescription(event.target.value)}
                />
              </div>

              <div className="formInput">
                <label>Price</label>
                <input 
                  type='text' 
                  placeholder='Price' 
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

export default AddProduct