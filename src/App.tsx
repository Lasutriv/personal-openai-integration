// Tanner Fry
// tannerf1101@yahoo.com

import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useFormInput } from './Utilities';
import { Configuration, OpenAIApi } from "openai";

// API reference:
// https://platform.openai.com/docs/api-reference/

function App() {
  const chatInput = useFormInput("");
  const imageInput = useFormInput("");
  const configuration = new Configuration({
      organization: "org-Dm1vzOgeX1soXlV2Ayy9qcIG",
      // apiKey: process.env.OPENAI_API_KEY,
      apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
  const [openAIInput, setOpenAIInput] = React.useState("");
  const [openAIImage, setOpenAIImage] = React.useState("");

  async function askOpenAIAQuestion(userInput) {
    await openai.listModels().then((response) => {
      console.log(JSON.stringify(response.data, null, '\t'));
      
    }).catch((error) => {
      setOpenAIInput(error.message);
    });
    await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: userInput}],
    }).then((completion: any) => {
      setOpenAIInput(completion.data.choices[0].message.content);
    }).catch((error) => {
      setOpenAIInput(error.message);
    });
  }

  async function askOpenAIToGenerateArt(userInput) {
    await openai.createImage({
      prompt: userInput,
      n: 10,
      size: "1024x1024",
    }).then((response: any) => {
      console.log(JSON.stringify(response.data, null, '\t'));
      
      setOpenAIImage(response.data.data[0].url);
    }).catch((error) => {
      setOpenAIInput(error.message);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className='open-ai-response-title'>
          OpenAI Image Response:
        </div>
        <div className='open-ai-image-response'>
          { openAIImage ? (
            <img src={openAIImage} alt="OpenAI Generated Image" />
          ) : (
            <>No image at this time.</>
          )}
        </div>
        <textarea {...imageInput} name="userInput" cols={40} rows={5}></textarea>
        <button onClick={
          () => {
            askOpenAIToGenerateArt(imageInput.value);
          }
        }>
          Submit
        </button>
        <div className='open-ai-response-title'>
          OpenAI Chat Response:
        </div>
        <div className='open-ai-response'>
          { openAIInput }
        </div>
        <div className='user-input-title'>
          User Input:
        </div>
        <textarea {...chatInput} name="userInput" cols={40} rows={5}></textarea>
        <button onClick={
          () => {
            askOpenAIAQuestion(chatInput.value);
          }
        }>
          Submit
        </button>
      </header>
      <body>
        
      </body>
    </div>
  );
}

export default App;
