const path = require('path').posix

const utilDefaultOptions = {}

class Util {
  gitBaseUlr =
    'https://github.com/keepgoingwm/develop-knowledge-graphic/tree/master/out'

  constructor(
    { gitBaseUlr, basePath } = JSON.parse(JSON.stringify(utilDefaultOptions))
  ) {
    gitBaseUlr && (this.gitBaseUlr = gitBaseUlr)
    basePath && (this.basePath = basePath)
  }

  genHashLink(name) {
    return `#${name}`
  }

  getGitUrl(relativePath) {
    return this.gitBaseUlr + relativePath
  }

  getRelativePath(fullPath, basePath) {
    return fullPath.replace(
      (basePath || this.basePath || '').replace(/\\/g, '/'),
      ''
    )
  }
}
module.exports = function (options) {
  return new Util(options)
}
