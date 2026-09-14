import React, { useContext, useEffect } from 'react';

import Form from './Form';

import { FormDataContext } from '../../../globalState';

import CheckYourAnswers from './CheckYourAnswers';
import ReceivedForm from './ReceivedForm';
import SubmitAnEnquiry from './SubmitAnEnquiry';
import DirectDebitGuarantee from './DirectDebitGuarantee';

import Data from '../../ContactUs/newData.json';

export const getResponseDays = (formToLoad) => {
  const page = Data.pages.find((data) => data.currentStepId === formToLoad);

  const hasAncestorStep = (currentPage, targetStepId) => {
    let current = currentPage;

    while (current) {
      if (current.currentStepId === targetStepId) {
        return true;
      }

      current = current.prevStepId
        ? Data.pages.find((data) => data.currentStepId === current.prevStepId)
        : null;
    }

    return false;
  };

  const isSwiftBranch = page && hasAncestorStep(page, 'step-swift-tickets-passes');
  const isCorporateTicketing =
    formToLoad === 'step-corporate-ticketing' ||
    (page && page.parentId === 'corporate-ticketing');
  const isOlderPassHelp =
    formToLoad === 'step-help-olderpass-application' ||
    (page && page.parentId === 'older-persons-pass');
  const isDisabledPassHelp =
    formToLoad === 'step-help-disabledpass-application' ||
    (page && page.parentId === 'disabled-persons-pass');

  if (formToLoad === 'step-cycle-storage' || isCorporateTicketing) {
    return 10;
  }

  if (isOlderPassHelp || isDisabledPassHelp) {
    return 30;
  }

  if (isSwiftBranch) {
    return 5;
  }

  return 10;
};

const Complaint = () => {
  const [{ page, formId }] = useContext(FormDataContext);
  const params = window.location.hash.slice(2);
  const formToLoad = formId || params;
  const { content } = Data.pages.find((data) => data.currentStepId === formToLoad) || {};
  const days = getResponseDays(formToLoad);

  useEffect(() => {
    const headerTitleEl = document.getElementById('formClicked');
    if (formToLoad === 'step-update-DD') {
      headerTitleEl.innerText = 'Update my Direct Debit';
    } else if (formToLoad === 'step-leave-feedback-or-complaint') {
      headerTitleEl.innerText = 'Leave feedback';
    } else {
      headerTitleEl.innerText = 'Submit an enquiry';
    }
  }, [formToLoad]);
  return (
    <>
      {page === 'SUCCESS' && (
        <ReceivedForm
          successTitle="We’ve received your form"
          title="What happens next"
          text1="You’ll receive an email to confirm that we have received your enquiry."
          text2={`It can take ${days} working days to process your enquiry. It may take longer if we need more information from you.`}
          text3={`If you’ve not received a response after ${days} days contact our ${
            formToLoad === 'step-Ring-journey'
              ? 'West Midlands Bus On Demand team on 0345 034 8670.'
              : 'Customer Services team on 0345 303 6760.'
          }`}
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
