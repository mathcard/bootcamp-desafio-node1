const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next){
  const { id } = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid project ID.'});
  }
  return next();
}

//app.use(validateProjectId); 

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositorie = { id: uuid(), title: title, url: url, techs: techs, likes: 0 }
  repositories.push(repositorie);  
  return response.json(repositorie)
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositoriesIndex < 0) {
    return response.status(400).json({error: 'Repositories not found.'})
  }

  const repositorie = { id, title, url, techs, likes: repositories[repositoriesIndex].likes }
  repositories[repositoriesIndex] = repositorie;
  return response.json(repositorie);

});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositoriesIndex < 0) {
    return response.status(400).json({error: 'Repositories not found.'})
  }

  repositories.splice(repositoriesIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repositoriesIndex < 0) {
    return response.status(400).json({error: 'Repositories not found.'})
  }

  const repositorie = { 
    id, 
    title: repositories[repositoriesIndex].title, 
    url: repositories[repositoriesIndex].url, 
    techs: repositories[repositoriesIndex].techs, 
    likes: repositories[repositoriesIndex].likes + 1 
  }
  
  repositories[repositoriesIndex] = repositorie;
  return response.json(repositorie);

});

module.exports = app;
