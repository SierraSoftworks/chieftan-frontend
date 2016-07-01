import {bindable, bindingMode} from "aurelia-framework";

@bindable({
  name: "value",
  defaultBindingMode: bindingMode.twoWay,
  defaultValue: {}
})
@bindable({
  name: "variableName",
  attributeName: "variable-name"
})
@bindable({
  name: "valueName",
  attributeName: "value-name"
})
export class VariableEditor {
  variableName: string = "Variable";
  valueName: string = "Value";

  value: {
    [name: string]: string;
  };

  rows: Row[] = [];

  bind() {
    this.updateRowsFromValue(this.value);
  }

  valueChanged() {
    this.updateRowsFromValue(this.value);
  }

  updateRowsFromValue(value: { [name: string]: string; }) {
    const newRows: Row[] = [];
    if (value) {
      for(let key in value) {
        newRows.push({
          key: key,
          value: value[key]
        });
      }
    }

    newRows.push({
      key: "",
      value: ""
    });

    return this.rows = newRows;
  }

  updateValueFromRows(rows: Row[]) {
    const newValue = {};
    rows.forEach(row => row.key && (newValue[row.key] = row.value));

    return this.value = newValue;
  }

  ensureNewRow(currentRow: Row) {
    const rows = this.rows;
    const length = rows.length;
    for (let i = length - 1; i >= 0; i--) {
      if (!rows[i].key && !rows[i].value) this.removeRow(rows, rows[i]);
      else break;
    }

    this.newRow(rows);
  }

  newRow(rows: Row[]) {
    this.rows.push({
      key: "",
      value: ""
    });
  }

  removeRow(rows: Row[], row: Row) {
    const i = rows.indexOf(row);
    if (~i) rows.splice(i, 1);
  }

  onChanged(row: Row) {
    this.ensureNewRow(row);
    this.updateValueFromRows(this.rows);
  }
}

interface Row {
  key: string;
  value: string;
}
