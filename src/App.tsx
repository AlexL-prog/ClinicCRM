import PatientsTable from './components/PatientsTable'
import AddButton from './components/AddButton'
import SearchBar from './components/SearchBar'
import './App.css'
import { useQuery } from '@tanstack/react-query'

function App() {

  const { data: patients, isLoading, isError } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients
  })

  return (
    <>    
      <SearchBar />
      <PatientsTable patients={patients} />
      <AddButton />
    </>
  )
}

const getPatients = async () => {
  const response =  await fetch('http://localhost:3000/patients')
  return response.json()
}

export default App
