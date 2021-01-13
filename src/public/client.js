let store = {
    user: { name: 'Student' },
    roversPhotos: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
};
const root = document.getElementById('root');

window.addEventListener('load', () => {
    render(root, store);
});

const render = async (root, state) => {
    root.innerHTML = App(state);
};

const App = (state) => {
    return `
        ${Header(state)}
        ${Main(state)}
        ${Footer()}
        `;
};

const updateStore = (state, newState) => {
    Object.assign(state, newState);
    render(root, store);
};

const loadRover = (element) => {
    const cardName = element.options[element.selectedIndex].value;
    const curiosity = document.getElementById('curiosity_card');
    const opportunity = document.getElementById('opportunity_card');
    const spirit = document.getElementById('spirit_card');
    switch (cardName) {
        case 'curiosity':
            curiosity.classList.remove('hidden');
            opportunity.classList.add('hidden');
            spirit.classList.add('hidden');
            break;
        case 'opportunity':
            curiosity.classList.add('hidden');
            opportunity.classList.remove('hidden');
            spirit.classList.add('hidden');
            break;
        case 'spirit':
            curiosity.classList.add('hidden');
            opportunity.classList.add('hidden');
            spirit.classList.remove('hidden');
            break;
        default:
            break;
    }
};

const capitalizeName = (name) => {
    return name.toUpperCase();
};

// Components

// High order function 1
const Greeting = (capitalize) => {
    return (name) => {
        if (name) {
            return `
                <h2>Welcome, ${capitalize(name)}!</h2>
            `;
        }
        return `
            <h1>Hello!</h1>
        `;
    };
};

/*
function utilizePrefixer(prefix) {
    return function(word) {
    return `${prefix}${word}`
    }
}
*/

const Header = (state) => {
    return `
    <header>
        <h1>Mars Rover Dashboard</h1>
        ${Greeting(capitalizeName)(state.user.name)}
    </header>
    `;
};

const Footer = () => {
    return `
    <footer>
    <p class="">Data Sourced from <a href="https://api.nasa.gov">NASA.GOV</a></p>
    </footer>
    `;
};

const Main = (state) => {
    const { roversPhotos } = state;
    if (!roversPhotos) {
        getMarsRovers(state);
        return `<div class="loader">
                    <h3>Loading!<h3>
                    <img src="./assets/images/loader.gif">
                </div>`;
    } else {
        let mainContenets = '';
        const photos = roversPhotos.get('roversPhotos');
        Object.keys(photos).forEach((key) => {
            mainContenets += GenerateRoverCard(photos[key]);
        });
        return `
        <main>
        ${RoverSelector(state)}
        <div class="container">
            ${mainContenets}    
        </div>
        </main>`;
    }
};

const RoverSelector = (state) => {
    const { rovers } = state;
    if (!rovers || rovers.length < 1) {
        return `
        <select id="roversSelector">
            <option value="" name="">
        </select>
    `;
    } else {
        const roverSelector = rovers.reduce((acc, curr) => {
            acc += `<option value="${curr.toLowerCase()}">Rover: ${curr}</option>`;
            return acc;
        }, '');
        return `
        <label for="roversSelector">Please Select Rover:</label>
        <select id="roversSelector" onchange="loadRover(this)">
            ${roverSelector}
        </select>
    `;
    }
};

const GenerateRoverCard = (rover) => {
    const cards = rover.map((item) => {
        return {
            img: item.img_src,
            photo_date: item.earth_date,
            rover_name: item.rover.name,
            rover_landing_date: item.rover.landing_date,
            rover_launch_date: item.rover.launch_date,
            rover_status: item.rover.status,
        };
    });
    const card = cards.reduce((acc, curr, index, array) => {
        if (acc.photo_date > curr.photo_date) {
            return acc;
        } else {
            return curr;
        }
    });
    return `
        <section id="${card.rover_name.toLowerCase()}_card" class="card">
            <h3>Mars Rover - ${card.rover_name}!</h3>
            <p>Launch Date: ${card.rover_landing_date}</p>
            <p>Landing Date: ${card.rover_launch_date}</p>
            <p>Status: ${card.rover_status}</p>
            ${generateRoverPhotos(cards)()}
            <p>
                This photo is one of the most recent photos by this rover and was taken on: ${card.photo_date}
            </p>
        </section>`;
};

// High order function
const generateRoverPhotos = (cards) => {
    return () => {
        return cards.reduce((acc, curr) => {
            acc += `<img src="${curr.img}" height="350px" width="100%" />`;
            return acc;
        }, '');
    };
};

// API calls
const getMarsRovers = (state) => {
    fetch('/marsRovers')
        .then((res) => res.json())
        .then((data) => {
            const roversPhotos = Immutable.Map({ roversPhotos: data });
            updateStore(state, { roversPhotos });
        })
        .catch((err) => console.log('error', err));
};
