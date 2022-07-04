/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import MapView from 'components/shared/MapView/MapView';

import { FormDataContext } from '../../../globalState';
import Radios from '../../../components/shared/Radios/Radios';
import Button from '../../../components/shared/Button/Button';
import LastPage from './LastPage';

const ContactUsForm = () => {
  const [{ currentStep }, formDispatch] = useContext(FormDataContext);
  const { register, handleSubmit, getValues, errors } = useForm();

  const [selectedVal, setSelectedVal] = useState();
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    const selectedRadio = currentStep.fields?.find((item) => item.selected);
    setSelectedVal(selectedRadio?.id);
  }, [currentStep]);

  const handleRadioChange = (e) => {
    setSelectedVal(e.target.id);
  };

  const continueHandler = (event) => {
    const values = getValues();
    const hasValues = !!Object.values(values).filter((val) => val).length;

    setFormError(!hasValues);
    if (hasValues) {
      formDispatch({
        type: 'CONTINUE',
        payload: { currentStep, selectedVal },
      });
      window.scrollTo(0, 0);
    }
  };
  const backHandler = () => {
    setFormError(false);

    formDispatch({
      type: 'BACK',
      payload: currentStep,
    });
    window.scrollTo(0, 0);
  };
  const fillFormHandler = (formId) => {
    formDispatch({
      type: 'FORM-ID',
      payload: { formId },
    });
  };
  useEffect(() => {
    document.activeElement.blur();
  }, [currentStep]);
  return (
    <div className="wmnds-container wmnds-container--main" style={{ padding: 0 }}>
      {currentStep.heading === 'What is your enquiry about?' ? null : (
        <div style={{ paddingLeft: 16 }} className="wmnds-col-1 wmnds-m-b-md">
          <button type="button" className="wmnds-btn wmnds-btn--link" onClick={backHandler}>
            &lt; Back
          </button>
        </div>
      )}
      {currentStep.hasReachedConfirmation ? (
        <LastPage content={currentStep?.content} currentStep={currentStep} />
      ) : (
        <form
          className="wmnds-bg-white wmnds-p-md wmnds-col-1 wmnds-col-md-3-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <>
            <Radios
              name={currentStep?.heading}
              label={currentStep.heading}
              classes="wmnds-m-b-sm"
              radios={currentStep.fields}
              register={register}
              onChange={handleRadioChange}
              fieldValidation={formError}
            />
            <Button
              text="Continue"
              type="button"
              onClick={handleSubmit(continueHandler)}
              btnClass="wmnds-btn wmnds-col-1 wmnds-col-sm-auto"
            >
              Continue
            </Button>
          </>
        </form>
      )}
      <button type="button" onClick={() => fillFormHandler('step-help-olderpass-application')}>
        Fill in this Form
      </button>
    </div>
  );
};

export default ContactUsForm;
