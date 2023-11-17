import React, { useEffect, useState } from 'react';

const TicketPriceList = () => {
    const [ticketCostCounts, setTicketCostCounts] = useState([]);
    const [avgPrice, setAvgPrice] = useState(null);
    const [clientsAmount, setClientsAmount] = useState(null);
    const [income, setIncome] = useState(0);
    const [maxPriceTicket, setMaxPriceTicket] = useState(0);

    const API_URL = "http://localhost:5228/";

    useEffect(() => {
      fetch(API_URL + 'api/todoapp/GetTicketCostCounts')
        .then((response) => response.json())
        .then((data) => setTicketCostCounts(data));
    }, []);

    useEffect(() => {
        fetch(API_URL + 'api/todoapp/GetAverageTicketCost')
          .then(response => response.json())
          .then(data => setAvgPrice(data));
    }, []);

    useEffect(() => {
        fetch(API_URL + 'api/todoapp/GetClientCount')
          .then(response => response.json())
          .then(data => setClientsAmount(data));
    }, []);

    useEffect(() => {
      fetch(API_URL + 'api/todoapp/GetIncome')
        .then(response => response.json())
        .then(data => setIncome(data));
    }, []);

    useEffect(() => {
      fetch(API_URL + 'api/todoapp/GetMaxPriceTicket')
        .then(response => response.json())
        .then(data => setMaxPriceTicket(data));
    }, []);
  
    return (
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <div>
          <h2>Кількість білетів за певною ціною:</h2>
          <ul>
            {ticketCostCounts.map((item, index) => (
              <li key={index}>
                Ticket Cost: {item.ticket_cost}, Ticket Count: {item.ticket_count}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2>Середня вартість квитка:</h2>
          <strong>AVG:</strong> {avgPrice} <span>грн.</span>
        </div>

        <div>
          <h2>Кількість клієнтів сайту:</h2>
          <strong>Amount:</strong> {clientsAmount}
        </div>
        <div>
          <h2>Дохід від клієнтів сайту:</h2>
          <strong>Total income:</strong> {income} <span>грн.</span>
        </div>
        <div>
          <h2>Найдорожчий квиток:</h2>
          <strong>Max price ticket:</strong> {maxPriceTicket} <span>грн.</span>
        </div>
      </div>
    );
  };

export default TicketPriceList;