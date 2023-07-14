const { default: axios } = require('axios');
let data = require('./pokemon.json');

data.forEach(element => {
    axios.post("http://localhost:8080/pokemon/create", element).then(result => {
        /* console.log({ result }); */
    }).catch(err => {
        console.log({ err: err.response.data });
    })
})

/* data = data.map((e, index) => {
    delete e.species_id;
    delete e.order;
    delete e.is_default;
    console.log({ index: index + 1 });

    e.image = `https://d272mprzra2ie.cloudfront.net/${index + 1}.png`;
    e.gif = `https://d272mprzra2ie.cloudfront.net/${index + 1}.gif`;
    return e;
}); */