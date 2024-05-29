const express = require("express");
const ejs = require('ejs');
const path = require("path");
const numWords = require('num-words');

const app = express();
app.use(express.static(__dirname + '/public/'));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/tada', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'tada.html'));
});
app.get('/excessfee', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'excessfee.html'));
});
app.get('/lab', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lab.html'));
});


//tada
app.post('/generate-pdf1', (req, res) => {
    const orderData = req.body;
    const numPeople = parseInt(orderData['num-people']);
    let totalAmount = 0;

    // Calculate total amount
    for (let i = 0; i < numPeople; i++) {
        totalAmount += parseFloat(orderData[`person-${i + 1}-amount`]);
    }

    // Convert total amount to words
    orderData['amounttowords'] = numWords(totalAmount);
    orderData['Total Amount'] = totalAmount
    // Get the current date
    let currentDate = new Date();
    const today = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(/ /g, '-');
    orderData['today']=today
    const tempArray = orderData['today'].split("/")
    const temp1 = tempArray[1]
    orderData['month'] = temp1
    orderData['people'] = [];
    for (let i = 0; i < numPeople; i++) {
        orderData['people'].push({
            name: orderData[`person-${i + 1}-name`],
            amount: orderData[`person-${i + 1}-amount`]
            
        });
    }
    console.log(orderData);
    ejs.renderFile(path.join(__dirname, 'views', 'tadaresult.ejs'), { orderData: orderData }, (err, str) => {
        if (err) {
            return res.status(500).send('Error rendering template');
        }
        res.send(str);
    });
});


//excess fee
app.post('/generate-pdf2', (req, res) => {
    const orderData = req.body;
    const numPeople = parseInt(orderData['num-people']);
    let totalAmount = 0;

    // Calculate total amount
    for (let i = 0; i < numPeople; i++) {
        totalAmount += parseFloat(orderData[`person-${i + 1}-amount`]);
    }

    // Convert total amount to words
    orderData['amounttowords'] = numWords(totalAmount);
    orderData['Total Amount'] = totalAmount
    
    const date = new Date(orderData['paymentdate']);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(/ /g, '-');
    orderData['fee-paid-date'] = formattedDate;
    // Get the current date
    let currentDate = new Date();
    const today = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(/ /g, '-');
    orderData['today'] = today
    const tempArray = orderData['today'].split("/")
    const temp1=tempArray[1]
    orderData['month']=temp1
    const myArray1 = orderData['course'].split(" ");
    const var1 = myArray1[0] + myArray1[1];
    orderData['use1'] = var1
    const myArray2 = orderData['semester'].split(" ");
    const var2 = myArray2[1]
    orderData['use2'] = var2
    orderData['people'] = [];
    for (let i = 0; i < numPeople; i++) {
        orderData['people'].push({
            name: orderData[`person-${i + 1}-name`],
            amount: orderData[`person-${i + 1}-amount`],
            RegistrationNumber: orderData[`person-${i + 1}-Registration No`],
            Paymentdate: orderData[`person-${ i + 1}-payment date`]
        });
    }
    console.log(orderData);
    ejs.renderFile(path.join(__dirname, 'views', 'excessfeeresult.ejs'), { orderData: orderData }, (err, str) => {
        if (err) {
            return res.status(500).send('Error rendering template');
        }
        res.send(str);
    });
});


//lab
app.post('/generate-pdf3', (req, res) => {
    const orderData = req.body;
    orderData['amounttowords'] = numWords(orderData['Total-amount']);
    const date = new Date(orderData['Items-Purchased-date']);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(/ /g, '-');
    orderData['Items-Purchased-date'] = formattedDate;
    // Get the current date
    let currentDate = new Date();
    const today = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(/ /g, '-');
    orderData['today'] = today
    const tempArray = orderData['today'].split("/")
    const temp1 = tempArray[1]
    orderData['month'] = temp1
    console.log(orderData);
    ejs.renderFile(path.join(__dirname, 'views', 'labresult.ejs'), { orderData: orderData }, (err, str) => {
        if (err) {
            return res.status(500).send('Error rendering template');
        }
        res.send(str);
    });
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
