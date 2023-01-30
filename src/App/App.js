import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// Contexts
import ContactUsForm from './ContactUs/components/Enquiry';
import { FormProvider, FormDataContext } from '../globalState/ContactUsContext';
import EnquiryForm from './EnquiryForm/components';
import './map.css';

function App() {
  const [{ formId }] = useContext(FormDataContext);
  const params = window.location.hash.slice(2);
  return (
    <Router>
      <Switch>
        <Route path="/">{formId || params ? <EnquiryForm /> : <ContactUsForm />}</Route>
      </Switch>
    </Router>
  );
}

const Root = () => {
  return (
    <FormProvider>
      <App />
    </FormProvider>
  );
};
export default Root;
