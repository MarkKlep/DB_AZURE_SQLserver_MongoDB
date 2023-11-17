import React from 'react';
import "../style/TourTable.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function TourTable({ tours }) {

  const user = useSelector(state => state.user.userProfile);
  const navigate = useNavigate();

  const handleToBook = (tour) => {  
    if(user === "") {
      alert("Ви маєте зареєструватися");
      return;
    }

    navigate(`/order_page/${JSON.stringify(tour)}`); 
  }

  return (
    <table className='tour-table'>
      <thead>
        <tr>
          <th>Країна</th>
          <th>Клімат</th>
          <th>Тривалість</th>
          <th>Готель</th>
          <th>Вартість на людину</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tours.map((tour) => (
          <tr key={tour.id}>
            <td>{tour.country}</td>
            <td>{tour.climate}</td>
            <td>{tour.travel_duration}</td>
            <td>{tour.hotel}</td>
            <td>{tour.cost}</td>
            <td><button onClick={() => handleToBook(tour)}>Замовити</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TourTable;
