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

// Components

const Greeting = (name) => {
    if (name) {
        return `
            <h2>Welcome, ${name}!</h2>
        `;
    }

    return `
        <h1>Hello!</h1>
    `;
};

const Header = (state) => {
    return `
    <header>
        <h1>Mars Rover Dashboard</h1>
        ${Greeting(state.user.name)}
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

/*
Launch Date
Landing Date
Status
Most recently available photos
Date the most recent photos were taken
*/

const Main = (state) => {
    const { roversPhotos } = state;
    if (!roversPhotos) {
        getMarsRovers(state);
        return '<div class="loading">Loading!</div>';
    } else {
        let mainContenets = '';
        Object.keys(roversPhotos).forEach((key) => {
            mainContenets += GenerateRoverCard(roversPhotos[key]);
        });
        return `
        <main>
        ${mainContenets}
        </main>`;
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
        <section class="card">
            <h3>Mars Rover - ${card.rover_name}!</h3>
            <p>Launch Date: ${card.rover_landing_date}</p>
            <p>Landing Date: ${card.rover_launch_date}</p>
            <p>Status: ${card.rover_status}</p>
            <img src="${card.img}" height="350px" width="100%" />
            <p>
                This photo is one of the most recent photos by this rover and was taken on: ${card.photo_date}
            </p>
        </section>`;
};

// API calls
const getMarsRovers = (state) => {
    fetch('/marsRovers')
        .then((res) => res.json())
        .then((roversPhotos) => {
            updateStore(state, { roversPhotos });
        })
        .catch((err) => console.log('error', err));
};
