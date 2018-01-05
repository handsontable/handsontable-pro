import moment from 'moment';
import {registerFormula} from './../../formulaRegisterer';

export const FORMULA_NAME = 'date_tomorrow';

export function formula(dataRow) {
  let date = moment(dataRow.value, dataRow.meta.dateFormat);

  if (!date.isValid()) {
    return false;
  }

  return date.isSame(moment().subtract(-1, 'days').startOf('day'), 'd');
}

registerFormula(FORMULA_NAME, formula, {
  name: 'Tomorrow',
  inputsCount: 0
});
