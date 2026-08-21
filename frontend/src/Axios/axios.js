import axios from "axios"
const instance = axios.create({
    baseURL:"http://152.42.221.215:8000/api"
})
export default instance