/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import React, { createContext, useReducer } from 'react';
import ContactUsReducer from './ContactUsReducer';
import Data from '../../components/App/ContactUs/newData.json';

// initial state
const initialState = {
  id: '',
  heading: Data.dashboard[0].heading,
  fields: Data.dashboard[0].fields,
};
console.log('state>>>>>>>>>>>>>>>', initialState);
// create context
export const GlobalContext = createContext(initialState);

// provider component
export const GlobalProvider = (props) => {
  const { children } = props || {};

  const [state, dispatch] = useReducer(ContactUsReducer, initialState);
  // actions
  function continueNext(val) {
    dispatch({
      type: 'CONTINUE',
      payload: val,
    });
  }
  return (
    <GlobalContext.Provider
      value={{
        dashboard: state,
        continueNext,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
