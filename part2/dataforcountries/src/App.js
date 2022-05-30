import { useState, useEffect } from "react"
import axios from "axios"


const Weather = (capital) => {
  const [weather, setWeather] = useState([]) 

  console.log(capital.capital)
  const url = 'http://api.weatherapi.com/v1/current.json?key=' 
  + process.env.REACT_APP_WEATHERAPI_KEY
  + '&' 
  + 'q='
  + capital.capital
  + '&aqi=no';
  
  const getWeatherReport = async () => {
    const response = await axios.get(url)
    console.log(response.data)
    setWeather([response.data.current.temp_c, response.data.current.wind_kph])
  }
  
  useEffect(() => {
    getWeatherReport()}, []);

  
  return (
    <>
    <h2>Weather</h2>
    <p>temperature {weather[0]} °C</p>
    <p>wind {weather[1]} km/h </p>
    </>
  )
}

const Country = ({ country }) => {
  console.log(country)
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>capital: {country.capital}</p>
      <p>area: {country.area}</p>
      <h2>languages</h2>
      {Object.values(country.languages).map(lang => <li>{lang}</li>)}
      <img height="300" src={country.flags.svg} alt="flag"/>
      <Weather capital={country.capital} />
    </>
  )
}

const Countries = ({ countries, countriesToShow, searchName, setNewSearchName }) => {

  const showCountry = (country, e) => {
    e.preventDefault();
    setNewSearchName(country.name.common)
  }
  
  switch (true) {
    case (countriesToShow.length === 1):
      return (
        <>
          <p><b>debug:</b> case: countriesToShow.length is 1</p>
          <Country country={countriesToShow[0]}/>
        </>
      )
    case (countriesToShow.length < 10): 
      return (
        <>
        <p><b>debug:</b> case: countriesToShow.length less than 10</p>
        {countriesToShow.map(country => 
        <div>
          <li key={country.ccn3}>{country.name.common}</li>
          <button onClick={(e) => showCountry(country, e)}>show</button>
        </div>)}
        </>
      )
    case (searchName !== '' && countriesToShow.length > 10):
        return (
          <>
            <p><b>debug:</b> case: too many countries </p>
            <p>Too many results, try to specify filter</p>
          </>
        )
    default:
      return (
        <>
        <p><b>debug:</b> case: default </p>
        {countries.map(country => <li key={country.ccn3}>{country.name.common}</li>)}
        </>
      )
  }
}
  /*
  return (
    <>
      
      { 
      countriesToShow.length < 10 ?
      countriesToShow
      .map(country => <li key={country.ccn3}>{country.name.common}</li>)
      : <p>Too many matches, specify another filter</p>
      }
    </>
  )
}
*/
const Filter = ({ searchName, handleSearchNameChange }) => {
  return (
    <>
    find countries
    {console.log('searchName', searchName)}
    <input 
    value={searchName}
    onChange={handleSearchNameChange}
    />
    </>
  )
}

const App = () => {
  const [countries, setCountries] = useState([]) 
  const [searchName, setNewSearchName] = useState('')

  const countriesToShow = countries.filter(country => country.name.common.includes(searchName))

  const handleSearchNameChange = (event) => {
      setNewSearchName(event.target.value)
  }

  const getCountries = async () => {
    const response = await axios.get('https://restcountries.com/v3.1/all')
    setCountries(response.data)
  }
  
  useEffect(() => {
    getCountries()}, []);
  
  return (
    <div>
      <Filter searchName={searchName} handleSearchNameChange={handleSearchNameChange}  />
      <Countries countries={countries} countriesToShow={countriesToShow} searchName={searchName} setCountries={setCountries} setNewSearchName={setNewSearchName} />
    </div>
  )
}

export default App;