import React, { useState } from 'react'
import axios from "axios"

// önerilen başlangıç stateleri
const initialValues = {
  message: "",
  email: "",
  steps: 0,
  index: 4
};


export default function AppFunctional(props) {
  const [values, setValues] = useState(initialValues),
        getXY = () => ({x: (values.index % 3) + 1, y: Math.floor(values.index / 3) + 1}),
        getXYMesaj = () => `(${getXY().x}, ${getXY().y})`,
        reset = () => setValues(initialValues),
        ilerle = e => e.target.id === "reset" ? reset() : sonrakiIndex(e.target.id),
        onChange = e => setValues({...values, email: e.target.value});
    
  const sonrakiIndex = yon => {
    let val = values.index,steps = values.steps, message = "";

    if(["left", "right"].includes(yon)){
      yon === "left" ? values.index % 3 !== 0 ? val-= 1 : message = "Sola gidemezsiniz" : values.index % 3 !== 2 ? val+= 1 :  message = "Sağa gidemezsiniz";
    }else{
      yon === "up" ? Math.floor(values.index / 3) !== 0 ? val-= 3 : message = "Yukarıya gidemezsiniz" : Math.floor(values.index / 3) !== 2 ? val+= 3 : message = "Aşağıya gidemezsiniz";
    }
      
    val !== values.index && ++steps;
    setValues({...values, index: val, message: message, steps: steps});
  }

  function onSubmit(e) {
    e.preventDefault();
    axios.post("http://localhost:9000/api/result", {
      "x": getXY().x,
      "y": getXY().y,
      "email": values.email,
      "steps": values.steps
    }).then(resp => {
      setValues({...values, message: resp.data.message, email: ""});
    }).catch(err => {
      setValues({...values, message: err.response.data.message});
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar {getXYMesaj()}</h3>
        <h3 id="steps">{values.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === values.index ? ' active' : ''}`}>
              {idx === values.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{values.message}</h3>
      </div>
      <div id="keypad">
        <button onClick={ilerle} id="left">SOL</button>
        <button onClick={ilerle} id="up">YUKARI</button>
        <button onClick={ilerle} id="right">SAĞ</button>
        <button onClick={ilerle} id="down">AŞAĞI</button>
        <button onClick={ilerle} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" onChange={onChange} value={values.email} placeholder="email girin"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
