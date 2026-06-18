import React, { useContext, useState, useEffect, useLayoutEffect, useRef } from 'react';

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
import Number from '../../../components/shared/Number/Number';
import Date from '../../../components/shared/Date/Date';
import Address from '../../../components/shared/Address/Address';

import { FormDataContext } from '../../../globalState/ContactUsContext';

import Data from '../../ContactUs/newData.json';

const Form = () => {
  const [{ stepNum, formData, formId, pageType, page, formComponents }, formDispatch] =
    useContext(FormDataContext);
  const params = window.location.hash.slice(2);
  const formToLoad = formId || params;
  const findComponents = Data.pages.find(
    (pageData) => pageData.currentStepId === formToLoad
  ).formComponents;

  const [components, setComponents] = useState(findComponents);

  const data = components[stepNum];

  useEffect(() => {
    formDispatch({
      type: 'SET-COMPONENTS',
      payload: {
        formComponents: components,
      },
    });
  }, [components, formDispatch]);

  useLayoutEffect(() => {
    if (formComponents.length > 1) {
      setComponents(formComponents);
    }
  }, [formComponents, page]);

  const prevStep = () => {
    formDispatch({
      type: 'PREV',
    });
  };

  const { register, handleSubmit, getValues, unregister, setValue } = useForm({
    shouldUnregister: true,
    shouldUseNativeValidation: true,
  });

  const fileDataRef = useRef({});

  const [formError, setFormError] = useState([]);

  // Helper function to format phone numbers with +44
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || typeof phoneNumber !== 'string') return phoneNumber;

    const trimmed = phoneNumber.trim();
    // If it already starts with +44 or +, return as is
    if (trimmed.startsWith('+')) return trimmed;
    // If it starts with 0, replace with +44
    if (trimmed.startsWith('0')) return `+44${trimmed.substring(1)}`;
    // Otherwise, prepend +44
    return `+44${trimmed}`;
  };

  // Helper function to format phone fields in form entries
  const formatPhoneFieldsInEntries = (entries, dataFieldName = '') => {
    return entries.map(([fieldKey, value]) => {
      // Check if this is a phone field based on key name or data field name
      const isPhoneField =
        /phone|telephone|mobile/i.test(fieldKey) || /phone|telephone|mobile/i.test(dataFieldName);
      // Only format if: it's a phone field AND it's a string AND contains digits (not just "Yes"/"No")
      if (isPhoneField && typeof value === 'string' && /\d/.test(value)) {
        return [fieldKey, formatPhoneNumber(value)];
      }
      return [fieldKey, value];
    });
  };

  const continueHandler = () => {
    const values = getValues();

    Object.keys(fileDataRef.current).forEach((key) => {
      values[key] = fileDataRef.current[key];
    });

    const entries = Object.entries(values);

    const isEmpty = Object.keys(values).length === 0;
    const errors = entries.filter((val) => !val[1]).map((val) => val[0]);

    const emailPattern = /^[\w.%+-]+@[\w.-]+\.[a-z]{2,4}$/;
    entries.forEach(([key, value]) => {
      if (key === 'email' && value && !emailPattern.test(value) && !errors.includes(key)) {
        errors.push(key);
      }
    });

    if (values.day || values.month || values.year) {
      const day = parseInt(values.day, 10);
      const month = parseInt(values.month, 10);
      const year = parseInt(values.year, 10);

      const isDayValid = day >= 1 && day <= 31;
      const isMonthValid = month >= 1 && month <= 12;
      const isYearValid = year >= 1900 && year <= 2100;

      if (values.day && !isDayValid && !errors.includes('day')) errors.push('day');
      if (values.month && !isMonthValid && !errors.includes('month')) errors.push('month');
      if (values.year && !isYearValid && !errors.includes('year')) errors.push('year');

      if (isDayValid && isMonthValid && isYearValid) {
        const parsed = new window.Date(year, month - 1, day);
        if (
          parsed.getFullYear() !== year ||
          parsed.getMonth() !== month - 1 ||
          parsed.getDate() !== day
        ) {
          if (!errors.includes('day')) errors.push('day');
          if (!errors.includes('month')) errors.push('month');
          if (!errors.includes('year')) errors.push('year');
        }
      }
    }

    if (values.hour !== undefined || values.minute !== undefined) {
      if ((values.hour === '' || values.hour === undefined) && !errors.includes('hour'))
        errors.push('hour');
      if ((values.minute === '' || values.minute === undefined) && !errors.includes('minute'))
        errors.push('minute');
    }

    const postcodePattern = /^[A-Za-z]{1,2}[0-9][0-9A-Za-z]?\s?[0-9][A-Za-z]{2}$/;
    entries.forEach(([key, value]) => {
      if (
        key.includes('postcode') &&
        value &&
        !postcodePattern.test(value) &&
        !errors.includes(key)
      ) {
        errors.push(key);
      }
    });

    setFormError(errors);

    if (data.hasDynamicComponents) {
      if (Object.keys(values).length > 1) {
        setComponents(data.dynamicComponents[0]);
      } else {
        setComponents(data.dynamicComponents[+Object.keys(values)[0]]);
      }
      return;
    }

    if (!isEmpty) {
      // Format phone numbers in form entries before storing
      const formattedEntries = formatPhoneFieldsInEntries(entries, data.name);

      formDispatch({
        type: 'ADD-DATA',
        payload: {
          name: data.name,
          value: formattedEntries,
          stepNum,
          answerTitle: data.answerTitle,
          section: data.sectionDescription,
        },
      });
    }

    if (errors.length === 0) {
      if (stepNum === components.length - 1 || pageType === 'change') {
        formDispatch({
          type: 'CHANGE-PAGE',
          payload: { page: 'ANSWERS', stepNum },
        });
        return;
      }
      if (entries.length === 1 && entries[0][0] === 'yes-or-no-skip' && entries[0][1] === 'No') {
        if (stepNum === components.length - 2 || pageType === 'change') {
          formDispatch({
            type: 'CHANGE-PAGE',
            payload: { page: 'ANSWERS', stepNum },
          });
          return;
        }
        formDispatch({
          type: 'SKIP',
        });
      } else {
        formDispatch({
          type: 'NEXT',
        });
      }
    }
  };

  const getDefaultValue = (name) => {
    if (formData[data.name]) {
      return formData[data.name].value.find((value) => value[0] === name);
    }
    return '';
  };
  useEffect(() => {
    const buttonFocusEl = document.getElementById('btn-focus');
    buttonFocusEl.focus();
    buttonFocusEl.blur();
  }, [data]);
  return (
    <div className="wmnds-container wmnds-container--main" style={{ padding: 0 }}>
      {stepNum !== 0 && (
        <div className="wmnds-col-1 wmnds-m-b-lg">
          <button type="button" className="wmnds-btn wmnds-btn--link" onClick={prevStep}>
            &lt; Back
          </button>
        </div>
      )}
      <button type="button" style={{ opacity: '0', all: 'unset' }} id="btn-focus" tabIndex="-1" />
      {data && (
        <div
          className="wmnds-bg-white wmnds-p-lg wmnds-col-1 wmnds-col-md-3-4"
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
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
                    defaultValue={getDefaultValue(component.name)?.[1] || ''}
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
                    type={component.inputType}
                  />
                )}
                {component.type === 'Number' && (
                  <Number
                    label={component.label}
                    label2={component.label2}
                    name={component.name}
                    defaultValue={getDefaultValue(component.name)}
                    errorMsg={component.errorMsg}
                    required={component.required}
                    register={register}
                    errors={formError}
                    unregister={unregister}
                    type={component.inputType}
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
                    setValue={setValue}
                  />
                )}
                {component.type === 'FileUpload' && (
                  <FileUpload
                    label={component.label}
                    details={component.details}
                    name={component.name}
                    defaultValue={formData[data.name]?.value?.[0]?.[1] || ''}
                    errorMsg={component.errorMsg}
                    required={component.required}
                    register={register}
                    errors={formError}
                    unregister={unregister}
                    setValue={setValue}
                    onFileChange={(name, files) => {
                      fileDataRef.current[name] = files;
                    }}
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
                    defaultValue={getDefaultValue('radio')?.[1] || ''}
                    defaultValues={component.options?.map(
                      (opt) => getDefaultValue(opt.name)?.[1] || ''
                    )}
                    required={component.required}
                    register={register}
                    errors={formError}
                    unregister={unregister}
                  />
                )}
                {component.type === 'Date' && (
                  <Date
                    name={component.name}
                    dayDefaultValue={getDefaultValue('day')?.[1] || ''}
                    monthDefaultValue={getDefaultValue('month')?.[1] || ''}
                    yearDefaultValue={getDefaultValue('year')?.[1] || ''}
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

            <button
              onClick={handleSubmit(continueHandler)}
              className="wmnds-btn"
              style={{ margin: 0, marginTop: 10 }}
              type="button"
            >
              Continue
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Form;
