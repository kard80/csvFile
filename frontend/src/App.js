import React, { useState, useEffect } from 'react';
import { CsvToHtmlTable } from 'react-csv-to-table';
import reactTable from 'react-table'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import './App.css';
import './axios.js'
import axios from './axios.js';

function App() {
  const [getData, setGetData] = useState([])
  const [file, setFile] = useState('')
  const [isUpdate, setIsUpdate] = useState(false)
  const [filename, setFilename] = useState([])


  const fetchData = async () => {
    const result = await axios.get('/')
    const filename = await axios.get('/filename')
    setGetData(result.data)
    setFilename(filename.data)
    console.log(result.data)
    setIsUpdate(!isUpdate)
  }

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(file);
    }
    reader.readAsDataURL(file)
    console.log(file)
  }

  const submitData = async () => {
    const formData = new FormData();
    formData.append('file', file)
    await fetchData()
    await axios.post('/', formData)
    setFile('')
  }
  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    getKeys()
  },[getData])

  const getKeys = () => {
    if (getData[0]) {
      return Object.keys(getData[0])
    }
  }
  const getHeader = () => {
    if (getKeys()) {
      const keys = getKeys();
      return keys.map((item, index) => {
        return <th key={item}>{item.toUpperCase()}</th>
      })
    }
  }

  const RenderRow = props => {
    return props.keys.map((key, index) => {
      return <td key={props.data[key]}>{props.data[key]}</td>
    })
  }

  const getRowsData = () => {
    if (getKeys()) {
      // const items = props.data;
      const keys = getKeys();
      return getData.map((row, index) => {
        return <tr key={index}>
          <RenderRow key={index} data={row} keys={keys} />
        </tr>
      })
        }
  }
  const callData = async filename => {
    const data = await axios.get(`/filename/${filename}`)
    setGetData(data.data)
    // fetchData()
  }
  return (
    <div className="App">
      <input type="file" onChange={e => handleUploadImage(e)} />
      <button onClick={submitData}>Submit</button>
      {filename.map(item =>( 
      <span style = {{display: 'flex'}} onClick={() => callData(item.fileName)}>{item.fileName}</span>))}
      <ReactHTMLTableToExcel
        table="forDownload"
        filename="excel"
        sheet="excel"
        buttonText="Download" />
      <table id="forDownload">
        {getHeader()}
        {getRowsData()}
      </table>
    </div>
  );
}

export default App;
