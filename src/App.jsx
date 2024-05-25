import { useRef, useState } from 'react'
import './App.css'
import Editor from '@monaco-editor/react';
import axios from 'axios';

function App() {
  const editorRef = useRef(null);
  const [algo, setAlgo] = useState("Verify Above")
  const [time, setTime] = useState("Verify Above")
  const [readability, setReadability] = useState({
    "total_variables": "Verify Below",
    "meaningful_variables": "Verify Below",
    "total_class": "Verify Below",
    "meaningful_class": "Verify Below",
    "meaningful_functions": "Verify Below",
    "total_functions": "Verify Below",
    "function_with_docstrings": "Verify Below",
    "meaningful_comments": "Verify Below",
    "readability_index": "Verify Below"
  })
  const [alternates, setAlters] = useState([])

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current.getValue());
  }

  const findAlgo = async () => {
    const data = {
      prompt: "Give me an algorithm name for given code and just return algorithm nothing else : ",
      content: editorRef.current.getValue()
    }

    const values = await axios.post("http://127.0.0.1:5000/", data)
    console.log(values)
    setAlgo(values.data.response)
    // setIsAlso(true)
    // setIsTime(false)
    const data2 = {
      prompt: "Give me an Alternate Algorithms which can be used instead of given algorithm and should not be same for this algorithm give in format of separated commas and give me algorithm names nothing else: ",
      content: values.data.response
    }

    const values2 = await axios.post("http://127.0.0.1:5000/", data2)
    console.log(values2)
    setAlters(values2.data.response.split(","))
  }

  const calcTime = async () => {
    const data = {
      prompt: "Give me a time complexity for given code and just return time complexity in big oh notation nothing else : ",
      content: editorRef.current.getValue()
    }

    const values = await axios.post("http://127.0.0.1:5000/", data)
    console.log(values)
    setTime(values.data.response)
  }

  const readable = async () => {
    const values = await axios.post("http://127.0.0.1:5000/readability", { "content": editorRef.current.getValue() })

    console.log(values.data);
    setReadability(values.data);
  }

  return (
    <div className='main'>
      <div className="btns">
        <button onClick={findAlgo}>Find Algorithm</button>
        <button onClick={calcTime}>Calculate Time Complexity</button>
        <button onClick={readable}>Readability Index</button>
      </div>
      <div className="main-arena">
        <Editor height="90vh" width="50vw" defaultLanguage="python" defaultValue="#some comment" onMount={handleEditorDidMount} />
        <div className="display">
          <div className="algos">
            <div className="algo">
              <h3>Algorithm Found : {algo}</h3>
            </div>

            <ul className="alters">
              <h3>Alternate Algorithm</h3>
              {alternates.map(al => {
                return (<li key={al}>{al}</li>)
              })}
            </ul>
          </div>

          <div className="time">
            <h2>Time Complexity : {time} </h2>
          </div>
        </div>
      </div>

      <div className="readability-index">
        <h2>Readability Index</h2>
        <div className="data-container">

          <div className="data ls">
            <div> total_variables : {readability.total_variables} </div>
            <div> meaningful_variables : {readability.meaningful_variables} </div>
            <div> total_class : {readability.total_class} </div>
            <div> meaningful_class : {readability.meaningful_class} </div>
          </div>
          <div className='data rs'>
            <div> meaningful_functions : {readability.meaningful_functions} </div>
            <div> total_functions : {readability.total_functions} </div>
            <div> functions_with_docstrings : {readability.function_with_docstrings} </div>
            <div> meaningful_comments : {readability.meaningful_comments} </div>
          </div>
        </div>
        <h3> readability_index : {readability.readability_index} </h3>
      </div>
    </div>
  )
}

export default App
