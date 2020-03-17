(function () {
  const dataPanel = document.querySelector("#data-panel");

  const baseURL = "https://lighthouse-user-api.herokuapp.com";

  const indexURL = baseURL + "/api/v1/users";

  const modal = document.querySelector('#exampleModal')

  const itemPerPage = 24

  const searchBar = document.querySelector('#searchBar')

  const searchInput = document.querySelector('#searchInput')

  const ageRange = document.querySelector('#ageRange')

  const ageForm = document.querySelector('#ageForm')

  const genderIcon = document.querySelector('#genderIcon')

  const genderModal = document.querySelector('#genderModal')


  let data = []

  let pagination = []

  let paginationIcon = document.querySelector('#pagination')
  // displayUser(data);

  //display all user

  axios
    .get(indexURL)

    .then((res) => {
      data.push(...res.data.results);
      getTotalPage(data)
      getPageData(1, data)

    }).catch(err => console.log(err));


  function displayUser(data) {



    let htmlContent = "";


    data.forEach((item) => {



      htmlContent += `
        
        <div class="user-card col-6 col-sm-4 col-md-3 col-lg-2 d-flex flex-column">
          
          
            <img data-toggle="modal" data-target="#userModal" class="user-pic rounded-circle w-100" src="${item.avatar}" alt="user picture"  data-id=${item.id}>
          
          
          
          <div class="user-name d-flex justify-content-around">
            <h5 class="font-weight-bold">${item.name} </h5>
            <h5 class='font-weight-bold'>${item.surname}</h5>
          </div>
        </div>
      </div>
`
    });

    dataPanel.innerHTML = htmlContent


  }

  // age listener

  ageForm.addEventListener('submit',(e)=>{

  
    let ageFilter = data.filter(item=> item.age <= ageRange.value)

    getTotalPage(ageFilter)
    getPageData(1,ageFilter)
  })

  // gender listener

  genderIcon.addEventListener('click',(e)=>{
    
    
    let male = data.filter(item => item.gender === 'male')
    let female = data.filter(item => item.gender === 'female')

    if(e.target.matches('.male')){
      
      getTotalPage(male)
      getPageData(1,male)

    } else if(e.target.matches('.female')){

      getTotalPage(female)
      getPageData(1,female)
    } else if(e.target.matches('.all')){

      getTotalPage(data)
      getPageData(1,data)
    }

  })

  //css animate
  paginationIcon.addEventListener('click', (e) => {

    if (e.target.tagName === 'A') {

      getPageData(e.target.dataset.page)
    }
  })

  //show modal when click
  dataPanel.addEventListener('mouseover', (e) => {

    if (e.target.matches('.user-pic')) {
      
      e.target.classList.add('animated', 'infinite', 'jello')

    }

    setTimeout(function () {
      e.target.classList.remove('animated', 'infinite', 'jello')
    }, 1000)

  })
  dataPanel.addEventListener('click', (e) => {

    showModal(e)
  })
// search listener

  searchBar.addEventListener('submit',(e)=>{

    e.preventDefault()
    let input = searchInput.value.toString().toLowerCase()
    console.log(input)

    let results = []
    data.forEach(i =>{

      if (i.id.toString().toLowerCase().includes(input)){
        return results.push(i)
      } else if (i.age.toString().toLowerCase().includes(input)){
        return results.push(i)
      } else if (i.birthday.toLowerCase().includes(input)){
        return results.push(i)
      } else if (i.email.toLowerCase().includes(input)) {
        return results.push(i)
      } else if (i.name.toLowerCase().includes(input)) {
        return results.push(i)
      }
       else if (i.surname.toLowerCase().includes(input)) {
        return results.push(i)
      } else if (i.region.toLowerCase().includes(input)) {
        return results.push(i)
      } else if (i.gender.toLowerCase().includes(input)) {
        return results.push(i)
      }
     
    })

    getTotalPage(results)

    getPageData(1, results)
    searchInput.value = ''
  })


  function showModal(e) {

    if (e.target.matches('.user-pic')) {
      const showURL = indexURL + `/${e.target.dataset.id}`
      const userName = document.querySelector('#user-fullname')
      const userList = document.querySelector('#user-list')

      axios.get(showURL).then(res => {

        const data = res.data

        userName.innerHTML = `${data.name} ${data.surname}`

        userList.innerHTML = `
                       <div class="col-6" >
                      <img src="${data.avatar}" class="img-fluid rounded" alt="user picture">
                    </div>
                      <ul class="col-6 list-group list-group-flush">
                        <li class="list-group-item" id="user-gender"><strong>GENDER:</strong> ${data.gender}</li>
                        <li class="list-group-item" id="user-age"><strong>AGE:</strong> ${data.age}</li>
                        <li class="list-group-item" id="user-birth"><strong>DOB:</strong> ${data.birthday}</li>
                        <li class="list-group-item" id="user-region"><strong>REGION:</strong> ${data.region}</li>
                        <li class="list-group-item" id="user-email"><strong>EMAIL:</strong> ${data.email}</li> 
                      </ul>
`

      })
    }

  }

  function getTotalPage(data) {

    let totalPage = Math.ceil(data.length / itemPerPage) || 1

    let pageItemContent = ''

    for (let i = 0; i < totalPage; i++) {

      pageItemContent += `
      <li class="page-item">
        <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
      </li>
      `
    }
    paginationIcon.innerHTML = pageItemContent
  }

  function getPageData(page, data) {

    pagination = data || pagination

    let splitStart = (page - 1) * itemPerPage

    let pagedata = pagination.slice(splitStart, splitStart + itemPerPage)

    displayUser(pagedata)

  }


})();

