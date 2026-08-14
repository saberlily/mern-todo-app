import axios from "axios"
const instance = axios.create({
    baseURL:"http://68.183.179.104:8000/api"
})
export default instance