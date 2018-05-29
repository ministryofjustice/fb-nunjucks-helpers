const get = require('lodash.get')
const set = require('lodash.set')

const init = (env) => {
  if (!env) {
    throw new Error('No nunjucks environment passed')
  }
  const nunjucksEnv = env

  // Allow json filtering and more complex dumping
  nunjucksEnv.addFilter('json', JSON.stringify)
  nunjucksEnv.addGlobal('JSON', JSON.stringify)

  // Allow objects to be updated
  const setObject = (...args) => {
    const objArgs = args.slice()
    objArgs.unshift({})
    return Object.assign.apply(null, objArgs)
  }
  nunjucksEnv.addGlobal('setObject', setObject)

  // Allow object properties to be updated individually
  const setObjectProperty = (obj, prop, val) => {
    return Object.assign({}, obj, {[prop]: val})
  }
  nunjucksEnv.addGlobal('setObjectProperty', setObjectProperty)

  // Allow globals to be added from within macros
  // needed to register macros at start time
  nunjucksEnv.addGlobal('addGlobal', (prop, val) => {
    nunjucksEnv.addGlobal(prop, val)
  })

  const add = (macroPaths, namespace) => {
    if (!nunjucksEnv) {
      throw new Error('No nunjucksEnv found')
    }
    const adjustedMacroPaths = macroPaths.map(macroPath => {
      let macroNamespace = namespace
      if (macroNamespace === undefined) {
        let macroNjk = macroPath.replace(/.*\/(.+)\.njk$/, '$1')
        macroNamespace = macroNjk.includes('.') ? macroNjk.replace(/\.[^.]+$/, '') : ''
      }
      return {
        path: macroPath,
        namespace: macroNamespace
      }
    })

    adjustedMacroPaths.forEach(macroObj => {
      nunjucksEnv.renderString(`
        {% import '${macroObj.path}' as importedMacros %}
        {{ addMacros(importedMacros${macroObj.namespace ? `, '${macroObj.namespace}'` : ''}) }}
      `, {})
    })
  }

  nunjucksEnv.addMacros = add

  // Object to store macros in
  let macros = {}

  const addMacro = (key, val) => {
    addMacros({[key]: val})
  }

  const addMacros = (obj, namespace) => {
    let newMacros = Object.assign({}, obj)
    if (namespace) {
      Object.keys(newMacros).forEach(key => {
        // access by string
        newMacros[`${namespace}.${key}`] = newMacros[key]
        delete newMacros[key]
        // access by path
        const namespaceMacros = Object.assign({}, get(macros, namespace), obj)
        set(macros, namespace, namespaceMacros)
      })
    }
    Object.assign(macros, newMacros)
  }

  nunjucksEnv.addGlobal('$macros', macros)
  nunjucksEnv.addGlobal('addMacro', addMacro)
  nunjucksEnv.addGlobal('addMacros', addMacros)

  nunjucksEnv.renderString(`
{%- macro callMacro(path, data) %}
{{ $macros[path](data) }}
{% endmacro -%}
{{ addGlobal('callMacro', callMacro) }}
  `)

  return nunjucksEnv
}

module.exports = {
  init
}
