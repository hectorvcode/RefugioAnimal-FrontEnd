import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import AdoptersTable from "./AdoptersTable";
import NavbarAdmin from "../navbarAdmin/NavbarAdmin";
import { Modal } from "react-bootstrap";
import { FaPlusSquare } from "react-icons/fa";
import { Loader } from "../../admin";
import "./adoptersModule.css";

const AdoptersModule = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      adopterDniNumber: "",
      adopterFirstName: "",
      adopterLastName: "",
    },
  });
  const [data, setData] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const localAdopters = localStorage.getItem("adopters");
    if (localAdopters) {
      setData(JSON.parse(localAdopters));
      setLoading(false);
    } else {
      fetch("/data/adopters.json")
        .then((response) => response.json())
        .then((jsonData) => {
          setData(jsonData);
          localStorage.setItem("adopters", JSON.stringify(jsonData));
        })
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleEdit = (id) => {
    setEditItemId(id);
    const item = data.find((item) => item.id === id);
    reset(item);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Estás seguro(a) de eliminar?");
    if (confirmDelete) {
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      localStorage.setItem("adopters", JSON.stringify(newData));
    }
  };

  const handleReset = () => {
    setEditItemId(null);
    reset({
      adopterDniNumber: "",
      adopterFirstName: "",
      adopterLastName: "",
    });
  };

  const onSubmit = async (formData) => {
    if (editItemId) {
      // Modo edición: Actualizar el registro existente
      const updatedData = data.map((item) =>
        item.id === editItemId ? { ...item, ...formData } : item
      );
      setData(updatedData);
      localStorage.setItem("adopters", JSON.stringify(updatedData));
      setEditItemId(null);
    } else {
      // Modo creación: Agregar un nuevo registro
      const newItem = { ...formData, id: uuidv4() };
      const newData = [...data, newItem];
      setData(newData);
      localStorage.setItem("adopters", JSON.stringify(newData));
    }
    setShowModal(false);
    reset();
  };

  return (
    <div>
      <NavbarAdmin />
      <div className="d-flex justify-content-center align-items-end">
        <h3 className="mt-5 text-center">Módulo Adoptantes</h3>
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
                      {...register("adopterDniNumber", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 7,
                          message: "Mínimo siete caracteres",
                        },
                        valueAsNumber: true,
                      })}
                      name="adopterDniNumber"
                      type="number"
                      className="form-control"
                      placeholder="* Número Documento"
                    />
                    {errors.adopterDniNumber && (
                      <p className="errorMsg">
                        {errors.adopterDniNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="col-auto m-1">
                    <input
                      {...register("adopterFirstName", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="adopterFirstName"
                      type="text"
                      className="form-control"
                      placeholder="* Nombres Adoptante"
                    />
                    {errors.adopterFirstName && (
                      <p className="errorMsg">
                        {errors.adopterFirstName.message}
                      </p>
                    )}
                  </div>

                  <div className="col-auto m-1">
                    <input
                      {...register("adopterLastName", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="adopterLastName"
                      type="text"
                      className="form-control"
                      placeholder="* Apellidos Adoptante"
                    />
                    {errors.adopterLastName && (
                      <p className="errorMsg">
                        {errors.adopterLastName.message}
                      </p>
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
        <AdoptersTable
          data={data}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default AdoptersModule;
