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
                            type: "array"
                        }
                    }
                }
            }
        },
        AbstractCommand: {
            type: "object",
            properties: {
                cmd: {
                    type: "string",
                }
            }
        }
    }
}