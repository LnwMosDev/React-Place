import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function Dashborad() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    descript: "",
    img: "",
    type: "",
    score: "",
  });
  const [selectedPlace, setSelectedPlace] = useState(null);
  const formRef = useRef(null); // Create a ref for the form element

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Fetch data from the API
    fetch("http://localhost:8080/apiPlace/")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => {
        console.error("Error fetching data from the API:", error);
      });
  };

  const handleFormOpen = () => {
    setSelectedPlace(null);
    setFormData({
      id: "",
      name: "",
      descript: "",
      img: "",
      type: "",
      score: "",
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((updatedPlace) => {
          // Assuming the API returns the updated data, you can update the state with it
          setData(
            data.map((place) =>
              place.id === updatedPlace.id ? updatedPlace : place
            )
          );
          setFormData({
            id: "",
            name: "",
            descript: "",
            img: "",
            type: "",
            score: "",
          });
          setShowForm(false);
          window.alert("แก้ไขข้อมูลสำเร็จ !! ทำการรีเฟรชหน้า");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating data to the API:", error);
        });
    } else {
      fetch("http://localhost:8080/apiPlace/", {
        method: "INSERT_ADMIN",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((newPlace) => {
          setData([...data, newPlace]);
          setFormData({
            id: "",
            name: "",
            descript: "",
            img: "",
            type: "",
            score: "",
          });
          setShowForm(false);
        })
        .catch((error) => {
          console.error("Error sending data to the API:", error);
        });
      window.alert("เพิ่มข้อมูลสำเร็จ !! ทำการรีเฟรชหน้า");
      window.location.reload();
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (id) => {
    const confirmed = window.confirm("ต้องการแก้ไขสถานที่นี้หรือไม่ ?");
    if (confirmed) {
      const placeToEdit = data.find((place) => place.id === id);
      if (placeToEdit) {
        setSelectedPlace(placeToEdit);
        setFormData({
          id: placeToEdit.id,
          name: placeToEdit.name,
          descript: placeToEdit.descript,
          img: placeToEdit.img,
          type: placeToEdit.type,
          score: placeToEdit.score,
        });
        setShowForm(true);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
  };
  const handleDelete = (id) => {
    // Show a confirmation dialog before proceeding with the deletion
    const confirmDelete = window.confirm("ต้องการลบสถานที่นี้หรือไม่ ?");

    if (confirmDelete) {
      // Send a DELETE request to the API to remove the place with the specified ID
      fetch(`http://localhost:8080/apiPlace/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Send the ID of the place to be deleted in the request body
      })
        .then((response) => response.json())
        .then(() => {
          // Update the state to remove the deleted place from the data array
          setData(data.filter((place) => place.id !== id));
          window.location.reload(); // You may choose to reload the page or not after deletion
        })
        .catch((error) => {
          console.error("Error deleting data from the API:", error);
        });
    } else {
      // If the user cancels the deletion, do nothing
      console.log("Deletion canceled.");
    }
  };
  return (
    <div style={{ marginTop: "2%", marginLeft: "2%" }}>
      <Button variant="contained" color="primary" onClick={handleFormOpen}>
        เพิ่มข้อมูลสถานที่ท่องเที่ยว
      </Button>

      {showForm && (
        <div ref={formRef} style={{ marginTop: "20px" }}>
          <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
            {/* <TextField
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            /> */}
            <TextField
              label="ชื่อสถานที่"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            {/* Adjust the width of the Description field */}
            <TextField
              label="คำอธิบาย"
              name="descript"
              value={formData.descript}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <TextField
              label="รูปภาพ"
              name="img"
              value={formData.img}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            <TextField
              label="ประเภท"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
            {/* <TextField
              label="คะแนนรวม"
              name="score"
              value={formData.score}
              onChange={handleInputChange}
              fullWidth
              style={{ marginBottom: "20px" }}
            /> */}
            <br />
            <Button
              variant="contained"
              color="success"
              type="submit"
              style={{ marginRight: "10px", marginBottom: "5%" }}
            >
              {selectedPlace ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleFormClose}
              style={{ marginRight: "10px", marginBottom: "5%" }}
            >
              ยกเลิก
            </Button>
          </form>
        </div>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ลำดับ</TableCell>
              <TableCell>ชื่อสถานที่</TableCell>
              <TableCell>คำอธิบาย</TableCell>
              <TableCell>รูปภาพ</TableCell>
              <TableCell>ประเภท</TableCell>
              {/* <TableCell>คะแนน</TableCell> */}
              <TableCell>ปุ่มจัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((place) => (
              <TableRow key={place.id}>
                <TableCell>{place.id}</TableCell>
                <TableCell>{place.name}</TableCell>
                <TableCell>{place.descript}</TableCell>
                <TableCell>
                  <img
                    src={place.img}
                    alt={place.name}
                    style={{ width: "100px" }}
                  />
                </TableCell>
                <TableCell>{place.type}</TableCell>
                {/* <TableCell>{place.score}</TableCell> */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(place.id)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(place.id)}
                  >
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

export default Dashborad;
