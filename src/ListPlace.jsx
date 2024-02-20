
// ListPlace.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import "./App.css";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import SelectedPlaceModal from "./SelectedPlaceModal";

const ListPlace = () => {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const serverName = "http://localhost:8080/apiPlace/";
  // const serverName = "http://student.crru.ac.th/641413019/apiPlace/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          // "http://student.crru.ac.th/641413019/apiPlace/"
          "http://localhost:8080/apiPlace/"
        );
        setPlaces(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (place) => {
    setSelectedPlace(place);
  };

  const handleCloseModal = () => {
    setSelectedPlace(null);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const maxDescriptionLength = 220;

  const filteredPlaces = places.filter((place) => {
    const { name, descript } = place;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(lowerCaseSearchTerm) ||
      descript.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = filteredPlaces.slice(indexOfFirstPlace, indexOfLastPlace);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPlace = () => {
    const currentIndex = places.indexOf(selectedPlace);
    if (currentIndex > 0) {
      setSelectedPlace(places[currentIndex - 1]);
    }
  };

  const goToNextPlace = () => {
    const currentIndex = places.indexOf(selectedPlace);
    if (currentIndex < places.length - 1) {
      setSelectedPlace(places[currentIndex + 1]);
    }
  };

  return (
    <div className="container mx-auto font-th-sarabun text-xl font-family: 'Kanit', sans-serif;">
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="ค้นหาสถานที่ท่องเที่ยว..."
          className="border border-gray-300 rounded-md px-20 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {currentPlaces.map((place) => (
    <div
      key={place.id}
      className="bg-white p-4 shadow-md rounded-md flex flex-col cursor-pointer"
    >
      <div className="w-full h-80 mb-4 rounded-md overflow-hidden">
        <Rating
          name={"rating" + place.id}
          defaultValue={place.score}
          readOnly
          precision={0.5}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <img
          src={place.img}
          alt={place.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-2xl font-bold mb-2 leading-tight">{place.name}</h3>
        <p className="text-gray-500 text-sm mb-4 leading-snug">
          {truncateText(place.descript, maxDescriptionLength)}
        </p>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={() => handleCardClick(place)}
      >
        รายละเอียด
      </button>
    </div>
  ))}
</div>


      {selectedPlace && (
        <SelectedPlaceModal
          selectedPlace={selectedPlace}
          handleCloseModal={handleCloseModal}
          goToPreviousPlace={goToPreviousPlace}
          goToNextPlace={goToNextPlace}
          places={places}
          serverName={serverName}
        />
      )}

      <div className="flex justify-center mt-4">
        <button
          className="mx-2 py-2 px-4 rounded bg-gray-200 hover:bg-gray-300"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          ก่อนหน้า
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`mx-2 py-2 px-4 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="mx-2 py-2 px-4 rounded bg-gray-200 hover:bg-gray-300"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default ListPlace;
