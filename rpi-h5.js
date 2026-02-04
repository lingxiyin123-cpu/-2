// 状态管理
let currentQuestion = 0;
let answers = [];
let questions = [];
let personalities = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  initParticles();
  loadProgress();
});

// 创建粒子效果
function initParticles() {
  const container = document.getElementById('particles');
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    
    if (Math.random() > 0.5) {
      particle.style.background = '#FF6B6B';
    }
    
    container.appendChild(particle);
  }
}

// 开始测试
function startQuiz() {
  // 确保数据已加载
  if (typeof RPI_DATA === 'undefined') {
    alert('数据加载失败，请刷新页面重试');
    return;
  }
  
  questions = RPI_DATA.questions;
  personalities = Object.values(RPI_DATA.personalities);
  currentQuestion = 0;
  answers = new Array(questions.length).fill(null);
  
  showPage('quizPage');
  renderQuestion();
  saveProgress();
}

// 显示页面
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('hidden');
  });
  document.getElementById(pageId).classList.remove('hidden');
  window.scrollTo(0, 0);
}

// 渲染题目
function renderQuestion() {
  const q = questions[currentQuestion];
  
  document.getElementById('questionNumber').textContent = `第 ${currentQuestion + 1} 题`;
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('progressText').textContent = `${currentQuestion + 1}/${questions.length}`;
  
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
  document.getElementById('progressFill').style.width = progressPercent + '%';
  
  // 渲染选项
  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';
  
  q.options.forEach((option, index) => {
    const optionEl = document.createElement('div');
    optionEl.className = 'option';
    if (answers[currentQuestion] === index) {
      optionEl.classList.add('selected');
    }
    // option是对象，需要取text属性
    optionEl.textContent = option.text || option;
    optionEl.onclick = () => selectOption(index);
    optionsContainer.appendChild(optionEl);
  });
  
  // 更新上一题按钮状态
  const prevBtn = document.getElementById('prevBtn');
  prevBtn.style.opacity = currentQuestion === 0 ? '0.3' : '1';
}

// 选择选项
function selectOption(index) {
  answers[currentQuestion] = index;
  renderQuestion();
  saveProgress();
  
  // 延迟跳转下一题
  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
      saveProgress();
    } else {
      calculateAndShowResult();
    }
  }, 400);
}

// 上一题
function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
    saveProgress();
  }
}

// 计算并显示结果
function calculateAndShowResult() {
  console.log('开始计算结果');
  console.log('answers:', answers);
  console.log('questions:', questions);

  // 使用计算器函数
  const scores = calculateRPIScores(answers, questions);
  console.log('scores:', scores);

  // 获取人格类型
  const personalityType = getPersonalityType(scores);
  console.log('personalityType:', personalityType);

  const personality = RPI_DATA.personalities[personalityType];
  console.log('personality:', personality);

  if (!personality) {
    console.error('人格数据未找到:', personalityType);
    alert('计算结果时出错，请重新测试');
    return;
  }

  // 先渲染结果内容
  const typeEl = document.getElementById('resultType');
  const titleEl = document.getElementById('resultTitle');
  const descEl = document.getElementById('resultDescription');

  if (typeEl) typeEl.textContent = personalityType;
  if (titleEl) titleEl.textContent = personality.title;
  if (descEl) descEl.textContent = personality.content;

  // 渲染维度
  renderDimensions(scores, personalityType);

  // 显示结果页
  showPage('resultPage');

  // 显示广告弹窗
  showAdModal();

  // 清除进度
  clearProgress();
}

// 渲染维度
function renderDimensions(scores, type) {
  const types = type.split('');
  
  // 主动性 A/P
  const dimA = document.getElementById('dimA');
  if (dimA) {
    dimA.style.width = (scores.A * 100) + '%';
    // 如果是P类型，用另一种颜色
    if (types[0] === 'P') {
      dimA.classList.remove('active');
    } else {
      dimA.classList.add('active');
    }
  }
  
  // 直球/暗示 D/I
  const dimD = document.getElementById('dimD');
  if (dimD) {
    dimD.style.width = (scores.D * 100) + '%';
    if (types[1] === 'D') {
      dimD.classList.add('active');
    } else {
      dimD.classList.remove('active');
    }
  }
  
  // 边界 B/F
  const dimB = document.getElementById('dimB');
  if (dimB) {
    dimB.style.width = (scores.B * 100) + '%';
    if (types[2] === 'B') {
      dimB.classList.add('active');
    } else {
      dimB.classList.remove('active');
    }
  }
  
  // 冲突 C/E
  const dimC = document.getElementById('dimC');
  if (dimC) {
    dimC.style.width = (scores.C * 100) + '%';
    if (types[3] === 'C') {
      dimC.classList.add('active');
    } else {
      dimC.classList.remove('active');
    }
  }
}

// 重新测试
function retryQuiz() {
  answers = [];
  currentQuestion = 0;
  showPage('startPage');
  clearProgress();
}

// 分享结果
function shareResult() {
  const type = document.getElementById('resultType').textContent;
  const title = document.getElementById('resultTitle').textContent;

  const shareText = `我测出了【${type} ${title}】！测测你的关系人格有多危险？`;

  // 尝试分享（移动端）
  if (navigator.share) {
    navigator.share({
      title: 'RPI关系人格指数测试',
      text: shareText,
      url: window.location.href
    }).then(() => {
      alert('分享成功！');
    }).catch((err) => {
      console.log('分享失败，使用备用方案', err);
      copyToClipboard(shareText + '\n' + window.location.href);
      alert('已复制分享内容，快去分享给好友吧！');
    });
  } else {
    // 复制到剪贴板
    copyToClipboard(shareText + '\n' + window.location.href);
    alert('已复制分享内容，快去分享给好友吧！');
  }
}

