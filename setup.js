'use strict'

const fs = require('fs')
fs.createReadStream('.example-env')
  .pipe(fs.createWriteStream('.env'))
