const test = require('tape')
const fbNunjucksHelpers = require('./fb-nunjucks-helpers')
const {initEnv, defaultViewPaths} = require('./spec/load-nunjucks')
const getEnv = initEnv(fbNunjucksHelpers)

test('When callBlock is called', t => {
  const nunjucksEnv = getEnv(defaultViewPaths)

  const blockId = 'blockId'
  const blockTemplate = `
  {{ callBlock({
    _id: "${blockId}",
    _type: "block",
    heading: "blockHeadingValue"
  }) | safe }}`
  const output = nunjucksEnv.renderString(blockTemplate).trim()
  t.equals(output, '<div class="govuk-form-group fb-block-block" data-block-id="blockId" data-block-type="block">\nblockHeadingValue\n</div>', 'it should render the corresponding block')

  const anotherId = 'anotherBlockId'
  const nestedTemplate = `
{{ callBlock({
  _id: "${anotherId}",
  _type: "anotherblock",
  title: "blockTitleValue",
  block: {
    _id: "innerBlockId",
    _type: "block",
    heading: "innerBlockHeadingValue"
  }
}) | safe }}`
  const nestedOutput = nunjucksEnv.renderString(nestedTemplate).trim()
  t.equals(nestedOutput, '<div class="govuk-form-group fb-block-anotherblock" data-block-id="anotherBlockId" data-block-type="anotherblock">\nblockTitleValue\n<div class="govuk-form-group fb-block-block" data-block-id="innerBlockId" data-block-type="block">\ninnerBlockHeadingValue\n</div>\n</div>', 'it should render nested callBlock')

  t.end()
})

test('When callBlock is called', t => {
  const nunjucksEnv = getEnv(defaultViewPaths)

  const blocksId = 'blockId'
  const blocksTemplate = `
{{ callBlocks([{
  _id: "${blocksId}",
  _type: "anotherblock",
  title: "blockTitleValue",
  block: {
    _id: "innerBlockId",
    _type: "block",
    heading: "innerBlockHeadingValue"
  }
},{
  _id: "blockId",
  _type: "block",
  heading: "blockHeadingValue"
}]) | safe }}`
  const output = nunjucksEnv.renderString(blocksTemplate).trim()
  t.equals(output, '<div class="govuk-form-group fb-block-anotherblock" data-block-id="blockId" data-block-type="anotherblock">\nblockTitleValue\n<div class="govuk-form-group fb-block-block" data-block-id="innerBlockId" data-block-type="block">\ninnerBlockHeadingValue\n</div>\n</div><div class="govuk-form-group fb-block-block" data-block-id="blockId" data-block-type="block">\nblockHeadingValue\n</div>', 'it should render nested callBlock')

  t.end()
})
