import React, { useState, useEffect, useRef } from "react";
import { ThumbnailTemplate } from "../components/ThumbnailTemplate";
import YesNoDialog from "../components/YesNoDialog";
import { TextTool } from "../components/TextTool";
import { TOKEN, Token } from "../modules/Token";
import {
  insertTemplate,
  setText,
  selectText,
  createNewDoc,
  showThumbnailTag,
  logme,
  getTagLayers,
  findLayer,
  delay,
  getLayers,
  app,
  getMaxName,
  doSaveDocument,
  collapseAll,
} from "../modules/bp";
import BatchPlayModules from "../components/BatchPlayModules";
import TabMenu from "../components/TabMenu";
import LoadingGIF from "../components/LoadingGIF";
import { wrapWc } from "wc-react";
import SmartObjects from "../components/SmartObjects";
import useWebSocket from "react-use-websocket";
import ColorTool from "../components/ColorTool";
import { Textures } from "../components/Textures";
import { OnlineImages } from "../components/OnlineImages";
import { ContextMenu, MENU, SECONDMENU } from "../components/ContextMenu";
import { appendTexturesFile, createRedbox, normalizeEmblem } from "../utils/layer";
import { MCB } from "../components/MCB";
import { ButtonList, btnLists } from "../components/ButtonList";
import { LogPanel } from "./LogPanel";

const SpMenu = wrapWc("sp-menu");
const events = [{ event: "make" }, { event: "select" }];
const photoshop = require("photoshop");
const sticky = Symbol()
class JulEmmiter extends EventTarget {
  constructor() {
    super()
    this.listeners = {
      '*': []
    }
    // l = listener, c = callback, e = event
    this[sticky] = (l, c, e) => {
      // dispatch for same "callback" listed (k)
      l in this.listeners ? this.listeners[l].forEach(k => k === c ? k(e.detail) : null) : null
    }
  }
  on(e, cb, once = false) {
    // store one-by-one registered listeners
    !this.listeners[e] ? this.listeners[e] = [cb] : this.listeners[e].push(cb);
    // check `.once()` ... callback `CustomEvent`
    once ? this.addEventListener(e, this[sticky].bind(this, e, cb), { once: true }) : this.addEventListener(e, this[sticky].bind(this, e, cb))
  }
  off(e, Fn = false) {
    if (this.listeners[e]) {
      // remove listener (include ".once()")
      let removeListener = target => {
        this.removeEventListener(e, target)
      }
      // use `.filter()` to remove expecific event(s) associated to this callback
      const filter = () => {
        this.listeners[e] = this.listeners[e].filter(val => val === Fn ? removeListener(val) : val);
        // check number of listeners for this target ... remove target if empty
        this.listeners[e].length === 0 ? e !== '*' ? delete this.listeners[e] : null : null
      }
      // use `while()` to iterate all listeners for this target
      const iterate = () => {
        let len = this.listeners[e].length;
        while (len--) {
          removeListener(this.listeners[e][len])
        }
        // remove all listeners references (callbacks) for this target (by target object)
        e !== '*' ? delete this.listeners[e] : this.listeners[e] = []
      }
      Fn && typeof Fn === 'function' ? filter() : iterate()
    }
  }
  emit(e, d) {
    this.listeners['*'].length > 0 ? this.dispatchEvent(new CustomEvent('*', { detail: d })) : null;
    this.dispatchEvent(new CustomEvent(e, { detail: d }))
  }
  once(e, cb) {
    this.on(e, cb, true)
  }
}

