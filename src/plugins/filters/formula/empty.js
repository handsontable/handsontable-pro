import {registerFormula} from './../formulaRegisterer';

export const FORMULA_NAME = 'empty';

export function formula(dataRow) {
  return dataRow.value === '' || dataRow.value === null || dataRow.value === void 0;
}

registerFormula(FORMULA_NAME, formula, {
  name: 'Is empty',
  inputsCount: 0
});
