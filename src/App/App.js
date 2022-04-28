import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// Contexts
import ContactUsForm from './ContactUs/components/Enquiry';
import { FormProvider } from '../globalState/ContactUsContext';

function App() {
  return (
    <FormProvider>
      <Router>
        <Switch>
          <Route path="/">
            <ContactUsForm />
          </Route>
        </Switch>
      </Router>
    </FormProvider>
  );
}

export default App;
