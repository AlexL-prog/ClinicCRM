export const parseFastApiErrors = (error: any): Record<string, string> => {
  // Implementation for parsing FastAPI errors
  const fieldErrors: Record<string, string> = {};

  const details = error?.response?.data?.detail;
  
  if (Array.isArray(details)) {
    details.forEach((err: { loc: (string | number)[]; msg: string }) => {
        const fieldName = String(err.loc[err.loc.length - 1]);

        const cleanMessage = err.msg.replace(/^Value error,\s*/i, ''); // Remove brackets from the message
        fieldErrors[fieldName] = cleanMessage;
    });
  } else if (typeof error?.response?.data?.detail === 'string') {
        fieldErrors['general'] = error.response.data.detail;
  }
    return fieldErrors;
};