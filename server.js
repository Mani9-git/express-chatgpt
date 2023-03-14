const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());

let askYourQuestion = [];

const saveToQuestion = (role, content) => {
  askYourQuestion.push({ role, content });
};

const getOpenAiResponse = async (message) => {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: message,
  });

  return response.data.choices[0].message.content;
};

app.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  saveToQuestion('user', prompt);
  let openAIresponse = await getOpenAiResponse(askYourQuestion);
  saveToQuestion('system', openAIresponse);
  res.send(openAIresponse);
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
