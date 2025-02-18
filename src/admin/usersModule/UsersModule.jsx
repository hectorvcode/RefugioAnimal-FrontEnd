import React, { useState, useEffect } from "react";
import NavbarAdmin from "../navbarAdmin/NavbarAdmin";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import UsersTable from "./UsersTable";
// Eliminamos la importación de api
import { Modal } from "react-bootstrap";
import { FaPlusSquare } from "react-icons/fa";
import { Loader } from "../../admin";
import "./usersModule.css";

// Definir constantes para localStorage y la ruta del JSON
const LOCAL_STORAGE_KEY = "users";
const JSON_URL = "/data/users.json";

const UsersModule = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dniNumber: "",
    },
  });
  const [data, setData] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para actualizar localStorage con los nuevos datos
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
      fetch(JSON_URL)
        .then((response) => response.json())
        .then((jsonData) => {
          setData(jsonData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jsonData));
        })
        .catch((error) => console.error("Error al cargar users:", error))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleEdit = (id) => {
    setEditItemId(id);
    const item = data.find((item) => item.id === id);
    reset(item);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro(a) de eliminar?");
    if (confirmDelete) {
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
      updateLocalStorage(newData);
    }
  };

  const handleReset = () => {
    setEditItemId(null);
    reset({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dniNumber: "",
    });
  };

  const onSubmit = (formData) => {
    if (editItemId) {
      // Edición: Actualizar el registro existente
      const updatedData = data.map((item) =>
        item.id === editItemId
          ? {
              ...item,
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              dniNumber: formData.dniNumber,
            }
          : item
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
        <h3 className="mt-5 text-center">Módulo Usuarios</h3>
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
                      {...register("email", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="* Correo"
                    />
                    {errors.email && (
                      <p className="errorMsg">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="col-auto m-1">
                    <input
                      {...register("password", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="* Contraseña"
                    />
                    {errors.password && (
                      <p className="errorMsg">{errors.password.message}</p>
                    )}
                  </div>
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
        <UsersTable
          data={data}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default UsersModule;
