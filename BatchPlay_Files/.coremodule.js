
const C = {
    btn: "sp-action-button",
    picker: "sp-picker",
    slider: "sp-slider",
    input: "input",
    div: "div",
    tf: "sp-textfield",
    div: "div",
    cb: "sp-checkbox",
    class_btn: "bp-button"
}





function __style(st) {
    function s(k) {
        var rr = k.replace(/([A-Z])/g, " $1");
        return rr.split(' ').join('-').toLowerCase();
    }
    let res = "";
    for (var i in st) {
        res += `${s(i)}:${st[i]};`
    }
    return res;
}
class EL {
    constructor(istextool) {
        if (istextool)
            this._mainpanel = document.querySelector(".bp-textoolpanel");
        else {
            this._mainpanel = document.querySelector(".batchplay-panel");
            while (this._mainpanel.firstChild)
                this._mainpanel.removeChild(this._mainpanel.firstChild)


        }




    }

    attachGroup(_el) {
        if (!this._mainpanel.querySelector(".textool") || !this._mainpanel.querySelector(".googletool"))
            this._mainpanel.appendChild(_el);
    }

    attr(el, attr) {
        el.setAttribute(attr[0], attr[1]);
    }
    style(ee, styledata) {
        ee.setAttribute("style", __style(styledata))

    }

    makegroup(ishorizontal) {
        const group = document.createElement("div");
        group.className = ishorizontal ? "group-horizontal" : "group-vertical";
        return group;
    }
    clearShit(_el) {
        while (_el.firstChild)
            _el.removeChild(_el.firstChild);
    }
    mainparent(ishorizontal, _classname) {
        const add = document.createElement("div");
        add.className = ishorizontal ? "group-horizontal" : "group-vertical";
        if (_classname) {
            this.parentclassName = _classname;
            add.classList.add(_classname);
        }
        return add;
    }
    appendMenuItem(_el, name) {
        const menuitem = document.createElement("sp-menu-item");
        menuitem.setAttribute("value", name);
        menuitem.innerText = name;
        _el.firstChild.appendChild(menuitem);

    }
    minmaxval(_el, s) {
        _el.setAttribute("min", s.min)
        _el.setAttribute("max", s.max)
        _el.setAttribute("value", s.value)
        _el.setAttribute("step", s.step)
    }


    add(el, _cls, text, type) {
        let _d = document.createElement(el);
        _d.setAttribute("size", "s");
        _d.className = _cls;
        if (el == C.input) {
            _d.setAttribute("value", text);
            if (type) {
                _d.setAttribute("type", type);
            }
        }
        else if (el == C.cb) {
            _d = document.createElement(C.cb);
            _d.className = _cls;

            _d.textContent = text;

        } else if (el == C.tf) {

            if (type) {
                _d.setAttribute("type", type);
            }
        } else if (el == C.picker) {

            const opt = document.createElement("sp-menu");
            opt.setAttribute("slot", "options");
            _d.appendChild(opt);
        } else if (el == C.slider) {

            const lbl = document.createElement("sp-label");
            _d.setAttribute("data-name", text);
            lbl.setAttribute("slot", "label");
            lbl.textContent = text;
            _d.appendChild(lbl);
        }
        else {

            _d.textContent = text;
        }
        return _d;
    }
    async getAllLayers() {
        return new Promise(async (resolve, reject) => {
            await ps_CoreModal(async () => {
                const docRef = {
                    _ref: "document",
                    _id: app.activeDocument.id,
                };
                const result = await ps_Bp([{
                    _obj: "multiGet",
                    _target: docRef,
                    extendedReference: [
                        ["name", "layerID"],
                        {
                            _obj: "layer",
                            index: 1,
                            count: -1,
                        },
                    ],
                }], {});
                resolve(result[0].list);
            }, { commandName: "some tag" });



        });
    }

    getSelectedLayers() {
        return app.activeDocument.activeLayers;
    }

}
window.EL = EL;
window.C = C;
function makeElement(el, _classname) {
    const _div = document.createElement(el);
    _div.className = _classname;
    return _div;
}


