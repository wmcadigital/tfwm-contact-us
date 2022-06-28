/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import React, { createContext, useReducer } from 'react';
import Data from '../../App/ContactUs/newData.json';
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
    page: 'SUBMIT',
    stepNum: 0,
    formData: {},
    formId: '',
    pageType: '',
  };
  const ContactUsReducer = (state, action) => {
    switch (action.type) {
      case 'CONTINUE': {
        const selectedStep = state.steps.pages.find(
          (item) => item.parentId === action.payload.selectedVal
        );
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
          (item) => item.currentStepId === action.payload.prevStepId
        );
        const updatedFields = prevSelectedStep?.fields?.map((field) => ({
          ...field,
          selected: field.id === action.payload.parentId,
        }));

        return {
          ...state,
          currentStep: { ...prevSelectedStep, fields: updatedFields },
        };
      }
      case 'CHANGE-PAGE': {
        return {
          ...state,
          page: action.payload.page,
          stepNum: action.payload.stepNum,
          pageType: action.payload.pageType,
        };
      }
      case 'ADD-DATA': {
        const cloneState = state;
        cloneState.formData[action.payload.name] = {
          value: action.payload.value,
          stepNum: action.payload.stepNum,
          answerTitle: action.payload.answerTitle,
          section: action.payload.section,
        };
        return {
          ...state,
          formData: cloneState.formData,
        };
      }

      case 'NEXT': {
        return {
          ...state,
          stepNum: state.stepNum + 1,
        };
      }
      case 'PREV': {
        return {
          ...state,
          stepNum: state.stepNum - 1,
        };
      }
      case 'FORM-ID': {
        return {
          ...state,
          formId: action.payload.formId,
        };
      }
      default:
        return state;
    }
  };

  const [formState, formDispatch] = useReducer(ContactUsReducer, initialState);

  return (
    <FormDataContext.Provider value={[formState, formDispatch]}>
      {children}
    </FormDataContext.Provider>
  );
  // };
};
