const config = {
    protocol: process.env.REACT_APP_API_PROTOCOL || "http",
    hostname: process.env.REACT_APP_API_HOSTNAME || "localhost",
    port: process.env.REACT_APP_API_PORT || 8080,
    basePath: process.env.REACT_APP_API_BASE_PATH || "",
    endpoints: {
        extractMetadata: "/metadata/extract",
    },
    get baseApiUrl() {
        return `${this.protocol}://${this.hostname}${
            this.port ? `:${this.port}` : ""
        }${this.basePath}`;
    },
};

export default config;
