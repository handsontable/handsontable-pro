import {stringify} from 'handsontable/helpers/mixed';
import {registerFormula} from './../formulaRegisterer';

export const FORMULA_NAME = 'eq';

export function formula(dataRow, [value] = inputValues) {
  return stringify(dataRow.value).toLowerCase() === stringify(value);
}

registerFormula(FORMULA_NAME, formula, {
  name: 'Is equal to',
  inputsCount: 1
});
