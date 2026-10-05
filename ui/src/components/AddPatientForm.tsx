import {useMutation, useQueryClient} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


const createPatient = async (patient: any) => {
  const response = await fetch('http://localhost:8000/patients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patient),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const AddPatientForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      navigate('/', { replace: true });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const patientData = Object.fromEntries(formData.entries());
    mutation.mutate(patientData);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="birthDate" type="date" placeholder="Birth Date" required />
      <label>
        <input name="gender" type="radio" value="Male" required />
        Male
      </label>
      <label>
        <input name="gender" type="radio" value="Female" required />
        Female
      </label>
      <button type="submit">Add Patient</button>
    </form>
  )
}
  