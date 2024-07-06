const express = require('express')
const app = express();
const fs = require("fs");
const port = 3000;

app.use(express.json());


app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/blogs', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }
  fs.writeFileSync(`${title}.txt`, content, 'utf8');
  res.send('ok');
});

app.put('/posts/:title', (req, res) => {
  const { title } = req.params;
  const { content } = req.body;

  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }

  if (fs.existsSync(`${title}.txt`)) {
    fs.writeFileSync(`${title}.txt`, content, 'utf8');
    res.send('ok');
  } else {
    res.status(404).send('This post does not exist!');
  }
});

app.delete('/blogs/:title', (req, res) => {
  const { title } = req.params;

  if (fs.existsSync(`${title}.txt`)) {
    fs.unlinkSync(`${title}.txt`);
    res.send('ok');
  } else {
    res.status(404).send('This post does not exist!');
  }
});

app.get('/blogs/:title', (req, res) => {
  const { title } = req.params;

    if (fs.existsSync(`${title}.txt`)) {
    const post = fs.readFileSync(`${title}.txt`, 'utf8');
    res.send(post);
  } else {
    res.status(404).send('This post does not exist!');
  }
});

app.get('/blogs', (req, res) => {
  const blogTitles = [];
  const files = fs.readdirSync(__dirname); 

  files.forEach(file => {
    if (file.endsWith('.txt')) {
      const title = file.slice(0, -4); 
      blogTitles.push({ title });
    }
  });
  res.json(blogTitles);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
 
