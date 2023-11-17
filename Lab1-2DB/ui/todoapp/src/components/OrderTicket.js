import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { rememberTickets } from '../store/userSlice';
import "../style/OrderTicketStyle.css";

const OrderTicket = () => {
  const [price, setPrice] = useState(null);
  const [amount, setAmount] = useState(1);
  const [departure, setDeparture] = useState(null);
  const [error, setError] = useState(null);
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false);

  const { tour } = useParams();
  const tourData = JSON.parse(tour);
  const userId = useSelector(state => state.user.userProfile.UserId);
  const tourId = tourData.id;

  const API_URL = "http://localhost:5228/";

  const dispatch = useDispatch();

  useEffect(() => {
    setPrice(tourData.cost * amount)
  }, [amount]);

  const handlePayTicket = (e) => {
    e.preventDefault();

    const ticketData = {
        RouteId: tourId,
        ClientId: userId,
        DepartureDate: departure,
        Amount: parseInt(amount),
        Discount: 0,
        TicketCost: price
    }
    console.log(ticketData);

    // відправка на сервер
    fetch(API_URL + 'api/todoapp/AddTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticketData)
      })
        .then((response) => {
          if (response.ok) {
            setIsRequestSuccessful(true);
            return response.json();
          } else {
            throw new Error('Помилка на сервері');
          }
        })
        .then((ticket) => {
            dispatch(rememberTickets(ticket));
            console.log("Ticket id = " + ticket);
        })
        .catch((error) => {
          setError(error);
        }
    );
        
  }

  return (
    <div className='container-order-ticket'>
        <h2>Ваша путівка</h2>

        <form onSubmit={handlePayTicket}>
            <label>Країна: {tourData.country}</label>
            <label>Ціна на людину: {price}</label>
            <label>Путівка на 
            <input 
                value={amount}
                type='number' 
                min={1} max={10}
                onChange={e => setAmount(e.target.value)} 
                onKeyDown={e => e.preventDefault()}
            />
            людей</label>

            <label>День відправки:</label>
            <input value={departure} type='date' onChange={e => setDeparture(e.target.value)} />
            <div>
                <button type="submit">Сплатити квиток</button>
            </div>
        </form>

        {isRequestSuccessful && <div style={{textAlign: 'center', color: 'green'}}>Замовлення виконано успішно</div>}
        <div>{error && error.message}</div>

    </div>
  )
}

export default OrderTicket;