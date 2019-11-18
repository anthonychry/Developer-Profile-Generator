const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');
const pdf = require('html-pdf');

let username;

inquirer
.prompt([
  {
    type: "input",
    message: "What is your name?",
    name: "name"
  },
  {
    type: "input",
    message: "What is your GitHub username?",
    name: "github"
  }
]).then(function(response) {
    username = response.github;
    developer = response.name;
    console.log(username);
}).then(function(response) {
    axios.get(`https://api.github.com/users/${username}`)
    .then(function (response) {
        console.log(generateHTML(response));
        pdf.create(generateHTML(response)).toFile('./message.pdf', function(err, res) {
            if (err) return console.log(err);
            console.log(res);
          });
                            // fs.writeFile('message.html', generateHTML(response), (err) => {
                            //     if (err) throw err;
                            //     console.log('The file has been saved!');
                            //   });
    })
    .catch(function (error) {
        console.log(error);
    })
});

function generateHTML(response) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Profile Generator</title>
    </head>
    <style>
        header {
            background-color: tan;
            width: 100%;
            height: 200px;
        }
        img {
            border-radius: 100px;
            height: 200px;
            width: 200px;
            border: 1.5px solid black;
            margin-top: -15px;
        }
        .heading {
            text-align: center;
            position: absolute;
            top: 40px;
            left: 40px;
            right: 40px;
            background-color: rgb(247, 239, 205);
            padding-left: 10%;
            padding-right: 10%;
            border-radius: 25px;
        }
        .subjects {
            display: flex;
            justify-content: space-between;
        }
        a {
            margin: 7px;
        }
        .property {
            display: inline-block;
            padding-top: 20px;
            padding-bottom: 20px;
            padding-left: 5px;
            padding-right: 5px;
            width: 150px;
            background-color: rgb(247, 239, 205);
            margin-right: 10px;
            margin-left: 10px;
            border-radius: 15px;
            margin-top: 300px;
            text-align: center;
        }
    
    </style>
    <body>
        <header></header>
        <div class="heading">
        <h1><img src="${response.data.avatar_url}"></h1>
        <h3>${developer}</h3>
            <h4>GitHub: ${response.data.login}</h4>
            <div class="links">
                <a href="https://www.google.com/maps/place/${locationString(response.data.location)}">Location</a>
                <a href="${response.data.html_url}">GitHub</a>
                <a href="${response.data.blog}">Blog</a>
            </div>
            <p>${response.data.bio}</p>
        </div>
        <div class="subjects">
            <p class="property">Public Repos: ${response.data.public_repos}</p>
            <p class="property">Followers: ${response.data.followers}</p>
            <p class="property">Following: ${response.data.following}</p>
        </div>
    </body>
    </html>
    `
}

function locationString(str){
    let words = str.split(" ");
    if (words.length > 1) {
        words = words.join("+");
    } else {
        words = words[0];
    }
    return words;
}