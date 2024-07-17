import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "./App.css";


/**
 * PAra la subida de archivo desde el front se debe configurar el bucket
 * 
 * CONFIGURACION CORS BUCKET:
 * [
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT"
        ],
        "AllowedOrigins": [
            "http://localhost:5173"
        ],
        "ExposeHeaders": []
    }
]
 * 
 *
 * **/

function App() {
  const [count, setCount] = useState(0);
  const [fileV, setFile] = useState();
  const REGION = "us-east-1";
  const BUCKET = "mi-primer-bucket-ejemplo";

  const subirVideo = async ({ region, bucket, key, file }) => {
    const client = new S3Client({
      region,
      credentials: {
        accessKeyId: "<ACCESS KEY>",
        secretAccessKey: "<SECRET ACCESS KEY>",
      },
    });

    const uploadParams = {
      Bucket: bucket,
      Key: key,
      Body: file,
    };
    const data = await client.send(
      new PutObjectCommand({ ...uploadParams, ContentType: "video/webm" })
    );
    return data;
  };

  const subirVideoPorPresegined = async (file, url) => {
    const response = await fetch(url, {
      method: "PUT",

      headers: { "Content-type": "video/webm" },
      body: file,
    });
    console.log(response);
    const resp = await response.json();
    console.log(resp);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={async () => {
            console.log(fileV);
            const date = new Date().getTime();
            let KEY = `2024-07-16 17-39-19_${date}.webm`;
            const subida = await subirVideo({
              region: REGION,
              bucket: BUCKET,
              key: KEY,
              file: fileV,
            });

            console.log(subida);
          }}
        >
          AWS CORS
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <div>
        <input
          type="file"
          onChange={async (e) => {
            const [file] = e.target.files;
            setFile(file);
          }}
        />
      </div>
      <div>
        <button
          onClick={async () => {
            console.log(fileV);
            const res = await subirVideoPorPresegined(
              fileV,
              "https://mi-primer-bucket-ejemplo.s3.us-east-1.amazonaws.com/2024-07-16%2017-39-19_1721179281890.webm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAQ3EGQSSATU4LYC4H%2F20240717%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240717T012121Z&X-Amz-Expires=3600&X-Amz-Signature=b14495fca3149c9469750575751743feaa255554f55dc2da8cc18d537aba6bf2&X-Amz-SignedHeaders=host&x-id=PutObject"
            );
            console.log(res);
          }}
        >
          Presigned
        </button>
      </div>
    </>
  );
}

export default App;
