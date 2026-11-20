import React from 'react';
import { render, screen } from '@testing-library/react';
import ReceivedForm from './ReceivedForm';

const renderReceivedForm = (successText) =>
  render(
    <ReceivedForm
      successTitle="Form received"
      successText={successText}
      title="What happens next"
      text1="First"
      text2="Second"
      text3="Third"
    />
  );

test('renders without optional success text or a prop-type warning', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    renderReceivedForm();
    expect(screen.getByText('Form received')).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
  } finally {
    consoleError.mockRestore();
  }
});

test('renders supplied success text', () => {
  renderReceivedForm('<strong>Thank you</strong>');
  expect(screen.getByText('Thank you').tagName).toBe('STRONG');
});
