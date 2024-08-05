import React, {useState} from 'react'
import axios from 'axios'

const TrainList = () => {
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [trains, setTrains] = useState([])

  const handleSearch = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(
        `http://localhost:3000/trains?source=${source}&destination=${destination}`,
        {
          headers: {Authorization: token},
        },
      )
      setTrains(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Train List</h2>
      <input
        type='text'
        placeholder='Source'
        value={source}
        onChange={e => setSource(e.target.value)}
      />
      <input
        type='text'
        placeholder='Destination'
        value={destination}
        onChange={e => setDestination(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {trains.map(train => (
          <li key={train.id}>
            {train.train_name} - Available Seats: {train.available_seats}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TrainList
