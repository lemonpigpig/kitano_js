const Nuxt = require('nuxt')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = require('express')()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || '3000'

app.use(bodyParser.json())
app.use(session({
  name: 'kitano.xs',
  secret: 'aco;il:UIkkjsl;ino;i wol;k08!*)93ujs.kjv nk',
  resave: false,
  saveUninitialized: false,
  cookie: { path: '/', maxAge: 24 * 60 * 60 * 1000, secure: false } // 24 hour
}))

app.post('/api/user', function (req, res) {
  req.session.user = req.body.user
  req.session.cookie.maxAge = req.body.user.expires_in

  res.json(req.session.user)
})

app.post('/api/logout', function (req, res) {
  req.session.destroy()
  res.json({ ok: true })
})

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)
app.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
  .catch((error) => {
    console.error(error) // eslint-disable-line no-console
    process.exit(1)
  })
}

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
