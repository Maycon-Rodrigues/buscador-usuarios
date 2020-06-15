let male = 0;
let female = 0;
let sumAge = 0;
let medAge = 0;

let allUsers = null;
let filterName = null;
let btnFilter = null;

window.addEventListener('load', () => {
  filterName = document.querySelector('#filterName');
  buscar = document.querySelector('#buscar');

  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );

  const json = await res.json();

  allUsers = json.results;

  render();
}

function render() {
  handleFilter();
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

function handleFilter() {
  filterName.addEventListener('change', (e) => {
    let input = e.target.value;
    findByName(input);
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
      <div>
      <h2 class="header">${filter.length} Usuário (os) encontrado (os)</h2>
    `;

    filter.forEach((user) => {
      const { image, name, last, age } = user;
      const userHTML = `
          <ul>
            <li class="item">
              <img src=${image} />${name} ${last}, ${age} anos
            </li>
          </ul>
        `;

      usersHTML += '</div>';
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

    let statisticsHTML = `
      <div>
        <h2 class="header">Estatísticas</h2>
        <ul>
          <li>Sexo masculino: ${male}</li>
          <li>Sexo feminino: ${female}</li>
          <li>Soma das idade: ${sumAge}</li>
          <li>Média das idade: ${medAge.toFixed(2)}</li>
        </ul>
      </div>
    `;

    divStatistic.innerHTML = statisticsHTML;
  }
}
