import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {onRegistration} from '../../../api/authAPI'
import './addUser.scss'

import Sidebar from '../../../components/sidebar/sidebar'
import Navbar from '../../../components/navbar/navbar'

import { InputLabel, MenuItem, FormControl, Select } from '@mui/material/'
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined"


const AddUser = ({inputs, title}) => {

  const navigate = useNavigate()

  const [file, setFile] = useState("")
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  })
  const onChange = (event) => {
    setValues({...values, [event.target.name]: event.target.value})
  }

  const onSubmitForm = async (event) => {
    event.preventDefault()

    try{
      
      await onRegistration(values)
      setValues({username: '', email: '', password: '', role: ''})
      
      navigate('/users')
    }catch(error){
      console.log(error.response.data.errors[0].message)
    }
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
            <form onSubmit={(event) => onSubmitForm(event)}>
              <div className="formInput">
                <label htmlFor='fileInput'>Image: <DriveFolderUploadOutlinedIcon className='icon' /></label>
                <input type="file" id='fileInput' onChange={event => setFile(event.target.files[0])} style={{display: 'none'}} />
              </div>
              {/* <span>{error}</span>
              <span>{success}</span> */}

              <div className="formInput">
                <label>Username</label>
                <input 
                  type='text' 
                  name='username'
                  placeholder='username' 
                  value={values.username}
                  onChange={(event) => onChange(event)}
                />
              </div>

              <div className="formInput">
                <label>Email</label>
                <input 
                  type='text' 
                  name='email'
                  placeholder='email' 
                  value={values.email}
                  onChange={(event) => onChange(event)}
                  />
              </div>

              <div className="formInput">
                <label>Password</label>
                <input 
                  type='password' 
                  name='password'
                  placeholder='password' 
                  value={values.password}
                  onChange={(event) => onChange(event)}
                />
              </div>

              <FormControl className='formInput'>
                <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={values.role}
                  name='role'
                  label="role"
                  onChange={(event) => onChange(event)}
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

export default AddUser