let male = 0;
let female = 0;
let sumAge = 0;
let medAge = 0;

let allUsers = null;
let filterName = null;
let btnFind = null;
let numberFormatter = null;

window.addEventListener('load', () => {
  filterName = document.querySelector('#filterName');
  btnFind = document.querySelector('#btnFind');
  numberFormatter = Intl.NumberFormat('pt-BR');

  render();
});

function formatNumber(number) {
  const toFixed = number.toFixed(2);
  if (!number) return 0;
  return numberFormatter.format(toFixed);
}

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );

  const json = await res.json();

  return (allUsers = json.results);
}

function preventFormSubmit() {
  function handleSubmit(e) {
    e.preventDefault();
  }

  const form = document.querySelector('form');
  form.addEventListener('submit', handleSubmit);
}

function usersMap() {
  const userMap = allUsers.map((user) => {
    const { picture, name, last, dob, gender } = user;

    return {
      image: picture.thumbnail,
      name: name.first,
      last: name.last,
      age: dob.age,
      gender,
    };
  });

  return userMap;
}

function render() {
  preventFormSubmit();
  fetchUsers();
  handleFilter();
}

function handleFilter() {
  filterName.focus();
  filterName.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.value.trim().length > 0) {
      let input = e.target.value.toLowerCase();
      findByName(input);
    }
  });

  btnFind.addEventListener('click', () => {
    let input = filterName.value;
    if (input.trim().length > 0) {
      findByName(input);
    }
  });

  function findByName(input) {
    let divUser = document.querySelector('.users');

    const filter = usersMap()
      .filter(
        (user) =>
          user.name.toLowerCase().includes(input) ||
          user.last.toLowerCase().includes(input)
      )
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    let usersHTML = `
      <div class="card">
      <div class="card-header">${filter.length} Usuário (os) encontrado (os)</div>
    `;

    filter.forEach((user) => {
      const { image, name, last, age } = user;
      const userHTML = `
        <div class="card-body">
          <img class="rounded mr-2" src=${image} /> 
          <span>${name} ${last}, ${age} anos</span>
        </div>
    `;

      usersHTML += userHTML;
    });

    divUser.innerHTML = usersHTML;

    // ESTATISTICAS
    let divStatistic = document.querySelector('.statistics');

    male = filter.filter((user) => user.gender === 'male').length;
    female = filter.filter((user) => user.gender === 'female').length;
    sumAge = filter.reduce((acc, curr) => {
      return acc + curr.age;
    }, 0);

    const totFiltered = filter.length;
    medAge = sumAge / totFiltered;
    const resMed = formatNumber(medAge);

    let statisticsHTML = `
      <div class="card">
        <div class="card-header">Estatísticas</div>
          <div class="card-body">
            <div class="flex-row">
                <span class="card-text m-0">Sexo masculino:</span>
                <span class="badge badge-primary badge-pill">${male}</span>
            </div>
            <div class="flex-row">
                <span class="card-text m-0">Sexo feminino:</span>
                <span class="badge badge-primary badge-pill">${female}</span>
            </div>
            <div class="flex-row">
                <span class="card-text m-0">Soma das idade:</span>
                <span class="badge badge-primary badge-pill">${sumAge}</span>
            </div>
            <div class="flex-row">
                <span class="card-text m-0">Média das idade:</span>
                <span class="badge badge-primary badge-pill">${resMed}</span>
            </div>
          </div>
        </div>
      </div>
      `;

    divStatistic.innerHTML = statisticsHTML;
  }
}
