import axios from "axios"
const instance = axios.create({
    baseURL:"http://178.128.x.x:8000/api"
})
export default instance