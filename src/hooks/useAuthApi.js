import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient.js";
import { END_POINTS } from "../api/endPoints.js";

const loginUser = async (payload) => {
  const { data } = await apiClient.post(END_POINTS.LOGIN, payload);
  return data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};