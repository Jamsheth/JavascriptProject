// var state={
//     tasklist:[
//         {
//         imageUrl: "",
//         imageName: "",
//         imageType:"",
//         Description:""
//         },
//         {
//             imageUrl: "",
//         imageName: "",
//         imageType:"",
//         Description:""
//         },
//         {
//             imageUrl: "",
//         imageName: "",
//         imageType:"",
//         Description:""
//         }
//     ]
// }

var state={
    taskList:[]/* use to store in localstorage */
};

//dom objects
var taskContents=document.querySelector(".task__contents");
var taskModal=document.querySelector(".task__modal__body");

//add to cart dynamic coding whis created from the add to cart
/* 

`` this symbol(acute/back quote) is used to write the html code in JS

by using ${} we can achive js variables in html*/
var htmlTaskContent=({id, title, description, type, url})=> `
 <div class="col-md-6 col-lg-4 mt-3" id="${id}" key="${id}">
      <div class="card shadow-sm task__card">
        <div class="card-header d-flex justify-content-end task__card__header">
          <button type="button" class="btn btn-outline-info mr-2" name="${id}">
            <i class="fas fa-pencil-alt" name="${id}" 
            onclick="editTask.apply(this, arguments)"></i>
          </button>
          <button
            type="button"
            class="btn btn-outline-danger mr-2"
            name="${id}"
            onclick="deleteTask.apply(this, arguments)"
          >
            <i class="fas fa-trash-alt" name="${id}"></i>
          </button>
        </div>
        <div class="card-body">
          ${ url ? `<img
            width="100%"
            src="${url}"
            alt="card image cap"
            class="card-img-top md-3 rounded-lg"
           />`
            :`<img
            width="100%"
            src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg"
            alt="card image cap"
            class="card-img-top md-3 rounded-lg"
          />` }
          <h4 class="card-title">${title}</h4>
          <p
            class="descrition trim-3 lines text-muted data-gram_editor='false'"
          >
            ${description}
          </p>
          <div class="tags text-white d-flex flex-wrap">
            <span class="badge bg-primary m-1">${type}</span>
          </div>
        </div>
        <div class="card-footer">
          <button
            type="button"
            class="btn btn-outline-primary float-right"
            data-bs-toggle="modal"
            data-bs-target="#showTask" id=${id} onclick='openTask.apply(this, arguments)'
            
          >
            Open Task
          </button>
        </div>
      </div>
    </div>
`;

//open task model coding
var htmlModalContent=({id, title, description, url})=> {
  var date= new Date(parseInt(id));
  return`
  <div id=${id}>
   ${ url ? `<img
            width="100%"
            src="${url}"
            alt="card image cap"
            class="card-img-top md-3 rounded-lg"
          />`
         : `<img
            width="100%"
            src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg"
            alt="card image cap"
            class="card-img-top md-3 rounded-lg"
          />`}
          <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
          <h2 class="my-3">${title}</h2>
          <p class="lead">${description}</p>
  </div>`;
};

//stores the datas in localstorage and tasklist array
var updateLocalStorage=()=>{
  localStorage.setItem('task', JSON.stringify({
    tasks: state.taskList,
  }))
}

//refresh
var loadInitialData=()=>{
  var localStorageCopy = JSON.parse(localStorage.task)

  if(localStorageCopy) state.taskList =localStorageCopy.tasks;

  state.taskList.map((cardDate)=>{
    taskContents.insertAdjacentHTML("beforeend",htmlTaskContent(cardDate));
  })
}

//fill the form and stored in localstorage and tasklist array
var handleSubmit=(event)=>{
  const id=`${Date.now()}`;
  const input={
    url: document.getElementById("imageUrl").value,
    title: document.getElementById("imageName").value,
    type: document.getElementById("imageType").value,
    description: document.getElementById("Description").value,
  };
  if(input.title===''|| input.type===''|| input.description===''){
    return alert("Please fill the Required Fields")
  }


  taskContents.insertAdjacentHTML("beforeend",htmlTaskContent({
    ...input,id
  }))
  state.taskList.push({...input,id});
  updateLocalStorage();
};

// when it looks same then only it open
var openTask=(e)=>{
  if(!e) e= window.event;
  var getTask = state.taskList.find(({id})=> id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

//delete the card body usin filter because it romes doesn't match datas
var deleteTask=(e)=>{
  if(!e) e= window.event;
  var targetID =e.target.getAttribute("name");
  var type= e.target.tagName;
  // console.log(targetID);
  var removeTask=state.taskList.filter(({id})=>id !== targetID);
  state.taskList=removeTask;
  updateLocalStorage();
  if (type=="BUTTON"){
    console.log(e.target.parentNode.parentNode.parentNode)
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode.parentNode
    );
};

//setattributes provides a certain additional information
var editTask=(e)=>{
  if(!e) e= window.event;
  var targetID =e.id;
  var type= e.target.tagName;

  var parentNode;
  let taskTitle;
  var taskDescription;
  var taskType;
  var submitButton;

  if (type=="BUTTON"){
    parentNode=e.target.parentNode.parentNode
  }else{
    parentNode=e.target.parentNode.parentNode.parentNode
  }

  taskTitle=parentNode.childNodes[3].childNodes[3];
  taskDescription=parentNode.childNodes[3].childNodes[5];
  taskType=parentNode.childNodes[3].childNodes[7].childNodes[1];
  console.log(taskTitle,taskDescription,taskType)
  submitButton=parentNode.childNodes[5].childNodes[1]

  taskTitle.setAttribute("contenteditable","true");
  taskDescription.setAttribute("contenteditable","true");
  taskType.setAttribute("contenteditable","true");

  submitButton.setAttribute("onclick","saveEdit.apply(this, arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML="Save Changes"
}

//to change the button name from save change to oprn task
 var saveEdit =(e)=>{
  if(!e) e= window.event;
  var targetID =e.target.id;
  var parentNode= e.target.parentNode.parentNode;
  // console.log(parentNode)

  var taskTitle=parentNode.childNodes[3].childNodes[3];
  var taskDescription=parentNode.childNodes[3].childNodes[5];
  var taskType=parentNode.childNodes[3].childNodes[7].childNodes[1];
  var submitButton=parentNode.childNodes[5].childNodes[1]

  var updateData={
    taskTitle:taskTitle.innerHTML,
    taskDescription:taskDescription.innerHTML,
    taskType:taskType.innerHTML,
  };

  var stateCopy=state.taskList;
  stateCopy=stateCopy.map((task)=>
  task.id=== targetID
  ?{
    id:task.id,
    title:updateData.taskTitle,
    description:updateData.taskDescription,
    type: updateData.taskType,
    url: task.url,
  }
  :task
  );
  state.taskList=stateCopy;
  updateLocalStorage();
  taskTitle.setAttribute("contenteditable","false");
  taskDescription.setAttribute("contenteditable","false");
  taskType.setAttribute("contenteditable","false");

  submitButton.setAttribute("onclick","openTask.apply(this, arguments)");
  submitButton.setAttribute("data-bs-toggle","modal");
  submitButton.setAttribute("data-bs-target","#showTask");
  submitButton.innerHTML="Open Task";
 }

 //search the image
 var searchTask =(e)=>{
  if(!e) e= window.event;

  while(taskContents.firstChild){
    taskContents.removeChild(taskContents.firstChild);
  }
  var resultData=state.taskList.filter(({title})=> title.includes(e.target.value));
  console.log(resultData);
  resultData.map((cardData)=>{
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  })
 }
