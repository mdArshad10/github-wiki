import { getResponseData } from "@/config/function"
import { apiClient } from "@/lib/api-client"

export const authApi = {
  async logout() {
    const response = await apiClient.post("/users/logout")

    return getResponseData(response.data)
  },

}