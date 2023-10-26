import { useState } from "react";

const samplePrompts = [
  "How to find your future partner?",
  "Is AI going to replace my job?",
  "I love stick man so much",
];
import sample from "lodash/sample";

export default function PromptForm(props) {
  const [prompt] = useState(sample(samplePrompts));
  const [image, setImage] = useState(null);

  return (
    <form
      onSubmit={props.onSubmit}
      className="py-5 animate-in fade-in duration-700"
    >
      <div className="flex flex-col items-start max-w-[512px] font-comic"> 
        {/* Added flex-col for column layout and items-start to align items to the start */}
        <input
          type="text"
          placeholder="How does waitbutwhy think..."
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
