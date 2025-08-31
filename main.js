const form = document.querySelector("#form");
const listContainer = document.querySelector("#listContainer");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const input = document.querySelector("#search");
  if (input.value == "") {
    return alert(`Please enter text`);
  }
  createTask(input.value);
});

export function createTask(text, checked = false) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("itemDiv");

  //checked unchecked image creation
  const statusImg = document.createElement("img");
  statusImg.classList.add(checked ? "checkedImg" : "uncheckedImg");
  statusImg.src = checked ? `images/checked.png` : `images/unchecked.png`;
  itemDiv.append(statusImg);

  const para = document.createElement("p");
  para.classList.add("item");
  para.innerText = text;
  itemDiv.append(para);

  const closeImg = document.createElement("img");
  closeImg.classList.add("closeImg");
  closeImg.src = `images/close.png`;
  itemDiv.append(closeImg);

  listContainer.prepend(itemDiv);
  saveTasks();
}


//Updation of task
listContainer.addEventListener("click", function (e) {
  if(e.target.classList.contains("closeImg")){
    e.target.parentElement.remove();
    saveTasks();
  }
  else if(e.target.classList.contains("uncheckedImg")){
    e.target.classList.replace("uncheckedImg", "checkedImg");
    e.target.src = `images/checked.png`;
    saveTasks();
  }
  else if(e.target.classList.contains("checkedImg")){
    e.target.classList.replace("checkedImg", "uncheckedImg");
    e.target.src = `images/unchecked.png`;
    saveTasks();
  }
  else if(e.target.classList.contains("item") && e.detail===2){//double click
    editText(e.target)
  }
});

function editText(element){
  const para = element;

  // 1. create an input element
  const input = document.createElement("input");
  input.type = "text";
  input.value = para.innerText;   // pre-fill input with current text
  input.classList.add("editInput");
  para.replaceWith(input);   // 2. replace <p> with <input>

  // 3. save on Enter key or blur behaviour --> means clicked somewhere outside
  input.addEventListener("blur", blurHandler);

  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      input.removeEventListener("blur", blurHandler); // prevent double call
      finishEdit(input,para);
    }
  });

  function blurHandler(){ //seperately written so that it can be removed
    finishEdit(input,para);
  }
}

// helper function
function finishEdit(input,para) {
  const newText = input.value.trim() || "Untitled task";
  para.innerText = newText;
  input.replaceWith(para);
  saveTasks();
}


//Local storage 
function saveTasks() {
  const tasksNodeList = document.querySelectorAll(".itemDiv");
  const tasksArray = [...tasksNodeList];
  
  const tasks = tasksArray.map((taskDiv) => {
    const text = taskDiv.querySelector(".item").innerText;
    const isChecked = taskDiv.querySelector("img").classList.contains("checkedImg");
    return { text, checked: isChecked }; //text:text shorthand
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Asyncronous task
function loadTasks() {
  try {
    const data = localStorage.getItem("tasks");
    const tasksArray = data ? JSON.parse(data) : [];

    // Render tasks (in reverse order so newest is on top)
    for (let i = tasksArray.length - 1; i >= 0; i--) {
      createTask(tasksArray[i].text, tasksArray[i].checked);
    }
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

window.addEventListener("DOMContentLoaded", loadTasks);
