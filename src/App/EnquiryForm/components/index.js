import React, { useContext, useEffect } from 'react';
import Form from './Form';
import { FormDataContext } from '../../../globalState';
import CheckYourAnswers from './CheckYourAnswers';
import ReceivedForm from './ReceivedForm';
import SubmitAnEnquiry from './SubmitAnEnquiry';
import DirectDebitGuarantee from './DirectDebitGuarantee';

const Complaint = () => {
  useEffect(() => {
    document.getElementById('formClicked').innerText = 'Submit an enquiry';
  }, []);
  const [{ page }] = useContext(FormDataContext);

  return (
    <>
      {page === 'SUCCESS' && (
        <ReceivedForm
          successTitle="We’ve received your form"
          successText="Your reference number is <b>123456</b>"
          title="What happens next"
          text1="You’ll receive an email to confirm your complaint."
          text2=" We aim to resolve issues brought to our attention within 2 working days, however, some investigations may take longer. Customer Relations will keep you informed of progress until your issue is resolved."
        />
      )}
      {page === 'SUBMIT' && <SubmitAnEnquiry />}

      {page === 'COMPLAINT' && <Form />}

      {page === 'ANSWERS' && <CheckYourAnswers />}

      {page === 'DIRECT-DEBIT-GUARANTEE' && <DirectDebitGuarantee />}
    </>
  );
};
export default Complaint;
