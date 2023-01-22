const express = require("express");
const path = require("path");
const app = express();
const PORT = 3300;
const connectLivereload = require("connect-livereload");
var bodyParser = require("body-parser");
const fs = require("fs");
const config = path.join(__dirname, "js", "config.json");
let formdatas = {};
var livereload = require("livereload");
const { JsonDB, Config } = require('node-json-db')
var server = livereload.createServer();
server.watch(__dirname);

app.use(connectLivereload());
app.use(express.static(path.join(__dirname, "js")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.get("/", (req, res) => {
    fs.readFile(config, "utf8", (err, json) => {
        formdatas = JSON.parse(json);
        res.render("main", { data: formdatas });
    });
});
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post("/save", urlencodedParser, (req, res) => {
    fs.writeFile(config, JSON.stringify(req.body), (err, json) => { });
});


app.get("/readlink", (req, res) => {
    const rootdir = "I:\\_GOOGLE DRIVE\\GOOGLE DRIVE RK\\THUMBNAIL\\_ROOT";
    fs.readdir(rootdir, (err, files) => {
        if (err) return;
        const newarr = []
        for (const file of files) {
            console.log(path.join(rootdir, file));
            fs.readlink(path.join(rootdir, file), (err, link) => {
                console.log(err)
                newarr.push({ key: file, link: link })
            })
        }

        res.json(newarr);
    })
});

const texture_dir = "D:\\FREETEXTURE"
app.get("/textures", async (req, res) => {
    var db = new JsonDB(new Config("hello", true, false, '/'));


    const dir = fs.readdirSync(texture_dir);
    let data = []
    dir.forEach(async (d) => {
        const stats = fs.lstatSync(path.join(texture_dir, d)).isDirectory();
        if (stats && d != ".thumbnail") {
            const txtures = fs.readdirSync(path.join(texture_dir, d));
            data.push({ category: d, files: txtures });

        }

    });
    res.json(data);
})

app.post("/link", (req, res) => {
    fs.readFile(config, "utf8", (err, json) => {
        const test = JSON.parse(json);
        var rootdir = "";
        for (var key in test) {
            const dir = test[key];
            if (key == "root") rootdir = test[key];
            if (fs.existsSync(dir)) {
                if (key != "root") {
                    const _name = path.basename(test[key]);
                    const _path = test[key];
                    fs.symlink(_path, path.join(rootdir, key), "dir", (ee) => {

                    });
                }
            }
        }
    });
});
app.listen(PORT, () => {
    console.log(`visit http://localhost:${PORT}`);
});

// in app.js (or similar)
server.server.once("connection", () => {
    setTimeout(() => {
        server.refresh("/");
    }, 100);
});
