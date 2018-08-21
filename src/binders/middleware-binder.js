const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

function middlewareBinder(app, disableLogs){
    app.use(helmet())
    app.use(bodyParser.json())
    app.use(cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }))
    if(!disableLogs)
        app.use(morgan('combined'))
}

module.exports = middlewareBinder
