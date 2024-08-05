import React, {useState} from 'react'
import axios from 'axios'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3000/register', {
        username,
        password,
        role,
      })
      alert('User registered successfully')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type='text'
        placeholder='Role'
        value={role}
        onChange={e => setRole(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}

export default Register
