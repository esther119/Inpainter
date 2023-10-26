import { useState } from "react";

const samplePrompts = [
  "How to find your future partner?",
  "Is AI going to replace my job?",
  "I love stick man so much",
];
import sample from "lodash/sample";

export default function PromptForm(props) {
  const [prompt] = useState(sample(samplePrompts));
  // const [image, setImage] = useState(null);  
  // const { apiOutput, loading, error } = useFetchGPTOutput("api/generate");
  const [apiOutput, setApiOutput] = useState(""); // Local state to store API output
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

  //   try {
  //     const response = await fetch('/api/generate', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ prompt }), // Sending prompt in request body
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();
  //     setApiOutput(data.output || ""); // Assuming the response has an 'output' key

  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  }

  return (
    <form
      onSubmit={props.submitData}
      className="py-5 animate-in fade-in duration-700"
    >
      <div className="flex flex-col items-start max-w-[512px] font-comic"> 
        {/* Added flex-col for column layout and items-start to align items to the start */}
        <input
          type="text"
          placeholder="How does waitbutwhy think..."
          value={props.textPrediction}
          className="block w-full mb-4 rounded-md font-comic" // added margin-bottom for spacing
        />      
      <div className="flex max-w-[512px] font-comic w-full">
        <input
          type="text"
          defaultValue={prompt}
          name="prompt"
          placeholder="Enter a topic..."
          className="block w-full flex-grow rounded-l-md"
        />

        <button
          className="bg-black text-white rounded-r-md text-small inline-block px-3 flex-none font-comic"
          type="submit"
        >
          Generate
        </button>
      </div>
      </div>
    </form>
  );
}
