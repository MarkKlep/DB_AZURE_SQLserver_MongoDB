import { useState, useEffect } from 'react';

function SearchResults({ query }) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json')
    .then(res => res.json())
    .then((data) => {
      setData(data); 
      setIsLoading(false);
    })
  }, []);


  useEffect(() => {
    setIsLoading(true);

    const fetchData = async (query) => {
      if(data !== null) {
        const queryResult = data.members.filter(member => member.name.toLowerCase().includes(query.toLowerCase()))

        setResults(queryResult);
        setIsLoading(false);
      }
      
      
    };

    fetchData(query);
  }, [query, data]);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>

     <div>
        {
          data ? (
            <div>
              <h1>Squad name: {data.squadName}</h1>
              <h2>Hometown: {data.homeTown} // Formed: {data.formed}</h2>
              <h3>
                Members: 
                <ul>
                    {
                      results.map((member, index) => (
                        <li key={index}>
                          <span>Name: {member.name}</span>
                          <span>Age: {member.age}</span>
                        </li>
                      ))
                    } 
                </ul>
              </h3>
            </div>
          ) :
          null
        }
     </div>



    </div>
  );
}

export default SearchResults;
