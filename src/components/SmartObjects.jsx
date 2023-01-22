import React, { Component } from "react";
import { TOKEN } from "../modules/Token";
import '../sass/smartobject.sass'
import {
    exportLayerAsSmartObject,
    findNestedObject,
    insertSmartObject,
    setLayerName,
    logme
} from "../modules/bp";
const fs = require("uxp").storage.localFileSystem;
export default class SmartObjects extends Component {
    constructor(props) {
        super(props);

        this.state = {
            jsonfile: null,
            smartobjects: [],
            bahantoken: null,
            parentdir: null,
            psbnames: [],
            namefilter: "",
            newname: "",
        };

        this.parseJsonFile = this.parseJsonFile.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.findName = this.findName.bind(this);
        this.handleConvertClick = this.handleConvertClick.bind(this);
        this.onRightClick = this.onRightClick.bind(this);



        this.props.token
            .getToken(TOKEN.BAHAN)
            .then(async (result) => {
                this.setState({ bahantoken: result, parentdir: result.nativePath });

                this.parseJsonFile();
            })
            .catch((e) => {
                this.props.askForToken();
            });
    }

    async parseJsonFile() {
        this.state.bahantoken.getEntry("thumbnail.json").then(async (r) => {
            const listallpsb = JSON.parse(await r.read());
            this.setState({ psbnames: listallpsb.map((psb) => psb.name) });
        });
    }
    handleSearch(e) {
        this.setState({ namefilter: e.target.value });
    }
    findName(layername) {
        return new Promise(async (resolve, reject) => {
            const numb_name = this.state.psbnames
                .map((psbfile) => {
                    const filename = psbfile.replace(".psb", "").split("_");
                    return parseInt(filename[filename.length - 1]);
                })
                .filter((n) => !isNaN(n));
            const num = Math.max(...numb_name);
            if (num == -Infinity) resolve(`${layername}_0.psb`);
            else resolve(`${layername}_${num + 1}.psb`);
        });
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props.serverListener) {

            if (this.props.serverListener != null && this.props.serverListener.fromserver) {
                if (this.props.serverListener.type == "createthumb" || this.props.serverListener.type == "deletethumb") {
                    this.parseJsonFile();
                }
            }
        }
    }

    handleToken() {
        this.token
            .getToken(TOKEN.BAHAN)
            .then(async (result) => {
                logme(result);
            })
            .catch((e) => {
                logme(e);
                this.props.askForToken();
            });
    }

    async onRightClick(filename) {
        window.openYesNoDialog("Delete this", "are you sure you wanna delete this smart object?",
            { yes: "Yap", no: "Nah!" }, (result) => {
                if (result) {
                    this.state.bahantoken
                        .getEntry(filename)
                        .then(async (entryobj) => {

                            this.props.doJsonMessage({
                                type: "deletethumb",
                                fromserver: false,
                                data: entryobj.nativePath,
                            });
                        });

                }

            })


    }
    async handleConvertClick(e) {
        const _name = await this.findName(this.state.newname);
        await setLayerName(_name.replace(".psb", ""));
        const newpsb = await this.state.bahantoken.createFile(_name, {
            overwrite: false,
        });
        const sessiontoken = fs.createSessionToken(newpsb);
        const ish = await exportLayerAsSmartObject(sessiontoken);
        const _path = await findNestedObject(ish, "_path");

        try {
            this.props.doJsonMessage({
                type: "createthumb",
                fromserver: false,
                data: _path._path,
            });
        } catch (error) {
            console.error(err);
        }

    }


    render() {
        return (
            <div className="so-panel">
                <div className="group-horizontal">
                    <sp-action-button
                        onClick={this.handleConvertClick}>
                        Convert
                    </sp-action-button>
                    <sp-textfield

                        class="so-text-convert"
                        placeholder="name..."
                        onInput={(e) => this.setState({ newname: e.target.value })}
                    ></sp-textfield>
                </div>
                <div className="group-vertical">
                    <sp-textfield
                        class="so-text-search"
                        type="search"
                        onInput={this.handleSearch}
                        placeholder="Search something..."
                    ></sp-textfield>
                    <div className="so-images">
                        {this.state.psbnames.map((name, i) => (
                            <img
                                key={i}
                                className={
                                    name.includes(this.state.namefilter)
                                        ? "so-img"
                                        : "so-img hide"
                                }
                                value={name}
                                src={`file:\\\\${this.state.parentdir}\\thumbnails\\${name}.png`}
                                onContextMenu={(e) => {
                                    e.stopPropagation();

                                    this.onRightClick(name + ".psb")
                                }}
                                onClick={() => {
                                    this.state.bahantoken
                                        .getEntry(name + ".psb")
                                        .then(async (entryobj) => insertSmartObject(entryobj));
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
