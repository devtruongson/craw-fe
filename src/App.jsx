import React, { useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ClipLoader from "react-spinners/ClipLoader";
import "./App.css";

function App() {
    const [startImageNumber, setStartImageNumber] = useState("");
    const [endImageNumber, setEndImageNumber] = useState("");
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        const zip = new JSZip();

        setIsLoading(true);

        for (let i = startImageNumber; i <= endImageNumber; i++) {
            const imageUrl = `${url}/${i.toString().padStart(6, "0")}.jpg`;
            const response = await axios.get(
                `https://craw.onrender.com/proxy?url=${imageUrl}`,
                {
                    responseType: "arraybuffer",
                }
            );
            zip.file(`image_${i}.jpg`, response.data);
        }

        setIsLoading(false);

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "images.zip");
    };

    return (
        <div className="App container w-100vw">
            {isLoading && (
                <div className="overlay">
                    <ClipLoader
                        color={"#ccc"}
                        loading={true}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            )}
            <div>
                <h2 className="py-4 text-center">Tool Craw QS</h2>
                <textarea
                    className="form-control mb-3"
                    type="text"
                    placeholder="Nhâpj link ảnh lưu ý bỏ số cuối /.000.jpg"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="Start Image Number"
                    value={startImageNumber}
                    onChange={(e) => setStartImageNumber(e.target.value)}
                />
                <input
                    className="form-control mb-3"
                    type="text"
                    placeholder="End Image Number"
                    value={endImageNumber}
                    onChange={(e) => setEndImageNumber(e.target.value)}
                />
                <button onClick={handleDownload} className="btn btn-primary">
                    Download ZIP
                </button>
                <p className="py-4">
                    Lưu Ý khi nhập link: ví dụ link như sau :
                    http://*****/cms/TempDir/books/202009081500-980dac65-2811-46f0-aea2-5394e4f56064//FullPreview/000001.jpg
                    <br></br>
                    <br></br>
                    =&gt; thì khi ta điền thì ta sẽ điền
                    <br></br>
                    <br></br>
                    http://*****/cms/TempDir/books/202009081500-980dac65-2811-46f0-aea2-5394e4f56064//FullPreview
                </p>
            </div>
        </div>
    );
}

export default App;
