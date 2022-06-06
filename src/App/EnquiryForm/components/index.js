import React, { useContext, useEffect } from 'react';

import Form from './Form';

import { FormDataContext } from '../../../globalState';

import CheckYourAnswers from './CheckYourAnswers';
import ReceivedForm from './ReceivedForm';

const Complaint = () => {
  useEffect(() => {
    console.log(document.querySelector('#formClicked').innerText);
    document.querySelector('#formClicked').innerText = 'Submit an Enquiry';
  });
  const [{ page }] = useContext(FormDataContext);

  return (
    <>
      {page === 'SUCCESS' && (
        <ReceivedForm
          successTitle="We’ve received your form"
          successText="Your reference number is <b>123456</b>"
          title="What happens next"
          text1="You’ll receive an email to confirm your complaint."
          text2=" We aim to resolve issues brought to our attention within 10 working days, however, some investigations may take longer. Customer Relations will keep you informed of progress until your issue is resolved."
        />
      )}

      {page === 'COMPLAINT' && <Form />}

      {page === 'ANSWERS' && <CheckYourAnswers />}
    </>
  );
};
export default Complaint;
