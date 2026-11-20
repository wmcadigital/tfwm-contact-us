import React, { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormDataContext } from '../../../globalState';
import CheckYourAnswers from './CheckYourAnswers';

jest.mock('components/shared/Map/Map', () => () => null);
jest.mock('../../ContactUs/newData.json', () => ({
  pages: [{ currentStepId: 'test-form', emailIndex: 'team@example.com', emailHeader: 'Enquiry' }],
}));

const originalFetch = global.fetch;
const originalFileReader = global.FileReader;

afterEach(() => {
  global.fetch = originalFetch;
  global.FileReader = originalFileReader;
});

const deferred = () => {
  let resolve;
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
};

const renderAnswers = (dispatch, formData = {}) =>
  render(
    <FormDataContext.Provider value={[{ formData, stepNum: 0, formId: 'test-form' }, dispatch]}>
      <CheckYourAnswers />
    </FormDataContext.Provider>
  );

const sendForm = () => {
  fireEvent.click(screen.getByLabelText(/terms and conditions/i));
  fireEvent.click(screen.getByLabelText(/privacy policy/i));
  fireEvent.click(screen.getByText('Accept and send'));
};

test('navigates to success without updating state after unmount', async () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const request = deferred();
  global.fetch = jest.fn(() => request.promise);
  const dispatch = jest.fn();
  const Harness = () => {
    const [visible, setVisible] = useState(true);
    return (
      visible && (
        <FormDataContext.Provider
          value={[
            { formData: {}, stepNum: 0, formId: 'test-form' },
            (action) => {
              dispatch(action);
              setVisible(false);
            },
          ]}
        >
          <CheckYourAnswers />
        </FormDataContext.Provider>
      )
    );
  };
  try {
    render(<Harness />);
    sendForm();
    await act(async () => request.resolve({ status: 200 }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'CHANGE-PAGE',
      payload: { page: 'SUCCESS', stepNum: 0 },
    });
    expect(consoleError).not.toHaveBeenCalled();
  } finally {
    consoleError.mockRestore();
  }
});

test.each([200, 500])('ignores a %s response after leaving the page', async (status) => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const request = deferred();
  global.fetch = jest.fn(() => request.promise);
  const dispatch = jest.fn();
  try {
    const { unmount } = renderAnswers(dispatch);
    sendForm();
    unmount();
    await act(async () => request.resolve({ status }));
    expect(dispatch).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  } finally {
    consoleError.mockRestore();
  }
});

test('shows submission errors while the page is open', async () => {
  global.fetch = jest.fn().mockResolvedValue({ status: 500 });
  renderAnswers(jest.fn());
  sendForm();
  await waitFor(() =>
    expect(
      screen.getByText('Sorry, there was a problem sending your form. Please try again.')
    ).toBeInTheDocument()
  );
});

test('does not send a request if the page closes while an attachment is being read', async () => {
  let reader;
  global.FileReader = jest.fn().mockImplementation(() => {
    reader = { readAsDataURL: jest.fn(), result: 'data:application/pdf;base64,Zm9v' };
    return reader;
  });
  global.fetch = jest.fn();
  const file = new File(['foo'], 'file.pdf', { type: 'application/pdf' });
  const { unmount } = renderAnswers(jest.fn(), {
    file: { answerTitle: 'Supporting documents', value: [['file', [file]]] },
  });
  sendForm();
  unmount();
  await act(async () => reader.onload());
  expect(global.fetch).not.toHaveBeenCalled();
});

test('reports an attachment read failure without sending the form', async () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  let reader;
  global.FileReader = jest.fn().mockImplementation(() => {
    reader = { readAsDataURL: jest.fn() };
    return reader;
  });
  global.fetch = jest.fn();
  const file = new File(['foo'], 'file.pdf', { type: 'application/pdf' });
  try {
    renderAnswers(jest.fn(), {
      file: { answerTitle: 'Supporting documents', value: [['file', [file]]] },
    });
    sendForm();
    await act(async () => reader.onerror(new Error('Read failed')));
    expect(
      screen.getByText('Sorry, there was a problem sending your form. Please try again.')
    ).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  } finally {
    consoleError.mockRestore();
  }
});
