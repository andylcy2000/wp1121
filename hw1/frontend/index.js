/* global axios */

const diaryitemTemplate = document.querySelector("#diary-item-template");
const diaryitemTemplate_edit = document.querySelector("#diary-item-template-edit");
const diaryitemTemplate_edit2 = document.querySelector("#diary-item-template-edit2");
const diaryviewTemplate = document.querySelector("#view-diary-template");

const diaryList = document.querySelector("#diarys");
const diaryEditList = document.querySelector("#diarys-edit");
const diaryViewList = document.querySelector("#diarys-view");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

const dayList = ['日','一','二','三','四','五','六'];
async function main() {
  const diarys = await getAllDiarys();
  setupHomeEventListeners(diarys);
  
  

}

function setupHomeEventListeners(diarys) {
  const addDiaryButton = document.querySelector("#diary-add");
  const filterButton = document.querySelector("#filter");
  addDiaryButton.addEventListener("click", async () => {
    
    createDiaryEdit();
  });
  filterButton.addEventListener("click", async () => {
    createFilterMode(diarys);
    
  });

}


async function getAllDiarys () {
  try {
    const diarys = await getDiarys();
    diarys.forEach((diary) => {
      renderDiary(diary);
    })
    return diarys;
  } catch (error) {
    alert("Failed to load diaries");
  }
}

function renderDiary(diary) {

  const item = createDiaryElement(diary);
  diaryList.appendChild(item);
}

async function viewDiary(diary) {
  const item = await getViewDiary(diary.id);
  createDiaryView(item);
}

function createDiaryView(diary) {
  const item = diaryviewTemplate.content.cloneNode(true);
  const date = item.querySelector(".history-date");
  const dialog = item.querySelector(".view-mode");
  date.innerText = diary.date_str;

  const tag1 = item.querySelector(".view-tag1");
  const tag2 = item.querySelector(".view-tag2");
  tag1.innerText = diary.selectTag1_content;
  tag2.innerText = diary.selectTag2_content;
  const content = item.querySelector(".diary-content");
  content.innerText = diary.diary_content;
  const wanna_show = item.querySelector(".view-mode");
  diaryViewList.appendChild(wanna_show);
  wanna_show.showModal();

  const closeButton = dialog.querySelector("button.view-cancel");
  closeButton.addEventListener("click", async () => {
    wanna_show.close();
  });
  const reviseButton = dialog.querySelector(".diary-revise");

  reviseButton.addEventListener("click", async () => {
    createDiaryRevise(diary);
    wanna_show.close();
  });
}

async function createFilterMode(diarys) {
  const filter_mode = document.querySelector("#filter-mode");
  filter_mode.showModal();
  const school_check = document.querySelector("#school");
  const people_check = document.querySelector("#people");
  const club_check = document.querySelector("#club");
  const happy_check = document.querySelector("#happy");
  const angry_check = document.querySelector("#angry");
  const sad_check = document.querySelector("#sad");
  const setFilter = document.querySelector("#finish-select");
  const cancelFilter = document.querySelector("#cancel-filter");
  setFilter.addEventListener("click", () => {
    let all =[];
    let shows = [];
    if(school_check.checked){
      all.push("學業");
    }
    if(people_check.checked){
      all.push("人際");
    }
    if(club_check.checked){
      all.push("社團");
    }
    if(happy_check.checked){
      all.push("快樂");
    }
    if(angry_check.checked){
      all.push("生氣");
    }
    if(sad_check.checked){
      all.push("難過");
    }
    diaryList.replaceChildren();
    diarys.forEach((diary) => {
      let check = 0;
      all.forEach((tag) => {
        if(diary.selectTag1_content===tag || diary.selectTag2_content===tag){
           check = 1;
        }
      })
      if(check){
        shows.push(diary);
      }
    })
    shows.forEach((show) => {
      renderDiary(show);
    })
    filter_mode.close();
  });
  
cancelFilter.addEventListener("click",() =>{
  filter_mode.close();
})

}

function createDiaryRevise(diary) {
  const item = diaryitemTemplate_edit2.content.cloneNode(true);
  const date = item.querySelector(".current-date");
  date.innerText=diary.date_str;
  const date_str = date.innerText;
  const wanna_show = item.querySelector(".edit-mode");
  
  const saveDiaryButton = wanna_show.querySelector("button#diary-save");
  
  const closeButton = wanna_show.querySelector("button.edit-cancel");
  const diaryInput = wanna_show.querySelector("textarea#diary-input");
  diaryInput.value = diary.diary_content;
  const selectTag1 = wanna_show.querySelector("select.select-tag1");
  selectTag1.value = diary.selectTag1_content;
  const selectTag2 = wanna_show.querySelector("select.select-tag2");
  selectTag2.value = diary.selectTag2_content;
  diaryEditList.appendChild(wanna_show);
  wanna_show.showModal();

  saveDiaryButton.addEventListener("click", async () => {
    const diary_content = diaryInput.value;
    const selectTag1_content = selectTag1.value;
    const selectTag2_content = selectTag2.value;
   

    if (!diary_content) {
      alert("Please enter a diary content!");
      return;
    }

    try {
      wanna_show.close();
      const diary_ = await updateDiaryStatus(diary.id, { diary_content, selectTag1_content,selectTag2_content, date_str});
      renderRevisedDiary(diary_);
      createDiaryView(diary_);
    } catch (error) {
      alert("Failed to revise diary1!");
      return;
    }
  });

  closeButton.addEventListener("click" ,async () => {
    diaryInput.value = "";
    selectTag1.value = "";
    selectTag2.value = "";
    wanna_show.close();
    createDiaryView(diary);

});
}

