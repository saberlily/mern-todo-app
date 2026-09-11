import axios from "axios"
const instance = axios.create({
    baseURL:"http://178.128.211.2:8000/api"
})
export default instance