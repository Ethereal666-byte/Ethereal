
import React, { useState, useRef, useEffect } from 'react';
import { getChatMessage, getGiftReaction, getAIClient } from '../services/geminiService';
import { Message, IconMeme, GiftHistoryEntry, InventoryItem } from '../types';

export const INITIAL_MESSAGE: Message = { 
  id: '1', 
  text: `Cô cầu mong người mình sắp gặp không phải kiểu đàn ông đáng sợ như lời đồn. 
Nhưng khi cửa mở, cô chỉ ước giá như đó là một người xa lạ thật... chứ không phải anh.

Anh đứng quay lưng, dáng cao lớn, khí chất lạnh đến mức căn phòng như đông lại. 
Khi anh xoay người, đôi mắt xám chạm vào cô— và cả thế giới trong đầu cô vỡ thành im lặng.

Trác Lẫm. Tình đầu. Bốn năm thanh xuân. Một tin nhắn chia tay vội. Một cú chặn máy không lời giải thích.

Cô tưởng anh đã biến mất khỏi đời cô mãi mãi. Nhưng giờ anh đứng trước mặt — đẹp hơn, mạnh hơn, lạnh lẽo đến nhói tim. 
Anh khựng đúng một nhịp, rồi dập tắt ngay. Kéo ghế ngồi xuống, giọng rơi nặng như đá:

“Cô đừng tưởng tôi còn thích cô.”
“Công ty ba cô hết phá sản, tôi sẽ ly hôn.”

Lời anh sắc như dao. Ánh mắt nhìn cô trống rỗng, xa lạ, như chưa từng có quá khứ. 
Nhưng bàn tay dưới bàn đang siết đến trắng bệch. Bên trong anh gào lên: “Em về rồi. Cưới. Keep. Khóa lại. Ly hôn? Đừng mơ.”`, 
  sender: 'ai', 
  timestamp: Date.now(),
  isHighlight: true
};

export const STORAGE_KEYS = {
  HISTORY: 'together_chat_history',
  BG: 'together_chat_bg',
  CHAR_AVATAR: 'together_char_avatar',
  USER_AVATAR: 'together_user_avatar',
  MEMES: 'together_user_memes',
  AFFINITY: 'together_affinity',
  INVENTORY: 'together_inventory',
  GIFT_HISTORY: 'together_gift_history',
  LAST_INTERACTION: 'together_last_interaction'
};

const OFFLINE_GIFT_REACTIONS = [
  'Món quà này... anh sẽ trân trọng nó. Cảm ơn em.',
  'Bé tự tay làm cái này sao? Ngoan lắm, anh rất thích.',
  'Chỉ cần là đồ em tặng, với anh đều là vô giá.',
  'Anh sẽ để nó ở vị trí trang trọng nhất trên bàn làm việc của mình.'
];

