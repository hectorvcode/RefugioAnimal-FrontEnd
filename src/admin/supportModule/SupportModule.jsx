import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import SupportTable from "./SupportTable";
import NavbarAdmin from "../navbarAdmin/NavbarAdmin";
// Se elimina la importación de la API
import { Modal } from "react-bootstrap";
import { FaPlusSquare } from "react-icons/fa";
import { Loader } from "../../admin";
import "./supportModule.css";

const LOCAL_STORAGE_KEY = "supports";
const JSON_URL = "/data/supports.json";

const SupportModule = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      supportTitle: "",
      supportContent: "",
      supportImg: "",
      supportLink: "",
    },
  });

  const [data, setData] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para sincronizar el estado con localStorage
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
        .catch((error) => console.error("Error al cargar supports:", error))
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
      supportTitle: "",
      supportContent: "",
      supportImg: "",
      supportLink: "",
    });
  };

  const onSubmit = (formData) => {
    if (editItemId) {
      // Edición: Actualiza el registro existente
      const updatedData = data.map((item) =>
        item.id === editItemId
          ? {
              ...item,
              supportTitle: formData.supportTitle,
              supportContent: formData.supportContent,
              supportImg: formData.supportImg,
              supportLink: formData.supportLink,
            }
          : item
      );
      setData(updatedData);
      updateLocalStorage(updatedData);
      setEditItemId(null);
    } else {
      // Creación: Agrega un nuevo registro
      const newItem = { ...formData, id: uuidv4() };
      const newData = [...data, newItem];
      setData(newData);
      updateLocalStorage(newData);
    }
    setShowModal(false);
    reset();
  };

  return (
    <>
      <NavbarAdmin />
      <div className="d-flex justify-content-center align-items-end">
        <h3 className="mt-5 text-center">Módulo Ayúdanos</h3>
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
                      {...register("supportTitle", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="supportTitle"
                      type="text"
                      className="form-control"
                      placeholder="* Titulo"
                    />
                    {errors.supportTitle && (
                      <p className="errorMsg">{errors.supportTitle.message}</p>
                    )}
                  </div>
                  <div className="col-auto m-1">
                    <input
                      {...register("supportContent", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="supportContent"
                      type="text"
                      className="form-control"
                      placeholder="* Contenido"
                    />
                    {errors.supportContent && (
                      <p className="errorMsg">
                        {errors.supportContent.message}
                      </p>
                    )}
                  </div>
                  <div className="col-auto m-1">
                    <input
                      {...register("supportImg", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="supportImg"
                      type="text"
                      className="form-control"
                      placeholder="* Imagen"
                    />
                    {errors.supportImg && (
                      <p className="errorMsg">{errors.supportImg.message}</p>
                    )}
                  </div>
                  <div className="col-auto m-1">
                    <input
                      {...register("supportLink", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 5,
                          message: "Mínimo cinco caracteres",
                        },
                      })}
                      name="supportLink"
                      type="text"
                      className="form-control"
                      placeholder="* Link"
                    />
                    {errors.supportLink && (
                      <p className="errorMsg">{errors.supportLink.message}</p>
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
        <SupportTable
          data={data}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default SupportModule;
