// متغير لتتبع الألغاز التي تم حلها
let solvedPuzzles = {
  1: false,
  2: false,
  3: false
};

// دالة التحقق من اللغز
function checkPuzzle(puzzleId, correctAnswer) {
  // جلب العناصر من الصفحة
  const inputElement = document.getElementById(`answer-${puzzleId}`);
  const messageElement = document.getElementById(`msg-${puzzleId}`);
  const codeBoxElement = document.getElementById(`code-${puzzleId}`);
  
  // تحويل إجابة المستخدم إلى رقم
  const userAnswer = parseInt(inputElement.value);

  // إذا كان اللغز محلولاً مسبقاً، لا نفعل شيء
  if (solvedPuzzles[puzzleId]) return;

  // التحقق من الإجابة
  if (userAnswer === correctAnswer) {
    // الإجابة صحيحة
    messageElement.textContent = "✅ إجابة صحيحة! حصلت على الرقم.";
    messageElement.className = "message success";
    
    // تعطيل الإدخال بعد الحل
    inputElement.disabled = true;
    inputElement.style.opacity = "0.5";
    
    // إظهار الرقم في صندوق الأكواد
    codeBoxElement.textContent = correctAnswer;
    codeBoxElement.classList.add("unlocked");
    
    // تحديث حالة اللغز
    solvedPuzzles[puzzleId] = true;
    
    // تشغيل صوت نجاح بسيط (اختياري - نستخدم Web Audio API)
    playSound("success");

  } else {
    // الإجابة خاطئة
    messageElement.textContent = "❌ إجابة خاطئة، حاول مرة أخرى.";
    messageElement.className = "message error";
    
    // تأثير اهتزاز للبطاقة
    const card = document.getElementById(`puzzle-${puzzleId}`);
    card.style.transform = "translateX(5px)";
    setTimeout(() => card.style.transform = "translateX(-5px)", 100);
    setTimeout(() => card.style.transform = "translateX(0)", 200);
    
    playSound("error");
  }
}

// دالة فتح الباب النهائي
function openDoor() {
  const finalInput = document.getElementById("final-code").value;
  const finalMsg = document.getElementById("final-msg");
  const victoryScreen = document.getElementById("victory-screen");

  // التحقق من أن جميع الألغاز تم حلها أولاً
  if (!solvedPuzzles[1] || !solvedPuzzles[2] || !solvedPuzzles[3]) {
    finalMsg.textContent = "⚠️ يجب حل جميع الألغاز أولاً للحصول على الكود!";
    finalMsg.className = "message error";
    playSound("error");
    return;
  }

  // الكود الصحيح هو 558 (تجميع إجابات الألغاز)
  if (finalInput === "558") {
    finalMsg.textContent = "";
    victoryScreen.classList.remove("hidden");
    playSound("victory");
  } else {
    finalMsg.textContent = "❌ الكود غير صحيح، راجع الأرقام التي جمعتها.";
    finalMsg.className = "message error";
    playSound("error");
  }
}

// دالة بسيطة لتوليد أصوات (بدون ملفات خارجية)
function playSound(type) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === "success") {
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
           } else if (type === "error") {
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } else if (type === "victory") {
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(500, audioCtx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.6);
    }
  } catch (e) {
    console.log("المتصفح لا يدعم الأصوات");
  }
}