// 复制到剪贴板
function copyToClipboard(text) {
  // 使用现代API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('复制成功');
    }).catch((err) => {
      console.log('现代API失败，使用备用方案', err);
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

// 备用复制方案
function fallbackCopy(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (!successful) {
      throw new Error('复制失败');
    }
  } catch (err) {
    console.error('复制失败:', err);
    alert('复制失败，请手动复制分享内容：\n' + text);
  }
}

// 保存进度
function saveProgress() {
  const progress = {
    currentQuestion,
    answers,
    timestamp: Date.now()
  };
  localStorage.setItem('rpi_progress', JSON.stringify(progress));
}

// 加载进度
function loadProgress() {
  const saved = localStorage.getItem('rpi_progress');
  if (saved) {
    const progress = JSON.parse(saved);
    // 如果进度在24小时内，询问是否继续
    if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) {
      if (confirm('上次有未完成的测试，是否继续？')) {
        currentQuestion = progress.currentQuestion;
        answers = progress.answers;
        questions = RPI_DATA.questions;
        personalities = Object.values(RPI_DATA.personalities);
        showPage('quizPage');
        renderQuestion();
      }
    }
  }
}

// 清除进度
function clearProgress() {
  localStorage.removeItem('rpi_progress');
}

// 显示广告弹窗
function showAdModal() {
  const modal = document.getElementById('adModal');
  const skipBtn = document.getElementById('adSkipBtn');
  const countdownEl = document.getElementById('adCountdown');

  if (!modal || !skipBtn || !countdownEl) {
    console.error('广告弹窗元素未找到');
    return;
  }

  modal.classList.remove('hidden');
  skipBtn.disabled = true;

  let countdown = 3;
  countdownEl.textContent = countdown;

  const timer = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;

    if (countdown <= 0) {
      clearInterval(timer);
      skipBtn.disabled = false;
      skipBtn.textContent = '跳过广告';
    }
  }, 1000);

  // 保存定时器以便清除
  modal.dataset.timerId = timer;
}

// 关闭广告弹窗
function closeAdModal() {
  const modal = document.getElementById('adModal');
  if (modal) {
    // 清除倒计时定时器
    if (modal.dataset.timerId) {
      clearInterval(parseInt(modal.dataset.timerId));
    }
    modal.classList.add('hidden');
  }
}

// 跳过广告
function skipAd() {
  closeAdModal();
}

// 辅助函数：计算RPI得分
function calculateRPIScores(answers, questions) {
  // 初始化所有维度的分数和计数
  const scores = { A: 0, P: 0, D: 0, I: 0, B: 0, F: 0, C: 0, E: 0 };
  const counts = { A: 0, P: 0, D: 0, I: 0, B: 0, F: 0, C: 0, E: 0 };
  const maxScores = { A: 0, P: 0, D: 0, I: 0, B: 0, F: 0, C: 0, E: 0 };
  
  answers.forEach((answerIndex, questionIndex) => {
    if (answerIndex === null || answerIndex === undefined) return;
    
    const question = questions[questionIndex];
    if (!question || !question.options || !question.options[answerIndex]) return;
    
    const selectedOption = question.options[answerIndex];
    
    // 获取选项的分数
    if (selectedOption && selectedOption.score) {
      Object.keys(selectedOption.score).forEach(dim => {
        const score = selectedOption.score[dim];
        scores[dim] = (scores[dim] || 0) + score;
        counts[dim] = (counts[dim] || 0) + 1;
        // 记录每个维度的最大可能分数（每个题目该维度最大是2）
        maxScores[dim] = (maxScores[dim] || 0) + 2;
      });
    }
  });
  
  console.log('原始分数:', scores);
  console.log('计数:', counts);
  console.log('最大分数:', maxScores);
  
  // 计算归一化分数 (0-1)
  // 对于对立的维度对，计算比例
  const result = { A: 0, D: 0, B: 0, C: 0 };
  
  // A/P 维度
  if (scores.A + scores.P > 0) {
    result.A = scores.A / (scores.A + scores.P);
  } else {
    result.A = 0.5;
  }
  
  // D/I 维度
  if (scores.D + scores.I > 0) {
    result.D = scores.D / (scores.D + scores.I);
  } else {
    result.D = 0.5;
  }
  
  // B/F 维度
  if (scores.B + scores.F > 0) {
    result.B = scores.B / (scores.B + scores.F);
  } else {
    result.B = 0.5;
  }
  
  // C/E 维度
  if (scores.C + scores.E > 0) {
    result.C = scores.C / (scores.C + scores.E);
  } else {
    result.C = 0.5;
  }
  
  console.log('最终分数:', result);
  
  return result;
}

// 辅助函数：获取人格类型
function getPersonalityType(scores) {
  const type = [];
  
  // 第1位：主动性维度 A(主动) / P(被动)
  type.push(scores.A > 0.5 ? 'A' : 'P');
  
  // 第2位：沟通维度 D(直球) / I(暗示)
  type.push(scores.D > 0.5 ? 'D' : 'I');
  
  // 第3位：边界维度 B(清晰) / F(模糊)
  type.push(scores.B > 0.5 ? 'B' : 'F');
  
  // 第4位：冲突维度 C(正面刚) / E(逃避)
  type.push(scores.C > 0.5 ? 'C' : 'E');
  
  return type.join('');
}

// 确保数据加载
setTimeout(() => {
  if (typeof RPI_DATA !== 'undefined') {
    questions = RPI_DATA.questions;
    personalities = Object.values(RPI_DATA.personalities);
  }
}, 100);
