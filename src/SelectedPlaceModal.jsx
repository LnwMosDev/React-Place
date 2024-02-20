import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Rating, TextField, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import "./SelectedPlaceModal.css"; // นำเข้าไฟล์ CSS เพิ่มเติม

const SelectedPlaceModal = ({ selectedPlace, handleCloseModal, goToPreviousPlace, goToNextPlace, places, serverName }) => {
    const [data, setData] = useState({
        id: selectedPlace.id,
        rating: 0,
        comment: ""
    });

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
        console.log(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to save comment and rating to the backend
        console.log(serverName);
        fetch(serverName, {
          method: 'POST',
          mode: 'no-cors', // Add this line
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((responseData) => {
            console.log(responseData);
            // Clear comment and rating fields
            setData({
              id: selectedPlace.id, // แก้เป็น selectedPlace.id
              comment: '',
              rating: 0,
            });
          })
          .catch((error) => {
            console.error('Error:', error);
          })
          .finally(() => {
            window.location.reload();
          });
      };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(serverName);
    //     console.log(data); // แสดงค่าข้อมูลก่อนส่งไปยัง backend
        
    //     fetch(serverName, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(data),
    //     })
    //       .then((response) => response.json())
    //       .then((responseData) => {
    //         console.log(responseData);
    //         // Clear comment and rating fields
    //         setData({
    //           id: selectedPlace.id,
    //           comment: '',
    //           rating: 0,
    //         });
    //       })
    //       .catch((error) => {
    //         console.error('Error:', error);
    //       })
    //       .finally(() => {
    //         window.location.reload();
    //       });
    //   };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 max-w-md mx-auto rounded-md selected-place-modal">
                <div className="flex justify-end">
                    <button className="text-gray-500 hover:text-red-600" onClick={handleCloseModal}>
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
                <div className="text-center">
                    <h3 className="text-3xl font-bold mb-4">{selectedPlace.name}</h3>
                </div>
                <div className="w-full h-80 mb-4 rounded-md overflow-hidden">
                    <Rating
                        name={"rating" + selectedPlace.id}
                        defaultValue={selectedPlace.score}
                        readOnly
                        precision={0.5}
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <img src={selectedPlace.img} alt={selectedPlace.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-gray-500 mb-4 text-lg leading-snug">{selectedPlace.descript}</p>
                <p className="text-gray-500 mb-4 text-lg leading-snug">ประเภทแหล่งท่องเที่ยว : {selectedPlace.type}</p>

                <p>
                    <h6>ความคิดเห็น</h6>
                    <ul>
                        {Object.values(selectedPlace.comment).map((comment, index) => (
                            <li key={index}>{comment.comment_text} โหวต {comment.vote}</li>
                        ))}
                    </ul>
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="hidden"
                        name="id"
                        value={selectedPlace.id} // แก้เป็น selectedPlace.id
                        onChange={handleChange}
                    />
                    <Rating
                        name="rating"
                        value={data.rating}
                        precision={0.5}
                        onChange={handleChange}
                    />
                    <p>
                        <TextField
                            label="แสดงความคิดเห็น"
                            multiline
                            rows={4}
                            name="comment"
                            value={data.comment}
                            onChange={handleChange}
                            style={{ width: '100%' }}
                        />
                    </p>

                    <Button type="submit" variant="contained" color="primary">ส่งความคิดเห็น</Button>
                </form>

                <br />
                {<div className="flex justify-between">
                    <button
                        className="mx-2 py-2 px-4 rounded bg-gray-200 hover:bg-blue-500"
                        onClick={goToPreviousPlace}
                        disabled={places.indexOf(selectedPlace) === 0}
                    >
                        &lt; ก่อนหน้า
                    </button>
                    <button
                        className="mx-2 py-2 px-4 rounded bg-gray-200 hover:bg-blue-500"
                        onClick={goToNextPlace}
                        disabled={places.indexOf(selectedPlace) === places.length - 1}
                    >
                        ถัดไป &gt;
                    </button>
                </div>}
            </div>
        </div>
    );
};

export default SelectedPlaceModal;
