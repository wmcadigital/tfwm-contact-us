import Data from '../../components/App/ContactUs/newData.json';

export default (state, action) => {
  console.log('payload>>>>>', action.payload, state);
  switch (action.type) {
    case 'CONTINUE': {
      const selectedStep = state.steps.pages.find(
        (item) => item.parentId === action.payload.selectedVal
      );
      console.log('selected step continue>>>>>', selectedStep);
      const selectedStepFields = selectedStep?.fields?.map((field) => ({
        ...field,
        selected: field.id === action.payload,
      }));
      return {
        ...state,
        currentStep: { ...selectedStep, fields: selectedStepFields },
      };
    }

    case 'BACK': {
      const prevSelectedStep = state.steps.pages.find(
        (item) => item.currentStepId === action.payload.currentStep.prevStepId
      );
      const updatedFields = prevSelectedStep?.fields?.map((field) => ({
        ...field,
        selected: field.id === action.payload.currentStep.parentId,
      }));

      const pages = state.steps.pages.map((item) => {
        if (item.currentStepId === action.payload.currentStep.prevStepId) {
          return { ...item, fields: updatedFields };
        }
        return item;
      });

      console.log('selectedddddd object backkk >>>>>>>>', prevSelectedStep);
      return {
        ...state,
        currentStep: { ...prevSelectedStep, fields: updatedFields },
        steps: { pages },
        // steps: {...steps, }
        // fields: updatedFields,
      };
    }
    default:
      return state;
  }
};
