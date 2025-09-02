import { useState } from 'react';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)

  function sendMessage() {
    axios.get("http://127.0.0.1:3000/")
    .then((response) => {
      console.log(response.data)
    })
  }

  return (
    <>
      <div>
        Hello World!
      </div>
      <button onClick={sendMessage}>Send</button>
    </>
  )
}

export default App
