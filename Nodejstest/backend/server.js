const express = require('express');
const res = require('express/lib/response');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');



const app = express();

app.use(cors());
app.use(express.json());




/* My Sql Connection */
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'suttha140244',
    database: 'note_easy'    
})

/*เชื่อมต่อ กับ SQL Server */ 

connection.connect((err) => {
    if (err) {
        console.log('Error connect to MySQL =',err)
        return;
    }
    console.log('MYSQL success connect!');
})





/* ทำ CRUD ทั้ง 4 Table โดยจะทดสอบ ผ่านตัว Thunder Client ใน vs code */
/*Route Create Database [ Customer,note,Catagory_note,History_note ] */ 


/*Route Customer Create database (post ข้อมูลใหม่เข้าไปใน Database) */ 

app.post("/customer/create", async (req, res) => {
    const {first_name ,last_name,email,password,phone_number} = req.body;     /*สร้างตัวแปรมารับข้อมูลจาก req body*/

    try{
        connection.query(
            "INSERT INTO customer(first_name ,last_name,email,password,phone_number) VALUES(?,?,?,?,?)",
            [first_name ,last_name,email,password,phone_number],
            (err,results,fields) => {
                if (err){
                    console.log("Error insert a customer into the database",err);     /*ถ้าเจอ err ให้แจ้งเตือนกลับมาผ่าน consloe (Server ไม่เข้าใจ request) */
                    return res.status(400).send();                 
                }
                return res.status(201).json({message: "New customer success create"});  /*สร้างข้อมูลเรียบร้อย*/ 
            }
        )

    } catch(err) {
        console.log(err);
        return res.status(500).send();        /* catch ดักจับถ้าเจอ err (500. request ถูกเกิดข้อผิดพลาดที่ Server) */
    }
})

/*Route note Create database*/ 

