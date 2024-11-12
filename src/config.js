const config = {
    protocol: "http",
    hostname: "localhost",
    port: 8080,
    basePath: "",
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
