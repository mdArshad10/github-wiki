import { useMutation } from "@tanstack/react-query";
import { authApi } from "./authRepo";
import { authKeys } from "./auth.key";
import { queryClient } from "@/lib/query-client";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.logout })
  })
