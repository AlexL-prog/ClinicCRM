export default function PatientsTable({patients}: { patients: any[] }) {
    return (
        <main>
          <table className="patients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
  	            <th>Birth Date</th>
  	            <th>Gender</th>
    	          <th>Created at</th>
      	        <th>Updated at</th>
        	    </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
			        <tr key={patient.id}>
			          <td>{patient.id}</td>
			          <td>{patient.name}</td>
			          <td>{patient.birthDate}</td>
			          <td>{patient.gender}</td>
			          <td>{patient.createdAt}</td>
			          <td>{patient.updatedAt}</td>
			        </tr>
              ))}
            </tbody>
              
					</table>
				</main>
    )
}