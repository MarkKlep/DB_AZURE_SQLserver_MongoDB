import React, { useState } from 'react';
import "../style/RegistrationFormStyle.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { rememberUser } from '../store/userSlice';


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    surname: '',
    name: '',
    patronymic: '',
    address: '',
    phone: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_URL = "http://localhost:5228/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const clientData = {
      Surname: formData.surname,
      Name: formData.name,
      Patronymic: formData.patronymic,
      Address: formData.address,
      Phone: formData.phone
    };

    // відправка на сервер
    fetch(API_URL + 'api/todoapp/AddClient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientData)
    })
      .then((response) => {
        if (response.ok) {

          return response.json();
        } else {
          throw new Error('Помилка на сервері');
        }
      })
      .then((data) => {
        const userId = data;
        dispatch(rememberUser({
          UserId: userId,
          Surname: formData.surname,
          Name: formData.name,
          Patronymic: formData.patronymic,
          Address: formData.address,
          Phone: formData.phone
        }));
        console.log(userId);
        navigate('/');
      })
      .catch((error) => {
        setError(error);
      }
    );
  };

  return (
    <div>
      <h2>Реєстрація</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Прізвище:</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ім'я:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Побатькові:</label>
          <input
            type="text"
            name="patronymic"
            value={formData.patronymic}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Адреса:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Телефон:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{display: "flex", justifyContent: 'space-around', alignItems: 'center'}}>
          <button type="submit">Зареєструватись</button>
          <Link to="/registration_page/authorization_page">Вже є аккаунт?</Link>
        </div>
      </form>

      <div>
        {error && <div style={{textAlign: 'center'}}>{error.message}</div>}
      </div>

      <Outlet/>

    </div>
  );
};

export default RegistrationForm;