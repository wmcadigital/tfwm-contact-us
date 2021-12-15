/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import React, { createContext, useReducer } from 'react';
// import ContactUsReducer from './ContactUsReducer';
import Data from '../../components/App/ContactUs/newData.json';

// create context
export const FormDataContext = createContext();

export const FormProvider = (props) => {
  const { children } = props || {};

  // initial state
  const initialState = {
    currentStep: {
      id: '',
      currentStepId: 'step-enquiry',
      prevStepId: 'step-0',
      heading: Data.pages[0].heading,
      fields: Data.pages[0].fields,
      hasReachedConfirmation: false,
    },
    steps: Data,
  };
  const ContactUsReducer = (state, action) => {
    console.log('payload>>>>>', action.payload, state);
    switch (action.type) {
      case 'CONTINUE': {
        const selectedStep = state.steps.pages.find(
          (item) => item.parentId === action.payload.selectedVal
        );
        console.log('selected step continue>>>>>', selectedStep);
        const selectedStepFields = selectedStep?.fields?.map((field) => ({
          ...field,
          selected: field.id === action.payload,
        }));
        return {
          ...state,
          currentStep: { ...selectedStep, fields: selectedStepFields },
        };
      }

      case 'BACK': {
        const prevSelectedStep = state.steps.pages.find(
          (item) => item.currentStepId === action.payload.currentStep.prevStepId
        );
        const updatedFields = prevSelectedStep?.fields?.map((field) => ({
          ...field,
          selected: field.id === action.payload.currentStep.parentId,
        }));

        const pages = state.steps.pages.map((item) => {
          if (item.currentStepId === action.payload.currentStep.prevStepId) {
            return { ...item, fields: updatedFields };
          }
          return item;
        });

        console.log('selectedddddd object backkk >>>>>>>>', prevSelectedStep);
        return {
          ...state,
          currentStep: { ...prevSelectedStep, fields: updatedFields },
          steps: { pages },
          // steps: {...steps, }
          // fields: updatedFields,
        };
      }
      default:
        return state;
    }
  };

  // console.log('state>>>>>>>>>>>>>>>', initialState);

  // provider component
  // export const GlobalProvider = (props) => {
  // const { children } = props || {};

  const [formState, formDispatch] = useReducer(ContactUsReducer, initialState);

  return (
    <FormDataContext.Provider value={[formState, formDispatch]}>
      {children}
    </FormDataContext.Provider>
  );
  // };
};
