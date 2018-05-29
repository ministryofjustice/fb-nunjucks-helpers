const init = (env) => {
  const nunjucksEnv = env

  // helper functions to paper over model inconsitencies
  const setError = data => {
    if (data.error) {
      data.errorMessage = {
        html: data.error
      }
    }
    return data
  }

  const setLabel = data => {
    data.id = data.id || data._id
    if (data.label && !data.label.html) {
      data.label = {
        html: data.label
      }
    }
    if (data.hint && !data.hint.html) {
      data.hint = {
        html: data.hint
      }
    }
    return data
  }

  // classes: params.fieldset.classes,
  // attributes: params.fieldset.attributes,
  const setItemsLabel = data => {
    data.id = data.id || data._id
    if (data.label) {
      data.legend = data.label.html || data.label
    }
    if (data.hint && !data.hint.html) {
      data.hint = {
        html: data.hint
      }
    }
    if (data.legend) {
      data.fieldset = Object.assign({}, data.fieldset, {
        legend: {
          html: data.legend
        },
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

  const markdown = {
    render: (text) => {
      return {
        body: text
      }
    }
  }
  const setContent = (data, prop) => {
    prop = prop || 'html'
    if (data[prop]) {
      data[prop] = markdown.render(data[prop]).body
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
    const widthDelimiter = (parseInt(data[prop], 10) > 0) ? 'c-input--width' : '!-width'
    data.classes = data.classes ? data.classes + ' ' : ''
    data.classes +=  `govuk-${widthDelimiter}-${data[prop]}`
    return data
  }

  // Handle width classes
  const setWidthClass = (data, def) => {
    return handleWidthClass(data, 'widthClass', def)
  }
  const setInputWidthClass = (data, def) => {
    return handleWidthClass(data, 'widthClassInput', def)
  }

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
  init
}
