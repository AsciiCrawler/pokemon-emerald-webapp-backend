let data = require('./pokemon.json');
const fs = require('fs');

data = data.map((e, index) => {
    delete e.species_id;
    delete e.order;
    delete e.is_default;
    console.log({ index: index + 1 });

    e.image = `https://d272mprzra2ie.cloudfront.net/${index+1}.png`;
    e.gif = `https://d272mprzra2ie.cloudfront.net/${index+1}.gif`;
    return e;
});

fs.writeFileSync("_pokemon.json", JSON.stringify(data), () => { });