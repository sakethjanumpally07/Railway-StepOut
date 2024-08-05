const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {Pool} = require('pg')

const app = express()
const port = 3000
const pool = new Pool({
  user: 'your_pg_user',
  host: 'localhost',
  database: 'railway_management',
  password: 'your_pg_password',
  port: 5432,
})

const SECRET_KEY = 'your_secret_key'
const ADMIN_API_KEY = 'your_admin_api_key'

app.use(bodyParser.json())

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// Middleware for admin API key
const checkAdminApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  if (apiKey !== ADMIN_API_KEY) return res.sendStatus(403)
  next()
}

// Register a User
app.post('/register', async (req, res) => {
  const {username, password, role} = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Login User
app.post('/login', async (req, res) => {
  const {username, password} = req.body

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ])
    if (result.rows.length === 0)
      return res.status(400).json({error: 'User not found'})

    const user = result.rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword)
      return res.status(400).json({error: 'Invalid password'})

    const token = jwt.sign({id: user.id, role: user.role}, SECRET_KEY, {
      expiresIn: '1h',
    })
    res.json({token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Add a New Train (Admin)
app.post('/trains', checkAdminApiKey, async (req, res) => {
  const {train_name, source, destination, total_seats} = req.body

  try {
    const result = await pool.query(
      'INSERT INTO trains (train_name, source, destination, total_seats, available_seats) VALUES ($1, $2, $3, $4, $4) RETURNING *',
      [train_name, source, destination, total_seats],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Get Seat Availability
app.get('/trains', authenticateToken, async (req, res) => {
  const {source, destination} = req.query

  try {
    const result = await pool.query(
      'SELECT * FROM trains WHERE source = $1 AND destination = $2',
      [source, destination],
    )
    res.json(result.rows)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

// Book a Seat
app.post('/bookings', authenticateToken, async (req, res) => {
  const {train_id} = req.body
  const user_id = req.user.id

  try {
    await pool.query('BEGIN')
    const trainResult = await pool.query(
      'SELECT * FROM trains WHERE id = $1 FOR UPDATE',
      [train_id],
    )
    if (trainResult.rows.length === 0) throw new Error('Train not found')

    const train = trainResult.rows[0]
    if (train.available_seats <= 0) throw new Error('No seats available')

    const bookingResult = await pool.query(
      'INSERT INTO bookings (user_id, train_id) VALUES ($1, $2) RETURNING *',
      [user_id, train_id],
    )

    await pool.query(
      'UPDATE trains SET available_seats = available_seats - 1 WHERE id = $1',
      [train_id],
    )
    await pool.query('COMMIT')

    res.status(201).json(bookingResult.rows[0])
  } catch (error) {
    await pool.query('ROLLBACK')
    res.status(400).json({error: error.message})
  }
})

// Get Specific Booking Details
app.get('/bookings/:id', authenticateToken, async (req, res) => {
  const {id} = req.params

  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [id, req.user.id],
    )
    if (result.rows.length === 0)
      return res.status(404).json({error: 'Booking not found'})
    res.json(result.rows[0])
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
