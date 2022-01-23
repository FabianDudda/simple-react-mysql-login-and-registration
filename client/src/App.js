import React, { useState } from "react";
import Axios from "axios";
import "./App.css";

function App() {
  const [userInput, setUserInput] = useState({});
  const [registerStatus, setRegisterStatus] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const register = () => {
    Axios.post("http://localhost:3002/register", { user: userInput }).then(
      (response) => {
        // console.log(response.data);
        if (response.data.message) {
          setRegisterStatus(response.data.message);
        }
      }
    );
  };

  const login = () => {
    Axios.post("http://localhost:3002/login", { user: userInput }).then(
      (response) => {
        //console.log(response.data);
        if (response.data.message) {
          setLoginStatus(response.data.message);
        } else {
          setLoginStatus(response.data[0].username);
        }
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(userInput);
  };

  return (
    <div className="App">
      <div className="registration">
        <h1>Registration</h1>
        <label>Username</label>
        <input type="text" name="registerUsername" onChange={handleChange} />
        <label>Password</label>
        <input
          type="password"
          name="registerPassword"
          onChange={handleChange}
        />
        <button onClick={register}>Register</button>
        <h2>{registerStatus}</h2>
      </div>

      <div className="login">
        <h1>Login</h1>
        <label>Username</label>
        <input type="text" name="loginUsername" onChange={handleChange} />
        <label>Password</label>
        <input type="password" name="loginPassword" onChange={handleChange} />
        <button onClick={login}>Login</button>
        <h2>{loginStatus}</h2>
      </div>
    </div>
  );
}

export default App;
