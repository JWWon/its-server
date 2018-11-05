import { chain } from 'lodash'

export const isValid = (value, model, optional = false) => {
  if (
    (value === undefined && optional) ||
    (typeof model === 'function' && typeof value === typeof model())
  )
    return true
  return chain(value)
    .keys()
    .reduce(
      (result, k) =>
        result && model[k] && isValid(value[k], model[k], optional),
      true
    )
    .value()
}
