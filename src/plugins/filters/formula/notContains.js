import {registerFormula, getFormula} from './../formulaRegisterer';
import {FORMULA_NAME as FORMULA_CONTAINS} from './contains';

export const FORMULA_NAME = 'not_contains';

export function formula(dataRow, inputValues) {
  return !getFormula(FORMULA_CONTAINS, inputValues)(dataRow);
}

registerFormula(FORMULA_NAME, formula, {
  name: 'Does not contain',
  inputsCount: 1
});
