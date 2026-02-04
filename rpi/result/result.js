// RPI测试结果页
Page({
  data: {
    result: null,
    personality: null,
    showShareModal: false
  },

  onLoad() {
    this.loadResult();
  },

  // 加载结果
  loadResult() {
    const resultStr = wx.getStorageSync('rpi_result');
    
    if (!resultStr) {
      // 没有结果，返回开始页
      wx.redirectTo({
        url: '/pages/rpi/start/start'
      });
      return;
    }

    const result = JSON.parse(resultStr);
    
    this.setData({
      result: result,
      personality: result.personality
    });

    // 动画显示维度条
    setTimeout(() => {
      this.animateDimensions();
    }, 500);
  },

  // 动画显示维度
  animateDimensions() {
    // 维度条已经在wxml中通过transition实现动画
  },

  // 再测一次
  retake() {
    wx.showModal({
      title: '重新测试',
      content: '确定要重新测试吗？当前结果将被清除',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('rpi_result');
          wx.redirectTo({
            url: '/pages/rpi/start/start'
          });
        }
      }
    });
  },

  // 保存图片
  saveImage() {
    this.setData({ showShareModal: true });
    
    // 实际项目中这里应该使用canvas生成图片
    wx.showToast({
      title: '图片生成中...',
      icon: 'loading'
    });

    setTimeout(() => {
      wx.hideToast();
      wx.showModal({
        title: '提示',
        content: '分享图片功能需要接入canvas绘图，当前为演示版本',
        showCancel: false
      });
    }, 1000);
  },

  // 隐藏分享弹窗
  hideShareModal() {
    this.setData({ showShareModal: false });
  },

  // 分享
  onShareAppMessage() {
    const { personality, result } = this.data;
    
    return {
      title: `我是【${personality.name}】，测测你的关系人格有多危险？`,
      path: '/pages/rpi/start/start',
      imageUrl: '/images/rpi-share.png'
    };
  },

  // 朋友圈分享
  onShareTimeline() {
    const { personality, result } = this.data;
    
    return {
      title: `我是【${personality.name}】，测测你的关系人格有多危险？`,
      query: '',
      imageUrl: '/images/rpi-share.png'
    };
  }
});
