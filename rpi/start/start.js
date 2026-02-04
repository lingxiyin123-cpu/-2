// RPI测试开始页
const app = getApp();

Page({
  data: {
    personalities: [],
    userCount: 12847,
    btnAnimated: true
  },

  onLoad() {
    this.initPersonalities();
    this.animateUserCount();
  },

  onShow() {
    // 清除之前的答题进度
    wx.removeStorageSync('rpi_quiz_progress');
    wx.removeStorageSync('rpi_answers');
  },

  // 初始化人格类型预览
  initPersonalities() {
    const codes = ['ADBC', 'ADBE', 'ADFC', 'ADFE', 'AIBC', 'AIBE', 'AIFC', 'AIFE',
                   'PDBC', 'PDBE', 'PDFC', 'PDFE', 'PIBC', 'PIBE', 'PIFC', 'PIFE'];
    
    const gradients = [
      'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
      'linear-gradient(135deg, #4ECDC4, #45B7D1)',
      'linear-gradient(135deg, #FF4757, #FFA502)',
      'linear-gradient(135deg, #FFA502, #FF6B6B)',
      'linear-gradient(135deg, #96CEB4, #4ECDC4)',
      'linear-gradient(135deg, #45B7D1, #96CEB4)',
      'linear-gradient(135deg, #DDA0DD, #FF6B6B)',
      'linear-gradient(135deg, #FFEAA7, #DDA0DD)',
      'linear-gradient(135deg, #00FF88, #45B7D1)',
      'linear-gradient(135deg, #45B7D1, #00FF88)',
      'linear-gradient(135deg, #FF6B9D, #FFA502)',
      'linear-gradient(135deg, #A8E6CF, #FFD93D)',
      'linear-gradient(135deg, #6C5CE7, #A29BFE)',
      'linear-gradient(135deg, #74B9FF, #0984E3)',
      'linear-gradient(135deg, #FD79A8, #FDCB6E)',
      'linear-gradient(135deg, #B2BEC3, #636E72)'
    ];

    const personalities = codes.map((code, index) => ({
      code: code,
      gradient: gradients[index],
      animate: false
    }));

    this.setData({ personalities });

    // 依次动画显示
    personalities.forEach((item, index) => {
      setTimeout(() => {
        this.setData({
          [`personalities[${index}].animate`]: true
        });
      }, index * 100);
    });
  },

  // 动态增加用户数量
  animateUserCount() {
    setInterval(() => {
      const increment = Math.floor(Math.random() * 3);
      this.setData({
        userCount: this.data.userCount + increment
      });
    }, 5000);
  },

  // 开始测试
  startQuiz() {
    // 按钮点击动画
    this.setData({ btnAnimated: false });
    
    wx.navigateTo({
      url: '/pages/rpi/quiz/quiz',
      success: () => {
        setTimeout(() => {
          this.setData({ btnAnimated: true });
        }, 300);
      }
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '测测你的关系人格有多危险？',
      path: '/pages/rpi/start/start',
      imageUrl: '/images/rpi-share.png'
    };
  }
});
