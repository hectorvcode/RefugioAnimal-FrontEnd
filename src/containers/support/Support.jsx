import React, { useState, useEffect } from "react";
import { Navbar } from "../../components";
import { Footer } from "../../containers";

// Definimos la ruta al archivo JSON con la información de los soportes
const JSON_URL = "/data/supports.json";

const Support = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Se realiza un fetch al archivo JSON en lugar de usar axios
    fetch(JSON_URL)
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error al cargar el JSON:", error));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container pt-5 d-flex flex-column">
        <div className="d-flex flex-column text-center mb-5">
          <h4 className="text-secondary mb-3">De esta forma</h4>
          <h2 className="display-4 m-0">
            Puedes <span className="text-primary">Ayudar</span>
          </h2>
          <div className="d-flex justify-content-center">
            <a href="/contacto" className="btn btn-primary mt-5">
              Contáctanos
            </a>
          </div>
        </div>

        <div className="p-3 d-flex flex-wrap justify-content-center">
          {data.map((item, index) => (
            <div
              className="card"
              style={{
                width: "18rem",
                height: "500px",
                margin: "1rem",
              }}
              key={index}
            >
              <img
                src={item.supportImg}
                className="card-img-top"
                alt={item.supportTitle}
              />
              <div className="card-body">
                <h5 className="card-title">{item.supportTitle}</h5>
                <p className="card-text">{item.supportContent}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Support;
