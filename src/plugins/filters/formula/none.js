import {registerFormula} from './../formulaRegisterer';

export const FORMULA_NAME = 'none';

export function formula() {
  return true;
}

registerFormula(FORMULA_NAME, formula, {
  name: 'None',
  inputsCount: 0
});
