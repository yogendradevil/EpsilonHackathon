const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const OpenAI = require("openai");

const openai = new OpenAI.default({
    apiKey: 'sk-proj-WwMhPrTSIc7fRbWB7ihOT3BlbkFJtHhjcuOb3DacbIjYRzK5',
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setting views path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/testCase", (req, res) => {
    res.render('testCase');
});

// Route to handle form submission
app.post("/testCase", async (req, res) => {
    try {
        const requirements = req.body.textData;
        const positive = req.body.Positive;
        const negative = req.body.Negative;

        // Constructing the template based on user's input
        let template = "Title:\nSteps to reproduce:\nExpected results:\n\n";
        if (positive) {
            template += "Positive Test Cases Scenarios:\n";
        }
        if (negative) {
            template += "Negative Test Cases Scenarios:\n";
        }

        // Query ChatGPT API to generate test cases
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: template + requirements }],
            model: "gpt-3.5-turbo",
        });

        const result = completion.choices[0].message.content;

        res.render('testCase', { result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});

const port = process.env.PORT || 3000;
const hostname = "127.0.0.1";
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
