import React from 'react'
import Login from './components/Login'
import Register from './components/Register'
import TrainList from './components/TrainList'
import BookSeat from './components/BookSeat'

function App() {
  return (
    <div className='App'>
      <h1>Railway Management System</h1>
      <Login />
      <Register />
      <TrainList />
      <BookSeat />
    </div>
  )
}

export default App
