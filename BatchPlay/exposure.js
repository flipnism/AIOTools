const cmdID = -504;

await ps_CoreModal(async () => {
    await ps_Core.performMenuCommand({ commandID: cmdID }).catch(e => console.log(e));

}, { commandName: "some tag" }).catch(e => console.log(e));