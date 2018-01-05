import {registerFormula} from './../formulaRegisterer';

export const FORMULA_NAME = 'lte';

export function formula(dataRow, [value] = inputValues) {
  if (dataRow.meta.type === 'numeric') {
    value = parseFloat(value, 10);
  }

  return dataRow.value <= value;
}

registerFormula(FORMULA_NAME, formula, {
  name: 'Less than or equal to',
  inputsCount: 1
});
