import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"; // Adjust the import as per your folder structure
import { Home } from "./components/pages/Home";
import PublicServices from "./components/MapFile/PublicServices";
import PrivateHospitals from "./components/MapFile/PrivateHospitals";
import Grooming from "./components/MapFile/Grooming";
import DogFriendlyPlaces from "./components/MapFile/DogFriendlyPlaces";
import Training from "./components/MapFile/Training";
import Daycare from "./components/MapFile/Daycare";
import About from "./About/About";
import ContactPage from "./Complain/ContactForm";
import AdoptionHouse from "./components/MapFile/AdoptionHouse";
import Contactus from "./components/pages/Contactus";

// import Complain from "./components/Complain/Complain";

// import PrivateHospitals from "./pages/PrivateHospitals";
// import KnowTheBreed from "./pages/KnowTheBreed";
// import DogMarketplace from "./pages/DogMarketplace";
// import Ecommerce from "./pages/Ecommerce";
// import Grooming from "./pages/Grooming";
// import DogFriendlyPlaces from "./pages/DogFriendlyPlaces";
// import Training from "./pages/Training";
// import Daycare from "./pages/Daycare";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";

const App = () => {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* <Route path="/aboutus" element={<About/> }/> */}
        <Route path="/public-services" element={<PublicServices/>} />
        <Route path="/private-hospitals" element={<PrivateHospitals/>} />
        <Route path="/complain" element={<ContactPage/>}/>
        <Route path="/contact" element={<Contactus/>}/>
        <Route path="/adoption-house" element={<AdoptionHouse/>} />
        <Route path="/grooming" element={<Grooming />} />
        <Route path="/dog-friendly-places" element={<DogFriendlyPlaces/>} />
        <Route path="/training" element={<Training/>} />
        <Route path="/daycare" element={<Daycare/>} />
      </Routes>
    </Router>
  );
};

export default App;
