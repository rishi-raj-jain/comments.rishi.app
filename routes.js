import { Router } from '@edgio/core'

export default new Router().match('/:path*', ({ renderWithApp }) => {
  renderWithApp()
})
