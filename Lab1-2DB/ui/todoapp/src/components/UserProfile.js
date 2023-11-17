import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../style/UserProfile.css';
import { useDispatch } from 'react-redux';
import { removeTicket } from '../store/userSlice';
import { rememberUser, rememberTickets } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [clientOrders, setClientOrders] = useState([]);
  const [clientRoutes, setClientRoutes] = useState([]);
  const [discount, setDiscount] = useState(0);
  const user = useSelector(state => state.user.userProfile);
  const userId = useSelector(state => state.user.userProfile.UserId);
  const tickets = useSelector(state => state.user.tickets);
  console.log(tickets);
  const dispatch = useDispatch();
  const API_URL = "http://localhost:5228/";

  const navigate = useNavigate();

  const calculateDiscount = (numTickets) => {
    let discount = 0;
    if (numTickets === 2) {
      discount = 0.05; // 5% скидка
    } else if (numTickets >= 3) {
      discount = 0.1; // 10% скидка
    }
    return discount;
  }

  useEffect(()=>{
    refreshCleintOrders();
    refreshClientRoutes();
  }, []);

  useEffect(()=>{
    setDiscount(calculateDiscount(tickets.length))
  }, [tickets.length]);

  useEffect(() => {
    const updateDiscountForTicket = async (ticketId) => {
      try {
        const url = `${API_URL}api/todoapp/UpdateTicketDiscount?ticketId=${ticketId}&discount=${discount}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(`Білет ${ticketId} оновлен:`, data);
        } else {
          throw new Error(`Помилка при оновленні білету ${ticketId}`);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    tickets.forEach((ticketId) => {
      updateDiscountForTicket(ticketId);
    });
  }, [ discount]);
//tickets,
  const refreshCleintOrders = async () => {
    const url = `${API_URL}api/todoapp/GetClientOrders?clientId=${userId}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setClientOrders(data);
      } else {
        throw new Error('Помилка на сервері');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const refreshClientRoutes = async () => {
      const url = `${API_URL}api/todoapp/GetClientRoutes?clientId=${userId}`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setClientRoutes(data);
        } else {
          throw new Error('Помилка на сервері');
        }
      } catch (error) {
        console.error(error);
      }
  }
  console.log("tickets = " + tickets);
  console.log("clientid = " + userId);
  const handleRemoveOrder = async (id) => {
    const url = `${API_URL}api/todoapp/DeleteClientOrder?id=${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log("ticketid = " + id);
        console.log("clientid = " + userId);
        const data = await response.json();
        console.log(data);
        dispatch(removeTicket(id));
        refreshCleintOrders();
        refreshClientRoutes();
      } else {
        throw new Error('Помилка на сервері');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteAccount = (userId) => {
    console.log('userId = ' + userId);
    const url = `${API_URL}api/todoapp/DeleteClient?id=${userId}`;
    fetch(url, {
      method: 'DELETE'
    })
    .then(response => response.text())
    .then(data => {
      //alert(data);
      dispatch(rememberUser(""));
      //dispatch(rememberTickets([]));
      navigate("/");
    });
  }

  return (
    <div className="user-profile">
      <div className="Name">Name: {user.Name}</div> 
      <div className="Surname">Surname: {user.Surname}</div> 
      <div>Phone: {user.Phone}</div>
      <div>Address: {user.Address}</div>
      <div>
        <button onClick={() => handleDeleteAccount(userId)}>Delete Account</button>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <div>
        <h2>Путівки: </h2>
          <ul>
              { 
                clientOrders.map((order, index) => (
                  <li key={tickets[index]}>
                    <span>#{index + 1}</span>
                    <span>Вартість путівки: <b style={{textDecoration: tickets.length > 1 ? 'line-through' : ''}}>{order.ticket_cost}</b> {discount && <b>Знижка:  {parseInt((100 - discount) / 100 * order.ticket_cost)}</b>}</span>
                    <span>Кількість осіб: { order.amount }</span>
                    <span>День відправки: { order.departure_date }</span>
                    <span className='delete' onClick={() => handleRemoveOrder(tickets[index])}>&times;</span>
                  </li>
                ))
              }
          </ul>
        </div>

        <div>
          <h2>Маршрути: </h2>
          <ul>
              { 
                clientRoutes.map((route, index) => (
                  <li key={tickets[index]}>
                    <span>#{index + 1}</span>
                    <span>Країна: { route.country }</span>
                    <span>Клімат: { route.climate }</span>
                    <span>Тривалість путівки: { route.travel_duration } днів</span>
                    <span>Готель: { route.hotel }</span>
                  </li>
                ))
              }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;