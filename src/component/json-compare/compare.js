const getFormsMeta = data => {
  return data
    ? data.reduce((meta, form, index) => {
        meta[form.formCode] = index;
        return meta;
      }, {})
    : {};
};
const getFieldMeta = data => {
  return data
    ? data.reduce((meta, form, index) => {
        meta[form.name] = index;
        return meta;
      }, {})
    : {};
};
const isEmpty = function(value) {
  return value === null || value === undefined;
};

const formAttrMapping = {
  fieldType: '表单类型',
  id: 'ID',
  index: '位置顺序',
  label: '描述信息',
  maxCount: '最大个数',
  minCount: '最低个数',
  multiple: '是否支持添加多个',
  name: 'NAME',
  readOnly: '是否可编辑',
  fields: '表单字段'
};

const fieldAttrMapping = {
  description: '描述信息',
  displayCondition: '隐藏控制逻辑',
  fieldType: '字段类型',
  index: '位置顺序',
  inputOption: '必填控制',
  inputType: '字段类型',
  label: '字段名称',
  name: 'NAME',
  options: '取值选项',
  validation: '取值校验逻辑'
};
const diffFields = (newFields, oldFields) => {
  const fieldChanges = [];
  const metaForNew = getFieldMeta(newFields);
  const metaForOld = getFieldMeta(oldFields);

  debugger;
  if (newFields) {
    newFields.forEach(fields => {
      if (isEmpty(metaForOld[fields.name])) {
        fieldChanges.push({
          type: 'add',
          current: fields
        });
      } else {
        const attrChanges = [];
        const newKeys = Object.keys(fields);
        const oldField = oldFields[metaForOld[fields.name]];
        const oldKeys = Object.keys(oldField);

        oldKeys.forEach(key => {
          if (newKeys.indexOf(key) === -1) {
            attrChanges.push({
              type: 'remove',
              key: key,
              attrName: fieldAttrMapping[key] || key,
              original: fields[key]
            });
          }
        });

        newKeys.forEach(key => {
          if (oldKeys.indexOf(key) === -1) {
            attrChanges.push({
              type: 'add',
              key: key,
              attrName: fieldAttrMapping[key] || key,
              original: oldField[key],
              current: fields[key]
            });
          } else {
            if (JSON.stringify(fields[key]) !== JSON.stringify(oldField[key])) {
              attrChanges.push({
                type: 'update',
                key: key,
                attrName: fieldAttrMapping[key] || key,
                original: oldField[key],
                current: fields[key]
              });
            }
          }
        });

        if (attrChanges && attrChanges.length) {
          fieldChanges.push({
            type: 'update',
            current: fields,
            original: oldField,
            changes: attrChanges
          });
        }
      }
    });
  }

  if (oldFields) {
    oldFields.forEach(fields => {
      if (isEmpty(metaForNew[fields.name])) {
        fieldChanges.push({
          type: 'remove',
          original: fields,
          key: fields.name,
          attrName: formAttrMapping[fields.name] || fields.name
        });
      }
    });
  }
  return fieldChanges;
};

const diffForm = (newItem, oldItem) => {
  const formChanges = [];
  const newKeys = Object.keys(newItem);
  const oldKeys = Object.keys(oldItem);
  oldKeys.forEach(key => {
    if (newKeys.indexOf(key) === -1) {
      formChanges.push({
        type: 'remove',
        key: key,
        attrName: formAttrMapping[key] || key
      });
    }
  });

  newKeys.forEach(key => {
    if (oldKeys.indexOf(key) === -1) {
      formChanges.push({
        type: 'add',
        key: key,
        attrName: formAttrMapping[key] || key,
        current: newItem[key]
      });
    } else if (key === 'fields') {
      const formAttrChanges = diffFields(newItem[key], oldItem[key]);
      if (formAttrChanges && formAttrChanges.length) {
        formChanges.push({
          type: 'update',
          key: key,
          attrName: formAttrMapping[key] || key,
          changes: formAttrChanges,
          original: oldItem[key],
          current: newItem[key]
        });
      }
    } else {
      if (JSON.stringify(oldItem[key]) !== JSON.stringify(newItem[key])) {
        if (key === 'id') {
          return;
        }
        formChanges.push({
          type: 'update',
          key: key,
          attrName: formAttrMapping[key] || key,
          original: oldItem[key],
          current: newItem[key]
        });
      }
    }
  });
  return formChanges;
};

const diff = (newData, oldData) => {
  const totalChanges = {};
  const metaForNew = getFormsMeta(newData);
  const metaForOld = getFormsMeta(oldData);
  if (oldData) {
    oldData.forEach(oldFormItem => {
      if (isEmpty(metaForNew[oldFormItem.formCode])) {
        totalChanges[oldFormItem.formCode] = {
          type: 'remove',
          original: oldFormItem,
          label: oldFormItem.label
        };
      }
    });
  }
  if (newData) {
    newData.forEach(newFormItem => {
      if (isEmpty(metaForOld[newFormItem.formCode])) {
        totalChanges[newFormItem.formCode] = {
          type: 'add',
          current: newFormItem,
          label: newFormItem.label
        };
      } else {
        const oldItem = oldData[metaForOld[newFormItem.formCode]];
        const formChanges = diffForm(newFormItem, oldItem);
        if (formChanges && formChanges.length) {
          totalChanges[newFormItem.formCode] = {
            type: 'update',
            original: oldItem,
            current: newFormItem,
            changes: diffForm(newFormItem, oldItem)
          };
        }
      }
    });
  }
  return totalChanges;
};

// const newForm = require("./mock/newForm");
// const oldForm = require("./mock/oldForm");
// const changes = diff(newForm.forms, oldForm.forms);
// console.log(changes);

export default diff;
