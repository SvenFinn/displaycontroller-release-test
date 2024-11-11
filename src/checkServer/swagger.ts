import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: 'ServerState Api',
        description: 'Get the state of the meyton server'
    },
    host: 'localhost',
    components: {
        schemas: {
            AdvServerState: {
                type: 'object',
                properties: {
                    online: { type: "boolean" },
                    compatible: { type: "boolean" },
                    version: { type: 'string' },
                    services: {
                        type: 'object',
                        properties: {
                            ssmdb2: { type: 'boolean' }
                        }
                    }
                },
                required: ["online"]
            }
            ,
            AdvServerStateOnline: {
                type: 'object',
                properties: {
                    online: { type: 'boolean', enum: [true] },
                    compatible: { type: 'boolean' },
                    version: { type: 'string' },
                    services: {
                        type: 'object',
                        properties: {
                            ssmdb2: { type: 'boolean' }
                        }
                    }
                }
            },
            AdvServerStateOffline: {
                type: 'object',
                properties: {
                    online: { type: 'boolean', enum: [false] }
                }
            }
        },
        examples: {
            AdvServerStateOffline: {
                value: {
                    online: false
                },
                summary: "Server is offline"
            },
            AdvServerStateOnline: {
                value: {
                    online: true,
                    compatible: true,
                    version: "5.0.0",
                    services: {
                        ssmdb2: true
                    }
                },
                summary: "Server is online and compatible"
            }
        }
    }
};

const outputFile = './swagger-output.json';
const routes = ['./src/webServer.ts'];

swaggerAutogen()(outputFile, routes, doc);