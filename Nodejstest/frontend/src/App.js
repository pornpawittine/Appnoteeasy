import Axios from 'axios'
import { useState } from 'react'

function App() {

const [first_name , setfirst_name] = useState("");
const [last_name , setlast_name] = useState("");
const [email , setemail] = useState("");
const [password , setpassword] = useState("");
const [phone_number , setphone_number] = useState("");

const [newnote_text , setnewnote_text] = useState("");

const [customerList , setCustomerlist] = useState([]);

/* อ่่านข้อมูล ทุก Customer และ note ใน database */
const getCustomer = () => {
  Axios.get('http://localhost:3000/api/readAll/cus_note').then((response) => {
    setCustomerlist(response.data);

  });
}


/* Create add ได้เฉพาะตาราง Customer */
const addCustomer = () => {
  Axios.post('http://localhost:3000/customer/create' , {
    first_name: first_name,
    last_name: last_name,
    email: email,
    password: password,
    phone_number: phone_number
  }).then(() => {
    setCustomerlist([
      ...customerList,
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        phone_number: phone_number
      }
    ])
  })
}

/* login test */
const login = () => {
  Axios.post('http://localhost:3000/api/login' , {
    email: email,
    password: password
  }).then(() => {
    setCustomerlist([
      ...customerList,
      {
        email: email,
        password: password
      }
    ])
  })
}

/* update ยังมีบัคอยู่เมื่อกดต้อง รีใหม่ ข้อมูลถึงจะแสดงการ update ล่าสุด*/

const updateNote = (id_note) => {
  Axios.patch("http://localhost:3000/api/update/note" , {note_text: newnote_text , id_note : id_note}).then((response) => {
    setCustomerlist(
      customerList.map((val) => {
        return val.id_note == id_note ? {
          id_note: val.id_note,
          first_name: val.first_name,
          last_name: val.last_name,
          email: val.email,
          title: val.title,
          note_text: val.note_text,
          created_time: val.created_time,
          category_type: val.category_type,
          annotation: val.annotation
        } : val;
      })
    )
  })
    
}



  return (
    <html class="bg-dark">
    <div className="App container p-3 mb-2 bg-secondary text-dark">
      <h1>Database Note_Easy</h1>
      <div className = "information">
        <h3>Register</h3>
        <form action = "">
          <div className ="mb-3">
            <label htmlFor = "first_name" className = "form-label">
              First_Name:
            </label>
            <input 
            type = "text" 
            className = "form-control" 
            placeholder = "Enter first name"
            onChange = {(Event) => {
              setfirst_name(Event.target.value)
            }}>             
            </input>

          </div>
          <div className ="mb-3">
            <label htmlFor = "last_name" className = "form-label">
              Last_Name:
            </label>
            <input 
            type = "text" 
            className = "form-control" 
            placeholder = "Enter last name"
            onChange = {(Event) => {
              setlast_name(Event.target.value)
            }}>        
            </input>

          </div>
          <div className ="mb-3">
            <label htmlFor = "email" className = "form-label">
              Email:
            </label>
            <input 
            type = "text" 
            className = "form-control" 
            placeholder = "Enter email"
            onChange = {(Event) => {
              setemail(Event.target.value)
            }}>         
            </input>

          </div>
          <div className ="mb-3">
            <label htmlFor = "password" className = "form-label">
              Password:
            </label>
            <input 
            type = "text" 
            className = "form-control" 
            placeholder = "Enter password"
            onChange = {(Event) => {
              setpassword(Event.target.value)
            }}>
            </input>

          </div>
          <div className ="mb-3">
            <label htmlFor = "phonenumber" className = "form-label">
              PHONE_Number:
            </label>
            <input 
            type = "text" 
            className = "form-control" 
            placeholder = "Enter phone number"
            onChange = {(Event) => {
              setphone_number(Event.target.value)
            }}>
            </input>
          </div>

          <button className = "btn btn-success" onClick = {addCustomer}>
            Create Customer
            </button>
        </form>     
      </div>
      <hr/>
      <div className='reg'>
        <h3>Login</h3>
        <form action="">
        <div className ="mb-3">
            <label htmlFor = "email" className = "form-label">
              Email:
            </label>
            <input 
            type = "text" 
            className = "form-control" 
            placeholder = "Enter email"
            onChange = {(Event) => {
              setemail(Event.target.value)
            }}>         
            </input>

          </div>
          <div className ="mb-3">
            <label htmlFor = "password" className = "form-label">
              Password:
            </label>
            <input 
            type = "text" 
            className = "form-control" 
            placeholder = "Enter password"
            onChange = {(Event) => {
              setpassword(Event.target.value)
            }}>
            </input>

          </div>
          <button className = "btn btn-success" onClick = {login}>
            Login
            </button>

        </form>
      </div>
      <hr/>
      <div className = "customer">
        <button className = "btn btn-primary" onClick = {getCustomer}>
          Show Customer
        </button>
        <br/><br/>

        {customerList.map((val , key) => {
          return (
            <div className = "Customer card">
              <div className = "card-body text-left">
                <p className = "card-text">First Name: {val.first_name}</p>
                <p className = "card-text">Last Name: {val.last_name}</p>
                <p className = "card-text">Email: {val.email}</p>
                <p className = "card-text">Title: {val.title}</p>
                <p className = "card-text">Note: {val.note_text}</p>
                <p className = "card-text">Time: {val.created_time}</p>
                <p className = "card-text">Category: {val.category_type}</p>
                <p className = "card-text">Annotation: {val.annotation}</p>

                <div className = "d-flex">
                  <input type = "text"
                  style = {{width: "250px"}}
                  placeholder = "Edit note"
                  className = "form-control"
                  onChange = {(Event) => {
                    setnewnote_text(Event.target.value)
                  }}>
                  </input>              
                       <button className = "btn btn-success " onClick = {() => {updateNote(val.id_note)}}>Update Note</button>            
                </div>

              </div>

            </div>
          )
        })}
        
      </div>
    </div>
    </html>
  );
}

/*    Upadate Testv.1
 <div className = "d-flex">
     <input type = "text"
     style = {{width: "250px"}}
     placeholder = "Edit note"
     className = "form-control">
     </input>              
     <button className = "btn btn-success">Update Note</button>            
  </div>
*/




export default App;
