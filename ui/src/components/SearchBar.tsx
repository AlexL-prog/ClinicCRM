import '../styles/SearchBar.css'

export default function SearchBar () {
    return (
      <div className="search-bar-div">
        <input className="search-bar" type="search" placeholder="Please enter patient's name"></input>
      </div>    
    )
}