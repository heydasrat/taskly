import connectDB from './db/index.js'
import config from './config/config.js'
import app from './app.js'


connectDB().then(() => {
    app.listen(config.port, () => {
        console.log(`The server is runing on http://localhost:${config.port}`)
    })
}).catch((mongodbError) => {
    console.error(mongodbError)
})