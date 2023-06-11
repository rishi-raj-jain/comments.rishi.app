module.exports = {
  connector: '@edgio/express',
  express: {
    appPath: './server.ts',
  },
  serverless: {
    include: ['.env'],
  },
}
