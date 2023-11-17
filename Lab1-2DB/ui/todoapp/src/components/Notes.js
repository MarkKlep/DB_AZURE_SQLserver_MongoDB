import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Notes = () => {
    const [notes, setNotes] = useState([]);

    const API_URL = "http://localhost:5228/";

    const adminEnter = useSelector(state => state.admin.adminEnter);
  
    useEffect(()=>{
      refreshNotes();
    }, []);
  
    const refreshNotes = async () => {
      fetch(API_URL + "api/todoapp/GetNotes").then(response=>response.json())
      .then(data=>{
        setNotes(data);
      })
    }
  
    const addClick = async () => {
      const newNotes = document.getElementById("newNotes").value;
      const data = new FormData();
      data.append("newNotes", newNotes);
  
      fetch(API_URL + "api/todoapp/AddNotes", {
        method: "POST",
        body: data
      }).then(res => res.json())
      .then(result => {
        alert(result);
        refreshNotes();
      })
    }
  
    const deleteClick = async (id) => {
      const newNotes = document.getElementById("newNotes").value;
      const data = new FormData();
      data.append("newNotes", newNotes);
  
      fetch(API_URL + "api/todoapp/DeleteNotes?id="+id, {
        method: "DELETE",
        body: data
      }).then(res => res.json())
      .then(result => {
        alert(result);
        refreshNotes();
      })
    }
  
    return (
      <div className="App">
  
        <h2>Сторінка скарг та побажань</h2>
  
        <textarea type="text" id="newNotes"/>
        <button onClick={()=>addClick()}>Залишити коментар</button>
  
        <ul>
          {
            notes.map(note => (
              <li>
                <span>{ note.description }</span>
                {adminEnter && <button onClick={()=>deleteClick(note.id)}>Delete Note</button>}
              </li>
            ))
          }
        </ul>
  
      </div>
    );
}

export default Notes;