import React, { useEffect, useState, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Admin() {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        descript: '',
        img: '',
        type: '',
        score: ''
    });
    const [selectedPlace, setSelectedPlace] = useState(null);
    const formRef = useRef(null); // Create a ref for the form element

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        // Fetch data from the API
        fetch('http://localhost:8080/apiPlace/')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => {
                console.error('Error fetching data from the API:', error);
            });
    };

    const handleFormOpen = () => {
        setSelectedPlace(null);
        setFormData({
            id: '',
            name: '',
            descript: '',
            img: '',
            type: '',
            score: ''
        });
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (selectedPlace) {
            // Send the form data to the API using an HTTP PUT request if a place is selected for editing
            fetch(`http://localhost:8080/apiPlace/${selectedPlace.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(updatedPlace => {
                    // Assuming the API returns the updated data, you can update the state with it
                    setData(data.map(place => (place.id === updatedPlace.id ? updatedPlace : place)));
                    setFormData({
                        id: '',
                        name: '',
                        descript: '',
                        img: '',
                        type: '',
                        score: ''
                    });
                    setShowForm(false);
                })
                .catch(error => {
                    console.error('Error updating data to the API:', error);
                });
        } else {
            fetch('http://localhost:8080/apiPlace/', {
                method: 'CREATE_ADMIN',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(newPlace => {

                    setData([...data, newPlace]);
                    setFormData({
                        id: '',
                        name: '',
                        descript: '',
                        img: '',
                        type: '',
                        score: ''
                    });
                    setShowForm(false);
                })
                .catch(error => {
                    console.error('Error sending data to the API:', error);
                });

        }
        window.location.reload();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEdit = (id) => {
        // Find the selected place from the data array based on the ID
        const placeToEdit = data.find(place => place.id === id);
        if (placeToEdit) {
            setSelectedPlace(placeToEdit);
            setFormData({
                id: placeToEdit.id,
                name: placeToEdit.name,
                descript: placeToEdit.descript,
                img: placeToEdit.img,
                type: placeToEdit.type,
                score: placeToEdit.score
            });
            setShowForm(true);

            // Scroll the form into view
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Scroll to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleDelete = (id) => {
        // Show a confirmation dialog before proceeding with the deletion
        const confirmDelete = window.confirm('Are you sure you want to delete this place?');

        if (confirmDelete) {
            // Send a DELETE request to the API to remove the place with the specified ID
            fetch(`http://localhost:8080/apiPlace/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id }) // Send the ID of the place to be deleted in the request body
            })
                .then(response => response.json())
                .then(() => {
                    // Update the state to remove the deleted place from the data array
                    setData(data.filter(place => place.id !== id));
                })
                .catch(error => {
                    console.error('Error deleting data from the API:', error);
                });
        } else {
            // If the user cancels the deletion, do nothing
            console.log('Deletion canceled.');
        }
        // window.location.reload(); // You may choose to reload the page or not after deletion
    };

    return (
        <div style={{ marginTop: '5%' }}>
            <Button variant="contained" color="primary" onClick={handleFormOpen}>
                Add Data
            </Button>

            {showForm && (
                <div ref={formRef}> {/* Use the ref on the form container */}
                    {/* Common form for adding and editing */}
                    <form onSubmit={handleSubmit}>
                        <TextField label="ID" name="id" value={formData.id} onChange={handleInputChange} />
                        <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} />
                        <TextField label="Descript" name="descript" value={formData.descript} onChange={handleInputChange} />
                        <TextField label="Image" name="img" value={formData.img} onChange={handleInputChange} />
                        <TextField label="Type" name="type" value={formData.type} onChange={handleInputChange} />
                        <TextField label="Score" name="score" value={formData.score} onChange={handleInputChange} />
                        <br />
                        <Button variant="contained" color="success" type="submit">
                            {selectedPlace ? 'Edit' : 'Add'}
                        </Button>
                        <Button variant="contained" color="error" onClick={handleFormClose}>
                            Cancel
                        </Button>
                    </form>
                </div>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(place => (
                            <TableRow key={place.id}>
                                <TableCell>{place.id}</TableCell>
                                <TableCell>{place.name}</TableCell>
                                <TableCell>{place.descript}</TableCell>
                                <TableCell>
                                    <img src={place.img} alt={place.name} style={{ width: '100px' }} />
                                </TableCell>
                                <TableCell>{place.type}</TableCell>
                                <TableCell>{place.score}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleEdit(place.id)}>
                                        <EditIcon />
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(place.id)}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Admin;
