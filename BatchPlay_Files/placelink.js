

fs.getFolder().then(async (result) => {
    const photos = await result.getEntries();
    for (const photo of photos) {
        const token = await fs.createSessionToken(photo);
        console.log(token);
        await PSCoreModal(async () => {
            await PSBP([{
                "_obj": "placeEvent",
                "null": {
                    _path: token,
                    _kind: "local",
                },
                "linked": true
            }], {}).catch(e => console.log("place", e))
        }, { commandName: "some tag" });

    }
})