export const _Emitter = new JulEmmiter()
window._Emitter = _Emitter;
export const MainPanel = () => {
  const initValue = {
    context: null,
    tag: null,
    show: false,
    title: "None",
    content: "None",
    okbutton: "OK",
    cancelbutton: "Cancel",
    callback: null,
  };

  const socketUrl = "ws://localhost:7898/Server";

  const {
    sendJsonMessage,
    getWebSocket,
    lastJsonMessage,
  } = useWebSocket(socketUrl, {
    onOpen: () => {

      logme("socket opened")



    },
    shouldReconnect: (closeEvent) => true,
  });

  const token = new Token();
  const [dialogState, setDialogState] = useState(initValue);
  const [template, setTemplate] = useState();
  const [showLoading, setShowLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(-1);
  const [tagLayers, setTagLayers] = useState([]);
  const [currentDocID, setCurrentDocID] = useState(0);
  const [showMenu, setShowMenu] = useState(true);

  const tagRef = useRef(null);
  const textRef = useRef(null);


  function updateLoading(value) {
    setShowLoading(value);
  };
  window.updateLoading = updateLoading;
  window.sockSendMessage = sendJsonMessage;

  window.roottoken = token;

  function appendTagLayer() {
    setTagLayers([{ name: "None", id: -20 }, ...getTagLayers()]);
  }

  async function onPSNotifier(e, d) {
    if (e == "select" && !d._isCommand && d._target[0]._ref == "layer") {
      _Emitter.emit("jul:layerselect", d);
    }
    if (e == "select" && !d._isCommand && d._target[0]._ref == "document" || e == "create-text") {

      try {
        appendTagLayer();
        setCurrentDocID(d.documentID);


      } catch (error) {
        logme(error);
      }
    }
  }

  function openYesNoDialog(title, text, yesno, action) {
    setDialogState({
      tag: null,
      show: true,
      title: title,
      content: text,
      okbutton: yesno.yes,
      cancelbutton: yesno.no,
      callback: action,
    });
  }
  window.openYesNoDialog = openYesNoDialog;
  useEffect(() => {
    let selIndex = 0;
    logme(tagLayers.length);
    if (tagLayers.length > 0) {
      tagLayers.forEach((l, index) => {
        if (l.visible) {
          selIndex = index;
        }
      })
      if (tagRef.current != null)
        tagRef.current.selectedIndex = selIndex;
    }
  }, [tagLayers])

  const [tokenGGP, setTokenGGP] = useState(null);
  function getTokenGGP() {
    token.getToken(TOKEN.GGP).then((result) => {
      setTokenGGP(result);
    })
  }
  useEffect(() => {
    getTokenGGP();

    photoshop.action.addNotificationListener(events, onPSNotifier);
    return () => {
      photoshop.action.removeNotificationListener(events, onPSNotifier);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousedown", mouseDown);
    return () => {
      window.removeEventListener("mousedown", mouseDown);
    }

  }, [activeAccordion])
  const [mousepos, setMousepos] = useState([-1, -1]);
  const cmRef = useRef(null);
  function onRightClickMenu(e) {
    if (e.shiftKey) {
      return;
    }
    setShowMenu(true);

    if (e.pageY > 380)
      setMousepos([380, 0])
    else
      setMousepos([e.pageY, e.pageX])
    if (cmRef != null)
      cmRef.current.doClick();
  }
  useEffect(() => {
    window.addEventListener("contextmenu", onRightClickMenu);
  }, [])
  function mouseDown(e) {

    if (e.shiftKey && e.button == 2) {


      let newacc = activeAccordion;
      newacc = newacc + 1;
      if (newacc > accordiondata.length)
        newacc = 0;
      setActiveAccordion(newacc);
    }

  }

  async function Save() {
    const layers = await getLayers();
    let channel = null;
    for (const layer of layers) {
      const name = layer.name;
      switch (true) {
        case name.includes("refly"):
          channel = "refly"
          break;
        case name.includes("naufal"):
          channel = "naufal"
          break;
        case name.includes("ogie"):
          channel = "ogie"
          break;
        case name.includes("zoom"):
          channel = "zoom"
          break;
        case name.includes("inang"):
          channel = "inang"
          break;
      }
    }


    const savepathtoken = await token.getToken(channel);
    if (app.activeDocument.title.includes("Untitled")) {
      let num = 0;
      let listfiles = getMaxName(await savepathtoken.getEntries());
      if (listfiles == -Infinity)
        listfiles = 0;
      num = listfiles + 1;
      const message = await doSaveDocument(
        savepathtoken,
        num,
        channel);
      logme("msg", message)

      sendJsonMessage({
        type: "filepath",
        channel: channel,
        fromserver: false,
        data: message,
        textdata: vidId
      })
    } else if (app.activeDocument.title.includes(".psd")) {
      const message = await doSaveDocument(
        savepathtoken,
        app.activeDocument.title.replace(".psd", ""),
        channel);
      logme("msg", message)
      sendJsonMessage({
        type: "filepath",
        channel: channel,
        fromserver: false,
        data: message,
        textdata: vidId
      })
    }
  }


  async function appendGigalPixelImages(img) {
    logme(tokenGGP);
    const fileentry = await tokenGGP.getEntry(img);
    await appendTexturesFile(fileentry, img).then(() => setGigapixelFile(null))

  }

  async function HOTKEYAPI(data) {
    switch (data) {
      case "backward":
        setShowMenu(false);
        cmRef.current.doHide();
        let pos = activeAccordion - 1;
        if (pos < 0) {
          pos = accordiondata.length - 1
        }
        setActiveAccordion(pos);
        break;
      case "forward":
        setShowMenu(false);
        cmRef.current.doHide();
        let pos_f = activeAccordion + 1;
        if (pos_f > accordiondata.length - 1) {
          pos_f = 0
        }
        setActiveAccordion(pos_f);
        break;
      case "save":
        await Save();
        break;
      case "newdoc":
        await createNewDoc()
        break;
      case "whatsapp":
        break;
      case "switchmenu":
        if (showMenu) {
          setShowMenu(false);
          cmRef.current.doHide();
          setActiveAccordion(activeAccordion);
        } else {
          setShowMenu(true);
          cmRef.current.doClick();
        }

        break;
      default: break;
    }



  }


  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.fromserver) {
        const jsonevent = new CustomEvent("SOCKETMESSAGE", { detail: lastJsonMessage }, false);
        document.dispatchEvent(jsonevent);
        switch (lastJsonMessage.type) {
          case "sendtextclipboard":
            if (textRef != null)
              textRef.current.updateText(lastJsonMessage.data)
            break;
          case "upscaledfile":
            const namafile = lastJsonMessage.data.split("\\").pop();
            logme("upscale", namafile);
            appendGigalPixelImages(namafile)
            break;
          case "hotkey":
            try {
              HOTKEYAPI(lastJsonMessage.data);
            } catch (error) {
              console.error(error)
            }
            break;

        }

        updateLoading(false);
      }
    }

  },
    [lastJsonMessage])
  async function handleButtonClick(i, alltext) {
    switch (i) {
      case "create":

        setShowLoading(true);
        await delay(300);
        await insertTemplate(template);
        const emblem = alltext.filter((a) => { return a.tag == "@" })
        const alt = alltext.filter((a) => { return a.tag == "$" })
        const normal = alltext.filter((a) => { return a.tag == "" })
        const textnormal = normal.map((t) => { return t.text });
        const normal_findlayer = await findLayer("dcsmstext");
        await setText(normal_findlayer[0].layerID, textnormal)
        const textalt = alt.map((t) => { return t.text });
        if (textalt.length > 0) {
          const alt_findlayer = await findLayer("dcsmstext_alt");
          await setText(alt_findlayer[0].layerID, textalt)
        }
        appendTagLayer();

        await collapseAll();
        setShowLoading(false);
        const texemblem = emblem.map((t) => { return t.text });
        if (texemblem.length > 0) {
          setShowLoading(true);
          for (const texte of texemblem) {
            sendJsonMessage({
              type: "createemblem",
              fromserver: false,
              data: "http://fucku.com",
              textdata: texte
            })
          }

        }


        break;
      case "explode":

        break;
      case "box me":
        await createRedbox();
        break;
      case "tag":
        appendTagLayer();
        break;
      default:
        break;
    }
    //setDialogState({ show: true, title: "title : " + i, content: "content for : " + i });
  }
  function handleAskForToken(tag, key) {
    setDialogState({
      tag: tag,
      show: true,
      title: "ROOT FOLDER",
      content: `Unable to retrieve root folder for ${key.toUpperCase()} proceed to fetch em all... `,
      okbutton: "Ok",
      cancelbutton: "Cancel",
    });
  }

  function handleShowYesNoDialog(title, content) {
    setDialogState({
      tag: null,
      show: true,
      title: title,
      content: content,
      okbutton: "Ok",
      cancelbutton: "Cancel",
    });
  }

  async function handleDialogButtonClick(res) {
    if (dialogState.callback != null) {
      dialogState.callback(res);
    }
    if (!res) {
      setDialogState({ show: false });
      return null;
    }
    try {
      switch (dialogState.tag) {
        case "sidebar":
          await token.getFolder(TOKEN.BP);
          break;
        case "thumbnail-template":
          await token.getFolder(TOKEN.TEMPLATE);
          break;
        case "smartobject":
          await token.getFolder(TOKEN.BAHAN);
          break;
        case "testsysmlink":
          await token.getFolder("Test Init Folder");
          break;
        default:
          break;
      }

      setDialogState({ show: false });
    } catch (error) {
      logme(error);
    }
  }
  const [logtext, setLogtext] = useState("");
  const [vidId, setVidId] = useState("");
  const accordiondata = [
    {

      title: "Text Tools",
      content: (
        <>
          {/* video id */}
          <sp-textfield size="s" class="videoid" onInput={(v) => {
            setVidId(v.target.value);
          }}></sp-textfield>
          <ThumbnailTemplate
            token={token}
            askForToken={() =>
              handleAskForToken("thumbnail-template", "Thumbnail Template")
            }
            onTemplateSelectionChange={(e) => setTemplate(e)}
          />
          <TextTool
            sendJsonMessage={sendJsonMessage}
            ref={textRef}
            BindOnClick={(i, text) => handleButtonClick(i, text)} />

          {tagLayers.length > 1 && (
            <div className="taglayer">
              <sp-picker size="s" ref={tagRef} class="strech w100">
                <SpMenu
                  slot="options"
                  onChange={(e) => {
                    showThumbnailTag(tagLayers, e.target.value)

                  }}
                >
                  {tagLayers.map((layer, index) => {
                    return (
                      <sp-menu-item key={layer.id} value={layer.name}>
                        {layer.name}
                      </sp-menu-item>
                    );
                  })}
                </SpMenu>
              </sp-picker>
            </div>
          )}

        </>
      ),
    }, /* {
 
      title: "Layer Effects",
      content: (<TabMenu
        style={{ width: "100%", height: "100%" }}
        clickTabBtn={async (tag) => {
          switch (tag) {
            case "save":
              await Save();
              break;
            case "newdoc":
              await createNewDoc();
              break;

          }
        }}
      ><BatchPlayModules
          doLoad={updateLoading}
          token={token}
          askForToken={() => handleAskForToken("sidebar", "Batchplay Template")}
        />
        <div className="batchplay-panel"></div>
      </TabMenu>)
    }, */
    {

      title: "Colorizer",
      content: <ColorTool docIDChange={currentDocID} />,
    },
    {

      title: "SmartObject Bank",
      content: (
        <SmartObjects
          token={token}

          serverListener={lastJsonMessage}
          doJsonMessage={sendJsonMessage}
          askForToken={() =>
            handleAskForToken("smartobject", "SmartObjects Library")
          }
        />
      ),
    },
    {

      title: "Stock Textures",
      content: (
        <Textures
          token={token}
          askForToken={() =>
            handleAskForToken("testsysmlink", "Symlink Folder")
          }
        />
      ),
    },
    {

      title: "Online Images",
      content: <OnlineImages token={token} />,
    },
    {

      title: "Whatsapp",
      content: <LogPanel />,
    }
  ];
  window.showmenu = setShowMenu;

  const [menuPanelVisibility, setMenuPanelVisibility] = useState();
  return (
    <>
      <div className="suredialog">
        <div className="suredialogfooter"></div>
      </div>
      <YesNoDialog
        show={dialogState.show}
        title={dialogState.title}
        content={dialogState.content}
        OkButton={dialogState.okbutton}
        CancelButton={dialogState.cancelbutton}
        OnButtonClick={(res) => handleDialogButtonClick(res)}
      />
      <ContextMenu
        ref={cmRef}
        mousePos={mousepos}
        onMenuClicked={async (which) => {
          setShowMenu(false);
          if (which)
            setActiveAccordion(MENU.findIndex(e => e === which));
        }}
        onSecondMenuClicked={async (e) => {
          switch (e.target.textContent) {
            case SECONDMENU[0]:
              await Save();
              break;
            case SECONDMENU[1]:
              await createNewDoc();
              appendTagLayer();
              break;
          }

        }}
      >
        <TabMenu
          clickTabBtn={async (tag) => {
            switch (tag) {
              case "save":
                await Save();
                break;
              case "newdoc":
                await createNewDoc();
                break;

            }
          }}
        ><BatchPlayModules
            doLoad={updateLoading}
            token={token}
            onBPButtonClicked={(e) => {

            }}
            askForToken={() => handleAskForToken("sidebar", "Batchplay Template")}
          />
          <div className="batchplay-panel"></div>
        </TabMenu>
      </ContextMenu>
      <LoadingGIF show={showLoading} />
      <div
        className="app"
        style={{ display: dialogState.show ? "none" : "block" }}
      >
        <div className="maintab" style={{ visibility: showMenu ? "hidden" : "visible" }}>
          <div className="group-vertical main-content" >
            <div className="accordion">
              {accordiondata.map((data, index) => {
                return (
                  <div key={index}>
                    <div key={index} className="accordion-item">
                      <div
                        className="accordion-title"
                        style={{
                          color:
                            activeAccordion == index ? "#fd0" : "#444",
                        }}
                        onClick={() => {
                          // if (activeAccordion == index)
                          //   setActiveAccordion(-1);
                          // else 
                          setActiveAccordion(index);
                        }}
                      >
                        {data.title}
                      </div>
                      <div
                        onContextMenu={(e) => {
                          e.stopPropagation();
                        }}
                        className={
                          activeAccordion == index
                            ? "accordion-content"
                            : "accordion-content hide"
                        }
                      >
                        {data.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <ButtonList
        onButtonItemMainClick={async (tag) => {
          switch (tag) {
            case "save":
              await Save();
              break;
            case "newdoc":
              await createNewDoc();
              break;
            case "collapse":
              await collapseAll();
              break;

          }
        }}
        onButtonItemClick={(which) => {
          if (which == "☢") {
            setShowMenu(true);
            cmRef.current.doClick();
            return;
          }
          setShowMenu(false);
          cmRef.current.doHide();
          if (which)
            setActiveAccordion(btnLists.findIndex(e => e === which));
        }}
      />
    </>
  );
};
