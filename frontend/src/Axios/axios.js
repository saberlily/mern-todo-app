import axios from "axios"
const instance = axios.create({
    baseURL:"http://178.128.221.132:8000/api"
})
export default instance