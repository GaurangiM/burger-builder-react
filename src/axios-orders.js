import axios from 'axios'

const instance= axios.create({
    baseURL: 'https://my-burger-a2cee-default-rtdb.europe-west1.firebasedatabase.app/'
})

export default instance;