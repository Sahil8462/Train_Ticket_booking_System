import axios from "axios";

const currentHost = window.location.hostname;
const apiBaseURL =
  currentHost === "localhost" || currentHost === "127.0.0.1"
    ? "http://localhost:8080/api"
    : `http://${currentHost}:8080/api`;

// Axios instance
const api = axios.create({
  baseURL: apiBaseURL,
   timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const publicPaths = [
      "/auth/login",
      "/auth/signup",
      "/search/combined",
      "/search/external/stations",
      "/search/select-train",
      "/seat/select",
      "/seat/view",
      "/passenger/add",
      "/passenger/list",
      "/bookings/finalize",
    ];

    const isPublicRequest = publicPaths.some((path) =>
      config.url?.startsWith(path)
    );

    if (
      token &&
      token !== "undefined" &&
      token !== "null" &&
      token.trim() !== "" &&
      !isPublicRequest
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// AUTH APIs
export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

export const signupUser = async (signData) => {
  const response = await api.post("/auth/signup", signData);
  return response.data;
};

// TRAIN APIs
export const searchTrains = async ({ from, to, date, classType }) => {
  const response = await api.get("/search/combined", {
    params: { from, to, date, classType },
  });
  return response.data;
};

//ticket API
export const getTicketByPnr = async (pnrNumber) => {
  const response = await api.get(`/tickets/pnr/${pnrNumber}`);
  return response.data;
};

export const selectTrain = async (trainData) => {
  const response = await api.post("/search/select-train", trainData);
  return response.data;
};

export const selectSeat = async (seatData) => {
  const response = await api.post("/seat/select", seatData);
  return response.data;
};

export const addPassenger = async (data) => {
  const response = await api.post("/passenger/add", data);
  return response.data;
};

export const getPassengers = async (draftId) => {
  const response = await api.get("/passenger/list", {
    params: { draftId },
  });
  return response.data;
};

export const finalizeBooking = async (draftId, userId) => {
  const response = await api.post("/bookings/finalize", {
    draftId,
    userId,
  });
  return response.data;
};

// Payment APIs
export const createPaymentOrder = async (data) => {
  const response = await api.post("/payments/create-order", data);
  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await api.post("/payments/verify", data);
  return response.data;
};

// 🔹 Coach list API
export const getCoachesByTrainId = async (trainId) => {
  const response = await api.get(`/seats/coaches/${trainId}`);
  return response.data;
};

// 🔹 Coach-wise seats API
export const getSeatsByTrainAndCoach = async (trainId, coachNumber) => {
  const response = await api.get(`/seats/${trainId}/${coachNumber}`);
  return response.data;
};

export const getSeatsByTrainCoachAndDate = async (trainId, coachNumber, date) => {
  const response = await api.get(`/seats/${trainId}/${coachNumber}/by-date`, {
    params: { date },
  });
  return response.data;
};

// Swap Seat APIs
export const getSwapPnrDetails = async (pnr) => {
  const response = await api.get(`/tickets/swap/pnr/${pnr}`);
  return response.data;
};

export const getSwapSeatOptions = async (trainId, journeyDate, currentSeatId) => {
  const response = await api.get(`/tickets/swap/seats`, {
    params: { trainId, journeyDate, currentSeatId },
  });
  return response.data;
};

export const createSwapRequest = async (data) => {
  const response = await api.post(`/seat-swaps/request`, data);
  return response.data;
};

export const createAvailableSwapPayment = async (data) => {
  const response = await api.post(`/seat-swaps/available/create-payment`, data);
  return response.data;
};

export const completeAvailableSwapPayment = async (data) => {
  const response = await api.post(`/seat-swaps/payment-success`, data);
  return response.data;
};

export const createBookedSwapPayment = async (swapId) => {
  const response = await api.post(`/seat-swaps/${swapId}/create-payment`);
  return response.data;
};

export const completeBookedSwapPayment = async (data) => {
  const response = await api.post(`/seat-swaps/payment-success/booked`, data);
  return response.data;
};
export default api;