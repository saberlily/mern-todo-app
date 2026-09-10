import axios from "axios"
const instance = axios.create({
    baseURL:"http://159.223.61.172:8000/api"
})
export default instance