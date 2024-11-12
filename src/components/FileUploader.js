import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./FileUploader.css";
import config from "../config";

const FileUploader = () => {
    const [fileNames, setFileNames] = useState([]);
    const [jsonResponses, setJsonResponses] = useState([]);
    const [totalTime, setTotalTime] = useState({ accumulated: 0, total: 0 });

    const fetchMetadata = async (fileName) => {
        const apiUrl = `${config.baseApiUrl}${
            config.endpoints.extractMetadata
        }?title=${encodeURIComponent(fileName)}`;

        const startTime = Date.now();
        var endTime = 0;
        var data;
        try {
            const response = await fetch(apiUrl);
            data = await response.json();
            endTime = Date.now();
        } catch (error) {
            console.error(`Error fetching metadata for ${fileName}:`, error);
        }

        const responseTime = endTime - startTime;
        setTotalTime((prevTime) => ({
            accumulated: prevTime.accumulated + responseTime,
            total: Date.now() - startTime,
        }));
        setJsonResponses((prev) => [...prev, { data, responseTime }]);
    };

    const onDrop = useCallback((acceptedFiles) => {
        const names = acceptedFiles.map((file) => file.name);
        setFileNames(names);
        setJsonResponses([]);
        setTotalTime({ accumulated: 0, total: 0 });

        names.forEach(fetchMetadata);
    }, []);

    const resetState = () => {
        setFileNames([]);
        setJsonResponses([]);
        setTotalTime({ accumulated: 0, total: 0 });
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const meanResponseTime =
        fileNames.length > 0
            ? Math.floor(totalTime.accumulated / fileNames.length)
            : 0;

    return (
        <div>
            <DropZone
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isVisible={fileNames.length === 0}
            />
            <UploadedFiles fileNames={fileNames} />
            <ResponseTimesContainer
                isVisible={fileNames.length > 0}
                totalTime={totalTime.total}
                accumulatedTime={totalTime.accumulated}
                meanTime={meanResponseTime}
            />
            {fileNames.length > 0 && <RestartButton resetState={resetState} />}
            <JsonResponses jsonResponses={jsonResponses} />
        </div>
    );
};

const DropZone = ({ getRootProps, getInputProps, isVisible }) => {
    if (!isVisible) return null;
    return (
        <div {...getRootProps()} className="dropzone-style">
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
    );
};

const UploadedFiles = ({ fileNames }) => {
    if (fileNames.length === 0) return null;
    return (
        <div>
            <h3>Uploaded Files:</h3>
            <ol>
                {fileNames.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                ))}
            </ol>
        </div>
    );
};

const ResponseTimesContainer = ({
    isVisible,
    totalTime,
    accumulatedTime,
    meanTime,
}) => {
    if (!isVisible) return null;
    return (
        <div className="container-style">
            <div className="response-time-style">
                <h4 className="response-time-title-style">Response Times</h4>
                <ResponseTimeItem label="Total" time={totalTime} />
                <ResponseTimeItem label="Accumulated" time={accumulatedTime} />
                <ResponseTimeItem label="Mean" time={meanTime} />
            </div>
        </div>
    );
};

const ResponseTimeItem = ({ label, time }) => (
    <div className="response-time-item-style">
        <span>{label}</span> <span>{time} ms</span>
    </div>
);

const RestartButton = ({ resetState }) => (
    <button onClick={resetState} className="button-style">
        Restart
    </button>
);

const JsonResponses = ({ jsonResponses }) => (
    <div>
        {jsonResponses.map((responseObj, index) => (
            <div key={index}>
                <h4>
                    <span className="response-time-label-style">
                        Response Time {responseObj.responseTime} ms -{" "}
                    </span>
                    {responseObj.data && responseObj.data.Title ? (
                        responseObj.data.Title
                    ) : (
                        <span className="error-label">No Title Available</span>
                    )}
                </h4>
                <pre className="json-style">
                    {responseObj.data ? (
                        JSON.stringify(responseObj.data, null, 2)
                    ) : (
                        "No data available"
                    )}
                </pre>
            </div>
        ))}
    </div>
);

export default FileUploader;
