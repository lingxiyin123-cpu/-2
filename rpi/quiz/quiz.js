// RPI测试答题页
const RPICalculator = require('../../../utils/rpi-calculator.js');

Page({
  data: {
    questions: [],
    currentIndex: 0,
    totalQuestions: 30,
    currentQuestion: {},
    answers: [],
    selectedIndex: -1,
    progress: 0,
    textAnimated: true,
    optionAnimated: true,
    canNext: false,
    showExitModal: false,
    optionLetters: ['A', 'B', 'C', 'D']
  },

  calculator: null,

  onLoad() {
    this.calculator = new RPICalculator();
    this.loadQuestions();
    this.loadProgress();
  },

  onShow() {
    this.setData({ textAnimated: true, optionAnimated: true });
  },

  // 加载题目
  loadQuestions() {
    const questions = RPICalculator.getQuestions();
    this.setData({
      questions: questions,
      totalQuestions: questions.length,
      currentQuestion: questions[0]
    });
    this.updateProgress();
  },

  // 加载进度
  loadProgress() {
    const savedProgress = wx.getStorageSync('rpi_quiz_progress');
    const savedAnswers = wx.getStorageSync('rpi_answers');
    
    if (savedProgress && savedAnswers) {
      const progress = parseInt(savedProgress);
      const answers = JSON.parse(savedAnswers);
      
      this.setData({
        currentIndex: progress,
        answers: answers,
        currentQuestion: this.data.questions[progress]
      });
      
      // 恢复已选答案
      if (answers[progress] !== undefined) {
        this.setData({
          selectedIndex: answers[progress],
          canNext: true
        });
      }
      
      this.updateProgress();
    }
  },

  // 保存进度
  saveProgress() {
    wx.setStorageSync('rpi_quiz_progress', this.data.currentIndex.toString());
    wx.setStorageSync('rpi_answers', JSON.stringify(this.data.answers));
  },

  // 更新进度
  updateProgress() {
    const progress = ((this.data.currentIndex + 1) / this.data.totalQuestions) * 100;
    this.setData({ progress: progress.toFixed(1) });
  },

  // 选择选项
  selectOption(e) {
    const index = e.currentTarget.dataset.index;
    const answers = this.data.answers;
    answers[this.data.currentIndex] = index;

    this.setData({
      selectedIndex: index,
      answers: answers,
      canNext: true
    });

    // 添加分数
    const score = this.data.currentQuestion.options[index].score;
    this.calculator.addScore(score);

    // 保存进度
    this.saveProgress();

    // 延迟自动下一题
    setTimeout(() => {
      if (this.data.currentIndex < this.data.totalQuestions - 1) {
        this.nextQuestion();
      }
    }, 500);
  },

  // 下一题
  nextQuestion() {
    if (!this.data.canNext) return;

    if (this.data.currentIndex >= this.data.totalQuestions - 1) {
      // 最后一题，查看结果
      this.showResult();
      return;
    }

    const nextIndex = this.data.currentIndex + 1;
    
    this.setData({
      textAnimated: false,
      optionAnimated: false
    });

    setTimeout(() => {
      const nextQuestion = this.data.questions[nextIndex];
      const savedAnswer = this.data.answers[nextIndex];

      this.setData({
        currentIndex: nextIndex,
        currentQuestion: nextQuestion,
        selectedIndex: savedAnswer !== undefined ? savedAnswer : -1,
        canNext: savedAnswer !== undefined,
        textAnimated: true,
        optionAnimated: true
      });

      this.updateProgress();
      this.saveProgress();
    }, 200);
  },

  // 上一题
  prevQuestion() {
    if (this.data.currentIndex === 0) return;

    const prevIndex = this.data.currentIndex - 1;

    this.setData({
      textAnimated: false,
      optionAnimated: false
    });

    setTimeout(() => {
      const prevQuestion = this.data.questions[prevIndex];
      const savedAnswer = this.data.answers[prevIndex];

      // 减去当前题的分数（重新计算）
      this.calculator.reset();
      for (let i = 0; i < prevIndex; i++) {
        if (this.data.answers[i] !== undefined) {
          const score = this.data.questions[i].options[this.data.answers[i]].score;
          this.calculator.addScore(score);
        }
      }

      this.setData({
        currentIndex: prevIndex,
        currentQuestion: prevQuestion,
        selectedIndex: savedAnswer !== undefined ? savedAnswer : -1,
        canNext: true,
        textAnimated: true,
        optionAnimated: true
      });

      this.updateProgress();
      this.saveProgress();
    }, 200);
  },

  // 显示结果
  showResult() {
    const result = this.calculator.calculateResult();
    
    // 保存结果
    wx.setStorageSync('rpi_result', JSON.stringify(result));
    
    // 清除答题进度
    wx.removeStorageSync('rpi_quiz_progress');
    wx.removeStorageSync('rpi_answers');

    // 跳转到结果页
    wx.redirectTo({
      url: '/pages/rpi/result/result'
    });
  },

  // 显示退出弹窗
  showExitModal() {
    this.setData({ showExitModal: true });
  },

  // 隐藏退出弹窗
  hideExitModal() {
    this.setData({ showExitModal: false });
  },

  // 确认退出
  confirmExit() {
    wx.navigateBack();
  },

  // 返回按钮处理
  onBackPress() {
    this.showExitModal();
    return true;
  }
});
