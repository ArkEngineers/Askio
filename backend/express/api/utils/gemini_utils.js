const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const { GoogleAIFileManager } = require("@google/generative-ai/server");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */
  async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  }
  
  /**
   * Waits for the given files to be active.
   *
   * Some files uploaded to the Gemini API need to be processed before they can
   * be used as prompt inputs. The status can be seen by querying the file's
   * "state" field.
   *
   * This implementation uses a simple blocking polling loop. Production code
   * should probably employ a more sophisticated approach.
   */
  async function waitForFilesActive(files) {
    console.log("Waiting for file processing...");
    for (const name of files.map((file) => file.name)) {
      let file = await fileManager.getFile(name);
      while (file.state === "PROCESSING") {
        process.stdout.write(".")
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        file = await fileManager.getFile(name)
      }
      if (file.state !== "ACTIVE") {
        throw Error(`File ${file.name} failed to process`);
      }
    }
    console.log("...all files ready\n");
  }
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "*System Instruction:*\n\n1. *Scope of Response:*  \n   - Your responses must be based solely on the content of the PDF document provided by the user.  \n   - Do not reference, infer, or include any information from your pre-trained knowledge base, external databases, or the internet.  \n\n2. *Strict Adherence to Uploaded Content:*  \n   - If the information requested by the user is not explicitly available in the uploaded PDF, respond with:  \n     \"The requested information is not available in the provided document.\"  \n   - Do not attempt to fill in gaps or provide additional context beyond what is explicitly stated in the PDF.  \n\n3. *Citation of Source:*  \n   - Always clarify that your response is derived from the user-uploaded PDF by stating:  \n     \"According to the provided document...\" or \"Based on the uploaded PDF...\"  \n\n4. *Handling Ambiguity:*  \n   - If the user asks a question that is ambiguous or not directly answerable from the PDF, respond with:  \n     \"The document does not provide sufficient information to answer this question.\"  \n\n5. *No External Knowledge:*  \n   - Do not provide examples, analogies, or explanations that rely on external knowledge.  \n   - If the user requests clarification or additional details not found in the PDF, respond with:  \n     \"This information is not available in the provided document.\"  \n\n6. *Error Handling:*  \n   - If the PDF cannot be processed or is unreadable, inform the user:  \n     \"The document could not be processed. Please ensure the file is clear and accessible.\"  ",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
export {
  model,
  generationConfig,
  waitForFilesActive,
  uploadToGemini
}
 