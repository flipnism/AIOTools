import React, { Component } from "react";
import {
    ApplyColor,
    createGuide,
    findLayer,
    showGuides,
    showHideShadows,
    photoshop,
    logme
} from "../modules/bp";
import { WC } from "../components/WC";
import ColorSort from "../utils/colorsort"
import { MultiSlider } from "./MultiSlider";
import { MCB } from "./MCB";
const colpattern = /(?:[0-9a-fA-F]{3}){1,2}/gm;
const COLOR = "COLOR";
const MODE = {
    COLORTOP: "COLORTOP",
    COLORMID: "COLORMID",
    COLORBOTTOM: "COLORBOTTOM",
};
export default class ColorTool extends Component {
    constructor(props) {
        super(props);

        this.events = [{ event: "make" }, { event: "select" }];
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleColorBoxClick = this.handleColorBoxClick.bind(this);
        this.deleteColor = this.deleteColor.bind(this);
        this.applyColors = this.applyColors.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
        this.fetchFillLayer = this.fetchFillLayer.bind(this);
        this.psEventNotifier = this.psEventNotifier.bind(this);
        this.getColors = this.getColors.bind(this);

        this.lockRef = React.createRef();
        this.textRef = React.createRef();
        this.colorsort = new ColorSort();

        this.state = {
            colors: this.getColors(),
            color_top: localStorage.getItem(MODE.COLORTOP),
            color_mid: localStorage.getItem(MODE.COLORMID),
            color_bottom: localStorage.getItem(MODE.COLORBOTTOM),
            slider_value: 0,
            triplecolor_slider: { l: 1024, r: 3072 },
            importColor: false,
            firsttime: true,
            cflayer: null,
            defaulttext: "",
            showguide: false
        };
    }
    getColors() {
        const cols = JSON.parse(localStorage.getItem(COLOR));
        if (!cols)
            return [];
        const color = this.colorsort.sort(cols);
        return color;
    }
    onSliderChange(e) {
        logme("onsliderChange");
        this.setState({ slider_value: e.target.value });
        this.applyColors();
    }
    fetchFillLayer() {
        findLayer("colorfill").then(async (result) => {
            logme(result[0].layerID);
            await ApplyColor(
                result[0].layerID,
                this.state.color_top,
                this.state.color_mid,
                this.state.color_bottom,
                this.state.triplecolor_slider.l,
                this.state.triplecolor_slider.r
            );
            await createGuide(
                this.props.docIDChange,
                this.state.triplecolor_slider.l,
                this.state.triplecolor_slider.r
            );
        });
    }
    async applyColors() {
        if (this.firsttime) {
            this.setState({ firsttime: false })
            return;
        }
        await ApplyColor(
            this.state.cflayer[0].layerID,
            this.state.color_top,
            this.state.color_mid,
            this.state.color_bottom,
            this.state.triplecolor_slider.l,
            this.state.triplecolor_slider.r
        );

        if (this.state.showguide)
            await createGuide(
                this.props.docIDChange,
                this.state.triplecolor_slider.l,
                this.state.triplecolor_slider.r
            );
    }
    deleteColor(color) {
        const newcolor = this.state.colors;
        const index = newcolor.findIndex((c) => c == color);
        newcolor.splice(index, 1);
        localStorage.setItem(COLOR, JSON.stringify(newcolor));
        this.setState({ colors: newcolor });
    }
    async handleColorBoxClick(e, value) {
        const isAlt = e.altKey;
        switch (e.type) {
            case "contextmenu":
                e.stopPropagation();
                this.deleteColor(value);
                break;
            case "click":
                if (e.shiftKey) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.setState({ color_mid: value }, () => {
                        this.applyColors();
                    });
                    localStorage.setItem(MODE.COLORMID, value);
                } else {
                    this.setState(
                        isAlt ? { color_bottom: value } : { color_top: value },
                        () => {
                            this.applyColors();
                        }
                    );
                    localStorage.setItem(isAlt ? MODE.COLORBOTTOM : MODE.COLORTOP, value);
                }

                break;
        }
    }
    handleButtonClick(e) {
        if (!this.state.importColor) {
            this.setState({ importColor: true });

            return;
        }

        let curcolors = this.state.colors;
        if (curcolors == null) curcolors = [];

        const allcolors = this.state.coltextinput.match(colpattern);
        if (!allcolors) return;
        curcolors.push(...allcolors);
        const trimallcolor = Array.from(
            new Set(curcolors.map((e) => e.toLowerCase()))
        );

        localStorage.setItem(COLOR, JSON.stringify(trimallcolor));
        this.setState({ colors: trimallcolor, importColor: false });
        this.textRef.current.value = "";
    }

    psEventNotifier(e, d) {
        if (e == "select" && !d._isCommand && d._target[0]._ref == "document") {
            findLayer("colorfill").then((result) => {
                this.setState({ cflayer: result })


            });
        }
    }
    componentDidUpdate(prevProps, prevState) {
    }
    componentDidMount() {
        photoshop.action.addNotificationListener(this.events, this.psEventNotifier);


    }

    componentWillUnmount() {
        photoshop.action.removeNotificationListener(this.events, this.psEventNotifier);
    }
    render() {
        return (
            <div className="col-main" style={{ padding: "20px" }}>
                <div className="group-horizontal">
                    <sp-textarea
                        ref={this.textRef}
                        style={{ display: this.state.importColor ? "block" : "none" }}
                        class="col-text"
                        onInput={(e) => {
                            this.setState({ coltextinput: e.target.value });
                        }}
                    ></sp-textarea>
                    <sp-action-button
                        class="btn-importcolor"
                        onClick={this.handleButtonClick}
                    >
                        {this.state.importColor ? "Save" : "Import Color"}
                    </sp-action-button>
                </div>

                {this.state.cflayer != null && this.state.cflayer.length > 0 ? (
                    <>
                        <div
                            className="group-horizontal"
                            style={{ justifyContent: "space-between" }}
                        >
                            <MCB
                                onInput={(e) => {
                                    this.setState({ showguide: e.target.checked });
                                    showGuides(
                                        e.target.checked,
                                        this.state.triplecolor_slider,
                                        this.props.docIDChange
                                    );

                                }}
                                value="show guide"

                            />

                            <MCB
                                onInput={async (e) => {
                                    await showHideShadows(e.target.checked);
                                }}
                                value="show style"
                            />

                            <MCB onChange={(e) => {
                                this.setState({ lockslider: e.target.checked ? 1 : 0 });
                            }} value="lock slider" />

                        </div>
                        <MultiSlider
                            lock={this.state.lockslider}
                            value={(e) => {
                                this.setState(
                                    { triplecolor_slider: { l: e.l, r: e.r } },
                                    () => {

                                        this.applyColors();
                                    }
                                );
                            }}
                        />
                        <div className="col-panel">
                            {this.state.colors &&
                                this.state.colors.map((value, index) => {
                                    return (
                                        <div
                                            className="col-box"
                                            onClick={(e) => this.handleColorBoxClick(e, value)}
                                            onContextMenu={(e) => this.handleColorBoxClick(e, value)}
                                            key={index}
                                            style={{ background: `#${value}` }}
                                        ></div>
                                    );
                                })}
                        </div>
                        <div className="group-vertical preview-box">
                            <div
                                className="preview-box-top"
                                style={{ background: `#${this.state.color_top}` }}
                            >left click</div>
                            <div
                                className="preview-box-mid"
                                style={{ background: `#${this.state.color_mid}` }}
                            >shift click</div>
                            <div
                                className="preview-box-bottom"
                                style={{ background: `#${this.state.color_bottom}` }}
                            >alt click</div>
                        </div>
                        <div className="group-horizontal w100 hide">
                            <WC onChange={this.onSliderChange} className="col-slider w100">
                                <sp-slider class="col-slider w100" value="0" min="-50" max="50">
                                    <sp-label slot="label">Vertical Mid Pos</sp-label>
                                </sp-slider>
                            </WC>
                        </div>
                    </>
                ) : (
                    <div className="group-horizontal fetch">
                        <div onClick={() => {
                            findLayer("colorfill").then((result) => {
                                this.setState({ cflayer: result })


                            });
                        }}>ColorFill Not Found</div>
                    </div>
                )}
            </div>
        );
    }
}
