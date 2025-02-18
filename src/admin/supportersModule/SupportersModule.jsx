import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { FaPlusSquare } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import NavbarAdmin from "../navbarAdmin/NavbarAdmin";
import { dniTypeOptions } from "../candidatesModule/options";
import { Loader } from "../../admin";
import SupportersTable from "./SupportersTable";
import { supporterOptions } from "./options";
import "./supportersModule.css";

const LOCAL_STORAGE_KEY = "supporters";
const JSON_URL = "/data/supporters.json";

const SupportersModule = () => {
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
      cellphone: "",
      email: "",
      supportAlternatives: "",
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
      fetch(JSON_URL)
        .then((response) => response.json())
        .then((jsonData) => {
          setData(jsonData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jsonData));
        })
        .catch((error) => console.error("Error al cargar supporters:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  // Función para sincronizar el estado con localStorage
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
      firstName: "",
      lastName: "",
      dniType: "",
      dniNumber: "",
      cellphone: "",
      email: "",
      supportAlternatives: "",
    });
  };

  const onSubmit = (formData) => {
    if (editItemId) {
      const updatedData = data.map((item) =>
        item.id === editItemId ? { ...item, ...formData } : item
      );
      setData(updatedData);
      updateLocalStorage(updatedData);
      setEditItemId(null);
    } else {
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
        <h3 className="mt-5 text-center">Módulo Colaboradores</h3>
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
                  {/* Campo Nombres */}
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
                  {/* Campo Apellidos */}
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
                  {/* Campo Tipo de documento */}
                  <div className="col-auto m-1">
                    <select
                      {...register("dniType", {
                        required: "Este campo es requerido",
                      })}
                      className="w-100 form-select"
                      name="dniType"
                      type="text"
                    >
                      <optgroup>
                        {dniTypeOptions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {errors.dniType && (
                      <p className="errorMsg">{errors.dniType.message}</p>
                    )}
                  </div>
                  {/* Campo Número de documento */}
                  <div className="col-auto m-1">
                    <input
                      {...register("dniNumber", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 7,
                          message: "Mínimo siete dígitos",
                        },
                        valueAsNumber: true,
                      })}
                      name="dniNumber"
                      type="number"
                      className="form-control"
                      placeholder="* Número Documento"
                    />
                    {errors.dniNumber && (
                      <p className="errorMsg">{errors.dniNumber.message}</p>
                    )}
                  </div>
                  {/* Campo Celular */}
                  <div className="col-auto m-1">
                    <input
                      {...register("cellphone", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 4,
                          message: "Mínimo cuatro caracteres",
                        },
                        pattern: {
                          value: /^(0|[1-9]\d*)(\.\d+)?$/,
                          message: "Ingresar únicamente números",
                        },
                      })}
                      name="cellphone"
                      type="text"
                      className="form-control"
                      placeholder="* Número Celular"
                    />
                    {errors.cellphone && (
                      <p className="errorMsg">{errors.cellphone.message}</p>
                    )}
                  </div>
                  {/* Campo Correo Electrónico */}
                  <div className="col-auto m-1">
                    <input
                      {...register("email", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 7,
                          message: "Mínimo siete caracteres",
                        },
                      })}
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="* Correo Electrónico"
                    />
                    {errors.email && (
                      <p className="errorMsg">{errors.email.message}</p>
                    )}
                  </div>
                  {/* Campo Alternativa de apoyo */}
                  <div className="col-auto m-1">
                    <select
                      {...register("supportAlternatives", {
                        required: "Este campo es requerido",
                      })}
                      className="w-100 form-select"
                      name="supportAlternatives"
                      type="text"
                    >
                      <optgroup>
                        {supporterOptions.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    {errors.supportAlternatives && (
                      <p className="errorMsg">
                        {errors.supportAlternatives.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-center mt-3">
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
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {loading ? (
        <Loader />
      ) : (
        <SupportersTable
          data={data}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default SupportersModule;
