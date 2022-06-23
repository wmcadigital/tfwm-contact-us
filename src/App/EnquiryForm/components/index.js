import React, { useContext, useEffect } from 'react';

import Form from './Form';

import { FormDataContext } from '../../../globalState';

import CheckYourAnswers from './CheckYourAnswers';
import ReceivedForm from './ReceivedForm';
import SubmitAnEnquiry from './SubmitAnEnquiry';
import DirectDebitGuarantee from './DirectDebitGuarantee';

import Data from '../../ContactUs/newData.json';

const Complaint = () => {
  useEffect(() => {
    document.getElementById('formClicked').innerText = 'Submit an enquiry';
  }, []);
  const [{ page, formId }] = useContext(FormDataContext);
  const { content } = Data.pages.find((data) => data.currentStepId === formId);

  return (
    <>
      {page === 'SUCCESS' && (
        <ReceivedForm
          successTitle="We’ve received your form"
          successText={
            content.warningText.includes('2') ? 'Your reference number is <b>123456</b>' : ''
          }
          title="What happens next"
          text1="You’ll receive an email to confirm that we have received your enquiry."
          text2={
            content.warningText.includes('2')
              ? 'It can take 2 working days to process your enquiry. It may take longer if we need more information from you.'
              : 'It can take 10 working days to process your enquiry. It may take longer if we need more information from you.'
          }
          text3={
            content.warningText.includes('2')
              ? 'If you’ve not received a response after 2 days contact our Customer Services team on 0345 303 6760.'
              : 'If you’ve not received a response after 10 days contact our Customer Services team on 0345 303 6760.'
          }
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
