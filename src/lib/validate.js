import { chain } from 'lodash'

export const isValid = (value, model) => {
  if (typeof model === 'function' && typeof value === typeof model())
    return true
  return chain(value)
    .keys()
    .reduce(
      (result, k) =>
        result && value[k] && model[k] && isValid(value[k], model[k]),
      true
    )
    .value()
}
