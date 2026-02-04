// RPI关系人格指数 - 计分逻辑和标签生成

const RPI_DATA = require('./rpi-data.js');

class RPICalculator {
  constructor() {
    this.dimensions = {
      A: 0, // 主动进攻型
      P: 0, // 被动防守型
      D: 0, // 直球表达型
      I: 0, // 暗示迂回型
      B: 0, // 边界清晰型
      F: 0, // 边界模糊型
      C: 0, // 正面刚型
      E: 0  // 逃避冷处理型
    };
  }

  // 重置分数
  reset() {
    this.dimensions = {
      A: 0, P: 0, D: 0, I: 0, B: 0, F: 0, C: 0, E: 0
    };
  }

  // 添加单题分数
  addScore(score) {
    for (let key in score) {
      if (this.dimensions.hasOwnProperty(key)) {
        this.dimensions[key] += score[key];
      }
    }
  }

  // 计算最终结果
  calculateResult() {
    // 确定每个维度的极性
    const initiative = this.dimensions.A >= this.dimensions.P ? 'A' : 'P';
    const expression = this.dimensions.D >= this.dimensions.I ? 'D' : 'I';
    const boundary = this.dimensions.B >= this.dimensions.F ? 'B' : 'F';
    const conflict = this.dimensions.C >= this.dimensions.E ? 'C' : 'E';

    // 组合成4位代码
    const code = initiative + expression + boundary + conflict;

    // 获取人格解读
    const personality = RPI_DATA.personalities[code];

    // 计算各维度百分比
    const totalInitiative = this.dimensions.A + this.dimensions.P;
    const totalExpression = this.dimensions.D + this.dimensions.I;
    const totalBoundary = this.dimensions.B + this.dimensions.F;
    const totalConflict = this.dimensions.C + this.dimensions.E;

    return {
      code: code,
      personality: personality,
      scores: {
        A: totalInitiative > 0 ? Math.round((this.dimensions.A / totalInitiative) * 100) : 50,
        P: totalInitiative > 0 ? Math.round((this.dimensions.P / totalInitiative) * 100) : 50,
        D: totalExpression > 0 ? Math.round((this.dimensions.D / totalExpression) * 100) : 50,
        I: totalExpression > 0 ? Math.round((this.dimensions.I / totalExpression) * 100) : 50,
        B: totalBoundary > 0 ? Math.round((this.dimensions.B / totalBoundary) * 100) : 50,
        F: totalBoundary > 0 ? Math.round((this.dimensions.F / totalBoundary) * 100) : 50,
        C: totalConflict > 0 ? Math.round((this.dimensions.C / totalConflict) * 100) : 50,
        E: totalConflict > 0 ? Math.round((this.dimensions.E / totalConflict) * 100) : 50
      },
      rawScores: { ...this.dimensions }
    };
  }

  // 获取所有题目
  static getQuestions() {
    return RPI_DATA.questions;
  }

  // 获取单题
  static getQuestion(index) {
    return RPI_DATA.questions[index];
  }

  // 获取题目总数
  static getTotalQuestions() {
    return RPI_DATA.questions.length;
  }

  // 获取所有人格类型
  static getAllPersonalities() {
    return RPI_DATA.personalities;
  }

  // 获取单个人格类型
  static getPersonality(code) {
    return RPI_DATA.personalities[code];
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RPICalculator;
}
