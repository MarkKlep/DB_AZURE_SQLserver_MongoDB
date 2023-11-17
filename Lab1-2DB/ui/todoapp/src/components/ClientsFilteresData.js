import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ClientsFilteredData = () => {
  const API_URL = "http://localhost:5228/";
  const [clientData, setClientData] = useState([]);
  const [selectedCategoryHotel, setSelectedCategoryHotel] = useState(0);
  const [selectedCategoryPriceMoreThan, setSelectedCategoryPriceMoreThan] = useState(0);

  const handleCategoryHotelChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategoryHotel(newCategory);
  };

  const handleAscPrice = () => {
    fetch(API_URL + "api/todoapp/ClientsFilteredDataPriceAsc")
    .then(response => response.json())
    .then(data => setClientData(data));
  }

  const handleDescPrice = () => {
    fetch(API_URL + "api/todoapp/ClientsFilteredDataPriceDesc")
    .then(response => response.json())
    .then(data => setClientData(data));
  }

  useEffect(() => {
    fetch(`${API_URL}api/todoapp/ClientsFilteredData?categoryId=${selectedCategoryHotel}`)
      .then((response) => response.json())
      .then((data) => setClientData(data));
  }, [selectedCategoryHotel]);

  useEffect(() => {
    fetch(API_URL + "api/todoapp/ClientsFilteredDataPrice?categoryId=" + selectedCategoryPriceMoreThan)
      .then(response => response.json())
      .then(data => setClientData(data))
  }, [selectedCategoryPriceMoreThan]);

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text("PDF FORM", 10, 10);
    const data = clientData.map((item) => [item.name, item.country, item.travel_duration, item.amount, item.ticket_cost, item.hotel]);
    doc.autoTable({
      head: [["Name", "Country", "Travel Duration", "Amount", "Ticket Cost", "Hotel"]],
      body: data,
    });
    doc.save("admin_report.pdf");
  };
  

  return (
    <div>
      <div>
        <label>Оберіть категорію:</label>
        <select value={selectedCategoryHotel} onChange={handleCategoryHotelChange}>
          <option value={'0'}>Усі готелі</option>
          <option value={'Grand Hotel'}>Grand Hotel</option>
          <option value={'Prima Hotel'}>Prima Hotel</option>
          <option value={'Beach Paradise'}>Beach Paradise</option>
          <option value={'Acropolis Hotel'}>Acropolis Hotele</option>
          <option value={'Italiano Hotel'}>Italiano Hotel</option>
        </select>

        <select value={selectedCategoryPriceMoreThan} onChange={e => setSelectedCategoryPriceMoreThan(e.target.value)}>
          <option value="0">Встановіть мінімальну ціну</option>
          <option value="1000">1000 грн.</option>
          <option value="2000">2000 грн.</option>
          <option value="3000">3000 грн.</option>
          <option value="5000">5000 грн.</option>
          <option value="10000">10000 грн.</option>
        </select>

        <button onClick={handleAscPrice}>За зростанням</button>
        <button onClick={handleDescPrice}>За спаданням</button>
        <div>
          <button onClick={generatePDFReport}>Згенерувати PDF-звіт</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>country</th>
            <th>travel_duration</th>
            <th>amount</th>
            <th>ticket_cost</th>
            <th>hotel</th>
          </tr>
        </thead>
        <tbody>
          {clientData.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.country}</td>
              <td>{item.travel_duration}</td>
              <td>{item.amount}</td>
              <td>{item.ticket_cost}</td>
              <td>{item.hotel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsFilteredData;
