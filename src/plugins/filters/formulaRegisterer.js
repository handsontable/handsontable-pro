export const formulas = {};

/**
 * Get formula closure with pre-bound arguments.
 *
 * @param {String} name Formula name.
 * @param {Array} args Formula arguments.
 * @returns {Function}
 */
export function getFormula(name, args) {
  if (!formulas[name]) {
    throw Error(`Filter formula "${name}" does not exist.`);
  }
  const {formula, descriptor} = formulas[name];

  if (descriptor.inputValuesDecorator) {
    args = descriptor.inputValuesDecorator(args);
  }

  return function(dataRow) {
    return formula.apply(dataRow.meta.instance, [].concat([dataRow], [args]));
  };
}

/**
 * Get formula object descriptor which defines some additional informations about this formula.
 *
 * @param {String} name Formula name.
 * @returns {Object}
 */
export function getFormulaDescriptor(name) {
  if (!formulas[name]) {
    throw Error(`Filter formula "${name}" does not exist.`);
  }

  return formulas[name].descriptor;
}

/**
 * Formula registerer.
 *
 * @param {String} name Formula name.
 * @param {Function} formula Formula function
 * @param {Object} descriptor Formula descriptor
 */
export function registerFormula(name, formula, descriptor) {
  descriptor.key = name;
  formulas[name] = {
    formula, descriptor
  };
}
