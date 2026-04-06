import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";

// Get all patients
const fetchPatients = async () => {
  const { data } = await privateApiClient.get(END_POINTS.GET_PATIENTS);
  return data.patients;
};

export const useFetchPatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });
};

// Add patient
const addPatient = async (formData) => {
  const { data } = await privateApiClient.post(END_POINTS.ADD_PATIENT, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const useAddPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

// Update patient
const updatePatient = async ({ id, formData }) => {
  const { data } = await privateApiClient.put(
    END_POINTS.UPDATE_PATIENT(id),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data;
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};

// Delete patient
const deletePatient = async (id) => {
  const { data } = await privateApiClient.delete(END_POINTS.DELETE_PATIENT(id));
  return data;
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};