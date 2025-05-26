let userInput = document.querySelector(".task-input");
let addButton = document.querySelector(".button-add");
let tabs = document.querySelectorAll(".tab-type div");
let underLine = document.getElementById("tab-underline");
let taskList = [];
let mode = "all";
let filterList = [];

addButton.addEventListener("mousedown", addTask);
userInput.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    addTask(event);
  }
});
for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

function addTask() {
  let taskValue = userInput.value;
  if (taskValue === "") return alert("할일을 입력해주세요");
  let task = {
    content: taskValue,
    isComplete: false,
    id: randomIDGenerator(),
  };

  taskList.push(task);
  userInput.value = "";
  render();
}

function render() {
  let result = "";
  list = [];
  if (mode === "all") {
    list = taskList;
  } else {
    list = filterList;
  }

  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete) {
      result += `<div class="task task-done" id="${list[i].id}">
        <span>${list[i].content}</span>
        <div class="button-box">
          <button onclick="toggleDone('${list[i].id}')"><i class="fas fa-undo-alt"></i></button>
          <button onclick="deleteTask('${list[i].id}')"><i class="fa fa-trash"></i></button>
          <button onclick="editTask('${list[i].id}')"><i class="fas fa-edit"></i></button>
        </div>
      </div>`;
    } else {
      result += `<div class="task" id="${list[i].id}">
        <span>${list[i].content}</span>
        <div class="button-box">
          <button onclick="toggleDone('${list[i].id}')"><i class="fa fa-check"></i></button>
          <button onclick="deleteTask('${list[i].id}')"><i class="fa fa-trash"></i></button>
          <button onclick="editTask('${list[i].id}')"><i class="fas fa-edit"></i></button>
        </div>
      </div>`;
    }
  }

  document.getElementById("task-board").innerHTML = result;
}

function toggleDone(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  filter();
}

function deleteTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === id) {
      taskList.splice(i, 1);
    }
  }
  filter();
}

function editTask(id) {
  const taskElement = document.getElementById(id);
  const taskObj = taskList.find(task => task.id === id);

  if (!taskElement || !taskObj) return;

  const inputHTML = `
    <input type="text" class="edit-input" value="${taskObj.content}" />
    <div class="button-box">
      <button onclick="saveEdit('${id}')"><i class="fa fa-save"></i></button>
      <button onclick="render()"><i class="fa fa-times"></i></button>
    </div>
  `;

  taskElement.innerHTML = inputHTML;

  taskElement.querySelector("input").focus();

  taskElement.querySelector("input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      saveEdit(id);
    }
  });
}

function saveEdit(id) {
  const taskElement = document.getElementById(id);
  const newContent = taskElement.querySelector("input").value.trim();

  if (newContent === "") {
    alert("내용을 입력해주세요.");
    return;
  }

  const taskObj = taskList.find(task => task.id === id);
  taskObj.content = newContent;

  render();
}

function filter(e) {
  if (e) {
    mode = e.target.id;
    underLine.style.width = e.target.offsetWidth + "px";
    underLine.style.left = e.target.offsetLeft + "px";
    underLine.style.top = e.target.offsetTop + (e.target.offsetHeight - 4) + "px";
  }

  filterList = [];
  if (mode === "ongoing") {
    for (let i = 0; i < taskList.length; i++) {
      if (!taskList[i].isComplete) {
        filterList.push(taskList[i]);
      }
    }
  } else if (mode === "done") {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete) {
        filterList.push(taskList[i]);
      }
    }
  }
  render();
}

function randomIDGenerator() {
  return "_" + Math.random().toString(36).substr(2, 9);
}


//다크모드 추가
document.getElementById("toggle-darkmode").addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".container").classList.toggle("dark-mode");
  document.querySelector("h1").classList.toggle("dark-mode");
  document.querySelector(".button-add").classList.toggle("dark-mode");

  const tasks = document.querySelectorAll(".task");
  const buttons = document.querySelectorAll(".button-box button");
  const underline = document.getElementById("tab-underline");

  tasks.forEach((el) => el.classList.toggle("dark-mode"));
  buttons.forEach((btn) => btn.classList.toggle("dark-mode"));
  underline.classList.toggle("dark-mode");
});

// 간단 메모 저장 기능
const memoInput = document.getElementById("memo-text");

if (memoInput) {
  // 저장된 메모 불러오기
  const savedMemo = localStorage.getItem("miniMemo");
  if (savedMemo) {
    memoInput.value = savedMemo;
  }

  // 입력하면 저장
  memoInput.addEventListener("input", () => {
    localStorage.setItem("miniMemo", memoInput.value);
  });
}


//시계 날짜
function updateDateTime() {
  const now = new Date();
  const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' };
  const optionsTime = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Seoul' };
  const dateString = now.toLocaleDateString('ko-KR', optionsDate);
  const timeString = now.toLocaleTimeString('ko-KR', optionsTime);
  document.getElementById('weather-time').textContent = `${dateString} ${timeString}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();

