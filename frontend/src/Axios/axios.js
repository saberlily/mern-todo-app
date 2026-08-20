import axios from "axios"
const instance = axios.create({
    baseURL:"http://139.59.250.16:8000/api"
})
export default instance