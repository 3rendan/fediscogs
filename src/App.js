import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import Explore from './pages/Explore'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import Category from './pages/Category'
import CreateRecord from './pages/CreateRecord'
import Record from './pages/Record'
import Contact from './pages/Contact'
import EditRecord from './pages/EditRecord'
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/profile' element={<PrivateRoute />} >
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/create-record' element={<CreateRecord />} />
          <Route path='/edit-record/:recordId' element={<EditRecord />} />
          <Route path='/category/:categoryName/:recordId' element={<Record />} />
          <Route path='/contact/:landlordId' element={<Contact />} />
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
