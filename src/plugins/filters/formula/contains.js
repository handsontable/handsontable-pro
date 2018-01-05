import {stringify} from 'handsontable/helpers/mixed';
import {registerFormula} from './../formulaRegisterer';

export const FORMULA_NAME = 'contains';

export function formula(dataRow, [value] = inputValues) {
  return stringify(dataRow.value).toLowerCase().indexOf(stringify(value)) >= 0;
}

registerFormula(FORMULA_NAME, formula, {
  name: 'Contains',
  inputsCount: 1
});
