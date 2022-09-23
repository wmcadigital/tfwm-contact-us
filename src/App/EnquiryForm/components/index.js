import React, { useContext, useEffect } from 'react';

import Form from './Form';

import { FormDataContext } from '../../../globalState';

import CheckYourAnswers from './CheckYourAnswers';
import ReceivedForm from './ReceivedForm';
import SubmitAnEnquiry from './SubmitAnEnquiry';
import DirectDebitGuarantee from './DirectDebitGuarantee';

import Data from '../../ContactUs/newData.json';

const Complaint = () => {
  const [{ page, formId }] = useContext(FormDataContext);
  const params = window.location.hash.slice(2);
  const formToLoad = formId || params;
  const { content } = Data.pages.find((data) => data.currentStepId === formToLoad);
  useEffect(() => {
    const headerTitleEl = document.getElementById('formClicked');
    if (formToLoad === 'step-update-DD') {
      headerTitleEl.innerText = 'Update my Direct Debit';
    } else if (formToLoad === 'step-leave-feedback-or-complaint') {
      headerTitleEl.innerText = 'Leave feedback';
    } else {
      headerTitleEl.innerText = 'Submit an enquiry';
    }
  }, []);
  return (
    <>
      {page === 'SUCCESS' && (
        <ReceivedForm
          successTitle="We’ve received your form"
          title="What happens next"
          text1="You’ll receive an email to confirm that we have received your enquiry."
          text2={
            content.warningText && content.warningText.includes('10')
              ? 'It can take 10 working days to process your enquiry. It may take longer if we need more information from you.'
              : 'It can take 2 working days to process your enquiry. It may take longer if we need more information from you.'
          }
          text3={
            content.warningText && content.warningText.includes('10')
              ? 'If you’ve not received a response after 10 days contact our Customer Services team on 0345 303 6760.'
              : 'If you’ve not received a response after 2 days contact our Customer Services team on 0345 303 6760.'
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
