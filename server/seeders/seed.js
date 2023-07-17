const mongoose = require('mongoose');
const User = require('../models/User');  // path to your user model
const Group = require('../models/Group');  // path to your group model
const Event = require('../models/Event');  // path to your event model

mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/calendarDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
);

const user = new User({
    name: "User1",
    email: "user1@example.com",
    password: "password123",  // this will be hashed before save
    groups: []
});

const group = new Group({
    name: "Group1",
    password: "group_password",  // this will be hashed before save
    users: [],
    events: []
});

const event = new Event({
    name: "Event1",
    category: "Category1",
    startTime: new Date(),
    endTime: new Date(),
    group: group._id
});

group.users.push(user._id);
group.events.push(event._id);

user.groups.push(group._id);

Promise.all([user.save(), group.save(), event.save()])
    .then(() => {
        console.log('Data has been seeded!');
        mongoose.connection.close();
    })
    .catch((error) => console.log('Error seeding data: ' + error));