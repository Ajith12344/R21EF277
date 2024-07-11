const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let storedNumbers = [];


const fetchNumbers = async (numberType) => {
    const url = http://numbers/${numberType};
    try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data.numbers || [];
    } catch (error) {
        return [];
    }
};

app.get('/numbers/:numberType', async (req, res) => {
    const { numberType } = req.params;

    if (!['p', 'f', 'e', 'r'].includes(numberType)) {
        return res.status(400).json({ error: "Invalid number type" });
    }

    const newNumbers =await fetchNumbers(numberType);
    const windowPrevState = [...storedNumbers];

    newNumbers.forEach(num => {
        if (!storedNumbers.includes(num)) {
            if (storedNumbers.length >= WINDOW_SIZE) {
                storedNumbers.shift();
            }
            storedNumbers.push(num);
        }
    });

    const avg = storedNumbers.length ? storedNumbers.reduce((a, b) => a + b, 0) / storedNumbers.length : 0;

    const responseData = {
        numbers: newNumbers,
        windowPrevState: windowPrevState,
        windowCurrState: storedNumbers,
        avg: avg.toFixed(2)
    };

    res.json(responseData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});