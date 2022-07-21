const express = require("express");
const app = express();
const port = 3004;
const mysql = require("./connection").con

app.set("view engine", "hbs");
app.set("views", "./view")
app.use(express.static(__dirname + "/public"))
// app.use(express.urlencoded())
//  app.use(express.json())
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.get("/search", (req, res) => {
    res.render("search");
});

app.get("/update", (req, res) => {
    res.render("update");
});

app.get("/delete", (req, res) => {
    res.render("delete");
});

app.get("/view", (req, res) => {
    let qry = "select * from user_details ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("view", { data: results });
        }

    });

});


app.get("/adduser", (req, res) => {
    const { name, phone, email, gender } = req.query

    // Sanitization XSS...
    let qry = "select * from user_details where emailid=? or phoneno=?";
    mysql.query(qry, [email, phone], (err, results) => {
        if (err)
            throw err
        else {
            if (results.length > 0) {
                res.render("add", { checkmesg: true })
            } else {
                // insert query
                let qry2 = "insert into user_details values(?,?,?,?)";
                mysql.query(qry2, [name, phone, email, gender], (err, results) => {
                    res.render("add", { mesg: true })
                })
            }
        }
    })
});

app.get("/searchuser", (req, res) => {
    const { phone } = req.query;

    let qry = "select * from user_details where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false })

            }
            else {
                res.render("search", { mesg1: false, mesg2: true })
            }
        }
    })
});

app.get("/updatesearch", (req, res) => {
    const { phone } = req.query;
    let qry = "select * from user_details where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            }
            else {
                res.render("update", { mesg1: false, mesg2: true })
            }
        }
    });
})

app.get("/updateuser", (req, res) => {
    const { phone, name, gender } = req.query;
    let qry = "update user_details set user_name=?, gender=? where phoneno=?";

    mysql.query(qry, [name, gender, phone], (err, results) => {
        if (err) throw err
        else {
            res.render("update", { umesg: true })
        }
    })
})

app.get("/removeuser", (req, res) => {
    const { phone } = req.query;
    let qry = "delete from user_details where phoneno=?";

    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            }
            else {
                res.render("delete", { mesg1: false, mesg2: true })
            }
        }
    })
})

app.listen(port, (err) => {
    if (err)
        throw err
    else
        console.log("Server is running at port %d", port);
});