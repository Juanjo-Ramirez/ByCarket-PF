import http from "./http.service";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: {
    countryCode: string;
    areaCode: string;
    number: string;
  };
  country: string;
  city: string;
  address: string;
}

interface RegisterResponse {
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive?: boolean;
    canPost?: boolean;
    postsRemaining?: number;
    lastPostDate?: string | null;
  };
}

export interface GoogleProcessLoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive?: boolean;
    canPost?: boolean;
    postsRemaining?: number;
    lastPostDate?: string | null;
  };
  message: string;
  token: string;
}

export interface CompleteProfileData {
  email: string;
  phone?: number;
  country?: string;
  city?: string;
  address?: string;
}

export interface CompleteProfileResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    profileComplete: boolean;
  };
  message: string;
}

export const registerUser = async (
  userData: RegisterData
): Promise<RegisterResponse> => {
  const { ...payload } = userData;
  const response = await http.post<RegisterResponse>("/auth/register", payload);
  return response.data;
};

export const loginUser = async (loginData: LoginData) => {
  const response = await http.post("/auth/login", loginData);
  return response.data;
};

export const processGoogleLogin = async (
  googleProfile: unknown
): Promise<GoogleProcessLoginResponse> => {
  const formattedProfile = {
    email: (googleProfile as any).email || "",
    name: (googleProfile as any).name || "",
    sub: (googleProfile as any).sub || (googleProfile as any).id || "",
  };

  try {
    const response = await http.post<GoogleProcessLoginResponse>(
      "/auth/process-google",
      formattedProfile
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al procesar el login de Google");
  }
};

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: number;
  country?: string;
  city?: string;
  address?: string;
  role?: string;
  isActive?: boolean;
  image?: string | { secure_url: string };
  posts?: {
    id: string;
    postDate: string;
    status: string;
    questions?: {
      id: string;
      message: string;
      date: string;
    }[];
  }[];
}

export interface UserDataResponse {
  id: string;
  name: string;
  email: string;
  role: "user" | "premium" | "admin";
  phone?: number;
  country?: string;
  city?: string;
  address?: string;
  image?: string | { secure_url: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone: {
    countryCode: string;
    areaCode: string;
    number: string;
  };
  country?: string;
  city?: string;
  address?: string;
}

export const getUserData = async (): Promise<UserDataResponse> => {
  const response = await http.get<{ data: UserDataResponse }>("/users/me");
  return response.data.data;
};

export const updateUserData = async (
  userData: UpdateUserData
): Promise<UserDataResponse> => {
  try {
    const response = await http.patch<{ data: UserDataResponse }>(
      "/users/me",
      userData
    );
    return response.data.data;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Error al actualizar datos del usuario";
    throw new Error(errorMsg);
  }
};

export interface UploadProfileImageResponse {
  image: string;
  message: string;
}

export const uploadUserProfileImage = async (
  file: File
): Promise<UploadProfileImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await http.patch<{ data: UploadProfileImageResponse }>(
      "/files/user-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Error al subir la imagen de perfil";
    throw new Error(errorMsg);
  }
};

export interface CreatePostResponse {
  data: {
    id: string;
    vehicleId: string;
    status: string;
    postDate: string;
    description?: string;
    price: number;
    isNegotiable: boolean;
  };
  user: UserDataResponse;
  message: string;
}

export const createPost = async ({
  vehicleId,
  description,
  price,
  isNegotiable,
}: {
  vehicleId: string;
  description?: string;
  price?: number;
  isNegotiable: boolean;
}): Promise<CreatePostResponse> => {
  const response = await http.post<CreatePostResponse>("/posts", {
    vehicleId,
    description,
    price,
    isNegotiable,
  });
  return response.data;
};

export const deleteUserAccount = async (): Promise<{ message: string }> => {
  const response = await http.delete<{ message: string }>("/users/me");
  return response.data;
};

export interface ChatMessage {
  role: "user" | "bot" | "system";
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  postId?: string;
}

export interface ChatCompletionResponse {
  response: string;
}

export const getChatCompletion = async (
  messages: ChatMessage[],
  postId?: string
): Promise<ChatCompletionResponse> => {
  try {
    const response = await http.post<ChatCompletionResponse>(
      "/openai/chatCompletion",
      { messages, postId }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error en la comunicación con el chatbot");
  }
};

export interface UserListResponse {
  data: UserData[];
  total: number;
  page: number;
  limit: number;
}

export const getUsers = async (
  page = 1,
  limit = 9,
  search = ""
): Promise<UserListResponse> => {
  const response = await http.get<UserListResponse>(
    `/users?page=${page}&limit=${limit}${
      search ? `&name=${encodeURIComponent(search)}` : ""
    }`
  );
  return response.data;
};

export const banUser = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await http.delete<{ success: boolean; message: string }>(
    `/users/${userId}`
  );
  return response.data;
};

export interface ActivateAccountResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    isActive: boolean;
  };
}

