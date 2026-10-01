import PatientsTable from './components/PatientsTable'
import AddButton from './components/AddButton'
import SearchBar from './components/SearchBar'
import './App.css'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from './assets/Spinner'

function App() {

  const { data: patients, isPending, refetch, error } = useQuery({
    queryKey: ['patients'],
    queryFn: getPatients
  })

  if (error) {
    return <div>Error: {error instanceof Error ? error.message : `${error}`}</div>
  }

  return (
    <>    
      <SearchBar />
      {isPending ? <Spinner center/> : <PatientsTable patients={patients} />}
      <AddButton refetch={refetch} />
    </>
  )
}

const getPatients = async () => {
  const response =  await fetch('http://localhost:8000/patients')
  return response.json()
}

export default App
