

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Invalidate cached auth queries
      queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // Redirect to home or hotels page
      navigate("/hotels"); // or "/vendor-home" if vendor
    },
  });

  return { isPending, error, loginMutation: mutate };
};

export default useLogin;
