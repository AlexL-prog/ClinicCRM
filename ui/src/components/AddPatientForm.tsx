import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { parseFastApiErrors } from "../parsers/FastApiParsers";
import { useState } from "react";
import '../styles/AddPatientForm.css';
import '../styles/GeneralButton.css';
import axios from "axios";

type PatientCreate = {
    name: string;
    birthDate: string;
    gender: 'Male' | 'Female' | '';
};


const createPatient = async (patient: PatientCreate) => {
  const response = await axios.post('http://localhost:8000/patients', patient);
  return response.data;
};

const validateField = (fieldName: string, value: string): string => {
  switch (fieldName) {
    case 'name':
      if (!value.trim()) return 'Name is required.';
      break;
    case 'birthDate':
      if (!value.trim()) return 'Birth date is required.';
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) return "Birth date cannot be in the future";
      if (selectedDate.getTime() - today.getTime() > 120 * 365 * 24 * 60 * 60 * 1000) return "Birth date cannot be more than 120 years in the past";
      break;
    case 'gender':
      if (!value.trim()) return 'Gender is required.';
      break;
    default:
      return '';
  }
  return '';
};

export const AddPatientForm = () => {
  const [patientFormData, setPatientFormData] = useState<PatientCreate>({
    name: '',
    birthDate: '',
    gender: ''
  });
  const [error, setError] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      navigate('/', { replace: true });
    },
    onError: (error: unknown) => {
      const parsedErrors = parseFastApiErrors(error);
      setError(parsedErrors);
    }
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setError((prevError) => ({ ...prevError, [name]: '' }));
    setPatientFormData((prevData) => ({
      ...prevData,
      [name]: (name === 'gender' ? (value as PatientCreate['gender']) : value)
    }));
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const errorMessage = validateField(name, value);
    setError((prevError) => ({ ...prevError, [name]: errorMessage }));
  }

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError({});
    mutation.mutate(patientFormData);
  }
  return (
    <form className="add-patient-form" onSubmit={handleSubmit} noValidate>
      {error.general && <div className="error-message">{error.general}</div>}
      <input className={`form-input ${error.name ? 'error-class' : ''}`} name="name" value={patientFormData.name} onChange={handleChange} onBlur={handleBlur} placeholder="Name" required/>
      {error.name && <div className="error-message">{error.name}</div>}
      <input className={`form-input ${error.birthDate ? 'error-class' : ''}`} name="birthDate" type="date" value={patientFormData.birthDate} onChange={handleChange} onBlur={handleBlur} placeholder="Birth Date" required />
      {error.birthDate && <div className="error-message">{error.birthDate}</div>}
      <div className="form-radio-group">
        <label>
          <input className={`form-radio ${error.gender ? 'error-class' : ''}`} name="gender" type="radio" value="Male" checked={patientFormData.gender === 'Male'} onChange={handleChange} onBlur={handleBlur} required />
          Male
        </label>
        <label>
          <input className={`form-radio ${error.gender ? 'error-class' : ''}`} name="gender" type="radio" value="Female" checked={patientFormData.gender === 'Female'} onChange={handleChange} onBlur={handleBlur} required />
          Female
        </label>
      </div>
      {error.gender && <div className="error-message">{error.gender}</div>}
      <div className="general-button-div">
        <button className="general-button" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding Patient...' : 'Add Patient'}
        </button>
      </div>
    </form>
  )
}
