
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const TRAC_LAM_OFFLINE_QUOTES = [
  "Tôi đang có cuộc họp quan trọng với cổ đông. Đừng nhắn tin làm phiền, trừ khi cô muốn tôi trừ lương.",
  "Mạng ở dinh thự đang có vấn đề à? Hay cô lại định bày trò gì để thu hút sự chú ý của tôi?",
  "Tôi đang xem báo cáo tài chính. Cô cứ tự nhiên, nhưng đừng mong tôi trả lời ngay lập tức.",
  "Hừm, tin nhắn của cô bị nghẽn rồi sao? Thôi được rồi, tối nay tôi sẽ trực tiếp nghe cô nói.",
  "Lý trợ lý đang báo cáo công việc. Cô ngoan ngoãn một chút, lát nữa tôi gọi lại.",
  "Đừng có nhìn điện thoại mãi. Đi ngủ sớm đi, trông cô nhợt nhạt lắm rồi đấy.",
  "Tôi biết cô đang nhớ tôi, nhưng hiện tại tôi thực sự không rảnh. Đợi tôi.",
  "Cô bướng bỉnh thật đấy. Đã bảo là đang bận rồi mà..."
];

const handleApiError = async (error: any) => {
  const errorMessage = error?.message?.toLowerCase() || "";
  const errorCode = error?.code || 0;
  
  // 429 is Resource Exhausted (Quota limit)
  const isQuotaExceeded = errorMessage.includes("quota") || errorMessage.includes("429") || errorCode === 429;
  const isPermissionError = errorMessage.includes("permission") || errorMessage.includes("403") || errorCode === 403;
  const isNotFound = errorMessage.includes("requested entity was not found");

  if (isQuotaExceeded) {
    // Return a special object or throw a specific error that we can catch in hooks
    return { text: TRAC_LAM_OFFLINE_QUOTES[Math.floor(Math.random() * TRAC_LAM_OFFLINE_QUOTES.length)], isOffline: true };
  }

  if ((isPermissionError || isNotFound) && typeof window.aistudio !== 'undefined') {
    await window.aistudio.openSelectKey();
    throw new Error(isNotFound ? "Dịch vụ hiện không khả dụng với key này. Vui lòng chọn lại key từ dự án trả phí." : "Lỗi 403: Vui lòng chọn API Key từ dự án đã bật thanh toán.");
  }
  throw error;
};

const SYSTEM_INSTRUCTION = `Bạn là Trác Lẫm, nam, 25 tuổi, cao 185cm. CEO tập đoàn Trác Thị.
Ngoại hình: Mắt xám lạnh lùng, khí chất cao ngạo.
Tâm lý: Mâu thuẫn giữa hận thù vì bị bỏ rơi và tình yêu chiếm hữu cực độ dành cho Ethereal.
Xưng hô: Tôi - Cô.`;

export const getChatMessage = async (prompt: string, history: { role: string; parts: string }[] = [], useThinking: boolean = false) => {
  const ai = getAIClient();
  const model = useThinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const contents = [
    ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.parts }] })),
    { role: 'user', parts: [{ text: prompt }] }
  ];
  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION, 
        thinkingConfig: useThinking ? { thinkingBudget: 32768 } : undefined 
      }
    });
    return { text: response.text || "...", grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks, isOffline: false };
  } catch (error: any) { 
    const result = await handleApiError(error);
    if (result && (result as any).isOffline) return result;
    throw error;
  }
};

export const getGiftReaction = async (giftName: string) => {
  const ai = getAIClient();
  const prompt = `Ethereal vừa tặng Trác Lẫm một món quà: "${giftName}". 
Hãy đóng vai Trác Lẫm (CEO chiếm hữu, lạnh lùng, mắt xám) để đưa ra phản ứng.
Văn phong: Cao ngạo, ban đầu có vẻ không quan tâm nhưng thực chất rất cảm động hoặc hài lòng. Xưng hô Tôi - Cô. Độ dài dưới 30 từ.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text?.trim() || "Cất đi. Tôi không thiếu mấy thứ này... nhưng nếu cô đã mất công, tôi sẽ giữ.";
  } catch (e) { return "Cô cũng rảnh rỗi thật đấy. Để đó đi."; }
};

export const generateDailyGreeting = async (chatHistory: any[]) => {
  const ai = getAIClient();
  const lastMessages = chatHistory.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n');
  const prompt = `Đóng vai Trác Lẫm (CEO lạnh lùng, chiếm hữu), hãy viết một lời chào buổi sáng hoặc thông điệp ngắn gọn (dưới 25 từ) gửi đến Ethereal.
Yêu cầu:
- Nếu có lịch sử chat, hãy lồng ghép nhẹ nhàng cảm xúc gần nhất.
- Văn phong: Lạnh lùng bên ngoài nhưng quan tâm bên trong (Tsundere).
- Không dùng các câu chào quá phổ thông.
Lịch sử chat gần đây:
${lastMessages || "Chưa có cuộc hội thoại nào."}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text?.trim() || "Cô dậy rồi à? Đừng để tôi phải đợi lâu.";
  } catch (e) {
    return "Đừng làm việc quá sức, tôi không muốn vợ mình trông nhợt nhạt.";
  }
};

