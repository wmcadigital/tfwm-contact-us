/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React, { useContext, useState, useReducer, useEffect } from 'react';
import { useFormContext, useForm } from 'react-hook-form';
import { FormProvider, FormDataContext } from 'globalState';
import Radios from 'components/shared/Radios/Radios';
import Button from 'components/shared/Button/Button';
import LastPage from './LastPage';

const ContactUsForm = () => {
  const [formState, formDispatch] = useContext(FormDataContext);
  // const { register, handleSubmit, getValues } = useForm();
  // const { register } = useFormContext();

  const [selectedVal, setSelectedVal] = useState();
  const [formError, setFormError] = useState();
  console.log('formState>>>>>>>>>>>>', formState);
  const methods = useForm({
    mode: 'onBlur',
  });
  useEffect(() => {
    console.log('here in useeffect', selectedVal);
    const selectedRadio = formState.currentStep.fields?.find((item) => item.selected);
    // if (formState.currentStep.parentId) {
    setSelectedVal(selectedRadio?.id);
    // }
  }, [formState?.currentStep]);

  // console.log(getValues());
  const handleRadioChange = (e) => {
    console.log('inside handle radio change');
    setSelectedVal(e.target.id);
  };

  const continueHandler = (e) => {
    e.preventDefault();

    if (!selectedVal) {
      setFormError({
        message: '<p>Please choose an option</p>',
      });
    }
    console.log('selectedValue inside handlecontinue', selectedVal);
    // handleSubmit((data) => console.log(data));
    formDispatch({
      type: 'CONTINUE',
      payload: { formState, selectedVal },
    });
  };
  const backHandler = () => {
    // console.log('backkkk clicked*************', formState.prevStepId);
    formDispatch({
      type: 'BACK',
      payload: formState,
    });
  };
  return (
    <div className="wmnds-container">
      {formState.currentStep.heading === 'What is your enquiry about?' ? null : (
        <button type="button" className="wmnds-btn wmnds-btn--link" onClick={backHandler}>
          &lt; Back
        </button>
      )}
      <FormProvider {...methods}>
        <form className="wmnds-bg-white wmnds-p-lg" onSubmit={continueHandler}>
          <h2 className="wmnds-fe-question">{formState.currentStep?.heading}</h2>
          {formState.currentStep.hasReachedConfirmation ? (
            <LastPage content={formState.currentStep.content} />
          ) : (
            <>
              <Radios
                name={formState.currentStep?.heading}
                label={formState.currentStep.heading}
                classes="wmnds-m-b-sm"
                radios={formState.currentStep.fields}
                fieldValidation={formError}
                onChange={handleRadioChange}
              />
              <Button text="Continue" type="submit">
                Continue
              </Button>
            </>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default ContactUsForm;
