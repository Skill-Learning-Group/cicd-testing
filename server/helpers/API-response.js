module.exports = {
  APIsuccess: (status, data) => {
    return {
      success: true,
      status,
      data
    };
  },
  APIerror: (status, data) => {
    return {
      success: false,
      status,
      data
    };
  },
}