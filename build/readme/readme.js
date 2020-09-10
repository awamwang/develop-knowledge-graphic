const rra = require('recursive-readdir-async')
const path = require('path')
const fs = require('fs')
const util = require('util')
const inputDir = path.resolve(process.argv[2])
const contentSuffix = process.argv[3]
const u = require('../util')({
  basePath: inputDir
})

const write = util.promisify(fs.writeFile)
const read = util.promisify(fs.readFile)

const readdirOptions = {
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
  let res = `## Categorys\n\n`

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
      return prev + (sub.name.endsWith(contentSuffix) ? item : '')
    }
  }, '')
}

function genDetails(tree) {
  let res = `## Details\n\n`

  tree.forEach((dir) => {
    res += `### ${dir.name}\n\n`

    res += genDetailItems(dir)

    res += '\n'
  })

  return res
}

rra.list(inputDir, readdirOptions).then((tree) => {
  read(path.resolve(__dirname, './README-header.md'), {
    encoding: 'utf-8'
  }).then((header) => {
    let readme = `${header}\n`
    readme += genCategory(tree)
    readme += '\n'
    readme += genDetails(tree)

    // write(path.resolve(__dirname, '.temp\\readmeBody.md'), readme, {
    //   encoding: 'utf-8'
    // })
    write(path.resolve(__dirname, '../../README.md'), readme, {
      encoding: 'utf-8'
    })
  })
})