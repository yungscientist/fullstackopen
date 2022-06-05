import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newObject) => axios.post(baseUrl, newObject);
function deletePerson(id) {
  console.log(`${baseUrl}/${id}`);
  return axios.delete(`${baseUrl}/${id}`);
}
const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject);

const phonebookService = {
  getAll,
  create,
  update,
  deletePerson,
};
export default phonebookService;
