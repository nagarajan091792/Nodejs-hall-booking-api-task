const express = require("express");
const hall = express();
hall.use(express.json());

// available default rooms
const rooms = [
    {
        "name": "large",
        "seats": 100,
        "amenities": "wifi,projection screen,AC",
        "price": 2500,
        "roomId": "ab12",
        "bookingDetails": [
            {
                "customerName": "rajan",
                "date": new Date("2022-11-15"),
                "start": "15:00",
                "end": "17:00",
                "status": "Payment Pending"
            }
        ]
    },
    {
        "name": "extra-large",
        "seats": 600,
        "amenities": "wifi,projection screen,AC",
        "price": 1500,
        "roomId": "abc123",
        "bookingDetails": [
            {
                "customerName": "gopi",
                "date": new Date("2022-11-14"),
                "start": "07:00",
                "end": "10:00",
                "status": "confirmed"
            }
        ]
    }
];

//create room api (http://localhost:3001/createroom)

hall.post("/createroom", function (req, res) {
    try {
        rooms.push({
            name: req.body.name,
            seats: req.body.seats,
            amenities: req.body.amenities,
            price: req.body.price,
            roomId: req.body.roomId,
            bookingDetails: []
        });
        res.status(200).json({
            message: "room created successfully",
        });
    } catch (error) {
        console.log(error);
    }
});

// list all rooms api (http://localhost:3001/)
hall.get("/", function (req, res) {
    res.json(rooms);
});



// customer room booking api (http://localhost:3001/bookRoom)
hall.post("/bookRoom", (req, res) => {
    for (let i = 0; i < rooms.length; i++) {

        if (!(rooms[i].roomId == req.body.roomId)) {
            return res.status(400).send({ error: "Invalid" });
        } else {
            let booking = {
                "customerName": req.body.name,
                "date": new Date(req.body.date),
                "start": req.body.start,
                "end": req.body.end,
                "status": "confirmed"
            };
            let result = undefined;
            rooms[i].bookingDetails.forEach((book) => {
                if (
                    book.date.getTime() !== booking.date.getTime() &&
                    book.start !== booking.start
                ) {
                    result = 0;
                    console.log("in booking");
                } else {
                    result = 1;
                    rooms[i].bookingDetails.push(booking);
                    // return res.status(200).send("Booking confirmed")
                }
            });
            if (result) return res.status(200).send("Booking confirmed");
            else
                return res
                    .status(400)
                    .send({ error: "Please select different time slot" });
        }
    }
});

// all customer booking rooms api (http://localhost:3001/listcustomer)
hall.get("/listcustomer", (req, res) => {
    let customerArray = [];

    rooms.forEach((room) => {
        let customerObj = { roomName: room.name };

        room.bookingDetails.forEach((customer) => {
            customerObj.customerName = customer.customerName;
            customerObj.date = customer.date;
            customerObj.start = customer.start;
            customerObj.end = customer.end;

            customerArray.push(customerObj);
        });
    });

    res.send(customerArray);
});

hall.listen(3001);
