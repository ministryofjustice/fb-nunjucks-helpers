const test = require('tape')
const {
  setError,
  setLabel,
  setItemsLabel,
  setContent,
  setWidthClass,
  setInputWidthClass
} = require('./fb-nunjucks-data-helpers')

const testIdsChecked = {}
const testIdChecker = (t, fn, testDuplicate) => {
  if (testIdsChecked[fn]) {
    if (testDuplicate) {
      t.ok(true, 'it should catch duplicates')
    } else {
      t.notok(`${fn.name} already called`)
    }
  }
  testIdsChecked[fn] = true
}
test('When testIdChecker is called', t => {
  testIdChecker(t, testIdChecker)
  testIdChecker(t, testIdChecker, true)
  t.end()
})

const testIds = (t, fn) => {
  testIdChecker(t, fn)
  const idData = fn({
    _id: 'idValue'
  })
  t.equals(idData.id, 'idValue', 'it should set the id to the value of _id')

  const explicitIdData = fn({
    id: 'explicitIdValue',
    _id: 'idValue'
  })
  t.equals(explicitIdData.id, 'explicitIdValue', 'it should respect the value of id if explictly passed')
}

test('When setError is called', t => {
  const withError = setError({
    error: 'error string'
  })
  t.deepEquals(withError, {
    error: 'error string',
    errorMessage: {
      html: 'error string'
    }
  }, 'it should update the errorMessage property with the value of the error')

  const withoutError = setError({})
  t.deepEquals(withoutError, {}, 'it should not update the errorMessage property if no error was passed')

  t.end()
})

test('When setLabel is called', t => {
  testIds(t, setLabel)

  const labelData = setLabel({
    label: 'labelValue'
  })
  t.equals(labelData.label.html, 'labelValue', 'it should set the label.html property with the value of any flat label passed')

  const nestedLabelData = setLabel({
    label: {
      html: 'nestedLabelValue'
    }
  })
  t.deepEquals(nestedLabelData.label, {
    html: 'nestedLabelValue'
  }, 'it should let an explicitly passed label object property pass through untouched')

  const hintData = setLabel({
    hint: 'hintValue'
  })
  t.equals(hintData.hint.html, 'hintValue', 'it should set the hint.html property with the value of any flat hint passed')

  const nestedHintData = setLabel({
    hint: {
      html: 'nestedHintValue'
    }
  })
  t.deepEquals(nestedHintData.hint, {
    html: 'nestedHintValue'
  }, 'it should let an explicitly passed hint object property pass through untouched')

  const undefinedData = setLabel({})
  t.equals(undefinedData.label, undefined, 'it should not set the label property if no label passed')
  t.equals(undefinedData.hint, undefined, 'it should not set the hint property if no hint passed')

  t.end()
})

test('When setItemsLabel is called', t => {
  testIds(t, setItemsLabel)

  const labelData = setItemsLabel({
    label: 'labelValue'
  })
  t.equals(labelData.label.html, 'labelValue', 'it should set the label.html property with the value of any flat label passed')
  t.equals(labelData.legend.html, 'labelValue', 'it should set the legend.html property with the value of any flat label passed')
  t.equals(labelData.fieldset.legend.html, 'labelValue', 'it should set the fieldset.legend.html property with the value of any flat label passed')

  const hintData = setItemsLabel({
    hint: 'hintValue'
  })
  t.equals(hintData.hint.html, 'hintValue', 'it should set the label.html property with the value of any flat hint passed')
  t.equals(hintData.fieldset.hint.html, 'hintValue', 'it should set the fieldset.legend.html property with the value of any flat hint passed')

  const errorData = setItemsLabel({
    error: 'errorValue'
  })
  t.equals(errorData.fieldset.errorMessage.html, 'errorValue', 'it should set the fieldset.errorMessage.html property with the value of any error passed')

  t.end()
})

test('When setContent is called', t => {
  const output = setContent({
    heading: '# Hello world\n\nGoodbye\n\n- One\n- Two\n- Three'
  }, 'heading')
  t.equals(output.heading, '<h1>Hello world</h1>\n<p>Goodbye</p>\n<ul>\n<li>One</li>\n<li>Two</li>\n<li>Three</li>\n</ul>', 'it should render the property as markdown')

  const impliedHtmlOutput = setContent({
    html: 'Implied'
  })
  t.equals(impliedHtmlOutput.html, '<p>Implied</p>', 'it should use the html property if no property passed explicitly')

  t.end()
})

const testWidthClass = (t, classMethod, className) => {
  const widthClassUndefined = classMethod({})
  t.equals(widthClassUndefined.classes, undefined, 'it should not set classes if no value or default')

  const widthClass10 = classMethod({
    [className]: '20'
  })
  t.equals(widthClass10.classes, 'govuk-c-input--width-20', 'it should set the character-based classes')

  const widthClassOneThird = classMethod({
    [className]: 'one-third'
  })
  t.equals(widthClassOneThird.classes, 'govuk-!-width-one-third', 'it should set the proprtion-based classes')

  const widthClassDefault = classMethod({}, 10)
  t.equals(widthClassDefault.classes, 'govuk-c-input--width-10', 'it should use the default if no property is set')

  const widthClassDefaultWithValue = classMethod({
    [className]: 'one-third'
  }, 10)
  t.equals(widthClassDefaultWithValue.classes, 'govuk-!-width-one-third', 'it should honour an explicitly passed value rather than the default')

  const widthClasses = classMethod({
    classes: 'class-value',
    [className]: '20'
  })
  t.equals(widthClasses.classes, 'class-value govuk-c-input--width-20', 'it should keep any previous set value of the classes property')

  t.end()
}

test('When setWidthClass is called', t => {
  testWidthClass(t, setWidthClass, 'widthClass')
})

test('When setInputWidthClass is called', t => {
  testWidthClass(t, setInputWidthClass, 'widthClassInput')
})