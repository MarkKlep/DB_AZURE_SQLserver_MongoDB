import './App.css';
import RegistrationForm from './components/RegistrationForm';
import HomePage from './components/HomePage';
import NotFoundPage from './components/NotFoundPage';
import Notes from "./components/Notes";
import Authorization from './components/Authorization';
import UserProfile from './components/UserProfile';
import { Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import OrderTicket from './components/OrderTicket';
import AdminAut from './components/AdminAut';
import { exitAdmin } from './store/adminSlice';
import EventsPage from './components/EventsPage';

import Project01 from './practise/Project01';
import Project02 from './practise/Project02';

//import { lazy, Suspense } from 'react';
//const LazyComponent = lazy(() => import('./practise/Project01'));

function App() {

  const profileExist = useSelector(state => state.user.userProfile) !== "";

  const adminEnter = useSelector(state => state.admin.adminEnter);

  const dispatch = useDispatch();

  const handleExitAdmin = () => {
    dispatch(exitAdmin());
  }

  return (
    <div>

      <nav style={{display: 'flex', justifyContent: "space-around", background: '#ccc', height: "40px",alignItems: 'center' /* Вырав эл по верт*/}}>
        <Link to="/">Home Page</Link>
        <Link to='/registration_page'>Registration page</Link>
        <Link to='/notes_page'>Leave a comment</Link>
        <Link to="events_page">Events page</Link>
        {profileExist && <Link to='/profile_page'>Profile</Link>}
        <Link to="/admin_aut">Увійти як адмін</Link>
        {adminEnter && <div><b>Admin</b> <button onClick={handleExitAdmin}>Exit</button></div>}
        <Link to='/project01'>project01</Link>
        <Link to='/project02'>project02</Link>
      </nav>

      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path="/order_page/:tour" element={<OrderTicket/>} />
        <Route path='/registration_page' element={<RegistrationForm/>}>
          <Route path='/registration_page/authorization_page' element={<Authorization/>}/>
        </Route>
        <Route path='/notes_page' element={<Notes/>}/>
        <Route path='/profile_page' element={<UserProfile/>}/>
        <Route path='/admin_aut' element={<AdminAut/>}/>
        <Route path='*' element={<NotFoundPage/>} />
        <Route path='/events_page' element={<EventsPage/>} />
        <Route path='/project01' element={<Project01/>}/>
        <Route path='/project02' element={<Project02/>}/>
      </Routes>


      

    </div>
  );
  
}

export default App;