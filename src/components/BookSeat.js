import React, {useState} from 'react'
import axios from 'axios'

const BookSeat = () => {
  const [trainId, setTrainId] = useState('')

  const handleBook = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        'http://localhost:3000/bookings',
        {train_id: trainId},
        {
          headers: {Authorization: token},
        },
      )
      alert('Seat booked successfully')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Book Seat</h2>
      <input
        type='text'
        placeholder='Train ID'
        value={trainId}
        onChange={e => setTrainId(e.target.value)}
      />
      <button onClick={handleBook}>Book</button>
    </div>
  )
}

export default BookSeat
