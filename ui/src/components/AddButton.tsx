import '../styles/AddButton.css'

export default function  AddButton({ refetch }: { refetch: () => void }) {
    return (
        <div className="add-button-div">
            <button className="add-button" onClick={refetch}>
                Add Patient
            </button>
        </div>
    )
}