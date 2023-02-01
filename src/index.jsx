import React from "react";
import { entrypoints } from "uxp";
import "./sass/main.sass";
import "./sass/aligntool.sass";
import { PanelController } from "./controllers/PanelController";
import { logme } from "./modules/bp";
import { MainPanel } from "./panels/MainPanel";
import { LogPanel } from "./panels/LogPanel";

const logPanel = new PanelController(() => <LogPanel />, {
    id: "logpanel"
})
const mainpanelController = new PanelController(() => <MainPanel />,
    {
        id: "mainpanel",
        menuItems: [
            {
                id: "reload",
                label: "Reload Plugin",
                enable: true,
                checked: false,
                oninvoke: () => location.reload()
            }, {
                id: "reset",
                label: "Reset Settings",
                enable: true,
                checked: false,
                oninvoke: () => {
                    localStorage.clear();
                    location.reload();
                }
            }
        ]
    })
entrypoints.setup({
    plugin: {
        create(plugin) {
            logme("created", plugin)
        },
        destroy() {

        }
    },
    commands: {},
    panels: {
        mainpanel: mainpanelController,
        logpanel: logPanel
    }
})