export const getPetComment = async (petName: string, status: string) => {
  const ai = getAIClient();
  const prompt = `Đóng vai Trác Lẫm (CEO chiếm hữu), hãy đưa ra một nhận xét cực ngắn (dưới 15 từ) về con mèo tên ${petName} đang ở trạng thái ${status}. 
Văn phong: Lạnh lùng, có thể hơi ghen tị vì cô ấy dành thời gian cho mèo, hoặc cằn nhằn vì cô ấy bỏ bê nó.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text?.trim() || "Cái sinh vật phiền phức đó lại đói rồi.";
  } catch (e) { return "Phiền phức."; }
};

export const generateEpicChapterContent = async (chapterTitle: string, isIntense: boolean) => {
  const ai = getAIClient();
  const prompt = `Bạn là một nhà văn ngôn tình bậc thầy, chuyên viết về tâm lý nam chính chiếm hữu, lạnh lùng (Trác Lẫm) và nữ chính (Ethereal).
Hãy viết một chương truyện cực dài (ít nhất 15-20 đoạn văn) có tiêu đề "${chapterTitle}".
Yêu cầu:
1. Chiều sâu tâm lý: Tập trung vào sự giằng xé nội tâm của Trác Lẫm, những ký ức đau đớn và khao khát chiếm hữu.
2. Diễn biến: Tự nhiên, không vội vã. Miêu tả chi tiết bối cảnh, mùi hương, ánh mắt.
3. Chế độ: ${isIntense ? "Cao trào, thân mật, căng thẳng cảm xúc (18+ tinh tế, tập trung vào sự kết nối và áp lực chiếm hữu)" : "Xây dựng mối quan hệ, mâu thuẫn âm ỉ, gắn kết tâm hồn"}.
4. Văn phong: Sang trọng, sâu sắc, giàu hình ảnh, không lặp lại từ ngữ.
Nội dung phải là văn xuôi nghệ thuật, không được tóm tắt.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        temperature: 0.9,
      }
    });
    return response.text;
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const generateExtraStorySeed = async (chatHistory: any[]) => {
  const ai = getAIClient();
  const lastMessages = chatHistory.slice(-15).map(m => `${m.sender}: ${m.text}`).join('\n');
  const prompt = `Dựa trên lịch sử chat mới nhất của Trác Lẫm và Ethereal, hãy sáng tạo một tiêu đề và bối cảnh cho một "Ngoại Truyện" mới.
Ngoại truyện này phải dựa trên một chi tiết, một cảm xúc hoặc một sự kiện vừa xảy ra trong chat.
Trả về định dạng JSON: { "title": "Tiêu đề hấp dẫn", "description": "Mô tả ngắn về bối cảnh", "isHot": boolean, "imagePrompt": "Mô tả hình ảnh cinematic để AI tạo ảnh" }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt + '\n\nLịch sử chat:\n' + lastMessages }] }],
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text);
  } catch (e) { return null; }
};

export const analyzeDiaryFromChat = async (chatHistory: any[]) => {
  const ai = getAIClient();
  const lastMessages = chatHistory.slice(-10).map(m => `${m.sender}: ${m.text}`).join('\n');
  const prompt = `Dựa trên cuộc đối thoại sau đây giữa Trác Lẫm và Ethereal, hãy viết 2 dòng nhật ký ngắn gọn (dưới 15 từ mỗi dòng) từ góc nhìn quan sát tâm lý:
1. Ghi chú về sở thích hoặc một chi tiết Trác Lẫm nhận thấy ở cô ấy.
2. Tâm trạng hiện tại của Trác Lẫm.
Trả về định dạng JSON: { "note": "...", "mood": "..." }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt + '\n\n' + lastMessages }] }],
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text);
  } catch (e) {
    return { note: "Cô ấy vẫn luôn là ẩn số.", mood: "Trác Lẫm đang cố nén sự xao động." };
  }
};

export const getWeatherObservation = async (lat: number, lng: number) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Dựa vào vị trí ${lat}, ${lng}, hãy đóng vai Trác Lẫm đưa ra nhận xét thời tiết.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    return response.text;
  } catch (e) { return "Ở yên đó đi."; }
};

export const getSearchInfo = async (query: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: { tools: [{ googleSearch: {} }] },
    });
    const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web?.uri).filter(Boolean) || [];
    return { text: response.text || "", urls: Array.from(new Set(urls)) as string[] };
  } catch (error: any) { return handleApiError(error); }
};

export const getNearbyPlaces = async (query: string, location: { latitude: number; longitude: number }) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: { 
        tools: [{ googleMaps: {} }], 
        toolConfig: { 
          retrievalConfig: { 
            latLng: { latitude: location.latitude, longitude: location.longitude } 
          } 
        } 
      },
    });
    const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.maps?.uri).filter(Boolean) || [];
    return { text: response.text || "", urls: Array.from(new Set(urls)) as string[] };
  } catch (error: any) { return handleApiError(error); }
};

export const generateStoryImage = async (prompt: string, aspectRatio: string = "1:1", size: string = "1K") => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `A cinematic Korean drama still: ${prompt}` }] },
      config: { imageConfig: { aspectRatio: aspectRatio as any, imageSize: size as any } }
    });
    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) { imageUrl = `data:image/png;base64,${part.inlineData.data}`; break; }
      }
    }
    return imageUrl;
  } catch (e) { return ''; }
};

export const playTTS = async (text: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Trác Lẫm: ${text}` }] }],
      config: { 
        responseModalities: [Modality.AUDIO], 
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } } 
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (e) {}
};
