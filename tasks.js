const form = document.querySelector(".js-form");
const input = form.querySelector("input");
const pending = document.querySelector(".js-pending");
const finished = document.querySelector(".js-finished");

const PENDING = 'PENDING';
const FINISHED = 'FINISHED';

let pendingArr, finishedArr;

let countId = 0;

function taskObj(text) {
    return {
        id: countId,
        text: text
    }
}

function delteBtn(event) {
    const currentBtn = event.target.parentNode
    const parnetEle = currentBtn.parentElement;
    if(parnetEle.className === 'js-pending') {
        const deletePending = findInPending(currentBtn.id);
        removeFromPending(currentBtn.id);
        parnetEle.removeChild(currentBtn);
    } else if(parnetEle.className === 'js-finished') {
        const deleteFinished = findInFinished(currentBtn.id);
        removeFromFinished(currentBtn.id);
        parnetEle.removeChild(currentBtn);
    };
    saveState();
}

function addToPending(task) {
    pendingArr.push(task);
}

function addToFinished(task) {
    finishedArr.push(task);
}

function removeFromFinished(taskId) {
    finishedArr = finishedArr.filter(function(task) {
        return task.id !== Number(taskId);
    })
}

function removeFromPending(taskId) {
    pendingArr = pendingArr.filter(function(task) {
        return task.id !== Number(taskId);
    })
}

function findInFinished(taskId) {
    return finishedArr.find(function(task) {
        return task.id === Number(taskId);
    });
}

function findInPending(taskId) {
    return pendingArr.find(function(task) {
        return task.id === Number(taskId);
    });
}

function handlePendingClick(event) {
    const finishedId = event.target.parentNode;
    const changeFinished = findInFinished(finishedId.id);

    finishedId.parentNode.removeChild(finishedId);
    removeFromFinished(finishedId.id);   
    addToPending(changeFinished);  
    paintPending(changeFinished);  
    saveState();                  
}

function handleFinishClick(event) {
    const pendingId = event.target.parentNode;
    const changePending = findInPending(pendingId.id);    //선택된 요소만 선택 

    pendingId.parentNode.removeChild(pendingId);
    removeFromPending(pendingId.id);    // 선택된 요소 이외의 요소를 찾음.
    addToFinished(changePending);   // 선택된 요소를 finished에 추가
    paintFinished(changePending);   // 선택된 요소를 finished에 그림 
    saveState();                     // 로컬 스토리지에 저장 
}

function bulidLi(task) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "&#9747;";

    if(task) {
        span.innerHTML = task.text;
        li.id = task.id;
    };

    li.append(span, deleteBtn);
    deleteBtn.addEventListener('click', delteBtn);
    return li;
}

function savePending(task) {
    pendingArr.push(task); 
}

function paintFinished(task) {
    const finishLi = bulidLi(task);
    const backInput = document.createElement('input');

    backInput.type = 'checkbox';
    backInput.checked = true;
    backInput.addEventListener('change', handlePendingClick);
    finishLi.appendChild(backInput);
    finished.appendChild(finishLi);
}

function paintPending(task) {
    const li = bulidLi(task);
    const complateInput = document.createElement('input');
    complateInput.type = 'checkbox';
    complateInput.checked = false;
    complateInput.addEventListener('change', handleFinishClick);
    li.appendChild(complateInput);
    pending.appendChild(li);
}

function handleSubmit(event) {
    event.preventDefault();
    countId++;
    const currentValue = taskObj(input.value);
    input.value = '';
    paintPending(currentValue); // 화면에 값을 그려야지?
    savePending(currentValue);  // array 에 값 저장 
    saveState();    // Local Storage 상태 저장
}

function saveState() {
    localStorage.setItem(PENDING, JSON.stringify(pendingArr));
    localStorage.setItem(FINISHED, JSON.stringify(finishedArr));
}

function restoreState() {
    pendingArr.forEach(function(task) {
        paintPending(task);
    });
    finishedArr.forEach(function(task) {
        paintFinished(task);
    });
}

function loadState() {
    pendingArr = JSON.parse(localStorage.getItem(PENDING)) || [];
    finishedArr = JSON.parse(localStorage.getItem(FINISHED)) || [];
}

function init() {
    form.addEventListener('submit', handleSubmit);
    loadState();
    restoreState(); // 다시 화면에 그려줌
}

init();