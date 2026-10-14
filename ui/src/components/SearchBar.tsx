import '../styles/SearchBar.css'

export default function SearchBar () {
    return (
      <div className="search-bar-container">
        <input className="search-bar" type="search" placeholder="Please enter patient's name"></input>
        <button className="search-icon-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21.5" y2="21.5" />
          </svg>
        </button>
      </div>
    )
}