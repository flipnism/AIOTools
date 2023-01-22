import React, { useEffect, useState } from 'react'
import "../sass/onlineimages.sass"

import { logme } from '../modules/bp'
import { chunkify } from '../utils/util';
import { TOKEN } from '../modules/Token';
import { appendTexturesFile } from '../utils/layer';
import md5 from '../utils/md5';

export const OnlineImages = (props) => {
    const stockurl = (keyword, page) => `https://app.stocksolo.com/search?search=${encodeURI(keyword)}&page=${page}`
    //const stockurl = (what) => 'http://localhost:3000/showimages';
    const [jsonData, setJsonData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentpage, setCurrentpage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [downloadedFolder, setDownloadedFolder] = useState(null);
    const [fileData, setFileData] = useState();
    const [disable, setDisable] = useState(false);
    function doFetch() {
        doLoad(true);
        fetch(stockurl(keyword, currentpage))
            .then(r => { if (r.ok) return r.json() })
            .then(d => {

                let alldata = d.items.filter((data) => { return data.additional != null })
                alldata = chunkify(d.items, 2, true);
                setJsonData(alldata);
                doLoad(false);
            })
    }
    function handleNextPage(e) {

        setCurrentpage(currentpage + 1);

    }
    function doLoad(isload) {
        setDisable(isload);
        setLoading(isload);
    }
    function handleOnKeydown(e) {

        if (e.key == "Enter") {
            setCurrentpage(1);
            setKeyword(e.target.value);
        }
    }

    useEffect(() => {
        (async () => {


            if (downloadedFolder == null || fileData == null)
                return;
            const urldata = fileData.url;
            const filename = fileData.filename
            const downloadedfile = await downloadedFolder.getEntry(filename).catch((e) => { logme(e) });
            logme(downloadedfile == null, "dl is null");
            if (!downloadedfile) {
                fetch(urldata)
                    .then(result => {
                        if (result.ok)
                            return result.arrayBuffer()
                    })
                    .then(async (buffer) => {
                        try {


                            const newjpeg = await downloadedFolder.createFile(filename, { overwrite: true });
                            await newjpeg.write(buffer, { format: require('uxp').storage.formats.binary })
                                .then(async (resp) => {
                                    logme(resp);
                                    await appendTexturesFile(newjpeg);
                                    doLoad(false);
                                })
                                .catch(e => { logme(e); doLoad(false) })




                            doLoad(false);
                        } catch (error) {
                            logme(error);
                        }
                    })
                    .catch(e => {
                        logme(e);
                        doLoad(false);
                    })
            } else {
                await appendTexturesFile(downloadedfile);
                doLoad(false);
            }
        })()

    }, [downloadedFolder])
    async function handleOnClick(data) {
        doLoad(true);
        const urldata = data.fullResolution.url;
        const filename = `${md5(urldata)}.jpg`
        setFileData({ url: urldata, filename: filename });
        setDownloadedFolder(await props.token.getToken(TOKEN.DOWNLOAD))
    }

    useEffect(() => {
        if (keyword != null && keyword !== "") {
            doFetch();
        }
    }, [keyword, currentpage])


    return (
        <div className="online-image-panel" >
            <div className="online-fetch" style={{ display: loading ? "block" : "none" }}>Fetch</div>
            <div className="group-horizontal" style={{ marginBottom: "15px" }}>


                {disable ? <><sp-textfield
                    disabled
                    onKeyDown={handleOnKeydown}
                    type="search" size="s" class="search"></sp-textfield>
                    <sp-action-button size="s" disabled onClick={handleNextPage}>{'>'}</sp-action-button>
                </> :
                    <>
                        <sp-textfield
                            onKeyDown={handleOnKeydown}
                            type="search" size="s" class="search"></sp-textfield> <sp-action-button size="s" onClick={handleNextPage}>{'>'}</sp-action-button></>}

            </div>
            <div className="group-vertical" style={{ height: "400px" }}>


                <div className="online-image-content" style={{ display: loading ? "none" : "flex" }}>
                    <div className="online-image-card" >
                        {jsonData != null && jsonData[0].map((data, index) => {
                            if (data.additional == null) {
                                return (<img key={index} onClick={() => handleOnClick(data)} src={data.preview.url} />)
                            }
                        })}
                    </div><div className="online-image-card" >
                        {jsonData != null && jsonData[1].map((data, index) => {
                            if (data.additional == null) {
                                return <img key={index} onClick={() => handleOnClick(data)} src={data.preview.url} />
                            }
                        })}
                    </div>
                </div>
            </div>
        </div >
    )

}
