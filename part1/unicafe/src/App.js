import { useState } from 'react'

const StatisticLine = (props) => {
  return (
    <>
    <table>
    <tbody>
        <tr>
            <td>{props.text} </td>
            <td>{props.value}</td>
        </tr>
      </tbody>
    </table>
    </>
  )
}

const Statistic = (props) => {
  
  const [good, neutral, bad, allFeedback] = props.feedback
  if (allFeedback === 0) {
    return (
      <>
      <p>No feedback given</p>
      </>
    )
  } else {
    return (
      <>
      <h1>Statistic</h1>
      <StatisticLine text="good" value ={good} />
      <StatisticLine text="neutral" value ={neutral} />
      <StatisticLine text="bad" value ={bad} />      
      <StatisticLine text="bad" value ={bad} /> 
      <StatisticLine text="all" value ={allFeedback} />
      <StatisticLine text="average" value ={(allFeedback)/3} />
      <StatisticLine text="positive" value ={(good/(allFeedback))*100 + '%'} />
      </>
    )
  }
  
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allFeedback, setAll] = useState(0)


  const handleGoodClick = () => {
    setAll(allFeedback+1)
    setGood(good + 1)
  }
  const handleNeutralClick = () => {
    setAll(allFeedback+1)
    setNeutral(neutral + 1)
  }
  const handleBadClick = () => {
    setAll(allFeedback+1)
    setBad(bad + 1)
  }
  return (
    <div>
      <h1>Give feedback</h1>
      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>
      <Statistic feedback={[good, neutral, bad, allFeedback]} />
    </div>
  )
}

export default App