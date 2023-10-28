import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge: https://vercel.com/docs/functions/edge-functions/edge-runtime
export const runtime = "edge";
export async function POST(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      // Check for OPENAI_API_KEY
      // if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY === "") {
      //   res.status(400, "Missing OPEN_API_KEY").send("Missing OPENAI_API_KEY – make sure to add it to your .env file.");
      //   return resolve();
      // }

      if (process.env.NODE_ENV != "development" &&
          process.env.KV_REST_API_URL &&
          process.env.KV_REST_API_TOKEN) {
        
        // const ip = req.headers.get("x-forwarded-for");
        // const ratelimit = new Ratelimit({
        //   redis: kv,
        //   limiter: Ratelimit.slidingWindow(50, "1 d"),
        // });

        // const { success, limit, reset, remaining } = await ratelimit.limit(`novel_ratelimit_${ip}`);

        // if (!success) {
        //   res.status(429).send("You have reached your request limit for the day.", {
        //     headers: {
        //       "X-RateLimit-Limit": limit.toString(),
        //       "X-RateLimit-Remaining": remaining.toString(),
        //       "X-RateLimit-Reset": reset.toString(),
        //     },
        //   });
        //   return resolve();
        // }
      }

      const { prompt } = await req.json();
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: "Generate a creative paragraph based on the topic you enter."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
        n: 1,
      });

      console.log('successful called the api', response);
      // const message = response.choices[0].message
      // console.log('message', message)
      // Convert the response into a friendly text-stream
      const stream = OpenAIStream(response);

      // Respond with the stream
      // res.status(200).send(stream);
      // console.log("returning streming", stream)
      return new StreamingTextResponse(stream)
      // resolve();

    } catch (error) {
      console.error("Error processing request:", error.message);
      // res.status(500).send("Internal server error.");
      reject(error);
    }
  });
}


// 
// export async function POST(req: Request) {
//   const { prompt } = await req.json();
 
//   // Ask OpenAI for a streaming completion given the prompt
//   const response = await openai.completions.create({
//     model: 'text-davinci-003',
//     stream: true,
//     temperature: 0.6,
//     max_tokens: 300,
//     prompt: `Create three slogans for a business with unique features.
 
// Business: Bookstore with cats
// Slogans: "Purr-fect Pages", "Books and Whiskers", "Novels and Nuzzles"
// Business: Gym with rock climbing
// Slogans: "Peak Performance", "Reach New Heights", "Climb Your Way Fit"
// Business: ${prompt}
// Slogans:`,
//   });
//   // Convert the response into a friendly text-stream
//   const stream = OpenAIStream(response);
//   // Respond with the stream
//   return new StreamingTextResponse(stream);
// }