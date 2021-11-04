let express = require("express")
let app = express()
const PORT = process.env.PORT || 3000;

const path = require("path");
const bodyParser = require("body-parser")
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: true }));

let users = [
    {nick:"111", email:"111@w.pl"},
    {nick:"222", email:"222@w.pl"},
    {nick:"333", email:"333@w.pl"}
];

const removingFormHeader = "<form action='/delete' method='POST'>";
const removingFormHeaderCheckbox = "<form action='/deleteCheckbox' method='POST'>";
const removingFormSubmit = "<input type='submit' value='usuń' style='margin: 4px;'><br>";

const checkIfEmailIsFree = (email) => {
    let result = users.find((element) => {
        return element.email == email 
    });
    
    if(result == undefined) {
        return true;
    }
    return false;
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/pages/addUser.html"));
})

app.post("/handleForm", (req, res) => {
    let nick = req.body.nick;
    let email = req.body.email;

    if(checkIfEmailIsFree(email)) {
        users.push({nick: nick, email: email});
        res.send(`<p>Twój email został dodany, ${nick}</p>`);
    }
    else {
        res.send("taki mail jest już w bazie");
    }
    console.log(users);
})

app.get("/removeUserBySelect", (req, res) => {
    let result = removingFormHeader;
    result += removingFormSubmit;
    result += "<select name='emails'>";
    users.forEach((user) => {
        result += `<option value='${user.email}'>${user.email}</option>`
    })
    result += "</select>";
    result += "</form>";

    res.send(result);
})

app.get("/removeUserByRadio", (req, res) => {
    let result = removingFormHeader;
    
    users.forEach((user) => {
        result += `<input type='radio' name='emails' value='${user.email}' id='${user.email}'>`
        result += `<label for='${user.email}'>${user.email}</label><br>`
    });

    result += removingFormSubmit;
    result += "</form>";

    res.send(result);
})

app.get("/removeUserByCheckbox", (req, res) => {
    let result = removingFormHeaderCheckbox;

    users.forEach((user) => {
        result += `<input type='checkbox' name='emails' value='${user.email}' id='${user.email}'>`
        result += `<label for='${user.email}'>${user.email}</label><br>`
    });

    result += removingFormSubmit;
    result += "</form>";

    res.send(result);
});

app.post("/delete", (req, res) => {
    let userEmail = req.body.emails;
    console.log(userEmail);

    users = users.filter((user) => {
        return user.email != userEmail;
    });
    res.send("<p>Usunięto użytkownika</p><a href='/'>Wróć do strony dodawania użytkowników</a>")
    console.log(users);
});

app.post("/deleteCheckbox", (req, res) => {
    let usersEmails = req.body.emails;

    users = users.filter((user) => {
        let index = usersEmails.indexOf(user.email);
        return index == -1;
    });
    res.send("<p>Zaznaczeni użytkownicy zostali usunięci</p><a href='/'>Wróć do strony dodawania użytkowników</a>");
    console.log(users);
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})