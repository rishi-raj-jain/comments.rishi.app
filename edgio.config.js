module.exports = {
  connector: '@edgio/express',
  express: {
    appPath: './server.ts',
  },
  includeFiles: {
    '.env': true,
  },
}
