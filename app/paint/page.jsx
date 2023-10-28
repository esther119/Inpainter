'use client'

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Canvas from "components/canvas";
import PromptForm from "components/prompt-form";
import Dropzone from "components/dropzone";
import Download from "components/download";
import { XCircle as StartOverIcon } from "lucide-react";
import { Code as CodeIcon } from "lucide-react";
import { Rocket as RocketIcon } from "lucide-react";
import { set } from "lodash";
import { useCompletion } from 'ai/react';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({api: '/api/generate'});
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [maskImage, setMaskImage] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);
  const [textPrediction, setTextPrediction] = useState('');

  const complexSubmit = async (e) => {
    e.preventDefault();
    console.log('handle submit function called')

    const prevPrediction = predictions[predictions.length - 1];
    const prevPredictionOutput = prevPrediction?.output
      ? prevPrediction.output[prevPrediction.output.length - 1]
      : null;
    
    handleSubmit(e)
    
    // const textResponse = await fetch("/api/generate", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ prompt: e.target.prompt.value }), // Empty string since content is fetched within the API
    // });
    // console.log('textResponse', textResponse)
    // if (textResponse.ok) {
    //   console.log('response is ok')
    //   if (textResponse.body) {
    //     console.log('parsedResponse', textResponse.body)
    //     const reader = textResponse.body.getReader();
    //     let text = "";
    //     while (true) {
    //       const { done, value } = await reader.read();

    //       if (done) {
    //         break;
    //       }
    //       console.log('value', value)
    //       // Convert the Uint8Array to a string and append it to the existing text
    //       text += new TextDecoder("utf-8").decode(value);
    //       setTextPrediction(text);
    //       console.log('text', text)
    //       console.log('text prediction', textPrediction)
    //     }
    //   } else {
    //     const errorMessage = await textResponse.text();
    //     console.error("Failed to fetch feedback:", errorMessage);
    //   }


    const body = {
      prompt: e.target.prompt.value,
      init_image: userUploadedImage
        ? await readAsDataURL(userUploadedImage)
        : // only use previous prediction as init image if there's a mask
        maskImage
        ? prevPredictionOutput
        : null,
      mask: maskImage,
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let prediction = await response.json();

    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPredictions(predictions.concat([prediction]));

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPredictions(predictions.concat([prediction]));

      if (prediction.status === "succeeded") {
        setUserUploadedImage(null);
      }
    }
  };

  const startOver = async (e) => {
    e.preventDefault();
    setPredictions([]);
    setTextPrediction('');
    setError(null);
    setMaskImage(null);
    setUserUploadedImage(null);
  };

  return (
    <div>
      <Head>
        <title>Inpainting with Stable Diffusion &amp; Replicate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main className="container mx-auto p-5">
        {error && <div>{error}</div>}

        <div className="border-hairline max-w-[512px] mx-auto relative">
          <Dropzone
            onImageDropped={setUserUploadedImage}
            predictions={predictions}
            userUploadedImage={userUploadedImage}
          />
          <div
            className="bg-gray-50 relative max-h-[512px] h-full w-full flex items-stretch"
            // style={{ height: 0, paddingBottom: "100%" }}
          >
            <Canvas
              predictions={predictions}
              userUploadedImage={userUploadedImage}
              onDraw={setMaskImage}
            />
          </div>
        </div>

        <div className="max-w-[512px] mx-auto">
          <PromptForm submitData={complexSubmit} handleInputChange={handleInputChange} textPrediction={completion} input={input}/>

          <div className="text-center font-comicpainting of fruit on a table in the style of Raimonds Staprans">
            {((predictions.length > 0 &&
              predictions[predictions.length - 1].output) ||
              maskImage ||
              userUploadedImage) && (
              <button className="lil-button" onClick={startOver}>
                <StartOverIcon className="icon" />
                Start over
              </button>
            )}

            <Download predictions={predictions} />
            <Link href="https://replicate.com/stability-ai/stable-diffusion" target="_blank" className="lil-button">
              {/* <a target="_blank" className="lil-button"> */}
                <RocketIcon className="icon" />
                Run with an API
              {/* </a> */}
            </Link>
            <Link href="https://github.com/zeke/inpainter" className="lil-button" target="_blank" rel="noopener noreferrer">
              {/* <a
                className="lil-button"
                target="_blank"
                rel="noopener noreferrer"
              > */}
                <CodeIcon className="icon" />
                View on GitHub
              {/* </a> */}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}
