import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import NavbarAdmin from "../navbarAdmin/NavbarAdmin";
import PetImagesTable from "./PetImagesTable";
import "./petImagesModule.css";
import { Modal } from "react-bootstrap";
import { FaPlusSquare } from "react-icons/fa";
import { Loader } from "../../admin";
import "./petImagesModule.css";

const LOCAL_STORAGE_KEY = "pet-images";

const PetImagesModule = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      petImageName: "",
      petImageLink: "",
      petImageDescription: "",
      petId: "",
    },
  });
  const [data, setData] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde localStorage o desde el archivo JSON
  useEffect(() => {
    setLoading(true);
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      setData(JSON.parse(localData));
      setLoading(false);
    } else {
      fetch("/data/pet-images.json")
        .then((response) => response.json())
        .then((jsonData) => {
          setData(jsonData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jsonData));
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
  }, []);

  const updateLocalStorage = (newData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  };

  const handleEdit = (id) => {
    setEditItemId(id);
    const item = data.find((item) => item.id === id);
    reset(item);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Estás seguro(a) de eliminar?");
    if (confirmDelete) {
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      updateLocalStorage(newData);
    }
  };

  const handleReset = () => {
    setEditItemId(null);
    reset({
      petImageName: "",
      petImageLink: "",
      petImageDescription: "",
      petId: "",
    });
  };

  const onSubmit = (formData) => {
    if (editItemId) {
      // Edición: Actualizar el registro existente
      const updatedData = data.map((item) =>
        item.id === editItemId ? { ...item, ...formData } : item
      );
      setData(updatedData);
      updateLocalStorage(updatedData);
      setEditItemId(null);
    } else {
      // Creación: Agregar un nuevo registro
      const newItem = { ...formData, id: uuidv4() };
      const newData = [...data, newItem];
      setData(newData);
      updateLocalStorage(newData);
    }
    setShowModal(false);
    reset();
  };

  return (
    <div>
      <NavbarAdmin />
      <div className="d-flex justify-content-center align-items-end">
        <h3 className="mt-5 text-center">Módulo Imágenes Mascotas</h3>
        <button
          className="btn btn-success ms-3"
          onClick={() => setShowModal(true)}
        >
          <FaPlusSquare />
        </button>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="myModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Ingrese los datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mt-3">
            <div className="d-flex justify-content-center">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="col-2 m-1">
                  <input type="hidden" {...register("id")} />
                </div>
                <div className="d-flex flex-wrap justify-content-center">
                  <div className="col-auto m-1">
                    <input
                      {...register("petImageName", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="petImageName"
                      type="text"
                      className="form-control"
                      placeholder="* Nombre Imagen"
                    />
                    {errors.petImageName && (
                      <p className="errorMsg">{errors.petImageName.message}</p>
                    )}
                  </div>

                  <div className="col-auto m-1">
                    <input
                      {...register("petImageLink", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="petImageLink"
                      type="text"
                      className="form-control"
                      placeholder="* Link Imagen"
                    />
                    {errors.petImageLink && (
                      <p className="errorMsg">{errors.petImageLink.message}</p>
                    )}
                  </div>

                  <div className="col-auto m-1">
                    <input
                      {...register("petImageDescription", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="petImageDescription"
                      type="text"
                      className="form-control"
                      placeholder="* Descripción Imagen"
                    />
                    {errors.petImageDescription && (
                      <p className="errorMsg">
                        {errors.petImageDescription.message}
                      </p>
                    )}
                  </div>

                  <div className="col-auto m-1">
                    <input
                      {...register("petName", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="petName"
                      type="text"
                      className="form-control"
                      placeholder="* Nombre Mascota"
                    />
                    {errors.petName && (
                      <p className="errorMsg">{errors.petName.message}</p>
                    )}
                  </div>

                  <div className="col-auto m-1">
                    <button className="btn btn-primary" type="submit">
                      {editItemId ? "Guardar" : "Crear"}
                    </button>

                    <button
                      className="btn btn-danger ms-3"
                      type="button"
                      onClick={handleReset}
                    >
                      Resetear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {loading ? (
        <Loader />
      ) : (
        <PetImagesTable
          data={data}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default PetImagesModule;
