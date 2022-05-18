import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './updateUser.scss'

import Sidebar from '../../../components/sidebar/sidebar'
import Navbar from '../../../components/navbar/navbar'

import { InputLabel, MenuItem, FormControl, Select } from '@mui/material/'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined"


const DetailUser = () => {

  const navigate = useNavigate()
  const {userId} = useParams() 

  const [file, setFile] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    const fetchData = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {method: 'GET'})
        const getResponse = await response.json()
        setUsername(getResponse[0].username)
        setEmail(getResponse[0].email)
    }
    fetchData()
  }, [userId])

  const handleUpdateUser = async (event) => {
    event.preventDefault()

    try {

      let updateFormData = new FormData()
      updateFormData.append('save_productImage', file)
      updateFormData.append('username', username)
      updateFormData.append('email', email)
      updateFormData.append('password', password)
      updateFormData.append('role', role)

      await fetch(`http://localhost:3001/user/${userId}`, {
        method: 'PUT',
        body: updateFormData
      })
      navigate('/users')
        
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
          <h1 className="title">Detail User</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} alt="" />
          </div>
          <div className="right">
            <form onSubmit={handleUpdateUser}>
              <div className="formInput">
                <label htmlFor='fileInput'>Image: <DriveFolderUploadOutlinedIcon className='icon' /></label>
                <input type="file" id='fileInput' onChange={event => setFile(event.target.files[0])} style={{display: 'none'}} />
              </div>

              <div className="formInput">
                <label>Username</label>
                <input 
                  type='text' 
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                />
              </div>

              <div className="formInput">
                <label>Email</label>
                <input 
                  type='text' 
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                />
              </div>

              <div className="formInput">
                <label>Password</label>
                <input 
                  type='password' 
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                />
              </div>

              
              <FormControl className='formInput'>
                <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={role}
                  name='role'
                  label="role"
                  onChange={event => setRole(event)}
                >
                  <MenuItem value={'admin'}>admin</MenuItem>
                  <MenuItem value={'member'}>member</MenuItem>
                </Select>
              </FormControl>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailUser