const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:'6229140bf472a3dbf8e87d86',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

// const mongoose = require("mongoose");
// const Campground = require('../models/campground');
// const cities = require('./cities');
// const {places,descriptors} = require('./seedHelper');

// mongoose.connect('mongodb://localhost:27017/yelp-camp',{
//     useNewUrlParser:true,
//     // useCreateIndex:true,
//     useUnifiedTopology:true
// });
// const db = mongoose.connection;
// db.on("error",console.error.bind(console,"Connection eror"));
// db.once("open",()=>{
//     console.log("Connected to database");
// })

// // const sample = function(array){

// // }
// const sample = (array) => array[Math.floor(Math.random() * array.length)];

// const seedDb = async()=>{
//     await Campground.deleteMany({});
//     for(let i = 0;i<50;i++){
//         const random1000 =  Math.floor(Math.random()*1000);
//         const randomPrice = Math.floor(Math.random()*20)+10;
//         const newcamp =  new Campground({
//             location:`${cities[random1000].city},${cities[random1000].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`,
//             image : 'https://source.unsplash.com/collection/483251',
//             description: 'It s been a long day without you, my friend And I ll tell you all about it when I see you againWeve come a long way from where we beganOh, Ill tell you all about it when I see you again When I see you again',
//             price: randomPrice
//         })
//         await newcamp.save();
//     }
// }
// seedDb().then(()=>{
//     mongoose.connection.close();
//     console.log("Operation ended");
// })


