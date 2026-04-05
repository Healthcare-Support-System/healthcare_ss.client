export const END_POINTS = {
  LOGIN: "api/users/login",
  GET_ALL_USERS: "api/users/all",

  ADD_PATIENT: "api/patients/add-patient",
  GET_PATIENTS: "api/patients/get-patients",
  GET_PATIENT_BY_ID: (id) => `api/patients/get-patient/${id}`,
  UPDATE_PATIENT: (id) => `api/patients/update-patient/${id}`,
  DELETE_PATIENT: (id) => `api/patients/delete-patient/${id}`,
};