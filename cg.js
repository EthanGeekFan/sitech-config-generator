#!/usr/bin/env node

const program = require("commander")
const packageJson = require("./package.json")
const fs = require('fs')
const path = require('path')

program
    .version(packageJson.version, '-v, --version')
    .option('-i, --new-implementation <implementation_id>', 'create a new implementation from template')
    .option('-s, --new-source <source_name>', 'create a new source module from template')
    .option('-m, --include-modules [modules...]', 'include modules when generating an implementation')
    .parse(process.argv)

let options = program.opts()

if (options.newImplementation) {
    let dest = './implementations/' + options.newImplementation;
    if (!dest.endsWith('.js')) {
        dest += '.js'
    }
    if (fs.existsSync(dest)) {
        console.log(`File ${dest} already exists`)
        process.exit()
    }
    if (!fs.existsSync('./implementations')) {
        fs.mkdirSync('./implementations')
    }
    let content = fs.readFileSync(path.join(__dirname, 'templates/implementation.js')).toString('utf-8')
    // content = content.replace('${label}', options.newImplementation.replace('.js', ''))
    if (options.includeModules) {
        let paramStr = " "
        let sourceStr = "\n"
        for (let i = 0; i < options.includeModules.length; i++) {
            paramStr += options.includeModules[i] + ((i === options.includeModules.length - 1) ? '' : ',') + ' '
            sourceStr += `        '${options.includeModules[i]}',\n`
        }
        sourceStr = sourceStr.trimEnd()
        let paramIndex = content.indexOf('{}') + 1
        const sourceMark = '/* data source module names */'
        content = content.slice(0, paramIndex) + paramStr + content.slice(paramIndex)
        let sourceIndex = content.indexOf(sourceMark) + sourceMark.length
        content = content.slice(0, sourceIndex) + sourceStr + content.slice(sourceIndex)
        fs.writeFileSync(dest, content)
    }
    fs.writeFileSync(dest, content)
    console.log('Generated new implementation at: ' + dest)
}

if (options.newSource) {
    let dest = './sources/' + options.newSource;
    if (!dest.endsWith('.js')) {
        dest += '.js'
    }
    if (fs.existsSync(dest)) {
        console.log(`File ${dest} already exists`)
        process.exit()
    }
    if (!fs.existsSync('./sources')) {
        fs.mkdirSync('./sources')
    }
    fs.copyFileSync(path.join(__dirname, 'templates/source.js'), dest)
    console.log('Generated new source module at: ' + dest)
}

if (!fs.existsSync('./implementations')) {
    console.log("No 'implementation' folder found")
    process.exit(1)
}

let files = fs.readdirSync('./implementations')
let modules = {}
for (let i = 0; i < files.length; i++) {
    if (files[i].endsWith('.js')) {
        if (files[i] === 'implementations.js') {
            continue
        }
        let name = files[i].substring(0, files[i].length - 3)
        modules[name] = "./" + files[i]
    }
}

let implementations = ""
for (const moduleKey in modules) {
    const name = moduleKey
    const entry = `        "${name}": "${modules[moduleKey]}", \n`
    implementations += entry
}
// console.log(implementations)

const conf = `
module.exports = {
    config: {
        sourceDir: "../sources"
    },
    implementations: {
${implementations}    },
}
`
fs.writeFileSync('./implementations/implementations.js', conf.trim())