import { model,generationConfig,uploadToGemini,waitForFilesActive } from "../utils/gemini_utils.js";
async function run() {
    // TODO Make these files available on the local file system
    // You may need to update the file paths
    const files = [
      
    ];
  
    // Some files have a processing delay. Wait for them to be ready.
    await waitForFilesActive(files);
  
    const chatSession = model.startChat({

      generationConfig,
    //   history: [
    //     {
    //       role: "user",
    //       parts: [
    //         {
    //           fileData: {
    //             mimeType: files[0].mimeType,
    //             fileUri: files[0].uri,
    //           },
    //         },
    //         {text: "tell me summary of this pdf and also site the source"},
    //       ],
    //     },
    //     {
    //       role: "model",
    //       parts: [
    //         {text: "According to the provided document, \"Steal Like An Artist\" by Austin Kleon is a book that offers 10 tips about being creative. The book cover indicates it is a New York Times Bestseller.\n\nAccording to the provided document, the tips are:\n1. Steal like an artist.\n2. Don't wait until you know who you are to get started.\n3. Write the book you want to read.\n4. Use your hands.\n5. Side projects and hobbies are important.\n6. The secret: Do good work and share it with people.\n7. Geography is no longer our master.\n8. Be nice. (The world is a small town.)\n9. Be boring. (It's the only way to get work done.)\n10. Creativity is subtraction."},
    //       ],
    //     },
    //     {
    //       role: "user",
    //       parts: [
    //         {text: "Tell me how does india's panchayati raj system works"},
    //       ],
    //     },
    //     {
    //       role: "model",
    //       parts: [
    //         {text: "The requested information is not available in the provided document."},
    //       ],
    //     },
    //     {
    //       role: "user",
    //       parts: [
    //         {
    //           fileData: {
    //             mimeType: files[1].mimeType,
    //             fileUri: files[1].uri,
    //           },
    //         },
    //         {text: "what are the 4 pillars of CC"},
    //       ],
    //     },
    //     {
    //       role: "model",
    //       parts: [
    //         {text: "Based on the provided document, the four aspects to focus on for cloud computing are:\n\n1.  **IAAS** (Infrastructure as a Service)\n2.  **PAAS** (Platform as a Service)\n3.  **SAAS** (Software as a Service)\n4.  **What are the various CC characteristics**\n\n"},
    //       ],
    //     },
    //     {
    //       role: "user",
    //       parts: [
    //         {text: "should artist steam from CC"},
    //       ],
    //     },
    //     {
    //       role: "model",
    //       parts: [
    //         {text: "I'm sorry, but the document does not contain information on whether or not artists should stream from CC."},
    //       ],
    //     },
    //   ],
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
