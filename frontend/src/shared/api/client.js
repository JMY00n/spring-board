// http://localhost:8080/api를 줄여 써주게 하는 파일
import axios from "axios"

export const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})