app.post("/note/create", async (req, res) => {
    const {title,note_text,id_category_note,id_history_note,id_customer} = req.body;

    try{
        connection.query(
            "INSERT INTO note(title,note_text,id_category_note,id_history_note,id_customer) VALUES(?,?,?,?,?)",
            [title,note_text,id_category_note,id_history_note,id_customer],
            (err,results,fields) => {
                if (err){
                    console.log("Error insert a note into the database",err);
                    return res.status(400).send();
                }
                return res.status(201).json({message: "New note success create"});
            }
        )

    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

/*Route history_note Create database*/ 

app.post("/history_note/create", async (req, res) => {
    const {annotation} = req.body;

    try{
        connection.query(
            "INSERT INTO history_note(annotation) VALUES(?)",
            [annotation],
            (err,results,fields) => {
                if (err){
                    console.log("Error insert a history_note into the database",err);
                    return res.status(400).send();
                }
                return res.status(201).json({message: "New history_note success create"});
            }
        )

    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})

/*Route category_note Create database*/ 

app.post("/category_note/create", async (req, res) => {
    const {category_type} = req.body;

    try{
        connection.query(
            "INSERT INTO category_note(category_type) VALUES(?)",
            [category_type],
            (err,results,fields) => {
                if (err){
                    console.log("Error insert a category_note into the database",err);
                    return res.status(400).send();
                }
                return res.status(201).json({message: "New category_note success create"});
            }
        )

    } catch(err) {
        console.log(err);
        return res.status(500).send();
    }
})


/*Route Read Database [ Customer,note,Catagory_note,History_note ] */ 

/*Route Customer Read database*/ 

app.get("/customer/read", async (req, res) => {
    try{
        connection.query("SELECT * FROM customer", (err ,results ,fields) => {
            if (err) {
                console.log("Error select a customer into the database",err);
                return res.status(400).send();
            }
            if(results === undefined || results.length === 0) {
                return res.status(404).send({message : "READ NOT FOUND"});
            }

            res.status(200).json(results)
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route note Read database*/ 

app.get("/note/read", async (req, res) => {
    try{
        connection.query("SELECT * FROM note", (err ,results ,fields) => {
            if (err) {
                console.log("Error select a Note into the database",err);
                return res.status(400).send();
            }
            if(results === undefined || results.length === 0) {
                return res.status(404).send({message : "READ NOT FOUND"});
            }

            res.status(200).json(results)
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route history_note Read database*/ 

app.get("/history_note/read", async (req, res) => {
    try{
        connection.query("SELECT * FROM history_note", (err ,results ,fields) => {
            if (err) {
                console.log("Error select a history_note into the database",err);
                return res.status(400).send();
            }
            if(results === undefined || results.length === 0) {
                return res.status(404).send({message : "READ NOT FOUND"});
            }

            res.status(200).json(results)
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route category_note Read database*/ 

app.get("/category_note/read", async (req, res) => {
    try{
        connection.query("SELECT * FROM category_note", (err ,results ,fields) => {
            if (err) {
                console.log("Error select a category_note into the database",err);
                return res.status(400).send();
            }
            if(results === undefined || results.length === 0) {
                return res.status(404).send({message : "READ NOT FOUND"});
            }

            res.status(200).json(results)
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route Customer Read specifically data (อ่านข้อมูลของ Customer เฉพาะโดยใส่่ email ลงไป )*/
app.get("/customer/read/:email", async (req, res) => {
    const email = req.params.email;

    try{
        connection.query("SELECT * FROM customer WHERE email = ?", [email] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error select a customer email into the database",err);
                return res.status(400).send();
            }

            if(results === undefined || results.length === 0) {
                return res.status(404).send({message : "READ NOT FOUND"});
            }
            
            res.status(200).json(results)    /* 200. ดำเนินการเสร็จสิ้น */
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route Update Database [ Customer,note,Catagory_note,History_note ] */ 

/*Route Customer Update database*/
// Change Password
app.patch("/customer/update/:id_customer/:email",async (req , res) => {
    const id_customer = req.params.id_customer;
    const email = req.params.email;
    const newPassword = req.body.newPassword;

    try{
        connection.query("UPDATE customer SET password = ? WHERE id_customer = ? AND email = ?", [newPassword,id_customer,email] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error update a customer password into the database",err);
                return res.status(400).send();
            }
            res.status(200).json({message: " customer update password success "})
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route note Update database*/
//Change note_text
app.patch("/note/update/:id_note",async (req , res) => {
    const id_note = req.params.id_note;
    const newNote = req.body.newNote;

    try{
        connection.query("UPDATE note SET note_text = ? WHERE id_note = ?", [newNote,id_note] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error update a note text into the database",err);
                return res.status(400).send();
            }
            res.status(200).json({message: " note update note_text success "})
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route history_note Update database*/
//Change annotation
app.patch("/history_note/update/:id_history_note",async (req , res) => {
    const id_history_note = req.params.id_history_note;
    const newAnnotation = req.body.newAnnotation;

    try{
        connection.query("UPDATE history_note SET annotation = ? WHERE id_history_note = ?", [newAnnotation,id_history_note] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error update a history_note text into the database",err);
                return res.status(400).send();
            }
            res.status(200).json({message: " history_note update annotation success "})
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route category_note Update database*/
//Change category_type
app.patch("/category_note/update/:id_category_note",async (req , res) => {
    const id_category_note = req.params.id_category_note;
    const newCategory = req.body.newCategory;

    try{
        connection.query("UPDATE category_note SET category_type = ? WHERE id_category_note = ?", [newCategory,id_category_note] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error update a category_note text into the database",err);
                return res.status(400).send();
            }
            res.status(200).json({message: " category_note update category_type success "})
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})


/*Route Delete Database [ Customer,note,Catagory_note,History_note ] */ 

/*Route Customer Delete database*/
app.delete("/customer/delete/:id_customer/:email",async (req , res) => {
    const id_customer = req.params.id_customer;
    const email = req.params.email;
   
    try{
        connection.query("DELETE FROM customer WHERE id_customer = ? AND email = ?", [id_customer,email] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error delete a id_customer into the database",err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({message : "No Data customer with that id"});
            }

            return res.status(200).json({message : "Data customer delete success"});
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route note Delete database*/
app.delete("/note/delete/:id_note",async (req , res) => {
    const id_note = req.params.id_note;
   
    try{
        connection.query("DELETE FROM note WHERE id_note = ?", [id_note] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error delete a id_note into the database",err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({message : "No Data note with that id"});
            }

            return res.status(200).json({message : "Data note delete success"});
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route history_note Delete database*/
app.delete("/history_note/delete/:id_history_note",async (req , res) => {
    const id_history_note = req.params.id_history_note;
   
    try{
        connection.query("DELETE FROM history_note WHERE id_history_note = ?", [id_history_note] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error delete a id_history_note into the database",err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({message : "No Data history_note with that id"});
            }

            return res.status(200).json({message : "Data history_note delete success"});
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/*Route category_note Delete database*/
app.delete("/category_note/delete/:id_category_note",async (req , res) => {
    const id_category_note = req.params.id_category_note;
   
    try{
        connection.query("DELETE FROM category_note WHERE id_category_note = ?", [id_category_note] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error delete a id_category_note into the database",err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({message : "No Data category_note with that id"});
            }

            return res.status(200).json({message : "Data category_note delete success"});
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

/* จบการทำ CRUD ทั้ง 4 Table */




/*Single Read Customer,email,note_text into the database (อ่านข้อมูลเฉพาะบุคคลของ แต่ละ Customer ว่าใน note มีไรบ้างโดยผ่านการใส่ id_note)*/ 

app.get("/api/read/cus_note", async (req, res) => {
    const id_note = req.query.id_note;
    const email = req.query.email;
    
    if (id_note !== undefined || email !== undefined) {

    try{
        connection.query("SELECT n.id_note , csn.first_name, csn.last_name , csn.email , n.title , n.note_text , n.created_time , cn.category_type ,hn.annotation FROM note AS n INNER JOIN customer AS csn ON n.id_customer = csn.id_customer INNER JOIN category_note AS cn ON n.id_category_note = cn.id_category_note INNER JOIN history_note AS hn ON n.id_history_note = hn.id_history_note  WHERE id_note = ? AND email = ?", 
        [id_note,email] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error select a note customer into the database",err);
                return res.status(400).send();
            }
            
            if(results === undefined || results.length === 0) {
                return res.status(404).send({message : "READ NOT FOUND"});
            }
            res.status(200).json({results , message: "Read note customer success "});
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }

  }else {
     return res.status(404).send({message : "ERROR READ REQ note customer"});
  }

})

/*READ ALL Customer,note,history,category (อ่านข้อมูลทั้งหมดของ Customer ทุกคนว่าในแต่ละคนเขียน note ว่าไรบ้าง)*/ 

app.get("/api/readAll/cus_note", async (req, res) => {
       

    try{
        connection.query("SELECT n.id_note , csn.first_name, csn.last_name , csn.email , n.title , n.note_text , n.created_time , cn.category_type ,hn.annotation FROM note AS n INNER JOIN customer AS csn ON n.id_customer = csn.id_customer INNER JOIN category_note AS cn ON n.id_category_note = cn.id_category_note INNER JOIN history_note AS hn ON n.id_history_note = hn.id_history_note  ", 
         (err ,results ,fields) => {
            if (err) {
                console.log("Error select a note customer into the database",err);
                return res.status(400).send();
            }
            
            if(results === undefined || results.length === 0) {
                return res.status(404).send({message : "READ NOT FOUND"});
            }
            res.status(200).json(results);
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }

  

})



/*req Check Login email & password test (ทดสอบลอง post ข้อมูล email และ password ลงไปว่ามีในฐานข้อมูลหรือไม่)*/ 

app.post("/api/login", async (req,res) => {
    const email = req.query.email;
    const password = req.query.password;

    if(email !== undefined && password !== undefined) {

        try{
            connection.query("SELECT email,password FROM customer WHERE email = ? AND password = ?", [email,password] ,(err ,results ,fields) => {
                if (err) {
                    console.log("Error login a customer email into the database",err);
                    return res.status(400).send();
                }

                if(results === undefined || results.length === 0) {
                    return res.status(404).send({message : "LOGIN ERROR TRY AGAIN"});
                }
                
                if(results[0].email === email && results[0].password === password) {
                    
                    return res.status(200).json({message: "login success yup "});
                }
                
                else {
                    return res.status(404).json({message: "login Error "});
                }

                //return res.status(200).json({message: "login success "});          
                //no res.render("/");
                //pass res.redirect("/")
            })
    
        } catch(err){
            console.log(err);
            return res.status(500).send();
        }
        
    }else {
        return res.status(404).send({message : "ERROR LOGIN TRYAGAIN"});
     }

})

/* update note ในหน้า React */
app.patch("/api/update/note" , async (req , res) => {
    const id_note = req.body.id_note;
    const note_text = req.body.note_text;

    try{
        connection.query("UPDATE note SET note_text = ? WHERE id_note = ?", [note_text,id_note] ,(err ,results ,fields) => {
            if (err) {
                console.log("Error update a note text into the database",err);
                return res.status(400).send();
            }
            res.status(200).json(results)
        })

    } catch(err){
        console.log(err);
        return res.status(500).send();
    }
})


/*Page Not Found 404 เมื่อมีการเข้า api ที่ไม่ถูกต้อง*/

app.use('/' , (req , res) => {
    res.status(404).send({message: "Page not found! 404"});
})

app.listen(3000, () => console.log('Server is Start on port:3000'));