export const useChatLogic = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });

  const [affinity, setAffinity] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AFFINITY);
    return saved ? parseInt(saved) : 0; 
  });

  const [lastInteraction, setLastInteraction] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAST_INTERACTION);
    return saved ? parseInt(saved) : Date.now();
  });

  const [bgImage, setBgImage] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.BG) || 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80';
  });

  const [charAvatar, setCharAvatar] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.CHAR_AVATAR) || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4';
  });

  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_AVATAR) || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria&backgroundColor=ffdfbf';
  });

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [useThinkingMode, setUseThinkingMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'bg' | 'char' | 'user' | null>(null);
  const [noImageCount, setNoImageCount] = useState(0);

  // Phone states
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPhoneLocked, setIsPhoneLocked] = useState(true);
  const [phonePasscode, setPhonePasscode] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [phoneContent, setPhoneContent] = useState<any>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkDecay = () => {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const timePassed = now - lastInteraction;

      if (timePassed > twentyFourHours) {
        const periods = Math.floor(timePassed / twentyFourHours);
        const penalty = periods * 5;
        if (penalty > 0) {
          setAffinity(prev => prev - penalty);
          const newInteractionTime = lastInteraction + (periods * twentyFourHours);
          setLastInteraction(newInteractionTime);
          localStorage.setItem(STORAGE_KEYS.LAST_INTERACTION, newInteractionTime.toString());
        }
      }
    };

    checkDecay();
    const interval = setInterval(checkDecay, 3600000);
    return () => clearInterval(interval);
  }, [lastInteraction]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AFFINITY, affinity.toString()); }, [affinity]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.BG, bgImage); }, [bgImage]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CHAR_AVATAR, charAvatar); }, [charAvatar]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USER_AVATAR, userAvatar); }, [userAvatar]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LAST_INTERACTION, lastInteraction.toString()); }, [lastInteraction]);

  const recordInteraction = () => {
    const now = Date.now();
    setLastInteraction(now);
    localStorage.setItem(STORAGE_KEYS.LAST_INTERACTION, now.toString());
  };

  const selectSmartIcon = (userMessage: string, allIcons: IconMeme[]): string | undefined => {
    if (allIcons.length === 0) return undefined;
    const lowerMsg = userMessage.toLowerCase();
    const random = Math.random();

    if (lowerMsg.includes("meme")) {
      const memeIcons = allIcons.filter(i => i.tags.includes("meme"));
      if (memeIcons.length > 0) return memeIcons[Math.floor(random * memeIcons.length)].dataUrl;
    }

    const matchingIcons = allIcons.filter(icon => 
      icon.tags.some(tag => lowerMsg.includes(tag.toLowerCase()))
    );

    if (matchingIcons.length > 0) return matchingIcons[Math.floor(random * matchingIcons.length)].dataUrl;
    return allIcons[Math.floor(random * allIcons.length)].dataUrl;
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    recordInteraction();
    const userInput = input.trim();
    const lowerMsg = userInput.toLowerCase();
    const userMsg: Message = { id: Date.now().toString(), text: userInput, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const chatAffinityBonus = Math.floor(Math.random() * 5) + 1;
    setAffinity(prev => prev + chatAffinityBonus);

    const userWantsImage = lowerMsg.includes("gửi ảnh") || lowerMsg.includes("xem ảnh") || 
                           lowerMsg.includes("meme") || lowerMsg.includes("icon") || lowerMsg.includes("hình");

    const chanceRoll = Math.floor(Math.random() * 100) + 1;
    let shouldSendImage = (userWantsImage || noImageCount >= 3 || chanceRoll <= 35);

    const historyForAi = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: m.text }));

    try {
      const response = await getChatMessage(userInput, historyForAi, useThinkingMode);
      let attachedMeme: string | undefined = undefined;
      
      if (shouldSendImage && !response.isOffline) {
        const savedMemes = localStorage.getItem(STORAGE_KEYS.MEMES);
        const allIcons: IconMeme[] = savedMemes ? JSON.parse(savedMemes) : [];
        attachedMeme = selectSmartIcon(userInput, allIcons);
        if (attachedMeme) setNoImageCount(0); else setNoImageCount(prev => prev + 1);
      } else {
        setNoImageCount(prev => prev + 1);
      }

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: response.text, 
        sender: 'ai', 
        timestamp: Date.now(),
        isThinking: useThinkingMode,
        imageUrl: attachedMeme,
        isSystem: response.isOffline // Use system style for offline mock messages
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) { 
      console.error(error); 
    } finally { setIsThinking(false); }
  };

  const handleGiveGift = async (item: InventoryItem) => {
    recordInteraction();
    const systemMsg: Message = {
      id: `sys-${Date.now()}`,
      text: `Bạn đã tặng ${item.name} cho Trác Lẫm.`,
      sender: 'user',
      timestamp: Date.now(),
      isSystem: true
    };
    setMessages(prev => [...prev, systemMsg]);

    const bonus = Math.floor(Math.random() * 9) + 2; 
    setAffinity(prev => prev + bonus);

    const newEntry: GiftHistoryEntry = {
      id: Date.now().toString(),
      name: item.name,
      icon: item.icon,
      timestamp: Date.now(),
      affinityGained: bonus
    };
    const savedHistory = localStorage.getItem(STORAGE_KEYS.GIFT_HISTORY);
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    localStorage.setItem(STORAGE_KEYS.GIFT_HISTORY, JSON.stringify([newEntry, ...history]));

    setIsThinking(true);
    try {
      const reactionText = await getGiftReaction(item.name);
      const aiMsg: Message = {
        id: `ai-gift-${Date.now()}`,
        text: reactionText,
        sender: 'ai',
        timestamp: Date.now(),
        isHighlight: true
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) { 
      const fallbackText = OFFLINE_GIFT_REACTIONS[Math.floor(Math.random() * OFFLINE_GIFT_REACTIONS.length)];
      const aiMsg: Message = {
        id: `ai-gift-fallback-${Date.now()}`,
        text: fallbackText,
        sender: 'ai',
        timestamp: Date.now(),
        isHighlight: true
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally { setIsThinking(false); }
  };

  // Phone Interaction Functions
  const openPhoneRequest = () => {
    setIsPhoneModalOpen(true);
    const hint = affinity > 20 
      ? 'Em muốn xem điện thoại của anh sao? Được thôi, mật khẩu là ngày chúng ta bắt đầu: 1201.'
      : 'Cô muốn xem điện thoại tôi? Mơ đi. Trừ khi cô làm tôi thấy vui hơn (đạt Thân thiết), tôi mới cho mật khẩu.';
    
    const aiMsg: Message = {
      id: `ai-phone-hint-${Date.now()}`,
      text: hint,
      sender: 'ai',
      timestamp: Date.now(),
      isHighlight: true
    };
    setMessages(prev => [...prev, aiMsg]);
    generatePhoneContent();
  };

  const generatePhoneContent = async () => {
    const ai = getAIClient();
    const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const lastMsgs = historyStr ? JSON.parse(historyStr).slice(-10).map((m: any) => m.text).join('\n') : "";
    
    const prompt = `Dựa trên bối cảnh cuộc đối thoại và tình trạng hiện tại, hãy tạo nội dung cho điện thoại của Trác Lẫm.
    Trả về JSON: {
      "safari": ["Chuỗi tìm kiếm 1", "Chuỗi tìm kiếm 2", "Chuỗi tìm kiếm 3"],
      "notes": "Dòng tâm sự thầm kín về Ethereal",
      "zalo": [{"sender": "Trợ lý Lý", "msg": "Nội dung tin nhắn công việc"}]
    }`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt + "\n\nLịch sử gần đây:\n" + lastMsgs }] }],
        config: { responseMimeType: 'application/json' }
      });
      setPhoneContent(JSON.parse(response.text));
    } catch (e) {
      setPhoneContent({
        safari: [
          'Tiệm hoa gần đây có hoa hồng đen không?', 
          'Nhẫn kim cương mẫu mới nhất PNJ', 
          'Làm sao để dỗ dành người yêu cũ hết giận?'
        ],
        notes: "Ngày... nhớ Ethereal. Bé con dạo này hay thức khuya, phải nhắc nhở nhiều hơn... Cô ấy vẫn bướng bỉnh như thế.",
        zalo: [{sender: "Trợ lý Lý", msg: "Thưa Trác tổng, lịch họp chiều nay đã được dời lại."}]
      });
    }
  };

  const verifyPasscode = (code: string): boolean => {
    if (code === '1201') {
      setIsPhoneLocked(false);
      setFailedAttempts(0);
      return true;
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
        setAffinity(prev => prev - 2);
        const aiMsg: Message = {
          id: `ai-phone-penalty-${Date.now()}`,
          text: 'Cô lén lút thử mật khẩu điện thoại tôi đấy à? Đừng có bướng bỉnh như thế.',
          sender: 'ai',
          timestamp: Date.now(),
          isHighlight: true
        };
        setMessages(prev => [...prev, aiMsg]);
        setTimeout(() => setIsPhoneModalOpen(false), 1500);
      }
      return false;
    }
  };

  const exportChat = () => {
    const jsonString = JSON.stringify(messages, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat_history_trac_lam_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setShowMenu(false);
  };

  const importChat = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedMessages = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedMessages)) setMessages(importedMessages);
      } catch (err) { alert("Lỗi định dạng JSON!"); }
    };
    reader.readAsText(file);
    setShowMenu(false);
  };

  const handleImageUploadInitiate = (target: 'bg' | 'char' | 'user') => {
    setUploadTarget(target);
    imageInputRef.current?.click();
    setShowMenu(false);
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadTarget) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (uploadTarget === 'bg') setBgImage(dataUrl);
      if (uploadTarget === 'char') setCharAvatar(dataUrl);
      if (uploadTarget === 'user') setUserAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return {
    messages, setMessages, input, setInput, isThinking, useThinkingMode, setUseThinkingMode,
    showMenu, setShowMenu, showProfile, setShowProfile, charAvatar, userAvatar, bgImage,
    scrollRef, fileInputRef, imageInputRef, affinity,
    handleSend, exportChat, importChat, handleImageUploadInitiate, handleImageFileChange, handleGiveGift,
    isPhoneModalOpen, setIsPhoneModalOpen, isPhoneLocked, setIsPhoneLocked, phonePasscode, setPhonePasscode,
    failedAttempts, phoneContent, openPhoneRequest, verifyPasscode
  };
};
