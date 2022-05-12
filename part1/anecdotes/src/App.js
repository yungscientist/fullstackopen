import { useState } from 'react'

const AnecdoteTopVoted = (props) => {
  
  const getMaxIndexOfArray = (obj) => {
    let arr = Object.values(obj)
    return arr.indexOf(Math.max.apply(null, arr));
  }


  return (
    <div>
      <h2>Anecdote with most votes</h2>
      <p>{props.Anecdotes[getMaxIndexOfArray(props.Points)]}</p>
    </div>
  )
}

const AnecdoteOfTheDay = (props) => {
  
  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{props.Anecdotes[props.Selected]}</p>
      <p>has {props.Points[props.Selected]} votes</p>

    </div>
  )
}

const Anecdotes = (props) => {
  const [points, setVote] = useState(new Uint8Array(props.anecdotes.length))
  const [selected, setSelected] = useState(0)
  const getRandomNumber = () => {
    return Math.floor(Math.random() * props.anecdotes.length)
  }
  const nextAnecdote = () => {
    setSelected(getRandomNumber())
  }

  const voteFor = () => {
    const newPoints = { 
      ...points,
      [selected]: points[selected]+1 
    }
    setVote(newPoints) 
  }
  
  return (
    <div>
      <AnecdoteOfTheDay Points={points} Anecdotes={props.anecdotes} Selected={selected}/>
      <button onClick={voteFor}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>
      <AnecdoteTopVoted Points={points} Anecdotes={props.anecdotes} />
    </div>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  return (
    <div>
      <Anecdotes anecdotes={anecdotes}/>
    </div>
  )
}

export default App