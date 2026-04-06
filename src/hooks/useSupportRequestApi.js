import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { privateApiClient } from "../api/apiClient";
import { END_POINTS } from "../api/endPoints";

// Get all support requests
const fetchSupportRequests = async () => {
  const { data } = await privateApiClient.get(END_POINTS.GET_SUPPORT_REQUESTS);
  return data.data;
};

export const useFetchSupportRequests = () => {
  return useQuery({
    queryKey: ["support-requests"],
    queryFn: fetchSupportRequests,
  });
};

// Add support request
const addSupportRequest = async (payload) => {
  const { data } = await privateApiClient.post(
    END_POINTS.ADD_SUPPORT_REQUEST,
    payload
  );
  return data;
};

export const useAddSupportRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSupportRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-requests"] });
    },
  });
};

// Update support request
const updateSupportRequest = async ({ id, payload }) => {
  const { data } = await privateApiClient.put(
    END_POINTS.UPDATE_SUPPORT_REQUEST(id),
    payload
  );
  return data;
};

export const useUpdateSupportRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSupportRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-requests"] });
    },
  });
};

// Delete support request
const deleteSupportRequest = async (id) => {
  const { data } = await privateApiClient.delete(
    END_POINTS.DELETE_SUPPORT_REQUEST(id)
  );
  return data;
};

export const useDeleteSupportRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupportRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-requests"] });
    },
  });
};