import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// Contexts
// import ContextProvider from '../../globalState/ContactUsContext';
import ContactUs from './ContactUs/components/Enquiry';
import { GlobalProvider } from '../../globalState/ContactUsContext';

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
    <GlobalProvider>
      <Router>
        <Switch>
          <Route path="/">
            <ContactUs />
          </Route>
        </Switch>
      </Router>
    </GlobalProvider>
    // </ContextProvider>
  );
}

export default App;
