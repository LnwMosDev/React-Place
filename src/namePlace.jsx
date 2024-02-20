import React, { useState, useEffect } from 'react';

const NamePlace = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // fetch('http://student.crru.ac.th/641413019/apiPlace/')
    fetch('http://localhost:8080/apiPlace/')
      .then(response => response.json())
      .then(data => setPlaces(data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="container mx-auto px-4 font-th-sarabun-new">
      <h1 className="text-2xl font-bold flex items-center justify-center">รายชื่อสถานที่ท่องเที่ยว</h1>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">ลำดับที่</th>
            <th className="px-4 py-2">ชื่อ</th>
            <th className="px-4 py-2">ประเภทแหล่งท่องเที่ยว</th>
            <th className="px-4 py-2">รูปภาพ</th>
          </tr>
        </thead>
        <tbody>
          {places.map(place => (
            <tr key={place.id}>
              <td className="border px-4 py-2">{place.id}</td>
              <td className="border px-4 py-2">{place.name}</td>
              <td className="border px-4 py-2">{place.type}</td>
              <td className="border px-4 py-2">
                <img src={place.img} alt={place.name} width="100" height="100" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NamePlace;
