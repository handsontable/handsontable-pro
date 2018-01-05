import moment from 'moment';
import {registerFormula} from './../../formulaRegisterer';

export const FORMULA_NAME = 'date_after';

export function formula(dataRow, [value] = inputValues) {
  let date = moment(dataRow.value, dataRow.meta.dateFormat);
  let inputDate = moment(value, dataRow.meta.dateFormat);

  if (!date.isValid() || !inputDate.isValid()) {
    return false;
  }

  return date.diff(inputDate) >= 0;
}

registerFormula(FORMULA_NAME, formula, {
  name: 'After',
  inputsCount: 1
});
