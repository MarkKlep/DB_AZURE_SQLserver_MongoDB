import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { rememberUser, rememberTickets } from '../store/userSlice';
import "../style/RegistrationFormStyle.css";

const Authorization = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        address: '',
        phone: ''
    });
    const [clientExist, setClientExist] = useState(true);

      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };
    
      const API_URL = "http://localhost:5228/";

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const clientData = {
          Address: formData.address,
          Phone: formData.phone
        };
        console.log(`Address: ${formData.address},
        Phone: ${formData.phone}`);
        const url = API_URL + `api/todoapp/CheckUser?address=${clientData.Address}&phone=${clientData.Phone}`;
        try {
          const response = await fetch(url);
          console.log(response);
          const data = await response.json();
          console.log(data);
          console.log("data = " + data[0]);
          if(data.length !== 0) {
            setClientExist(true);
            dispatch(rememberUser({
              UserId: data[0].id,
              Surname: data[0].surname,
              Name: data[0].name,
              Patronymic: data[0].patronymic,
              Address: data[0].address,
              Phone: data[0].phone
            }));

            for(let i = 0; i < data.length; i++){
              dispatch(rememberTickets(data[i].id));
            }
          }
          else {
            setClientExist(false);
          }
        }
        catch(error) {
          console.error('Помилка:', error);
        }
      }
    
      return (
        <div>
          <h2>Авторизація</h2>
          <form onSubmit={handleSubmit}>
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
            <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <button type="submit">Увійти</button>
              {!clientExist && <span style={{color: 'red'}}>Клієнта не знайдено</span>}
            </div>
          </form>
    
        </div>
      );
}

export default Authorization
