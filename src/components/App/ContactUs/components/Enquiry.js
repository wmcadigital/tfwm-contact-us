/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React, { useContext, useState, useReducer, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { FormDataContext } from 'globalState';
import Radios from 'components/shared/Radios/Radios';
import Button from 'components/shared/Button/Button';
import LastPage from './LastPage';

const ContactUsForm = () => {
  const [formState, formDispatch] = useContext(FormDataContext);
  const { register, handleSubmit, getValues, trigger, errors } = useForm();
  // const { register, getValues, trigger } = useFormContext(); // Get useForm methods
  const methods = useForm();
  console.log(methods);
  // console.log(getValues());

  const [selectedVal, setSelectedVal] = useState();
  const [formError, setFormError] = useState(false);
  // console.log('formState>>>>>>>>>>>>', formState);

  useEffect(() => {
    const selectedRadio = formState.currentStep.fields?.find((item) => item.selected);
    setSelectedVal(selectedRadio?.id);
  }, [formState?.currentStep]);

  const handleRadioChange = (e) => {
    setSelectedVal(e.target.id);
  };

  const continueHandler = (event) => {
    const values = getValues();
    const hasValues = !!Object.values(values).filter((val) => val).length;

    console.log('valuesssss inside handlecontinue', hasValues, values);
    setFormError(!hasValues);
    if (hasValues) {
      formDispatch({
        type: 'CONTINUE',
        payload: { formState, selectedVal },
      });
    }
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
        <form
          className="wmnds-bg-white wmnds-p-lg"
          onSubmit={methods.handleSubmit(continueHandler)}
        >
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
                register={register}
                onChange={handleRadioChange}
                fieldValidation={formError}
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
