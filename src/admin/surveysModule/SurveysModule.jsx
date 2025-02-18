import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import SurveysTable from "./SurveysTable";
import NavbarAdmin from "../navbarAdmin/NavbarAdmin";
import {
  houseTypeOptions,
  timeAloneOptions,
  anyKidsOptions,
  reasonsOptions,
  hadPetOptions,
  havePetOptions,
} from "./options";
import { Modal } from "react-bootstrap";
import { FaPlusSquare } from "react-icons/fa";
import { Loader } from "../../admin";
import "./surveysModule.css";

// Definir las constantes para localStorage y la ruta del JSON
const LOCAL_STORAGE_KEY = "surveyFields";
const JSON_URL = "/data/survey-fields.json";

function AdoptSurvey() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      dniNumber: "",
      familyComposition: "",
      adultsQty: "",
      childrenQty: "",
      babiesQty: "",
      houseType: "",
      timeAlone: "",
      anyKids: "",
      childrenAges: "",
      reasons: "",
      reasonsOther: "",
      hadPet: "",
      hadPetOther: "",
      havePet: "",
      havePetOther: "",
      getFundapetInfo: "",
      adoptReason: "",
      ref1Name: "",
      ref1Cellphone: "",
      ref2Name: "",
      ref2Cellphone: "",
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
        .catch((error) =>
          console.error("Error al cargar survey fields:", error)
        )
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
      dniNumber: "",
      familyComposition: "",
      adultsQty: "",
      childrenQty: "",
      babiesQty: "",
      houseType: "",
      timeAlone: "",
      anyKids: "",
      childrenAges: "",
      reasons: "",
      reasonsOther: "",
      hadPet: "",
      hadPetOther: "",
      havePet: "",
      havePetOther: "",
      getFundapetInfo: "",
      adoptReason: "",
      ref1Name: "",
      ref1Cellphone: "",
      ref2Name: "",
      ref2Cellphone: "",
    });
  };

  const onSubmit = (formData) => {
    if (editItemId) {
      // Edición: Actualizar el registro existente
      const updatedData = data.map((item) =>
        item.id === editItemId
          ? {
              ...item,
              dniNumber: formData.dniNumber,
              familyComposition: formData.familyComposition,
              adultsQty: formData.adultsQty,
              childrenQty: formData.childrenQty,
              babiesQty: formData.babiesQty,
              houseType: formData.houseType,
              timeAlone: formData.timeAlone,
              anyKids: formData.anyKids,
              childrenAges: formData.childrenAges,
              reasons: formData.reasons,
              reasonsOther: formData.reasonsOther,
              hadPet: formData.hadPet,
              hadPetOther: formData.hadPetOther,
              havePet: formData.havePet,
              havePetOther: formData.havePetOther,
              getFundapetInfo: formData.getFundapetInfo,
              adoptReason: formData.adoptReason,
              ref1Name: formData.ref1Name,
              ref1Cellphone: formData.ref1Cellphone,
              ref2Name: formData.ref2Name,
              ref2Cellphone: formData.ref2Cellphone,
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
    <>
      <NavbarAdmin />
      <div className="d-flex justify-content-center align-items-end">
        <h3 className="mt-5 text-center">Módulo Encuesta</h3>
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
                  {/* Campo para Número de Documento */}
                  <div className="col-auto m-1">
                    <label>Número de documento:</label>
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
                      placeholder="* Ej: 80156897"
                    />
                    {errors.dniNumber && (
                      <p className="errorMsg">{errors.dniNumber.message}</p>
                    )}
                  </div>

                  {/* Campo para Composición del hogar */}
                  <div className="col-auto m-1">
                    <label>Composición del hogar:</label>
                    <input
                      {...register("familyComposition", {
                        required: "Este campo es requerido",
                        minLength: {
                          value: 4,
                          message: "Cuatro caracteres mínimo",
                        },
                      })}
                      name="familyComposition"
                      type="text"
                      className="form-control"
                      placeholder="* Ej: Papá 40, Mamá 36..."
                    />
                    {errors.familyComposition && (
                      <p className="errorMsg">
                        {errors.familyComposition.message}
                      </p>
                    )}
                  </div>

                  {/* Cantidad de adultos, niños y bebés */}
                  <div className="col-auto">
                    <label>Número de personas en la familia:</label>
                    <div className="d-flex">
                      <div className="col-auto m-1">
                        <input
                          {...register("adultsQty", {
                            required: "Este campo es requerido",
                            minLength: {
                              value: 1,
                              message: "Un carácter mínimo",
                            },
                            valueAsNumber: true,
                          })}
                          name="adultsQty"
                          type="number"
                          className="form-control"
                          placeholder="* Adultos"
                        />
                        {errors.adultsQty && (
                          <p className="errorMsg">{errors.adultsQty.message}</p>
                        )}
                      </div>
                      <div className="col-auto m-1">
                        <input
                          {...register("childrenQty", {
                            required: "Este campo es requerido",
                            minLength: {
                              value: 1,
                              message: "Un carácter mínimo",
                            },
                            valueAsNumber: true,
                          })}
                          name="childrenQty"
                          type="number"
                          className="form-control"
                          placeholder="* Niños"
                        />
                        {errors.childrenQty && (
                          <p className="errorMsg">
                            {errors.childrenQty.message}
                          </p>
                        )}
                      </div>
                      <div className="col-auto m-1">
                        <input
                          {...register("babiesQty", {
                            required: "Este campo es requerido",
                            minLength: {
                              value: 1,
                              message: "Un carácter mínimo",
                            },
                            valueAsNumber: true,
                          })}
                          name="babiesQty"
                          type="number"
                          className="form-control"
                          placeholder="* Bebés"
                        />
                        {errors.babiesQty && (
                          <p className="errorMsg">{errors.babiesQty.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preguntas de la encuesta */}
                  <h3 className="mt-2 text-center">Preguntas</h3>
                  <div className="row d-flex justify-content-center">
                    <div className="col-auto m-1">
                      <p>Qué tipo de vivienda tienes?</p>
                      <select
                        name="houseType"
                        className="form-select"
                        {...register("houseType", {
                          required: "Este campo es requerido",
                        })}
                      >
                        <optgroup>
                          {houseTypeOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      {errors.houseType && (
                        <p className="errorMsg">{errors.houseType.message}</p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>
                        ¿Por cuánto tiempo dejarás solo a tu mascota al día?
                      </p>
                      <select
                        name="timeAlone"
                        className="form-select"
                        {...register("timeAlone", {
                          required: "Este campo es requerido",
                        })}
                      >
                        <optgroup>
                          {timeAloneOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      {errors.timeAlone && (
                        <p className="errorMsg">{errors.timeAlone.message}</p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>¿Hay niños pequeños en la casa?</p>
                      <select
                        name="anyKids"
                        className="form-select"
                        {...register("anyKids", {
                          required: "Este campo es requerido",
                        })}
                      >
                        <optgroup>
                          {anyKidsOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      {errors.anyKids && (
                        <p className="errorMsg">{errors.anyKids.message}</p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>Especificar edades de los niños</p>
                      <input
                        {...register("childrenAges")}
                        name="childrenAges"
                        type="text"
                        className="form-control"
                        placeholder="Ej: 8, 12, 16"
                      />
                      {errors.childrenAges && (
                        <p className="errorMsg">
                          {errors.childrenAges.message}
                        </p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>¿Para qué quieres adoptar?</p>
                      <select
                        name="reasons"
                        className="form-select"
                        {...register("reasons", {
                          required: "Este campo es requerido",
                        })}
                      >
                        <optgroup>
                          {reasonsOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      {errors.reasons && (
                        <p className="errorMsg">{errors.reasons.message}</p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>Especificar otra razón</p>
                      <input
                        {...register("reasonsOther")}
                        name="reasonsOther"
                        type="text"
                        className="form-control"
                      />
                      {errors.reasonsOther && (
                        <p className="errorMsg">
                          {errors.reasonsOther.message}
                        </p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>¿Has tenido mascota antes?</p>
                      <select
                        name="hadPet"
                        className="form-select"
                        {...register("hadPet", {
                          required: "Este campo es requerido",
                        })}
                      >
                        <optgroup>
                          {hadPetOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      {errors.hadPet && (
                        <p className="errorMsg">{errors.hadPet.message}</p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>Razón (si no has tenido mascota)</p>
                      <input
                        {...register("hadPetOther")}
                        name="hadPetOther"
                        type="text"
                        className="form-control"
                      />
                      {errors.hadPetOther && (
                        <p className="errorMsg">{errors.hadPetOther.message}</p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>¿Tienes mascota actualmente?</p>
                      <select
                        name="havePet"
                        className="form-select"
                        {...register("havePet", {
                          required: "Este campo es requerido",
                        })}
                      >
                        <optgroup>
                          {havePetOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                      {errors.havePet && (
                        <p className="errorMsg">{errors.havePet.message}</p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>Especifique características de tu mascota actual</p>
                      <input
                        {...register("havePetOther")}
                        name="havePetOther"
                        type="text"
                        className="form-control"
                      />
                      {errors.havePetOther && (
                        <p className="errorMsg">
                          {errors.havePetOther.message}
                        </p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>¿Cómo te enteraste de Fundapet?</p>
                      <textarea
                        {...register("getFundapetInfo", {
                          required: "Este campo es requerido",
                          minLength: {
                            value: 4,
                            message: "Cuatro caracteres mínimo",
                          },
                        })}
                        name="getFundapetInfo"
                        className="form-control"
                      />
                      {errors.getFundapetInfo && (
                        <p className="errorMsg">
                          {errors.getFundapetInfo.message}
                        </p>
                      )}
                    </div>

                    <div className="col-auto m-1">
                      <p>¿Por qué quieres adoptar? ¿Por qué eres idóneo?</p>
                      <textarea
                        {...register("adoptReason", {
                          required: "Este campo es requerido",
                          minLength: {
                            value: 4,
                            message: "Cuatro caracteres mínimo",
                          },
                        })}
                        name="adoptReason"
                        className="form-control"
                      />
                      {errors.adoptReason && (
                        <p className="errorMsg">{errors.adoptReason.message}</p>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-2 text-center">Referencias</h3>
                  <div className="row d-flex justify-content-center">
                    <div className="col-auto m-1">
                      <p>Nombre Referencia 1</p>
                      <input
                        {...register("ref1Name", {
                          required: "Este campo es requerido",
                          minLength: {
                            value: 4,
                            message: "Cuatro caracteres mínimo",
                          },
                        })}
                        name="ref1Name"
                        type="text"
                        className="form-control"
                        placeholder="* Nombre Completo"
                      />
                      {errors.ref1Name && (
                        <p className="errorMsg">{errors.ref1Name.message}</p>
                      )}
                    </div>
                    <div className="col-auto m-1">
                      <p>Teléfono Referencia 1</p>
                      <input
                        {...register("ref1Cellphone", {
                          required: "Este campo es requerido",
                          minLength: {
                            value: 4,
                            message: "Cuatro caracteres mínimo",
                          },
                          pattern: {
                            value: /^(0|[1-9]\d*)(\.\d+)?$/,
                            message: "Ingresar únicamente números",
                          },
                        })}
                        name="ref1Cellphone"
                        type="text"
                        className="form-control"
                        placeholder="* Teléfono"
                      />
                      {errors.ref1Cellphone && (
                        <p className="errorMsg">
                          {errors.ref1Cellphone.message}
                        </p>
                      )}
                    </div>
                    <div className="col-auto m-1">
                      <p>Nombre Referencia 2</p>
                      <input
                        {...register("ref2Name", {
                          required: "Este campo es requerido",
                          minLength: {
                            value: 4,
                            message: "Cuatro caracteres mínimo",
                          },
                        })}
                        name="ref2Name"
                        type="text"
                        className="form-control"
                        placeholder="* Nombre Completo"
                      />
                      {errors.ref2Name && (
                        <p className="errorMsg">{errors.ref2Name.message}</p>
                      )}
                    </div>
                    <div className="col-auto m-1">
                      <p>Teléfono Referencia 2</p>
                      <input
                        {...register("ref2Cellphone", {
                          required: "Este campo es requerido",
                          minLength: {
                            value: 4,
                            message: "Cuatro caracteres mínimo",
                          },
                          pattern: {
                            value: /^(0|[1-9]\d*)(\.\d+)?$/,
                            message: "Ingresar únicamente números",
                          },
                        })}
                        name="ref2Cellphone"
                        type="text"
                        className="form-control"
                        placeholder="* Teléfono"
                      />
                      {errors.ref2Cellphone && (
                        <p className="errorMsg">
                          {errors.ref2Cellphone.message}
                        </p>
                      )}
                    </div>
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
        <SurveysTable
          data={data}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
}

export default AdoptSurvey;
