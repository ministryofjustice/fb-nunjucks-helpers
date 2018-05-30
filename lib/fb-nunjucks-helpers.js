const nunjucksMacroHelpers = require('./nunjucks-macro-helpers')
const fbNunjucksDataHelpers = require('./fb-nunjucks-data-helpers')

const init = (env) => {
  let nunjucksEnv = nunjucksMacroHelpers.init(env)

  nunjucksEnv.addFilter('addBlockInfo', (str, params) => {
    const output = str.replace(/(<div[^>]+)/, `$1 data-block-id="${params._id}" data-block-type="${params._type}"`)
      .replace(/(govuk-form-group)/, `$1 fb-block-${params._type}`)
    return output
  })

  nunjucksEnv.renderString(`
{% macro callBlock(data) -%}
{% set blockOutput %}{{ callMacro(data._type, data) }}{% endset %}
{{- blockOutput | addBlockInfo(data) | safe -}}
{%- endmacro %}
{{ addGlobal('callBlock', callBlock) }}
{% macro callBlocks(blocks) -%}
{% for block in blocks -%}
{{- callBlock(block) -}}
{%- endfor %}
{%- endmacro %}
{{ addGlobal('callBlocks', callBlocks) }}
  `)

  nunjucksEnv = fbNunjucksDataHelpers.init(nunjucksEnv)

  return nunjucksEnv
}

module.exports = {
  init
}
