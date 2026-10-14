import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { parseFastApiErrors } from "../parsers/FastApiParsers";
import { useState } from "react";
import '../styles/AddPatientForm.css';
import '../styles/GeneralButton.css';
import axios from "axios";



const createPatient = async (patient: any) => {
  const response = await axios.post('http://localhost:8000/patients', patient);
  return response.data;
};

export const AddPatientForm = () => {
  const [patientFormData, setPatientFormData] = useState({
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
    onError: (error: any) => {
      const parsedErrors = parseFastApiErrors(error);
      setError(parsedErrors);
    }
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setError((prevError) => ({ ...prevError, [name]: '' }));
    setPatientFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError({});
    mutation.mutate(patientFormData);
  }
  return (
    <form className="add-patient-form" onSubmit={handleSubmit}>
      {error.general && <div className="error-message">{error.general}</div>}
      <input className={`form-input ${error.name ? 'error-class' : ''}`} name="name" onChange={handleChange} placeholder="Name" required />
      {error.name && <div className="error-message">{error.name}</div>}
      <input className={`form-input ${error.birthDate ? 'error-class' : ''}`} name="birthDate" type="date" onChange={handleChange} placeholder="Birth Date" required />
      {error.birthDate && <div className="error-message">{error.birthDate}</div>}
      <div className="form-radio-group">
        <label>
          <input className={`form-radio ${error.gender ? 'error-class' : ''}`} name="gender" type="radio" value="Male" onChange={handleChange} required />
          Male
        </label>
        <label>
          <input className={`form-radio ${error.gender ? 'error-class' : ''}`} name="gender" type="radio" value="Female" onChange={handleChange} required />
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
