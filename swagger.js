const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/suits', './routes/sections']

swaggerAutogen(outputFile, endpointsFiles)