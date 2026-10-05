import PatientsTable from './components/PatientsTable'
import AddButton from './components/AddButton'
import SearchBar from './components/SearchBar'
import './App.css'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from './assets/Spinner'
import { AddPatientForm } from './components/AddPatientForm'
import { Routes, Route, useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()

  const { data: patients, isPending, error } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients
  })

  if (error) {
    return <div>Error: {error instanceof Error ? error.message : `${error}`}</div>
  }

  return (
    <>
      <Routes> 
        <Route path='/' element={
          <div>
            <SearchBar />
            {isPending ? <Spinner center/> : <PatientsTable patients={patients} />}
            <AddButton navigate={navigate} />
          </div>   
        } />
        <Route path='/form' element={
          <AddPatientForm />
        } />
      </Routes>
    </>
  )
}

const getPatients = async () => {
  const response =  await fetch('http://localhost:8000/patients')
  return response.json()
}

export default App