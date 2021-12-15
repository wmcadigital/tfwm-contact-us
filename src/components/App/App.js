import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// Contexts
// import ContextProvider from '../../globalState/ContactUsContext';
import ContactUsForm from './ContactUs/components/Enquiry';
import { FormProvider } from '../../globalState/ContactUsContext';

function App() {
  // console.log(data);

  // const context = useContext(ContextProvider);
  // // const [state, setstate] = useState(initialState);
  // useEffect(() => {
  //   console.log(context);
  // }, [context]);
  return (
    // <ContextProvider
    //   value={{
    //     options: state.radiosOptionsEnquiry,
    //   }}
    // >
    <FormProvider>
      <Router>
        <Switch>
          <Route path="/">
            <ContactUsForm />
          </Route>
        </Switch>
      </Router>
    </FormProvider>
    // </ContextProvider>
  );
}

export default App;
