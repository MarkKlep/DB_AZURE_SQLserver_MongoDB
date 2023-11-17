import React from 'react';
import '../style/AdminAut.css';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { checkAdminData } from '../store/adminSlice';
import { useSelector } from 'react-redux';
import ClientList from './ClientList';
import TicketPriceList from './TicketPriceList';
import ClientsFilteredData from './ClientsFilteresData';

const AdminAut = () => {

  const [adminLogin, setAdminLogin] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [seeClientList, setSeeCkientList] = useState(false);
  const [seeTicketPriceList, setSeeTicketPriceList] = useState(false);
  const [seeClientsFilteredData, setSeeClientsFilteredData] = useState(false);


  const adminEnter = useSelector(state => state.admin.adminEnter);

  const dispatch = useDispatch();  

  const handleAdminEntrance = () => {
    if(adminLogin !== "" && adminPassword !== "") {
        dispatch(checkAdminData({ adminLogin, adminPassword }));
    }
  }

  return (
    <div>
        <div className='admin-page'>
            <h2>Admin authentication</h2>
            <label htmlFor="admin-login">Login:</label>
            <input type='text' placeholder='Login...' id="admin-login" onChange={e => setAdminLogin(e.target.value)} />
            <label htmlFor="admin-password">Password:</label>
            <input type='text' placeholder='Password...'  id="admin-password" onChange={e => setAdminPassword(e.target.value)} />
            <button onClick={handleAdminEntrance}>Submit</button>
            {adminEnter ? (<span style={{color: 'green'}}>Ви зайшли як адмін</span>) : 
                (<span style={{color: 'red'}}>Ви НЕ зайшли як адмін</span>)
        }
        </div>

        {adminEnter && (
            <div>
                <div><button onClick={() => setSeeCkientList(!seeClientList)}>Подивитись список клієнтів</button></div>
                {
                    (seeClientList) && <ClientList/>
                }
                <div><button onClick={() => setSeeTicketPriceList(!seeTicketPriceList)}>Подивитись список кількості білетів за ціною</button></div>
                {
                    (seeTicketPriceList) && <TicketPriceList/>
                }
                <div><button onClick={() => setSeeClientsFilteredData(!seeClientsFilteredData)}>Подивитись фільтровані данні</button></div>
                {
                    (seeClientsFilteredData) && <ClientsFilteredData/>
                }
            </div>
        )}
    </div>

 
  )
}

export default AdminAut;