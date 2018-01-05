import {stringify} from 'handsontable/helpers/mixed';
import {registerFormula} from './../formulaRegisterer';

export const FORMULA_NAME = 'ends_with';

export function formula(dataRow, [value] = inputValues) {
  return stringify(dataRow.value).toLowerCase().endsWith(stringify(value));
}

registerFormula(FORMULA_NAME, formula, {
  name: 'Ends with',
  inputsCount: 1
});
