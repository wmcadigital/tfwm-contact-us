/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// Contexts
import ContactUsForm from './ContactUs/components/Enquiry';
import { FormProvider, FormDataContext } from '../globalState/ContactUsContext';
import EnquiryForm from './EnquiryForm/components';
import './map.css';

// Maintenance page component
const MaintenancePage = () => (
  <div style={{ textAlign: 'center', marginTop: '10%' }}>
    <h1>We'll be back soon!</h1>
    <p>Sorry for the inconvenience. We're performing some maintenance at the moment.</p>
  </div>
);

function App() {
  // Uncomment the next line to enable maintenance mode
  const maintenanceMode = false; // Set to true to show maintenance page

  if (maintenanceMode) {
    return <MaintenancePage />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
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
