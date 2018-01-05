import {registerFormula, getFormula} from './../formulaRegisterer';
import {FORMULA_NAME as FORMULA_BETWEEN} from './between';

export const FORMULA_NAME = 'not_between';

export function formula(dataRow, inputValues) {
  return !getFormula(FORMULA_BETWEEN, inputValues)(dataRow);
}

registerFormula(FORMULA_NAME, formula, {
  name: 'Is not between',
  inputsCount: 2
});
