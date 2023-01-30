const params = `<!DOCTYPE optics>
<optics>
 <layer filterEnabled="1" name="Original" maskEnabled="1">
  <mask type="Alpha" enabled="1"/>
 </layer>
 <layer filterEnabled="1" name="Frost" maskEnabled="1">
  <effect preset="Frost 5" filter="Frost">
   <parameter id="input"></parameter>
   <parameter id="view">Output</parameter>
   <parameter id="detail-group">true</parameter>
   <parameter id="smoothing">2</parameter>
   <parameter id="mist-group">true</parameter>
   <parameter id="mist.blendMode">Screen</parameter>
   <parameter id="mist.brightness">50</parameter>
   <parameter id="mist.blur">(60,60)</parameter>
   <parameter id="mist.color">#ffffff</parameter>
   <parameter id="color-group">true</parameter>
   <parameter id="cc.hue">0</parameter>
   <parameter id="cc.saturation">0</parameter>
   <parameter id="cc.brightness">0</parameter>
   <parameter id="cc.contrast">0</parameter>
   <parameter id="cc.gamma">0</parameter>
   <parameter id="cc.temperature">0</parameter>
   <parameter id="cc.cyanMagenta">0</parameter>
   <parameter id="cc.red">0</parameter>
   <parameter id="cc.green">0</parameter>
   <parameter id="cc.blue">0</parameter>
   <parameter id="matte-group">true</parameter>
   <parameter id="matte.position">100</parameter>
   <parameter id="matte.range">80</parameter>
   <parameter id="matte.blur">0</parameter>
  </effect>
 </layer>
</optics>
`;

const layer = app.activeDocument.activeLayers[0];

(async () => {


   if (layer) {
      await BP([{
         "_obj": "9D94A847-5C51-4751-947C-36E2076FD77C",
         "$parM": params
      }], {})
   }

})()