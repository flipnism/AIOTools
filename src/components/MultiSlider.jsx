import { useEffect, useState, useRef } from "react";
import React from "react";
import { WC } from "../components/WC";

Number.prototype.maprange = function (in_min, in_max, out_min, out_max) {
  return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
export const MultiSlider = (props) => {
  const [lValue, setLValue] = useState();
  const [rValue, setRValue] = useState();
  const [first, setFirst] = useState(true);
  const [isLock, setIsLock] = useState(false);
  const [ranges, setRanges] = useState(0);
  const kiri = useRef();
  const kanan = useRef();

  function handleOnInput(e) {
    if (props.lock != undefined && props.lock == 1) {
      if (e.target == kiri.current)
        kanan.current.value = kiri.current.value + ranges;
      else kiri.current.value = kanan.current.value - ranges;
    } else {
      if (kiri.current.value > kanan.current.value) {
        kanan.current.value = kiri.current.value;
      }
    }
  }
  function handleOnChange(e) {
    setRanges(kanan.current.value - kiri.current.value);
  }

  useEffect(() => {
    setRanges(kanan.current.value - kiri.current.value);

  }, [props.lock]);
  useEffect(() => {
    if (first) {
      setFirst(false);
      return;
    }
    props.value({
      l: Math.floor(kiri.current.value.maprange(0, 100, 0, 4096)),
      r: Math.floor(kanan.current.value.maprange(0, 100, 0, 4096)),
    });
  }, [lValue, rValue]);

  return (
    <>
      <div className="group-vertical multi-slider-panel">
        <div className="group-vertical multi-slider">
          <WC
            onChange={(e) => {
              setLValue(e.target.value);
              handleOnChange();
            }}
            onInput={handleOnInput}
          >
            <sp-slider
              ref={kiri}
              data-id="msleft"
              value="0"
              min="0"
              max="100"
            />
          </WC>
          {
            <WC
              onChange={(e) => {
                setRValue(e.target.value);
                handleOnChange();
              }}
              onInput={handleOnInput}
            >
              <sp-slider
                ref={kanan}
                data-id="msright"
                value="25"
                min="0"
                max="100"
              />
            </WC>
          }
        </div>
      </div>
    </>
  );
};
