import React, { useState, useEffect } from 'react';
import TourTable from './TourTable';
import "../style/TourCompanyPage.css";

function TourCompanyPage() {
    const [tours, setTours] = useState([]);
    const [error, setError] = useState(null);

    const API_URL = "http://localhost:5228/";
  
    useEffect(()=>{
      refreshTours();
    }, []);
  
    const refreshTours = async () => {
      fetch(API_URL + "api/todoapp/GetRoutes")
      .then(response=>{
        return response.json();
      })
      .then(data=>{
        setTours(data);
      })
      .catch(error=>{
        setError(error);
      })
    }
  

  return (
    <div className="tour-company-page">
      <h2>Ласкаво просимо до нашої туристическую фірму</h2>
      <p>Ми пропонуємо кращі тури и пригоди по всьому світу</p>
      {error && <b>{error.message}</b>}
      {!error && <TourTable tours={tours} />}
    </div>
  );
}

export default TourCompanyPage;