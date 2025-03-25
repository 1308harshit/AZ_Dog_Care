// import React from "react";
// import "./home.css";

// export const Home = () => {
//   return (
//     <>
//       <h1 className="home-h1"><span className="funny-font">Welcome To</span> <span className="funny-font">AZ Dog Care</span></h1>
//       <div class="container">
//         <div class="grid-container">
//           <div class="card"><h3>Public Services</h3><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, possimus.</p></div>
//           <div class="card"><h3>lorem</h3><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, possimus.</p></div>
//           <div class="card"><h3>lorem</h3><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, possimus.</p></div>
//           <div class="card"><h3>lorem</h3><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, possimus.</p></div>
//           <div class="card"><h3>lorem</h3><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, possimus.</p></div>
//           <div class="card"><h3>lorem</h3><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, possimus.</p></div>
//           <div class="card"><h3>lorem</h3><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, possimus.</p></div>
//           <div class="card"><h3>lorem</h3><p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repudiandae, possimus.</p></div>
//         </div>
//       </div>
//     </>
//   );
// };


// -----------------------------------------

import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

export const Home = () => {
  return (
    <>
      <h1 className="home-h1"><span className="funny-font">Welcome To</span> <span className="funny-font">AZ Dog Care</span></h1>
      <div className="container">
        <div className="grid-container">
          <Link to="/public-services" className="card">
            <h3>Public Services</h3>
            <p>Find nearest government hospital using our distance and route showing functionality</p>
          </Link>
          <Link to="/private-hospitals" className="card">
            <h3>PRIVATE HOSPITALS</h3>
            <p>Find nearest private hospitals using our distance and route showing functionality.</p>
          </Link>
          
          <a href="http://127.0.0.1:8001/know-your-breed" target="_blank" className="card">
            <h3>BREED FINDER</h3>
            <p>Want to know the dog breed, use our dog breed prediction model with 80% accuracy.</p>
          </a>

          <Link to="/complain" className="card">
            <h3>COMPLAIN</h3>
            <p>Found out anything unfortunate. Contact us via email, we will help you out.</p>
          </Link>

          <a href="http://localhost:3000/" target="_blank" className="card">
            <h3>E-COMMERCE</h3>
            <p>Want to buy cool things for your buddy, use our online store to get what you want.</p>
          </a>

          <Link to="/adoption-house" className="card">
            <h3>ADOPTION HOUSE</h3>
            <p>Want a new family member!, use our map to reach out nearest store with filtered reviews.</p>
          </Link>

          <Link to="/grooming" className="card">
            <h3>GROOMING CENTER</h3>
            <p>Get your dog a a new look, use our map to reach out the nearest grooming centers.</p>
          </Link>

          <Link to="/dog-friendly-places" className="card">
            <h3>DOG ZONE</h3>
            <p>Want to take your dog outside for dinner with you,react to nearest dog friendly places</p>
          </Link>

          <Link to="/training" className="card">
            <h3>TRAINING</h3>
            <p>Want to train your pal? Reach out to nearest training center at once! Happy Journey</p>
          </Link>

          <Link to="/daycare" className="card">
            <h3>DAYCARE CENTER</h3>
            <p>Wanna go to work, dont worry about your buddy. Reach out to nearest daycare center</p>
          </Link>   

          <Link to="/contact" className="card">
            <h3>CONTACT </h3>
            <p>Wanna suggest something or know more? Let's have a talk. Waiting...</p>
          </Link>         

          <Link to="/" className="card">
            <h3>SOME CONTACTS</h3>
            <p>Helpline:1234-567-890</p>
            <p>Control:0987-654-321</p>
            <p>Rescue: 1122-334-455</p>
            <p>Shelter: 7788-990-112</p>
          </Link>  

        </div>
      </div>
    </>
  );
};
