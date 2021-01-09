const root = document.getElementById('root');
const store = {};

window.addEventListener('load', () => {
    console.log('loaded');
    render(root, store);
});

const render = async (root, state) => {
    console.log(':: Inside Render');
    console.log(':: Before getApod');
    getApod(store);
    console.log(':: After getApod');
};

// API Call
const getApod = (state) => {
    fetch('http://localhost:3000/apod')
        .then((res) => res.json())
        .then((data) => console.log(data));
};
