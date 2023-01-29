const doc = app.activeDocument;
function GetAllLayer() {
    const selectedLayer = doc.activeLayers[0];
    if (!selectedLayer) return;
    if (selectedLayer.isBackgroundLayer) return;
    const layers = doc.layers.filter((a) => !a.isBackgroundLayer)
    if (selectedLayer.name === layers[0].name) selectedLayer.moveBelow(layers[layers.length - 1])
    else selectedLayer.moveAbove(layers[0])
}
GetAllLayer();