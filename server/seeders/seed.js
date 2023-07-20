const mongoose = require('mongoose');
const User = require('../models/User');  // path to your user model
const Group = require('../models/Group');  // path to your group model
const Event = require('../models/Event');  // path to your event model

mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/calendarDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
);

const seedData = async () => {
    const user = new User({
        name: "User1",
        email: "user1@example.com",
        password: "password123",  // this will be hashed before save
        groups: []
    });

    const savedUser = await user.save();

    const group = new Group({
        name: "Group1",
        password: "group_password",  // this will be hashed before save
        users: [savedUser._id],
        events: []
    });

    const savedGroup = await group.save();

    const event = new Event({
        name: "Event1",
        category: "Category1",
        startTime: new Date(),
        endTime: new Date(),
        group: savedGroup._id
    });

    const savedEvent = await event.save();

    savedUser.groups.push(savedGroup._id);
    await savedUser.save();

    savedGroup.users.push(savedUser._id);
    savedGroup.events.push(savedEvent._id);
    await savedGroup.save();

    console.log('Data has been seeded!');
    mongoose.connection.close();
}

seedData().catch((error) => console.log('Error seeding data: ' + error));