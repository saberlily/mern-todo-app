import axios from "axios"
const instance = axios.create({
    baseURL:"http://157.245.61.179:8000/api"
})
export default instance