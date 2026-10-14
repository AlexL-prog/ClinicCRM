import '../styles/GeneralButton.css'

export default function  AddButton({ navigate }: { navigate: (path: string) => void }) {
    return (
        <div className="general-button-div">
            <button className="general-button" onClick={() => navigate('/form')}>
                Add Patient
            </button>
        </div>
    )
}