import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import './pages/colorMode/dark.scss'
import 'react-toastify/dist/ReactToastify.css'

import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { DarkModeContext } from './context/darkModeContext'

import { userInputs } from "./formSource";
import { Home, Login, CartList, ListUsers, ListSelling, ListProducts, UserProfile, ProductCatalog, AddUser, AddProduct, UpdateUser, UpdateProduct } from './pages';


const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{isAuth ? <Outlet /> : <Navigate to='/login' />}</>
}

const RestrectedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)

  return <>{!isAuth ? <Outlet /> : <Navigate to='/' />}</>
}


function App() {

  const { darkMode } = useContext(DarkModeContext)

  return (
    <div className={darkMode ? 'App Dark' : 'App'}>

      <BrowserRouter>
        <ToastContainer />

        <Routes>
          <Route path="/">

            <Route element={<PrivateRoutes />}>
              <Route index element={<Home />} />
              <Route path="catalog" element={<ProductCatalog />} />
              <Route path="cart_list" element={<CartList />} />
              <Route path="selling" element={<ListSelling />} />

              <Route path="products">
                <Route index element={<ListProducts />} />
                <Route path=":productId" element={<UpdateProduct />} />
                <Route path="add" element={<AddProduct title='Add New Product' />} />
              </Route>

              <Route path="users">
                <Route index element={<ListUsers />} />
                <Route path=":userId" element={<UpdateUser />} />
                <Route path="register" element={<AddUser inputs={userInputs} title='Add New User' />} />
                <Route path="user_profile" element={<UserProfile />} />
              </Route>
            </Route>

            <Route element={<RestrectedRoutes />}>
              <Route path="login" element={<Login />} />
            </Route>


            {/* <Route index element={<Home />} />
            <Route path="login" element={<Login />} /> */}

            {/* <Route path="users">
              <Route index element={<ListUsers />} />
              <Route path=":userId" element={<Detail />} />
              <Route path="register" element={<AddUser inputs={userInputs} title='Add New User' />} />
            </Route> */}

            {/* <Route path="products">
              <Route index element={<ListProducts />} />
              <Route path=":productId" element={<DetailProduct />} />
              <Route path="add" element={<AddProduct title='Add New Product' />} />
            </Route> */}
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
