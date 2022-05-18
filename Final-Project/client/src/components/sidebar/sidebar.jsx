import React, {useContext} from 'react'
import { useSelector } from 'react-redux'
import {  onLogout } from '../../api/authAPI'
import { unAuthenticateUser } from '../../redux/slices/authSlice'
import './sidebar.scss'

import {Link} from 'react-router-dom'
import { DarkModeContext } from '../../context/darkModeContext'

import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BallotIcon from '@mui/icons-material/Ballot';


const Sidebar = () => {
    
    const { isAuth } = useSelector((state) => state.auth)
    const logout = async () => {
        try {
            await onLogout()
        
            dispatch(unAuthenticateUser())
            localStorage.removeItem('isAuth')
        } catch (error) {
            console.log(error.response)
        }
    }

    const { dispatch } = useContext(DarkModeContext)

    return (
        <div className='sidebar'>
            <div className="top">
                <Link to='/' style={{textDecoration:'none'}}>
                    <span className='logo'>Selling App</span>
                </Link>
            </div>
            <hr />
            <div className="middle">
                <ul>
                    {isAuth? (
                        <>
                    <p className="title">Menu</p>
                        <Link to='/' style={{textDecoration:'none'}}>
                    <li>
                        <DashboardIcon className='icon' />
                        <span>Dashboard</span>
                    </li>
                        </Link>

                        <Link to='/catalog' style={{textDecoration:'none'}}>
                    <li>
                        <BallotIcon className='icon' />
                        <span>Catalog</span>
                    </li>
                        </Link>

                        <Link to='/selling' style={{textDecoration:'none'}}>
                    <li>
                        <LocalOfferOutlinedIcon className='icon' />
                        <span>Selling</span>
                    </li>
                        </Link>
        
                        <p className="title">Lists</p>
                        <Link to='/users' style={{textDecoration:'none'}}>
                    <li>
                        <PersonOutlineOutlinedIcon className='icon' />
                        <span>Users</span>
                    </li>
                        </Link>

                        <Link to='/products' style={{textDecoration:'none'}}>
                    <li>
                        <StoreOutlinedIcon className='icon' />
                        <span>Products</span>
                    </li>
                        </Link>

                        <p className="title">Options</p>
                                <Link to='/users/user_profile' style={{textDecoration:'none'}}>
                            <li>
                                <AccountCircleOutlinedIcon className='icon' />
                                <span>Profile</span>
                            </li>
                                </Link>

                            <li>
                                <LogoutOutlinedIcon className='icon' />
                                <span onClick={() => logout()}>Logout</span>
                            </li>
                        </>
                        ) : (
                            <>
                            <p className="title">Options</p>
                                <Link to='/users/user_profile' style={{textDecoration:'none'}}>
                            <li>
                                <AccountCircleOutlinedIcon className='icon' />
                                <span>Profile</span>
                            </li>
                                </Link>

                            <li>
                                <LogoutOutlinedIcon className='icon' />
                                <span onClick={() => logout()}>Logout</span>
                            </li>
                            </>
                        )}
                </ul>
            </div>
            {/* <div className="bottom">
            <span>Mode</span>
                <div className="colorOption" onClick={() => dispatch({type:'LIGHT'})}></div>
                <div className="colorOption" onClick={() => dispatch({type:'DARK'})}></div>
            </div> */}
        </div>
    )
}

export default Sidebar