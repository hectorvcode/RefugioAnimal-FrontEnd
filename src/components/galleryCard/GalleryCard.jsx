import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./galleryCard.css";
import axios from "axios";

function GalleryCard() {
  const [pets, setPets] = useState([]);
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para la búsqueda

  useEffect(() => {
    const fetchData = async () => {
      const url = "/data/pets.json"; // Ruta al archivo JSON en public/data
      try {
        const response = await axios.get(url);
        setPets(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Filtrar considerando todas las condiciones, incluyendo la búsqueda por nombre
  const filteredPets = pets.filter((pet) => {
    const matchSpecies = speciesFilter
      ? pet.petSpecies.toLowerCase() === speciesFilter.toLowerCase()
      : true;
    const matchGender = genderFilter
      ? pet.petGender.toLowerCase() === genderFilter.toLowerCase()
      : true;
    const matchAge = ageFilter
      ? pet.petAge.toLowerCase() === ageFilter.toLowerCase()
      : true;
    const matchSize = sizeFilter
      ? pet.petSize.toLowerCase() === sizeFilter.toLowerCase()
      : true;
    const matchSearch = searchTerm
      ? pet.petName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchSpecies && matchGender && matchAge && matchSize && matchSearch;
  });

  const handleSpeciesChange = (event) => {
    setSpeciesFilter(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGenderFilter(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAgeFilter(event.target.value);
  };

  const handleSizeChange = (event) => {
    setSizeFilter(event.target.value);
  };

  // Función para actualizar el término de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className="section d-flex flex-column align-items-center">
        {/* Barra de búsqueda */}
        <div className="mb-3" style={{ width: "50%" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filters d-flex flex-wrap justify-content-center">
          <div className="m-3 d-flex align-items-center">
            <label className="col-form-label">Especie:</label>
            <select
              className="ms-1 form-select"
              value={speciesFilter}
              onChange={handleSpeciesChange}
            >
              <option value="">Cualquiera</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
            </select>
          </div>

          <div className="m-3 d-flex align-items-center">
            <label className="col-form-label">Género:</label>
            <select
              className="ms-1 form-select"
              value={genderFilter}
              onChange={handleGenderChange}
            >
              <option value="">Cualquiera</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          <div className="m-3 d-flex align-items-center">
            <label className="col-form-label">Edad:</label>
            <select
              className="ms-1 form-select"
              value={ageFilter}
              onChange={handleAgeChange}
            >
              <option value="">Cualquiera</option>
              <option value="Cachorro">Cachorro</option>
              <option value="Adulto">Adulto</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div className="m-3 d-flex align-items-center">
            <label className="col-form-label">Tamaño:</label>
            <select
              className="ms-1 form-select"
              value={sizeFilter}
              onChange={handleSizeChange}
            >
              <option value="">Cualquiera</option>
              <option value="Grande">Grande</option>
              <option value="Mediano">Mediano</option>
              <option value="Pequeno">Pequeño</option>
            </select>
          </div>
        </div>
      </div>

      <div className="gal__card_container_main">
        {filteredPets.map((pet) => (
          <div className="gal__card_container animate__pulse" key={pet.id}>
            <Link to={`/mascota/${pet.id}`}>
              <div className="gal__card_body">
                <img
                  src={
                    pet.petImages && pet.petImages.length > 0
                      ? pet.petImages[0].petImageLink
                      : pet.featuredImg
                  }
                  alt={pet.petName}
                />
                <div className="gal__card_footer">
                  <p className="gal__card_title">{pet.petName}</p>
                  <div className="gal__card_chars">
                    <p>{pet.petGender}</p>
                    <p>{pet.petAge}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default GalleryCard;
