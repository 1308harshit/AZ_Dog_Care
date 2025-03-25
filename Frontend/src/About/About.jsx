import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./About.css";
import img1 from "./images/img1.png"
import img2 from "./images/img2.png"
import img3 from "./images/img3.png"
import img4 from "./images/img4.png"
import img5 from "./images/img5.png" 
import img6 from "./images/img6.png"
import img7 from "./images/img7.png"

const About = () => {
  const [bgColor, setBgColor] = useState(
    "linear-gradient(to right, #ff7e5f, #feb47b)"
  );

  const slides = [

    { url: img1 },
    { url: img2 },
    { url: img3 },
    { url: img4 },
    { url: img5 },
    { url: img6 },
    { url: img7 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  const handleDownload = async () => {
    const doc = new jsPDF();

    for (let i = 0; i < slides.length; i++) {
      const { url } = slides[i];

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;

      await new Promise((resolve) => {
        img.onload = () => resolve();
      });

      const imgContainer = document.createElement("div");
      imgContainer.style.position = "absolute";
      imgContainer.style.top = "-9999px";
      imgContainer.appendChild(img);
      document.body.appendChild(imgContainer);

      try {
        const canvas = await html2canvas(imgContainer);
        const imgData = canvas.toDataURL("image/png");

        if (i > 0) {
          doc.addPage();
        }
        doc.addImage(imgData, "PNG", 10, 10, 190, 280);
      } catch (error) {
        console.error("Error capturing image:", error);
      }

      document.body.removeChild(imgContainer);
    }

    doc.save("slides.pdf");
  };

  return (
    <div className="container">
      <h1 className="heading">About Us</h1>
      <div className="slider-container" style={{ background: bgColor }}>
        <div className="slider">
          <div className="arrow left-arrow" onClick={goToPrevious}>
            ❰
          </div>
          <div className="arrow right-arrow" onClick={goToNext}>
            ❱
          </div>
          <div
            className="slide"
            style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
          ></div>
          <div className="dots">
            {slides.map((slide, index) => (
              <div
                className={`dot ${currentIndex === index ? "active" : ""}`}
                key={index}
                onClick={() => goToSlide(index)}
              >
                ●
              </div>
            ))}
          </div>
        </div>
        <button className="download-button" onClick={handleDownload}>
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default About;

// ----------------------------------------------------------------------------
