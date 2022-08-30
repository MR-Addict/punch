import formValidator from "./formValidator.js";
const fv = new formValidator(".container-body");

const department_options = {
  技术开发部:
    '<select id="group" name="group"><option value="航模组">航模组</option><option value="编程组">编程组</option><option value="电子组">电子组</option><option value="静模组">静模组</option></select><div class="arrow-icon"><img src="/images/triangle.svg" alt="arrow" /></div>',
  组织策划部:
    '<select id="group" name="group"><option value="PU组">PU组</option><option value="场地组">场地组</option><option value="财务组">财务组</option><option value="统筹组">统筹组</option><option value="人事组">人事组</option></select><div class="arrow-icon"><img src="/images/triangle.svg" alt="arrow" /></div>',
  科普活动部:
    '<select id="group" name="group"><option value="策划组">策划组</option><option value="财务组">财务组</option><option value="活动组">活动组</option><option value="外联组">外联组</option></select><div class="arrow-icon"><img src="/images/triangle.svg" alt="arrow" /></div>',
  新闻宣传部:
    '<select id="group" name="group"><option value="微信推送组">微信推送组</option><option value="视频海报组">视频海报组</option><option value="摄影组">摄影组</option></select><div class="arrow-icon"><img src="/images/triangle.svg" alt="arrow" /></div>',
  对外联络部:
    '<select id="group" name="group"><option value="校外组">校外组</option><option value="校外组">校外组</option><option value="赞助组">赞助组</option></select><div class="arrow-icon"><img src="/images/triangle.svg" alt="arrow" /></div>',
  双创联合服务部: "",
};

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

// notes validation
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

const depart_select = document.getElementById("department");
depart_select.addEventListener("change", () => {
  document.querySelector(".container-body .group").innerHTML = department_options[depart_select.value];
});
