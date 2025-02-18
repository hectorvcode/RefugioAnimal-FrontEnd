import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import {
  maritalStatusOptions,
  dniTypeOptions,
  stratumOptions,
  localityOptions,
} from "./options";
import CandidatesTable from "./CandidatesTable";
import NavbarAdmin from "../navbarAdmin/NavbarAdmin";
import { Modal } from "react-bootstrap";
import { FaPlusSquare } from "react-icons/fa";
import { Loader } from "../../admin";
import "./candidatesModule.css";

const LOCAL_STORAGE_KEY = "candidates";
const JSON_URL = "/data/candidates.json";

const CandidatesModule = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dniType: "",
      dniNumber: "",
      age: "",
      address: "",
      neighborhood: "",
      locality: "",
      stratum: "",
      maritalStatus: "",
      children: "",
      cellphone: "",
      profession: "",
      companyName: "",
      companyAddress: "",
      companyPhone: "",
      email: "",
      facebookUser: "",
      instagramUser: "",
    },
  });
  const [data, setData] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para actualizar el localStorage
  const updateLocalStorage = (newData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  };

  useEffect(() => {
    setLoading(true);
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      setData(JSON.parse(localData));
      setLoading(false);
    } else {
      // Si no hay datos en localStorage, cargar desde el JSON
      fetch(JSON_URL)
        .then((response) => response.json())
        .then((jsonData) => {
          setData(jsonData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jsonData));
        })
        .catch((error) => console.error("Error al cargar candidatos:", error))
        .finally(() => setLoading(false));
    }
  }, []);

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
      firstName: "",
      lastName: "",
      dniType: "",
      dniNumber: "",
      age: "",
      address: "",
      neighborhood: "",
      locality: "",
      stratum: "",
      maritalStatus: "",
      children: "",
      cellphone: "",
      profession: "",
      companyName: "",
      companyAddress: "",
      companyPhone: "",
      email: "",
      facebookUser: "",
      instagramUser: "",
    });
  };

  const onSubmit = (formData) => {
    if (editItemId) {
      // Edición de candidato existente
      const updatedData = data.map((item) =>
        item.id === editItemId ? { ...item, ...formData } : item
      );
      setData(updatedData);
      updateLocalStorage(updatedData);
      setEditItemId(null);
    } else {
      // Creación de nuevo candidato
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
        <h3 className="mt-5 text-center">Módulo Candidatos</h3>
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
                  {/* Aquí se incluyen todos los campos del formulario */}
                  <div className="col-auto m-1">
                    <input
                      {...register("firstName", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="firstName"
                      type="text"
                      className="form-control"
                      placeholder="* Nombres"
                    />
                    {errors.firstName && (
                      <p className="errorMsg">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="col-auto m-1">
                    <input
                      {...register("lastName", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="lastName"
                      type="text"
                      className="form-control"
                      placeholder="* Apellidos"
                    />
                    {errors.lastName && (
                      <p className="errorMsg">{errors.lastName.message}</p>
                    )}
                  </div>
                  {/* Continúa con los demás campos de forma similar... */}
                  {/* ... */}
                  <div className="row d-flex justify-content-center">
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
        <CandidatesTable
          data={data}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default CandidatesModule;
