/* eslint-disable jsx-a11y/accessible-emoji */

import React from 'react';

import './Field.css';

export default function Field(props) {
  const { model, register, errors } = props;
  const error = prepareErrorText(errors, model.name);
  let field = null;
  switch (model.type) {
    case 'text':
      field = <FieldText model={model} register={register} error={error} />;
      break;
    case 'radiogroup':
      field = <FieldRadioGroup model={model} register={register} error={error} />;
      break;
    case 'checkbox':
      field = <FieldCheckBox model={model} register={register} error={error} />;
      break;
    default:
      break;
  }
  return (
    <div className="field">
      <label htmlFor={buildInputId(model)} className="field-title">
        {model.title}
      </label>
      {model.isRequired && <span className="required">*</span>}
      {field}
      {model.description && <span className="description">{model.description}</span>}
      <Error error={error} />
    </div>
  );
}

function FieldText(props) {
  const { model, register } = props;
  const required = model.isRequired;
  const pattern = buildValidationPattern(model);
  return (
    <div>
      <input
        type={model.inputType}
        name={model.name}
        id={buildInputId(model)}
        ref={register({ required, pattern })}
      />
    </div>
  );
}

const PATTERN_EMAIL = /\S+@\S+\.\S+/;
function buildValidationPattern(model) {
  // this function handle only one validation per field
  if (model.validators && model.validators[0].type) {
    switch (model.validators[0].type) {
      case 'email':
        return PATTERN_EMAIL;
      default:
        return '';
    }
  }
  return '';
}

function FieldRadioGroup(props) {
  const { model, register } = props;
  return (
    <div>
      {model.choices.map((choice) => {
        const inputId = buildInputId(model, choice);
        return (
          <div key={choice.value}>
            <input
              type="radio"
              name={model.name}
              id={inputId}
              value={choice.value}
              ref={register({ required: model.isRequired })}
            />
            <label htmlFor={inputId}>{choice.text}</label>
          </div>
        );
      })}
    </div>
  );
}

function FieldCheckBox(props) {
  const { model, register } = props;
  return (
    <div>
      {model.choices.map((choice) => {
        const inputId = buildInputId(model, choice);
        return (
          <div key={choice.value}>
            <input
              type="checkbox"
              name={model.name}
              id={inputId}
              value={choice.value}
              ref={register({ required: model.isRequired })}
            />
            <label htmlFor={inputId}>{choice.text}</label>
          </div>
        );
      })}
    </div>
  );
}

function buildInputId(model, choice = '') {
  if (choice === '') {
    return model.name;
  } else {
    return model.name + '_' + choice.value;
  }
}

function Error(props) {
  const { error } = props;
  return error && <div className="error">💣{error}</div>;
}

function prepareErrorText(errors, fieldName) {
  const error = errors[fieldName];
  if (error) {
    if (error.type === 'required') {
      return 'Champ à compléter';
    }
    if (error.type === 'pattern') {
      return 'Champ de type email (nom@domaine.com)';
    } else {
      return 'Erreur';
    }
  } else {
    return '';
  }
}
