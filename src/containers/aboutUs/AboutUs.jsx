import React, { useState, useEffect } from "react";
import { Navbar } from "../../components";
import { Footer } from "../../containers";
import "./aboutUs.css";

// Definimos la ruta al archivo JSON
const JSON_URL = "/data/shelter-contents.json";

const AboutUs = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Se hace fetch al archivo JSON en lugar de consumir la API
    fetch(JSON_URL)
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.log("Error al cargar el JSON:", error));
  }, []);

  return (
    <>
      <Navbar />
      <div id="about" className="about">
        {data.map((item, index) => (
          <div className="container-fluid" key={index}>
            <div
              className={`row d_flex mb-5 ${
                index % 2 === 0 ? "flex-row-reverse" : ""
              }`}
            >
              <div className="d-flex justify-content-center align-items-center col-md-6">
                <div className="about_img">
                  <figure>
                    <img src={item.infoImgLink} alt={item.infoTitle} />
                  </figure>
                </div>
              </div>
              <div className="d-flex align-items-center col-md-6">
                <div className="titlepage">
                  <h2 className="blue">{item.infoTitle}</h2>
                  <p>{item.infoContent}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
