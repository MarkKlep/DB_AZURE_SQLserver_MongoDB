import React, { useEffect, useState } from 'react';

const ClientList = () => {
  const [clients, setClients] = useState([]);

  const API_URL = "http://localhost:5228/";

  useEffect(() => {
    fetch(API_URL + 'api/todoapp/GetClients')
      .then(response => response.json())
      .then(data => setClients(data));
  }, []);

  return (
    <div className="client-list-container">
        <h2>Список Клієнтів:</h2>
        <ul className="client-list">
            {clients.map(client => (
            <li key={client.id} className="client-item">
                <div className="client-info">
                    <div>
                        <strong>Прізвище:</strong> {client.surname}
                    </div>
                    <div>
                        <strong>Ім'я:</strong> {client.name}
                    </div>
                    <div>
                        <strong>По-батькові:</strong> {client.patronymic}
                    </div>
                    <div>
                        <strong>Адреса:</strong> {client.address}
                    </div>
                    <div>
                        <strong>Телефон:</strong> {client.phone}
                    </div>
                </div>
            </li>
            ))}
        </ul>
    </div>
  );
};

export default ClientList;