import React, {useState} from 'react'
import axios from 'axios'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      })
      setToken(response.data.token)
      localStorage.setItem('token', response.data.token)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
