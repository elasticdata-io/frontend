export default {
    type: "object",
    required: [],
    title: "Scraper pipeline",
    properties: {
        settings: {
            $ref: "#/definitions/Settings"
        },
        commands: {
            type: "array",
            items: { $ref: "#/definitions/AbstractCommand" }
        }
    },
    definitions: {
        Settings: {
            type: "object",
            properties: {
                userInteraction: {
                    type: "object",
                    properties: {
                        watchCommands: {
                            type: "array",
                            items: { $ref: "#/definitions/AbstractCommand" }
                        }
                    }
                },
                window: {
                    type: "object",
                    properties: {
                        lang: {
                            type: "string"
                        },
                        width: {
                            type: "number"
                        },
                        height: {
                            type: "number"
                        }
                    }
                },
                proxies: {
                    type: "array",
                    items: { type: "string" }
                }
            }
        },
        AbstractCommand: {
            type: "object",
            required: ["cmd"],
            properties: {
                cmd: {
                    type: "string",
                }
            }
        }
    }
}