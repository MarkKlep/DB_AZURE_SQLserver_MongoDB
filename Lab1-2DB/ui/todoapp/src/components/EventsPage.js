import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function EventsPage() {
    const [events, setEvents] = useState([]);
    const [text, setText] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editingEventId, setEditingEventId] = useState(null);


    const API_URL = 'http://localhost:5038/';

    const adminEnter = useSelector(state => state.admin.adminEnter);

    const refreshEvents = async () => {
        fetch(API_URL + "api/eventapp/GetEvents")
        .then(response => response.json())
        .then(data => setEvents(data))
    }

    useEffect(() => {
        refreshEvents();
    }, [events]);

    const handleAddEvent = async () => {
        if(text.trim().length) {
            const data = new FormData();
            data.append("newEvent", text);

            fetch(API_URL + 'api/eventapp/AddEvent', {
                method: 'POST',
                body: data
            })
            .then(response => response.json())
            .then(data => alert(data))
            

            setText('');
        }
    }

    const handleDeleteEvent = async (id) => {

        fetch(API_URL + 'api/eventapp/DeleteEvent?id='+id, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => alert(data))
    }

    const handleEditEvent = async (id) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("description", editedDescription);
        console.log(formData);
        fetch(API_URL + 'api/eventapp/UpdateEvent', {
            method: 'PUT',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            alert(data); 
            setEditingEventId(null);
        });
    }

    return (
        <div>

            {
                adminEnter && (
                    <div>
                        <textarea 
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="description..."
                        />
                        <button onClick={handleAddEvent}>Add Event</button>
                    </div>
                )
            }

            <ul>
                {
                    events.map(el => (
                        <li key={el.id}>
                            {editingEventId === el.id ? (
                                <div>
                                    <textarea
                                        type="text"
                                        value={editedDescription}
                                        onChange={e => setEditedDescription(e.target.value)}
                                    />
                                    <button onClick={() => handleEditEvent(el.id)}>Save</button>
                                </div>
                            ) : (
                                <span>{el.description}</span>
                            )}

                            {adminEnter && (
                                <button onClick={() => {setEditingEventId(el.id); setEditedDescription(el.description)}}>Edit Event</button>
                            )}
                            {adminEnter && <button onClick={() => handleDeleteEvent(el.id)}>Delete Event</button>}
                        </li>
                    ))
                }
            </ul>


        </div>
    );
}

export default EventsPage;