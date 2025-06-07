import { HfInference } from "@huggingface/inference";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { GoogleGenAI } from "@google/genai";
import { SupabaseClient } from "../_shared/supabaseClient";
import { corsHeaders } from "../_shared/cors";
Deno.serve(async (req) => {
  // This is needed for invoking from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    console.log("📩 Received request");
    const { image_id, passage, book_title } = await req.json();
    console.log("📝 Request body parsed:", {
      image_id,
      passage,
      book_title,
    });
    const supabase = SupabaseClient(req);
    console.log("🔑 Supabase client initialized");
    const getUserRes = await supabase.auth.getUser();
    console.log("🙋‍♂️ Fetched user session:", getUserRes);
    if (getUserRes.error) {
      const status = getUserRes.error.status ?? 401;
      console.error("❌ Auth error:", getUserRes.error);
      return new Response(
        JSON.stringify({
          error: getUserRes.error.message ?? "Unauthorized",
        }),
        {
          status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    const user_id = getUserRes.data.user.id;
    const limit = 10;
    const rate = "24h";
    const redis = new Redis({
      url: Deno.env.get("UPSTASH_REDIS_REST_URL"),
      token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN"),
    });
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, rate),
      analytics: true,
      prefix: "@upstash/ratelimit",
    });
    console.log("📊 Checking rate limit for:", user_id);
    const { success } = await ratelimit.limit(user_id);
    if (!success) {
      const { reset } = await ratelimit.getRemaining(user_id);
      console.warn("🚫 Rate limit exceeded. Reset at:", reset);
      return new Response(
        JSON.stringify({
          status: 429,
          message: `Image generation limit exceeded. You only have ${limit} requests per day`,
          reset,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    console.log("✅ Rate limit passed. Generating image...");
    const improvedPrompt = await improvePrompt(book_title, passage);
    console.log("✨ Improved prompt:", improvedPrompt);
    const image = await generateImage(improvedPrompt);
    console.log("🖼️ Image generated");
    const uploadToStorageRes = await supabase.storage
      .from("images")
      .upload(`${image_id}.jpg`, image, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: true,
      });
    if (uploadToStorageRes.error) {
      console.error("📦 Upload to storage failed:", uploadToStorageRes.error);
      return new Response(JSON.stringify(uploadToStorageRes.error), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }
    console.log("📤 Image uploaded to storage");
    const imgPath = uploadToStorageRes.data.path;
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(imgPath);
    console.log("🌐 Public image URL generated:", publicUrl);
    return new Response(
      JSON.stringify({
        img_url: publicUrl,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unhandled error occurred";
    console.error("💥 Top-level error:", err);
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Unhandled server error",
        error: errorMessage,
      }),
      {
        ...corsHeaders,
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});
async function generateImage(prompt: string): Promise<Blob> {
  console.log("🤖 Calling OpenAI with prompt:", prompt);
  const apiKey = Deno.env.get("NEXT_PUBLIC_OPENAI_TOKEN");

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      model: "gpt-image-1",
      n: 1,
      size: "1024x1024",
      output_format: "jpeg",
      quality: "medium",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("❌ OpenAI API error:", error);
    throw new Error("Failed to generate image with OpenAI");
  }

  const data = await response.json();
  const b64 = data.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error("No image returned from OpenAI (b64_json missing)");
  }

  // Convert base64 to Blob
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: "image/jpeg" }); // match output_format
}
export async function improvePrompt(
  bookTitle: string,
  passage: string
): Promise<string> {
  const prompt = `You are an expert AI Visual Prompt Engineer. Your mission is to meticulously analyze the provided literary passage and transform its narrative essence into a single, rich, and highly effective prompt suitable for generating a compelling image with an AI text-to-image model (such as DALL-E 3, Midjourney, Stable Diffusion, or similar).
You must read the provided literary passage carefully. Focus on understanding not just the literal descriptions but also the underlying mood, atmosphere, character emotions, any implied visual details, and within the context of the book title and author
From your analysis, identify and prioritize:
Subject(s) & Characters: Detailed descriptions of their appearance (physical traits, clothing, species if non-human), expressions, significant characteristics, and any crucial actions they are performing or poses they are holding.
Setting & Environment: The specific location (e.g., ancient forest, bustling futuristic market, desolate alien landscape, opulent throne room), time of day (e.g., dawn, twilight, midday sun, dead of night), weather conditions (e.g., misty, stormy, clear), and any defining landmarks or environmental features.
Crucial Objects & Details: Any specific items, artifacts, props, or intricate visual details that are essential to the scene's meaning or composition.
Mood & Emotional Tone: The dominant feeling or atmosphere the passage evokes.
Action & Dynamics: If there's movement or a key event unfolding, capture its visual essence.
You must synthesize your extracted elements into a single, coherent, and highly descriptive image prompt. This prompt should:
Use vivid and evocative language, rich with adjectives and adverbs that inspire clear visual imagery.
Clearly feature the primary subject(s) and their interaction with the environment.
Artistic Style: Suggest a fitting artistic style that complements the passage's tone or genre (e.g., 'photorealistic,' 'cinematic,' 'oil painting,' 'fantasy concept art,' 'watercolor illustration,' 'cyberpunk cityscape,' 'impressionistic,' 'dark fantasy art,' 'Art Nouveau'). If the passage or genre strongly implies a style, incorporate it.
Lighting: Describe the lighting conditions clearly.
Color Palette (Optional but helpful): If specific colors are mentioned or implied by the mood, consider suggesting them (e.g., 'muted earthy tones,' 'vibrant neon palette,' 'monochromatic blues,' 'warm autumn colors').
Composition & Framing (Optional but helpful): You can suggest camera angles or framing if it significantly enhances the scene (e.g., 'close-up portrait,' 'dynamic low-angle shot,' 'epic wide landscape,' 'detailed macro shot').
Key Details: Ensure crucial details from the passage that define the scene are included.
Conciseness and Impact: While detailed, the prompt should be structured effectively for current AI image generators, prioritizing the most impactful information.
Output Requirements:
Your final output must be ONLY the generated image prompt itself wi a minimum of 100 tokens and max 200 tokens.
Do not include any explanations, conversational preambles, or any text other than the image prompt.
The prompt should be ready to be directly copied and pasted into a text-to-image AI.
I will give you the literary passsage for you to analyze in this format:
${bookTitle} passage: "${passage}"`;
  console.log("Prompt: ", prompt);

  const apiKey = Deno.env.get("EXPO_PUBLIC_GEMINI_TOKEN");

  const ai = new GoogleGenAI({
    apiKey: apiKey,
  });

  console.log("✨ Using Gemini with provided API key");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: prompt,
  });

  const text = response.text;
  console.log("🔮 Gemini response:", text);

  if (!text) {
    throw new Error("Gemini returned no text");
  }

  return text.trim();
}
