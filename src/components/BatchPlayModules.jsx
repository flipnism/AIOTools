import React, { useEffect, useRef, useState } from "react";
import { TOKEN } from "../modules/Token";
import { executeBPFile, delay, logme } from "../modules/bp";
import Sval from "sval";
const BatchPlayModules = (props) => {
    const { askForToken, token, sidebarshow, doLoad, ...rest } = props;
    const elRef = useRef(null);

    const interpreter = new Sval({
        ecmaVer: 9,
        sandBox: false,
    });
    const [bpfile, setBpfile] = useState({ files: [] });
    const [tokenentry, setTokenentry] = useState(null);
    const handleEvent = (evt) => {
        const propName = `on${evt.type[0].toUpperCase()}${evt.type.substr(1)}`;
        if (rest[propName]) {
            rest[propName].call(evt.target, evt);
        }
    }

    function handleToken() {
        token.getToken(TOKEN.BP).then(
            async (result) => {
                setTokenentry(result);
                await result.getEntries().then(
                    (entry) => {
                        const bp_file = entry.filter((f) => { return f.isFile; });

                        setBpfile({ files: bp_file });
                    }
                )
            }
        ).catch((e) => {
            logme(e);
            askForToken();
        })
    }

    async function onBPClick(f) {

        doLoad(true);
        if (tokenentry) {
            new Promise(async (resolve) => {
                const getscriptfile = await tokenentry.getEntry(f.name);
                const readfile = await getscriptfile.read();
                await executeBPFile(interpreter, readfile).then(() => { resolve("done") })

            }).then(() => {
                doLoad(false);
            })



        }

    }

    useEffect(() => {
        handleToken();
        const el = elRef.current;
        const eventProps = Object.entries(rest).filter(([k, v]) => k.startsWith("on"));
        eventProps.forEach(([k, v]) => el.addEventListener(k.substring(0, 2).toLowerCase(), handleEvent));

        return () => {
            const el = elRef.current;
            const eventProps = Object.entries(rest).filter(([k, v]) => k.startsWith("on"));
            eventProps.forEach(([k, v]) => el.removeEventListener(k.substring(0, 2).toLowerCase(), handleEvent));
        }
    }, []);
    return (

        <div ref={elRef} {...rest} className="sidebar">
            <div className="sidebar-btn-group">

                {bpfile.files.map((f, i) => { return <div className="bp-button" key={i} onClick={() => onBPClick(f)}>{f.name.replace(/\.[^/.]+$/, "").toUpperCase()}</div> })}

            </div>
        </div>

    )

}
export default BatchPlayModules;