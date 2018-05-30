const Markdown = require('markdown-it')()

// helper functions to paper over model inconsitencies
const setError = data => {
  if (data.error && !data.errorMessage) {
    data.errorMessage = {
      html: data.error
    }
  }
  return data
}

const checkPropObject = (data, prop) => {
  if (data[prop] && typeof data[prop] === 'string') {
    data[prop] = {
      html: data[prop]
    }
  }
  return data
}

const setLabel = data => {
  data.id = data.id || data._id
  data = checkPropObject(data, 'label')
  data = checkPropObject(data, 'hint')
  return data
}

// classes: params.fieldset.classes,
// attributes: params.fieldset.attributes,
const setItemsLabel = data => {
  data = setLabel(data)
  data.legend = data.legend || data.label
  data = checkPropObject(data, 'legend')
  data.fieldset = data.fieldset || {}
  if (data.legend) {
    data.fieldset = Object.assign({}, data.fieldset, {
      legend: data.legend
    })
  }
  if (data.hint) {
    data.fieldset = Object.assign({}, data.fieldset, {
      hint: data.hint
    })
  }

  if (data.error) {
    data.fieldset.errorMessage = {
      html: data.error
    }
  }
  data = Object.assign(data, data.fieldset)
  data.items = data.items || []
  data.items = data.items.map(item => {
    return Object.assign({}, item, {
      text: item.text ? item.text : item.label
    })
  })
  return data
}

const setContent = (data, prop) => {
  prop = prop || 'html'
  if (data[prop]) {
    data[prop] = Markdown.render(data[prop]).trim()
  }
  return data
}

const handleWidthClass = (data, prop, def) => {
  if (!data[prop] && def) {
    data[prop] = def
  }
  if (!data[prop]) {
    return data
  }
  const widthDelimiter = parseInt(data[prop], 10) > 0 ? 'c-input--width' : '!-width'
  data.classes = data.classes ? `${data.classes} ` : ''
  data.classes += `govuk-${widthDelimiter}-${data[prop]}`
  return data
}

// Handle width classes
const setWidthClass = (data, def) => {
  return handleWidthClass(data, 'widthClass', def)
}
const setInputWidthClass = (data, def) => {
  return handleWidthClass(data, 'widthClassInput', def)
}

const init = (env) => {
  const nunjucksEnv = env

  const njkGlobals = {
    setError,
    setLabel,
    setItemsLabel,
    setContent,
    setWidthClass,
    setInputWidthClass
  }

  Object.keys(njkGlobals).forEach(key => {
    nunjucksEnv.addGlobal(key, njkGlobals[key])
  })

  return nunjucksEnv
}

module.exports = {
  init,
  setError,
  setLabel,
  setItemsLabel,
  setContent,
  setWidthClass,
  setInputWidthClass
}
