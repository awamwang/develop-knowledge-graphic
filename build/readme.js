const rra = require('recursive-readdir-async')
const path = require('path')
const fs = require('fs')
const util = require('util')
const { getDefaultSettings } = require('http2')
const outputDir = path.resolve(__dirname, '../out')
const u = require('./util')({
  basePath: outputDir
})

const write = util.promisify(fs.writeFile)

const options = {
  mode: rra.TREE,
  recursive: true,
  stats: false,
  ignoreFolders: true,
  extensions: false,
  deep: false,
  realPath: true,
  normalizePath: true,
  include: [],
  exclude: [],
  readContent: false,
  encoding: 'utf8'
}

function genCategory(tree) {
  let res = `## 分类\n\n`

  tree.forEach((dir) => {
    res += `+ [${dir.name}](${u.genHashLink(dir.name)})\n`
  })

  return res
}

function genDetailItems(dir, indentation = 0) {
  return dir.content.reduce((prev, sub) => {
    let item =
      '  '.repeat(indentation) +
      `+ [${sub.name}](${u.getGitUrl(u.getRelativePath(sub.fullname))})\n`

    if (sub.isDirectory) {
      return prev + item + genDetailItems(sub, indentation + 1)
    } else {
      return prev + (sub.name.endsWith('.png') ? item : '')
    }
  }, '')
}

function genDetails(tree) {
  let res = `## 具体内容\n\n`

  tree.forEach((dir) => {
    res += `### ${dir.name}\n\n`

    res += genDetailItems(dir)

    res += '\n'
  })

  return res
}

rra.list(outputDir, options).then((tree) => {
  let readme = `# 开发知识\n\n`
  readme += genCategory(tree)
  readme += '\n'
  readme += genDetails(tree)

  // write(path.resolve(__dirname, '.temp\\readmeBody.md'), readme, {
  //   encoding: 'utf-8'
  // })
  write(path.resolve(__dirname, '../README.md'), readme, {
    encoding: 'utf-8'
  })
})
