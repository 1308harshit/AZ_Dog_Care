import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import './ComplainPage.css';

const variants = {
  initial: { y: 500, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const ContactPage = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    petType: '',
    issueType: '',
    details: '',
  });
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Define the form data to be sent to EmailJS
    const templateParams = {
      name: formData.name,
      contact: formData.contact,
      address: formData.address,
      petType: formData.petType,
      issueType: formData.issueType,
      details: formData.details,
    };
  
    // Send the form data via EmailJS
    emailjs.send('service_38goqv4', 'template_xfjt2jb', templateParams, 'aD6bUn-CeacE3DFws')
      .then(
        () => {
          setSuccess(true); // Set success state to true on success
          setError(false);  // Make sure error is reset
          // Reset form fields
          setFormData({
            name: '',
            contact: '',
            address: '',
            petType: '',
            issueType: '',
            details: '',
          });
        },
        () => {
          setError(true);  // Set error state if something goes wrong
          setSuccess(false); // Reset success in case of failure
        }
      );
  };
  
  return (
    <motion.div className="contact" variants={variants} initial="initial" whileInView="animate">
      <motion.div className="textContainer" variants={variants}>
        <motion.div className="item" variants={variants}>
          <h2>Mail</h2>
          <span>khatsuriyaharshit@gmail.com</span>
        </motion.div>
        <motion.div className="item" variants={variants}>
          <h2>Address</h2>
          <span>Ahmedabad, Gujarat</span>
        </motion.div>
        <motion.div className="item" variants={variants}>
          <h2>Phone</h2>
          <span>+91 9328315950</span>
        </motion.div>
        <motion.div className='item' variants={variants}>
          <h2>Importanat Contact</h2>
          <ul>
            <li><strong>Global Animal Helpline:</strong>1234-567-890</li>
            <li><strong>Local Animal Control:</strong>0987-654-321</li>
            <li><strong>Animal Rescue Center:</strong> 1122-334-455</li>
            <li><strong>Veterinary Hospital:</strong>2233-445-566</li>
            <li><strong>Pet Adoption Services:</strong>6677-889-900</li>
            <li><strong>Emergency Animal Shelter:</strong>7788-990-112</li>
          </ul>
        </motion.div>
      </motion.div>

      <div className="formContainer">
        <motion.form onSubmit={handleSubmit} ref={formRef} variants={variants}>
          <motion.h1 variants={variants}>Submit Your Complaint</motion.h1>
          <div className="form-group">
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
          </div>
          <div className="form-group">
            <label>
              Contact:
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
            </label>
          </div>
          <div className="form-group">
            <label>
              Address:
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </label>
          </div>
          <div className="form-group">
            <label>
              Pet Type:
              <select
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Select</option>
                <option value="pet">Pet</option>
                <option value="stray">Stray</option>
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Issue Type:
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Select</option>
                <option value="stopping_feeding">Stopping Feeding</option>
                <option value="harassing">Harassing</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Details:
              <textarea rows={5} name="details" value={formData.details} onChange={handleChange} required />
            </label>
          </div>
          <button type="submit">Submit Complaint</button>
          {error && <span>Error: Something went wrong!</span>}
          {success && <span>Success: Message sent!</span>}
        </motion.form>
      </div>
    </motion.div>
  );
};

export default ContactPage;
