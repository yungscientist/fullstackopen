import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl)
  }

const create = (newObject) => axios.post(baseUrl, newObject)
const deletePerson = (id) => axios.delete(`${baseUrl}/${id}`)
const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject) 

const phonebookService = {
    getAll,
    create,
    update,
    deletePerson
}
export default phonebookService