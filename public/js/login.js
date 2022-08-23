import formValidator from "./formValidator.js";
const fv = new formValidator(".container-body");

// name validation
fv.register("#username", (value, inputField) => {
  if (value.length === 0) {
    return {
      pass: false,
      error: "用户名不能为空哦！",
    };
  } else if (value.length > 10) {
    return {
      pass: false,
      error: "用户名太长啦！",
    };
  }
  return {
    pass: true,
  };
});

// password validation
fv.register("#password", (value, inputField) => {
  if (value.length === 0) {
    return {
      pass: false,
      error: "密码不能为空哦！",
    };
  } else if (value.length > 20) {
    return {
      pass: false,
      error: "密码太长啦！",
    };
  }
  return {
    pass: true,
  };
});
