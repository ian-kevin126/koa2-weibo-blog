/**
 * @description res 的数据模型
 * @author kevinliao126
 */

/**
 * 基础模块
 */
class BaseModel {
  constructor({ errno, data, message }) {
    // errno是每次都会传的，正确的时候传data，错误的时候传message
    this.errno = errno
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}

/**
 * 成功的数据模型
 */
class SuccessModel extends BaseModel {
  constructor(data = {}) {
    super({
      errno: 0,
      data,
    })
  }
}

/**
 * 失败的数据模型
 */
class ErrorModel extends BaseModel {
  constructor({ errno, message }) {
    super({
      errno,
      message,
    })
  }
}

module.exports = {
  SuccessModel,
  ErrorModel,
}