function renderRevisedDiary (diary) {
  const container = document.querySelector(`#diarys`);
  
  const div = container.querySelector(`[data-id="${diary.id}"]`);
  const tag1 = div.querySelector(".diary-tag1");
  const tag2 = div.querySelector(".diary-tag2");
  tag1.innerText = diary.selectTag1_content;
  tag2.innerText = diary.selectTag2_content;
}

function createDiaryElement(diary) {
  const item = diaryitemTemplate.content.cloneNode(true);
  const container = item.querySelector(".diary-item");
  const browse_button = item.querySelector(".browse");
  container.dataset.id = diary.id;
  browse_button.id = diary.id;
  browse_button.addEventListener("click", async () => {
     viewDiary(diary);
  });
  const date = item.querySelector(".diary-date");
  date.innerText = diary.date_str;
  const tag1 = item.querySelector(".diary-tag1");
  const tag2 = item.querySelector(".diary-tag2");
  tag1.innerText = diary.selectTag1_content;
  tag2.innerText = diary.selectTag2_content;
  
  const deleteButton = item.querySelector("button.delete-diary");
  deleteButton.dataset.id = diary.id;
  deleteButton.addEventListener("click", () => {
    deleteDiaryElement(diary.id);
  });
  return item;
}

function createDiaryEdit() {

  const item = diaryitemTemplate_edit.content.cloneNode(true);
  let today= new Date();
  const edit_year = item.querySelector(".date-year");
  const edit_month = item.querySelector(".date-month");
  const edit_date = item.querySelector(".date-date");
  const edit_day = item.querySelector(".date-day");
  edit_year.value=`${today.getFullYear()}`;
  edit_month.value = `${today.getMonth()+1}`.padStart(2,'0');
  edit_date.value = `${today.getDate()}`.padStart(2,'0');
  edit_day.value = `${dayList[today.getDay()]}`;
  //date.innerText=today.getFullYear()+"."+`${today.getMonth()+1}`.padStart(2,'0')+"."+`${today.getDate()}`.padStart(2,'0') + ` (${dayList[today.getDay()]})`;
  
  const wanna_show = item.querySelector(".edit-mode");
  diaryEditList.appendChild(wanna_show);
  const saveDiaryButton = wanna_show.querySelector("button#diary-save");
  wanna_show.showModal();
  const closeButton = wanna_show.querySelector("button.edit-cancel");
  const diaryInput = wanna_show.querySelector("textarea#diary-input");
  const selectTag1 = wanna_show.querySelector("select.select-tag1");
  const selectTag2 = wanna_show.querySelector("select.select-tag2");

  saveDiaryButton.addEventListener("click", async () => {
    const diary_content = diaryInput.value;
    const selectTag1_content = selectTag1.value;
    const selectTag2_content = selectTag2.value;
    const date_str = `${parseInt(edit_year.value)}` + "." +`${parseInt(edit_month.value)}` + "." + `${parseInt(edit_date.value)}` + " " +`(${edit_day.value})`;

    if (!diary_content) {
      alert("Please enter a diary content!");
      return;
    }
    try {
      if(!daychecker(edit_year.value,edit_month.value,edit_date.value,edit_day.value)){
        alert("Invalid Date !");
        return;
      }
    }catch(error){
      alert("Woops!");
      return;
    }
    

    try {
      wanna_show.close();
      
      const diary = await createDiary({ diary_content, selectTag1_content,selectTag2_content, date_str});
      renderDiary(diary);
    } catch (error) {
      alert("Failed to create diary1!")
      return;
    }
  });

  closeButton.addEventListener("click" ,async () => {
    diaryInput.value = "";
    selectTag1.value = "";
    selectTag2.value = "";
    wanna_show.close();

});
}

function daychecker(year,month,date,day) {
  let limitInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  year = parseInt(year);
  month = parseInt(month);
  date = parseInt(date);
  if (year %4===0){
    limitInMonth.splice(1,1,29);
  }
  return date <= limitInMonth[month-1] && dayList.includes(day) && date>=0;
}


async function deleteDiaryElement(id) {
  try {
    await deleteDiaryById(id);
  } catch (error) {
    alert("Failed to delete diary!");
  } finally {
    const diary = document.querySelector(`[data-id="${id}"]`)
    diary.remove();
  }
}



async function getDiarys() {
  const response = await instance.get("/diarys");
  return response.data;
}

async function getViewDiary(id) {
  const response = await instance.get(`/diarys/${id}`);
  return response.data;
}

async function createDiary(diary) {
  const response = await instance.post("/diarys", diary);
  return response.data;
}

// eslint-disable-next-line no-unused-vars
async function updateTodoStatus(id, todo) {
  const response = await instance.put(`/todos/${id}`, todo);
  return response.data;
}

async function updateDiaryStatus(id, diary) {
  const response = await instance.put(`/diarys/${id}`, diary);
  return response.data;
}



async function deleteDiaryById(id) {
  const response = await instance.delete(`/diarys/${id}`);
  return response.data;
}

main();
