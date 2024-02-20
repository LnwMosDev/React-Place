import React from 'react';
import ListPlace from './ListPlace';
import Nav from './Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Contact from './Contact';
import NamePlace from './namePlace';
import AdminLogin from './AdminLogin';
import Admin from './Admin';





function App() {
  const serverName = "http://localhost:8080/apiPlace/";
  // const serverName = "http://student.crru.ac.th/641413019/apiPlace/";

  return (
    <BrowserRouter>
      <Nav />
      <div className="container mx-auto px-6 py-8">
        <Routes>
          <Route index element={<ListPlace serverName={serverName}/>} />
          <Route path="/NamePlace" element={<NamePlace/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/Admin" element={<Admin />} /> 
          
         
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