class JulBox {
    constructor(text) {
        this.gray = "#555"
        this.maincolor = "#fd0"
        this.state = false;
        this.root = document.createElement("div");
        this.root.setAttribute("style",
            this.style({
                display: "flex",
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                margin: "2px 2px"
            }))
        this.div = document.createElement("div");
        this.div.setAttribute("style", this.style({
            cursor: "pointer",
            width: "10px",
            height: "10px",
            border: "solid 2px",
            borderRadius: "20px",
            borderColor: this.state ? this.maincolor : this.gray,
        }))
        this.div.addEventListener("click", (e) => {
            if (e.button == 2)
                e.stopPropagation();
            this.state = !this.state;
            this.div.style.borderColor = this.state ? this.maincolor : this.gray;
            this.div.style.backgroundColor = this.state ? this.maincolor : "transparent";

        })

        this.root.appendChild(this.div);
        this.text = document.createElement("label");
        this.text.setAttribute("style", this.style({
            fontSize: "1em",
            color: "#fff",
            fontFamily: "Montserrat",
            fontWeight: "900",
            paddingLeft: "5px"
        }))
        this.text.innerText = text;
        this.root.appendChild(this.text);
    }
    listen(action) {
        action(this.state);
    }
    parent() {
        return this.root;
    }
    setText(xx) {
        this.text.innerText = xx;
    }
    state() {
        return this.state;
    }


    style(styledata) {
        return __style(styledata);

    }



}
window.JulBox = JulBox;


class HoldButton {


    async mouseDown(e, istart, isdown) {
        if (isdown && isdown == "down")
            await new Promise(resolve => { setTimeout(() => { resolve() }, 300) })
        this.ispositive = !e.shiftKey;
        this.start = istart;
        if (!this.start) {
            if (isdown == "up")
                this.btn.dispatchEvent(this.event);
        }
    }
    get() {
        return this.time;
    }
    set(value) {
        this.time = value;
        this.text.textContent = value;
    }


    listen(action) {
        action(this.value);
    }
    constructor() {

        this.timeout = 100
        this.delay = 300

        this.event = new CustomEvent("onUp");
        this.start = false;
        this.btn = document.createElement("div");
        this.text = document.createElement("span");
        this.text.textContent = "0";
        this.btn.setAttribute("style", __style({
            cursor: "pointer",
            background: "#333",
            display: "flex",
            width: "20px",
            height: "auto",
            padding: "6px",
            justifyContent: "center",
            border: "20px",
            color: "#fff",
            borderRadius: "5px"


        }))
        this.text.setAttribute("style", __style({

            color: "#fff",
            fontSize: "0.6rem",
            fontFamily: "Montserrat",
            fontWeight: "900",
            borderRadius: "5px"


        }))
        this.time = parseInt(this.text.textContent);
        this.btn.appendChild(this.text);
        this.btn.addEventListener("mousedown", (e) => { this.mouseDown(e, true, "down") })
        this.btn.addEventListener("mouseup", (e) => { this.mouseDown(e, false, "up") })
        this.btn.addEventListener("mouseleave", (e) => { this.mouseDown(e, false) })
        this.btn.addEventListener("touchstart", (e) => { this.mouseDown(e, true, true) })
        this.btn.addEventListener("touchend", (e) => { this.mouseDown(e, false) })


        setInterval(() => {
            if (this.start) {
                this.ispositive ? this.time++ : this.time--
                this.text.textContent = this.time;
            }
        }, this.timeout)




    }
}
window.HoldButton = HoldButton;

async function isApplied(id) {
    return new Promise(async (resolve) => {
        await ps_CoreModal(async () => {
            const result = await ps_Bp([{
                _obj: "get",
                _target: [
                    {
                        _property: "smartObject"
                    },
                    {
                        _ref: "layer",
                        _id: id
                    }
                ]
            }], {}).catch(e => resolve(false));
            const so = result[0].smartObject;
            if (so) {
                resolve([so.filterFX.length > 0, so.filterFX]);
            } else {
                resolve([false, null]);
            }


        }, { commandName: "some tag" }).catch(e => resolve([false, null]));
    })
}
window.isApplied = isApplied;

const setFilter = (index, _filter) => {
    return {
        "_obj": "set",
        "_target": [
            {
                "_ref": "filterFX",
                "_index": index
            },
            {
                "_ref": "layer",
                "_enum": "ordinal",
                "_value": "targetEnum"
            }
        ],
        "filterFX": {
            _obj: "filterFX",
            filter: _filter
        }
    }
}

const activelayerID = () => {
    return app.activeDocument.activeLayers[0].id;
}
window.lyrID = activelayerID;

window.setFilter = setFilter;