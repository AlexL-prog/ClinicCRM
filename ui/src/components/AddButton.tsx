import '../styles/AddButton.css'

export default function  AddButton({ navigate }: { navigate: (path: string) => void }) {
    return (
        <div className="add-button-div">
            <button className="add-button" onClick={() => navigate('/form')}>
                Add Patient
            </button>
        </div>
    )
}