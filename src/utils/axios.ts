// utils/axios.ts
import axios, { AxiosInstance } from "axios"

const fetchApi: AxiosInstance = axios.create({
  baseURL: "/api",
})

export default fetchApi
