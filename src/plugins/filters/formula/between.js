import {registerFormula, getFormula} from './../formulaRegisterer';
import {FORMULA_NAME as FORMULA_DATE_AFTER} from './date/after';
import {FORMULA_NAME as FORMULA_DATE_BEFORE} from './date/before';

export const FORMULA_NAME = 'between';

export function formula(dataRow, [from, to] = inputValues) {
  if (dataRow.meta.type === 'numeric') {
    let _from = parseFloat(from, 10);
    let _to = parseFloat(to, 10);

    from = Math.min(_from, _to);
    to = Math.max(_from, _to);

  } else if (dataRow.meta.type === 'date') {
    let dateBefore = getFormula(FORMULA_DATE_BEFORE, [to]);
    let dateAfter = getFormula(FORMULA_DATE_AFTER, [from]);

    return dateBefore(dataRow) && dateAfter(dataRow);
  }

  return dataRow.value >= from && dataRow.value <= to;
}

registerFormula(FORMULA_NAME, formula, {
  name: 'Is between',
  inputsCount: 2
});
