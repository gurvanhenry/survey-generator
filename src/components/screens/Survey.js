import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import Field from '../form/Field';

import form1Json from '../../assets/1.json';

import './Survey.css';

function Survey(props) {
  const { onSurveySubmit } = props;
  const { surveyId } = useParams();
  const form = loadSurvey(surveyId);
  const [stepNumber, setStepNumber] = useState(1);
  const totalSteps = form ? form.pages.length : 0;
  const [allResponses, setAllResponses] = useState({});
  const isLastStep = () => {
    return stepNumber >= totalSteps;
  };
  const submitForm = (responses) => {
    const newAllResponses = { ...allResponses, ...responses };
    if (isLastStep()) {
      onSurveySubmit(form, newAllResponses);
    } else {
      setAllResponses(newAllResponses);
      setStepNumber(stepNumber + 1);
    }
  };
  if (!form) {
    return <div>No form</div>;
  }
  const page = form.pages[stepNumber - 1];
  const submitText = isLastStep() ? 'Terminer' : 'Suivant';
  const stepNames = form.pages.map((x) => x.name);
  return (
    <div className="root">
      <h3 className="survey-title">{form.title}</h3>
      <Progress currentPosition={stepNumber} steps={stepNames} />
      <h4 className="form-title">{page.name}</h4>
      <Form fields={page.elements} submitText={submitText} onSubmit={submitForm} />
      <Pagination current={stepNumber} total={totalSteps} />
    </div>
  );
}

function loadSurvey(surveyId) {
  switch (surveyId) {
    case '1':
      return form1Json;
    default:
      return null;
  }
}

function Progress(props) {
  const { currentPosition, steps } = props;
  const formatText = (done, position, name, suffix) => {
    return `[${done}] (${position}) ${name} ${suffix}`;
  };
  return (
    <div className="progress">
      <ul>
        {steps.map((name, position) => {
          const done = position + 1 < currentPosition;
          const isCurrent = position + 1 === currentPosition;
          const doneText = done ? 'x' : ' ';
          const positionText = position + 1;
          const suffix = isCurrent ? '  <===' : '';
          return <li key={name}>{formatText(doneText, positionText, name, suffix)}</li>;
        })}
      </ul>
    </div>
  );
}

function Form(props) {
  const { fields, submitText, onSubmit } = props;
  const { handleSubmit, register, errors } = useForm();
  const onFormSubmit = (responses) => {
    onSubmit(responses);
  };
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      {fields.map((field) => (
        <Field model={field} key={field.name} register={register} errors={errors} />
      ))}
      <div className="field">
        <input type="submit" value={submitText} />
      </div>
    </form>
  );
}

function Pagination(props) {
  const { current, total } = props;
  return (
    <div className="pagination">
      {current} / {total}
    </div>
  );
}

export default Survey;
