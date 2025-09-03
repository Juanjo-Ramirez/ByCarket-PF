import http from "./http.service";
import { UserDataResponse } from "./api.service";

export interface Brand {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  name: string;
  brandId: string;
}

export interface Version {
  id: string;
  name: string;
  modelId: string;
}

export interface VehicleData {
  brandId: string;
  modelId: string;
  versionId: string;
  typeOfVehicle: string;
  year: number;
  condition: string;
  currency: string;
  price: number;
  mileage: number;
  description: string;
  images: File[];
}

export interface VehicleResponse {
  id: string;
  brand: Brand;
  model: Model;
  version: Version;
  typeOfVehicle: string;
  year: number;
  condition: string;
  currency: string;
  price: number;
  mileage: number;
  description: string;
  images: { public_id: string; secure_url: string }[];
  userId: string;
  createdAt: string;
}

export interface GetVehiclesResponse {
  vehicles: VehicleResponse[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export type PostStatus = "Pending" | "Approved" | "Rejected" | "Inactive";

export interface PostResponse {
  id: string;
  vehicle: VehicleResponse;
  status: PostStatus;
  postDate: string;
  user: UserDataResponse;
  sellerId: string;
  isNegotiable: boolean;
}

export interface GetPostsResponse {
  data: PostResponse[];
  vehicles?: PostResponse[];
  total: number;
  totalItems?: number;
  page: number;
  currentPage?: number;
  limit: number;
  totalPages: number;
  status?: PostStatus;
}

export const getBrands = async (): Promise<Brand[]> => {
  const response = await http.get<Brand[]>("/brands");
  return response.data;
};

export const getModels = async (brandId?: string): Promise<Model[]> => {
  const url = brandId ? `/brands/${brandId}/models` : "/models";
  const response = await http.get<Model[]>(url);
  return response.data;
};

export const getModelsByBrand = async (brandId: string): Promise<Model[]> => {
  const response = await http.get<{ models: Model[] }>(`/brands/${brandId}`);
  return response.data.models || [];
};

export const getVersions = async (modelId?: string): Promise<Version[]> => {
  const url = modelId ? `/models/${modelId}/versions` : "/versions";
  const response = await http.get<Version[]>(url);
  return response.data;
};

export const getVersionsByModel = async (
  modelId: string
): Promise<Version[]> => {
  const response = await http.get<{ versions: Version[] }>(
    `/models/${modelId}`
  );
  return response.data.versions || [];
};

export const createVehicle = async (
  vehicleData: VehicleData
): Promise<VehicleResponse> => {
  const formData = new FormData();

  formData.append("brandId", vehicleData.brandId);
  formData.append("modelId", vehicleData.modelId);
  formData.append("versionId", vehicleData.versionId);
  formData.append("typeOfVehicle", vehicleData.typeOfVehicle);
  formData.append("year", vehicleData.year.toString());
  formData.append("condition", vehicleData.condition);
  formData.append("currency", vehicleData.currency);
  formData.append("price", vehicleData.price.toString());
  formData.append("mileage", vehicleData.mileage.toString());
  formData.append("description", vehicleData.description);

  vehicleData.images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await http.post<any>("/vehicles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const getVehicles = async (
  page: number = 1,
  limit: number = 10
): Promise<GetVehiclesResponse> => {
  const response = await http.get<GetVehiclesResponse>("/vehicles", {
    params: { page, limit },
  });
  return response.data;
};

export const getUserVehicles = async (): Promise<VehicleResponse[]> => {
  const response = await http.get<any>("/vehicles/me");
  if (response.data?.data) {
    return response.data.data;
  }
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (Array.isArray(response.data?.vehicles)) {
    return response.data.vehicles;
  }
  return [];
};

export const getPosts = async (
  page: number = 1,
  limit: number = 9,
  filters: any = {}
): Promise<GetPostsResponse> => {
  const params: Record<string, any> = {
    page,
    limit,
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = value;
    }
  });

  const response = await http.get<GetPostsResponse>("/posts", {
    params,
  });
  return response.data;
};

interface ApiResponse<T> {
  data: T;
  message: string;
}

export const getVehicleById = async (
  vehicleId: string
): Promise<VehicleResponse> => {
  try {
    const response = await http.get<ApiResponse<VehicleResponse>>(
      `/vehicles/${vehicleId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching vehicle by ID:", error);
    throw error;
  }
};

export const deleteVehicle = async (vehicleId: string): Promise<void> => {
  try {
    await http.delete(`/vehicles/${vehicleId}`);
  } catch (error) {
    throw error;
  }
};

export const updateVehicle = async (
  vehicleId: string,
  vehicleData: Partial<VehicleData>
): Promise<VehicleResponse> => {
  const response = await http.patch<VehicleResponse>(
    `/vehicles/${vehicleId}`,
    vehicleData
  );
  return response.data;
};

export const getPostById = async (postId: string): Promise<PostResponse> => {
  try {
    const response = await http.get<ApiResponse<PostResponse>>(
      `/posts/${postId}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await http.delete(`/posts/${postId}`);
  } catch (error) {
    throw error;
  }
};

export const uploadVehicleImages = async (
  vehicleId: string,
  images: File[]
): Promise<void> => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("images", image);
  });

  try {
    await http.patch(`/files/vehicle-images/${vehicleId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteVehicleImage = async (
  vehicleId: string,
  publicId: string
): Promise<void> => {
  try {
    await http.delete(`/files/${vehicleId}/images/${publicId}`);
  } catch (error) {
    throw error;
  }
};

export const createPost = async (data: {
  vehicleId: string;
  description?: string;
  price?: number;
  isNegotiable: boolean;
}): Promise<PostResponse> => {
  const response = await http.post<ApiResponse<PostResponse>>("/posts", data);
  return response.data.data;
};

export const getMyPosts = async (): Promise<GetPostsResponse> => {
  const response = await http.get<ApiResponse<GetPostsResponse>>("/posts/me");
  return response.data.data;
};

export const getPendingPosts = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}): Promise<GetPostsResponse> => {
  try {
    const response = await http.get<GetPostsResponse>(
      `/posts?status=Pending&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching pending posts:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al obtener las publicaciones pendientes"
    );
  }
};

export const acceptPost = async (postId: string): Promise<void> => {
  try {
    await http.patch(`/posts/accept/${postId}`);
  } catch (error) {
    throw error;
  }
};

export const rejectPost = async (postId: string): Promise<void> => {
  try {
    await http.patch(`/posts/reject/${postId}`);
  } catch (error) {
    throw error;
  }
};

export const generateVehicleDescription = async (
  description: string
): Promise<string> => {
  try {
    const response = await http.post<{ description: string }>(
      "/openai/generate-description",
      { description }
    );

    if (!response.data?.description) {
      throw new Error("La respuesta no contiene descripción");
    }

    return response.data.description;
  } catch (error) {
    console.error("Error generando la descripción del vehículo:", error);
    throw error;
  }
};
