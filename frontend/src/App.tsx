import { useState } from 'react';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("")

  function sendMessage() {
    axios.get("http://127.0.0.1:3000/")
    .then((response) => {
      console.log(response.data)
      setMessage(response.data.message)
    })
  }

  return (
    <>
      <div>
        Hello World!
      </div>
      <button onClick={sendMessage}>Send</button>
      <p>Message: {message}</p>
    </>
  )
}

export default App
