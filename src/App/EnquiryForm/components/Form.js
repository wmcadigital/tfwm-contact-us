import React, { useContext, useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import { useForm } from 'react-hook-form';

import FileUpload from 'components/shared/FileUpload/FileUpload';

import YesOrNo from 'components/shared/YesOrNo/YesOrNo';

import RadioOptions from 'components/shared/RadioOptions/RadioOptions';

import FindAddress from 'components/shared/FindAddress/FindAddress';

import Dropdown from '../../../components/shared/Dropdown/Dropdown';

import Textarea from '../../../components/shared/Textarea/Textarea';

import Checkbox from '../../../components/shared/Checkbox/Checkbox';

import Input from '../../../components/shared/Input/Input';

import Date from '../../../components/shared/Date/Date';

import Address from '../../../components/shared/Address/Address';

import { FormDataContext } from '../../../globalState/ContactUsContext';

import Data from '../../ContactUs/newData.json';

const Form = () => {
  const [{ stepNum, formData, formId, pageType }, formDispatch] = useContext(FormDataContext);
  const findComponents = Data.pages.find((page) => page.currentStepId === formId).formComponents;

  const [components, setComponents] = useState(findComponents);
  const [data, setData] = useState(components[stepNum]);
  useEffect(() => {
    setData(components[stepNum]);
  }, [stepNum, components]);
  const prevStep = () => {
    formDispatch({
      type: 'PREV',
    });
  };
  const { register, handleSubmit, getValues, unregister } = useForm({
    shouldUnregister: true,
    reValidateMode: 'onChange',
  });
  const [formError, setFormError] = useState([]);

  const continueHandler = (event) => {
    const values = getValues();

    const isEmpty = Object.keys(values).length === 0;

    const errors = Object.entries(values)
      .filter((val) => !val[1])
      .map((val) => val[0]);

    setFormError(errors);

    if (data.hasDynamicComponents) {
      if (Object.keys(values).length > 1) {
        setComponents(data.dynamicComponents[0]);
      } else {
        setComponents(data.dynamicComponents[+Object.keys(values)[0]]);
      }
      return;
    }
    // Object.keys(values).map(function (key, index) {
    if (!isEmpty) {
      formDispatch({
        type: 'ADD-DATA',
        payload: {
          name: data.name,
          value: Object.entries(values),
          stepNum,
          answerTitle: data.answerTitle,
          section: data.sectionDescription,
        },
      });
    }

    //   return true;
    // });

    if (errors.length === 0) {
      if (stepNum === components.length - 1 || pageType === 'change') {
        formDispatch({
          type: 'CHANGE-PAGE',
          payload: { page: 'ANSWERS', stepNum },
        });
        return;
      }

      formDispatch({
        type: 'NEXT',
      });
    }
  };

  const getDefaultValue = (name) => {
    if (formData[data.name]) {
      return formData[data.name].value.find((value) => value[0] === name);
    }
    return '';
  };

  return (
    <div className="wmnds-container wmnds-container--main" style={{ padding: 0 }}>
      <div className="wmnds-col-1 wmnds-m-b-lg">
        {stepNum !== 0 && (
          <button type="button" className="wmnds-btn wmnds-btn--link" onClick={prevStep}>
            &lt; Back
          </button>
        )}
      </div>
      <div
        className="wmnds-bg-white wmnds-p-lg wmnds-p-l-md wmnds-col-1 wmnds-col-md-3-4"
        style={{ maxWidth: 608 }}
      >
        {data.sectionNum && (
          <p className="wmnds-m-b-xs">
            Section {data.sectionNum} of {data.sectionTotal || 2}
          </p>
        )}
        {data.sectionDescription && (
          <h4 className="wmnds-m-t-xs wmnds-m-b-lg">{data.sectionDescription}</h4>
        )}

        <h2 style={{ margin: 0, marginBottom: 30 }}>{data.title}</h2>
        <form onSubmit={handleSubmit(continueHandler)}>
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
                  register={register}
                  errors={formError}
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
                  defaultValue={getDefaultValue(component.name)}
                  register={register}
                  errors={formError}
                />
              )}

              {component.type === 'Input' && (
                <Input
                  label={component.label}
                  label2={component.label2}
                  name={component.name}
                  defaultValue={getDefaultValue(component.name)}
                  errorMsg={component.errorMsg}
                  required={component.required}
                  register={register}
                  errors={formError}
                  unregister={unregister}
                />
              )}
              {component.type === 'FindAddress' && (
                <FindAddress
                  label={component.label}
                  name={component.name}
                  defaultValue={formData[component.name]}
                  errorMsg={component.errorMsg}
                  required={component.required}
                  allowMapView={component.allowMapView}
                  register={register}
                  errors={formError}
                  inputs={component.inputs}
                  unregister={unregister}
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
                  register={register}
                  errors={formError}
                  unregister={unregister}
                />
              )}
              {component.type === 'Checkbox' && (
                <Checkbox
                  label={component.label}
                  options={component.options}
                  name={component.name}
                  defaultValues={getDefaultValue(component.name)}
                  required={component.required}
                  register={register}
                  unregister={unregister}
                  errors={formError}
                />
              )}
              {component.type === 'YesOrNo' && (
                <YesOrNo
                  label={component.label}
                  options={component.options}
                  name={data.name}
                  defaultValue={formData[data.name] ? formData[data.name].value : ''}
                  required={component.required}
                  register={register}
                  errors={formError}
                  unregister={unregister}
                />
              )}
              {component.type === 'Radios' && (
                <RadioOptions
                  label={component.label}
                  options={component.options}
                  name={component.name}
                  defaultValues={[formData.email, formData.phone]}
                  required={component.required}
                  register={register}
                  errors={formError}
                  unregister={unregister}
                />
              )}
              {component.type === 'Date' && (
                <Date
                  name={component.name}
                  defaultValues={[formData.email, formData.phone]}
                  required={component.required}
                  register={register}
                  errors={formError}
                  label={component.label}
                  showTime={component.showTime}
                />
              )}
              {component.type === 'Address' && (
                <Address
                  label={component.label}
                  name={component.name}
                  defaultValue={formData[component.name]}
                  errorMsg={component.errorMsg}
                  required={component.required}
                  allowMapView={component.allowMapView}
                  register={register}
                  errors={formError}
                  inputs={component.inputs}
                  unregister={unregister}
                />
              )}
            </div>
          ))}

          <button className="wmnds-btn" style={{ margin: 0, marginTop: 10 }} type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
