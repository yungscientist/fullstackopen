import { useState, useEffect } from 'react'

import phonebookService from './services/phonebook'

const Notification = ({ successMessage, errorMessage, type }) => {
  const successMessageStyle = {
    color: 'green',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  const errorMessageStyle = {
    color: 'red',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  if (errorMessage === null && successMessage === null) {
    return null
  }

  if (errorMessage !== null) {
    return (
      <div style={errorMessageStyle}>
        {errorMessage}
      </div>
    )
  }
  
  return (
    <div style={successMessageStyle}>
      {successMessage}
    </div>
  )
}

const Persons = ({persons, setPersons, searchName, setErrorMessage}) => {
  const personsToShow = (searchName) => {
    return searchName === '' ? persons : persons.filter(person => person.name === searchName)
  }
  const handleDeletePerson = (e, id) => {
    e.preventDefault()
    console.log('deletePerson', id);

    if (window.confirm(`Do you really want to delete?`) === true) {
      phonebookService.deletePerson(id)
      .then(response => console.log(response))
      .catch((error) => {
        console.log(persons.find(person => person.id === id))
        setErrorMessage(`Information of ${JSON.stringify(persons.find(person => person.id === id).name)} has already been removed from server`) 
        console.error(error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)})
      } 
      setPersons(persons.filter(person => person.id !== id)) 
    }
  
  return ( 
    <>
      <ul>
        {personsToShow(searchName).length === 0 
        ? <li>No entries found</li> 
        : personsToShow(searchName).map((person) => {
          return (
          <li key={person.id}>{person.name} {person.number}
          <button onClick={(e) => handleDeletePerson(e, person.id)}>delete</button></li>
        )})}
      </ul>
    </>
  )
}

const PersonForm = ({ persons, setPersons, setSuccessMessage, successMessage, errorMessage, setErrorMessage, newName, newNumber, setNewName, setNewNumber, handleNameChange, handleNumberChange}) => {



  const isAlreadyAdded = (name) => {
    let arr = persons.map(person => Object.values(person).includes(name) 
    ? true 
    : false)
    return arr.includes(true) === true 
    ? true 
    : false
  }

  
  const updateNumber = (name, number) => {
    const person = persons.find(person => person.name = name)
    const changedPerson = {...person, number: number}
    const id = person.id

    phonebookService
    .update(id, changedPerson)
    .then((response) => {
      setPersons(persons.map((person) => person.id !== id ? person : response.data))
    })
    .catch(error => console.log('error', error.message))
    setNewName('')
    setNewNumber('')
  }

  const addNewPerson = (event) => {
    event.preventDefault()
    let personObject = {
      name: newName,
      number: newNumber
    }
    if (isAlreadyAdded(personObject.name) === true) {
      return ( 
        <>
        {window.confirm(`${personObject.name} is already added to the phonebook. Do you want to update number?`) === true
        ? updateNumber(personObject.name, personObject.number) & setSuccessMessage(`${personObject.name} number updated`) 
        & setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        : console.log('false')
        }
        </>
      )
    } else {
      phonebookService
      .create(personObject)
      .then((response) => {
        personObject = response.data
        setPersons(persons.concat(personObject))
        console.log('persons', persons)
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`${personObject.name} added to the phonebook`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
    }
  }
  return (
    <>
      <form onSubmit={addNewPerson}>
        <div>
          name: <input 
          value={newName}
          onChange={handleNameChange}
          />          
        </div>
        <div>
          number: <input 
          value={newNumber}
          onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </>
  )
}

const Filter = ({ searchName, handleSearchNameChange }) => {
  return (
    <div>
      filter shown with
      {console.log(searchName)} 
      <input 
      value={searchName}
      onChange={handleSearchNameChange} 
      />
    </div>
  )
}

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setNewSearchName] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  
  useEffect(() => {
    phonebookService
    .getAll()
    .then((response) => setPersons(response.data))
  }, []);
  
  const handleSearchNameChange = (event) => {
    setNewSearchName(event.target.value)
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification successMessage={successMessage} errorMessage={errorMessage}/>
      <Filter 
      searchName={searchName} 
      handleSearchNameChange={handleSearchNameChange}
      />
      <h2>Add a new</h2>
      <PersonForm 
      handleNameChange={handleNameChange} 
      handleNumberChange={handleNumberChange} 
      persons={persons}
      setPersons={setPersons} 
      newNumber={newNumber} 
      newName={newName}
      setNewNumber={setNewNumber}
      setNewName={setNewName} 
      successMessage={successMessage}
      setSuccessMessage={setSuccessMessage}
      />
      <h2>Numbers</h2>
      <Persons
      errorMessage={errorMessage}
      setErrorMessage={setErrorMessage} 
      persons={persons}
      setPersons={setPersons}
      searchName={searchName}
      />
    </div>
  )
}

export default App