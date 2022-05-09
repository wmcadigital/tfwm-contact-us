import React, { useContext, useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import FileUpload from 'components/shared/FileUpload/FileUpload';

import YesOrNo from 'components/shared/YesOrNo/YesOrNo';

import Dropdown from '../../../components/shared/Dropdown/Dropdown';

import Textarea from '../../../components/shared/Textarea/Textarea';

import Checkbox from '../../../components/shared/Checkbox/Checkbox';

import Input from '../../../components/shared/Input/Input';

import { FormDataContext } from '../../../globalState/ContactUsContext';

import Data from '../../ContactUs/newData.json';

const Form = () => {
  const [{ stepNum, formData, formId }, formDispatch] = useContext(FormDataContext);
  const findComponents = Data.pages.find((page) => page.currentStepId === formId).formComponents;
  const data = findComponents[stepNum];

  const nextStep = (event) => {
    event.preventDefault();
    Array.prototype.forEach.call(event.target, (target) => {
      if (target.name) {
        // answers.push({ name: target.name, value: target.value, required: target.id });
        formDispatch({
          type: 'ADD-DATA',
          payload: { name: target.name, value: target.value },
        });
      }
    });
    // event.target.forEach((target) => {
    //   console.log(target);
    // if (target.name) {
    //   // answers.push({ name: target.name, value: target.value, required: target.id });
    //   formDispatch({
    //     type: 'ADD-DATA',
    //     payload: { name: target.name, value: target.value },
    //   });
    // }
    // });

    // const hasEmptyField = answers.some((target) => !target.value);
    // const isRequired = answers.some((target) => target.required === 'required');
    // // exit func if there is a field with an empty value or if there are no answers
    // if ((hasEmptyField && isRequired) || answers.length === 0) return;

    // when last form is reached
    if (stepNum === findComponents.length) {
      formDispatch({
        type: 'CHANGE-PAGE',
        payload: { page: 'ANSWERS', stepNum },
      });
      return;
    }

    formDispatch({
      type: 'NEXT',
    });
  };

  const prevStep = () => {
    formDispatch({
      type: 'PREV',
    });
  };

  return (
    <>
      <div className="wmnds-col-1 wmnds-m-lg">
        <button type="button" className="wmnds-btn wmnds-btn--link" onClick={prevStep}>
          &lt; Back
        </button>
      </div>
      <div
        className="bg-white wmnds-p-l-md wmnds-m-l-lg"
        style={{ width: '40rem', backgroundColor: 'white' }}
      >
        <p className="wmnds-m-b-xs wmnds-p-t-lg">Section {data.sectionNum} of 2</p>
        <h4 className="wmnds-m-t-xs">{data.sectionDescription}</h4>

        <h2 className=" wmnds-m-t-lg">{data.title}</h2>
        <form onSubmit={nextStep}>
          {data.components.map((component) => (
            <div key={component.id}>
              {component.type === 'Dropdown' && (
                <Dropdown
                  label={component.label}
                  details={component.details}
                  errorMsg={component.errorMsg}
                  required={component.required}
                  options={component.options}
                  name={component.name}
                  defaultValue={formData[component.name]}
                />
              )}

              {component.type === 'Textarea' && (
                <Textarea
                  title={component.title}
                  text1={component.text1}
                  required={component.required}
                  text2={component.text2}
                  name={component.name}
                  errorMsg={component.errorMsg}
                  defaultValue={formData[component.name]}
                />
              )}

              {component.type === 'Input' && (
                <Input
                  label={component.label}
                  name={component.name}
                  defaultValue={formData[component.name]}
                  errorMsg={component.errorMsg}
                  required={component.required}
                />
              )}
              {component.type === 'FileUpload' && (
                <FileUpload
                  label={component.label}
                  details={component.details}
                  name={component.name}
                  defaultValue={formData[component.name]}
                  errorMsg={component.errorMsg}
                  required={component.required}
                />
              )}
              {component.type === 'Checkbox' && (
                <Checkbox
                  label={component.label}
                  options={component.options}
                  name={component.name}
                  defaultValues={[formData.email, formData.phone]}
                  required={component.required}
                />
              )}
              {component.type === 'YesOrNo' && (
                <YesOrNo
                  label={component.label}
                  options={component.options}
                  name={component.name}
                  defaultValues={[formData.email, formData.phone]}
                  required={component.required}
                />
              )}
            </div>
          ))}

          <button className="wmnds-btn wmnds-m-b-lg" type="submit">
            Continue
          </button>
        </form>
      </div>
    </>
  );
};

export default Form;
