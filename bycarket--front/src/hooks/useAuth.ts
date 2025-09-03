import { useAuthStore } from "@/context/AuthContext";

export const useAuth = () => {
	return useAuthStore();
};
