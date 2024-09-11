import React from 'react';
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

const FormInput = ({ label, ...props }) => {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input {...props} />
    </FormControl>
  );
};

export default FormInput;