export interface ResendActivationResponse {
  message: string;
}

export const activateAccount = async (
  token: string
): Promise<ActivateAccountResponse> => {
  try {
    const response = await http.get<ActivateAccountResponse>(
      `/auth/activate/${token}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      return {
        message: "La cuenta ya está activada",
        user: error.response?.data?.user,
      };
    }
    throw error;
  }
};

export const resendActivationEmail = async (
  email: string
): Promise<ResendActivationResponse> => {
  const response = await http.post<ResendActivationResponse>(
    "/auth/resend-activation",
    { email }
  );
  return response.data;
};

// PAYMENT METHODS
export interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: null | any;
  livemode: boolean;
  lookup_key: null | string;
  metadata: Record<string, any>;
  nickname: null | string;
  product: string;
  recurring: {
    interval: "monthly" | "quarterly" | "annual";
    interval_count: number;
    meter: null | any;
    trial_period_days: null | number;
    usage_type: string;
  };
  tax_behavior: string;
  tiers_mode: null | any;
  transform_quantity: null | any;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
  [key: string]: any;
}

export interface Subscription {
  id: string;
  object: string;
  status: string;
  amount_subtotal: number;
  amount_total: number;
  subscription?: {
    id: string;
    items: {
      data: Array<{
        price: Price;
      }>;
    };
  };
  customer_details?: {
    name?: string;
    email?: string;
  };
  payment_status: string;
  client_reference_id: string | null;
  metadata: Record<string, any>;
  client_secret?: string;
  session_id?: string;
  payment_intent?: {
    client_secret: string;
    id: string;
    status: string;
  };
}

export const getMonthlyPrice = async (): Promise<{ data: Price }> => {
  const response = await http.get<Price>("/prices/monthly");
  return { data: response.data };
};

export const getQuarterlyPrice = async (): Promise<{ data: Price }> => {
  const response = await http.get<Price>("/prices/quarterly");
  return { data: response.data };
};

export const getAnnualPrice = async (): Promise<{ data: Price }> => {
  const response = await http.get<Price>("/prices/annual");
  return { data: response.data };
};

export const getSubscriptionById = async (
  subscriptionId: string
): Promise<Subscription> => {
  try {
    const response = await http.get<Subscription>(
      `/subscription/${subscriptionId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching subscription by id:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al obtener los detalles de la suscripción"
    );
  }
};

export const createSubscription = async (data: {
  id: string;
  customer_email?: string;
  metadata?: Record<string, any>;
}): Promise<Subscription> => {
  try {
    const { id, ...restData } = data;
    const response = await http.post<Subscription>(
      `/subscription/${id}`,
      restData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al crear la suscripción"
    );
  }
};

export const updateSubscription = async (
  subscriptionId: string,
  updateData: Record<string, any>
): Promise<Subscription> => {
  try {
    const response = await http.post<Subscription>(
      `/subscription/${subscriptionId}`,
      updateData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating subscription:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al actualizar la suscripción"
    );
  }
};

export const getClientSecret = async (priceId: string): Promise<string> => {
  try {
    const response = await http.post<{ client_secret: string }>(
      `/subscription/${priceId}`,
      {}
    );

    if (!response.data.client_secret) {
      throw new Error("No se pudo obtener el client secret");
    }

    return response.data.client_secret;
  } catch (error: any) {
    console.error("Error en getClientSecret:", error.response?.data);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error al obtener el client secret"
    );
  }
};

// Acara Scrapping
export const getScrapperData = async (): Promise<any> => {
  const response = await http.get<any>("/acara-scrapping");
  return response.data;
};

// User Featured Products
export const getUserFeaturedProducts = async (userId: string): Promise<any> => {
  const response = await http.get<any>(`/posts/user/${userId}`);
  return response.data;
};

// Invoices
export const getInvoiceById = async (id: string): Promise<any> => {
  const response = await http.get<any>(`/invoices/${id}`);
  return response.data;
};

export enum StatusInvoice {
  DRAFT = "draft",
  OPEN = "open",
  PAID = "paid",
  UNCOLLECTIBLE = "uncollectible",
  VOID = "void",
}

export interface Invoice {
  id: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  period_end: string;
  period_start: string;
  status: string;
  total: string;
  amount_paid: string;
}

export interface SubscriptionResponse {
  id: string;
  invoices: Invoice[];
  started_at: string;
  latest_invoice: string;
  status: string;
  cancel_at: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  ended_at: string | null;
}

export const getUserInvoices = async (): Promise<SubscriptionResponse> => {
  const response = await http.get<SubscriptionResponse>("/subscription/me");
  return response.data;
};

export const updateUserSubscription = async (): Promise<any> => {
  const response = await http.patch<any>("/subscription/cancel");
  return response.data;
};

export const getAllUserInvoices = async (): Promise<Invoice[]> => {
  const response = await http.get<Invoice[]>("/invoices/me");
  return response.data || [];
};
