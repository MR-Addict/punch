import formValidator from "./formValidator.js";
const fv = new formValidator(".container-body");

// name validation
fv.register("#name", (value, inputField) => {
  if (value.length === 0) {
    return {
      pass: false,
      error: "姓名不能为空哦！",
    };
  } else if (value.length > 10) {
    return {
      pass: false,
      error: "名字太长啦！",
    };
  }
  return {
    pass: true,
  };
});

fv.register("#notes", (value, inputField) => {
  if (value.length === 0) {
    return {
      pass: false,
      error: "笔记内容不能为空哦！",
    };
  } else if (value.length < 4) {
    return {
      pass: false,
      error: "笔记内容至少4个字哦！",
    };
  } else if (value.length > 500) {
    return {
      pass: false,
      error: "你写的笔记太长啦！",
    };
  }
  return {
    pass: true,
  };
});
