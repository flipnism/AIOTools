import React, { useState, useEffect } from "react";
import { wrapWc } from 'wc-react';
import { TOKEN } from "../modules/Token";
import "../sass/textures.sass"
import { logme } from "../modules/bp";
import { chunkify } from "../utils/util";
import { appendTexturesFile } from "../utils/layer";
const SpMenu = wrapWc("sp-menu");


/* 
category:""
files:{path:"",thumbnail:""}
*/
export const Textures = (props) => {

  const [selected, setSelected] = useState();
  const [textureToken, setTextureToken] = useState();
  const [textureDir, setTextureDir] = useState();
  const [hover, setHover] = useState([]);
  const [textureCategories, setTextureCategories] = useState([]);
  const [imagesList, setImagesList] = useState([]);
  const main_url = "http://localhost:3000/texture";
  const MODE = { APPLY: 0, FAV: 1 }


  function fetchCategory(category) {
    fetch(`${main_url}/cat/${category}`)
      .then(response => {
        if (response.ok)
          return response.json();
      })
      .then(data => {
        const newdata = chunkify(data, 2, true);
        setImagesList(newdata);
      })
      .catch(e => logme("fetchCategory", e))
  }

  function handleSelection(e) {
    setSelected(e.target.selectedIndex);
  }
  function updateFavorite(chunk, index, img) {
    fetch(`${main_url}/fav/${img.name}/${img.favorite}`)
      .then(response => {
        logme(response);
        if (response.ok)
          return response.json();
      })
      .then(data => {
        const newImagesList = [...imagesList];
        newImagesList[chunk][index].favorite = !img.favorite;

        setImagesList(newImagesList);
      })
      .catch(e => logme("fetchCategory", e))
  }
  function updateHover(index, isHover) {
    let newHover = hover;
    newHover[index] = isHover;
    setHover([...newHover]);

  }
  /* req.params.fav
    img 
      name: string
      category: string
      favorite: bool
      mode: MODE
  */
  function handleClick(chunk, index, img, mode) {
    if (mode == MODE.APPLY) {
      textureToken.getEntry(`${img.category}/${img.name}`).then(async (entry) => {

        await appendTexturesFile(entry);
      });



    } else {
      updateFavorite(chunk, index, img)
    }
  }

  useEffect(() => {
    fetchCategory(textureCategories[selected]);
  }, [selected])

  useEffect(() => {
    props.token.getToken(TOKEN.TEXTURE).then(async (result) => {
      setTextureToken(result);
      setTextureDir(result.nativePath);
    })

    fetch("http://localhost:3000/texture/all")
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        setTextureCategories(data);
        setSelected(0);
      })
      .catch(err => logme(err))
  }, [])
  function debugTexturesFiles() {
    props.token.getToken(TOKEN.TEXTURE).then(async (result) => {
      const entry = await result.getEntries();
      for (const entr of entry) {
        if (!entr.isFolder && entr.name != ".thumbnail")
          return;
        await entr.getEntries().then((r) => {
          console.log(r);
        }).catch(e => logme(e));

      }
    })
  }


  return (
    <>
      <div className="texture-panel">
        <div className="group-horizontal">
          <sp-picker size="s" class="stretch w100" >
            <SpMenu slot="options"
              selectedIndex={selected}
              onChange={handleSelection}>
              {textureCategories.map((texture, idx) => {
                return <sp-menu-item key={idx} value={texture}>{texture}</sp-menu-item>
              })}
            </SpMenu>

          </sp-picker>
        </div>
        <div className="group-horizontal textures-content">
          <div className="textures-col">
            {imagesList[0] && imagesList[0].map((img, index) => {
              const filename = img.name;
              const cat = img.category;
              const isFav = img.favorite;
              const urlike = `file:\\\\${textureDir}\\\.thumbnail\\${cat == "Vector" ? filename.replace("eps", "jpg") : filename}`;
              return (<div key={index} onMouseEnter={() => updateHover(index, true)} onMouseLeave={() => updateHover(index, false)} className="img-card">
                <div style={{ display: hover[index] ? "flex" : "none" }} className="img-btn-panel">
                  <div className="btn-apply" onClick={() => handleClick(0, index, img, MODE.APPLY)}></div>
                  <div className={isFav ? "btn-favd" : "btn-fav"} onClick={() => handleClick(0, index, img, MODE.FAV)}></div>
                </div>
                <img className="img-thumb" key={index} src={urlike} />
              </div>)
            })}
          </div>
          <div className="textures-col">
            {imagesList[1] && imagesList[1].map((img, index) => {
              const filename = img.name;
              const cat = img.category;
              const isFav = img.favorite;
              const urlike = `file:\\\\${textureDir}\\\.thumbnail\\${cat == "Vector" ? filename.replace("eps", "jpg") : filename}`;
              return (<div key={index} onMouseEnter={() => updateHover(index, true)} onMouseLeave={() => updateHover(index, false)} className="img-card">
                <div style={{ display: hover[index] ? "flex" : "none" }} className="img-btn-panel">
                  <div className="btn-apply" onClick={() => handleClick(1, index, img, MODE.APPLY)}></div>
                  <div className={isFav ? "btn-favd" : "btn-fav"} onClick={() => handleClick(1, index, img, MODE.FAV)}></div>
                </div>
                <img className="img-thumb" key={index} src={urlike} />
              </div>)
            })}
          </div>

        </div>
      </div>
    </>
  );

}

