var recipes = require("../recipes.json");
var router = require("express").Router();

router.get("/", async function (req, res) {
  await res.status(200).json(recipes);
});

router.get("/shopping-list", async function (req, res) {
  if (req.query.ids) {
    const id = req.query.ids.split(",");
    let unmatchedRecipes = [];
    let shopping_listArr = [];
    var promise = new Promise(function (resolve, reject) {
      if (id.length == 0) {
        resolve([]);
      }
      for (let i = 0; i < id.length; i++) {
        let recipe = recipes.find(function (recipe) {
          return recipe.id == id[i];
        });
        if (recipe) {
          recipe.ingredients.forEach((element) => {
            shopping_listArr.push(element);
          });
          resolve(shopping_listArr);
        } else {
          unmatchedRecipes.push(id[i]);
          reject(unmatchedRecipes);
        }
      }
    });
    promise
      .then(function (result) {
        console.log("Resolve", result);
        if (shopping_listArr.length > 0) {
          res.status(200).json(result);
        }
      })
      .catch(function (error) {
        console.log("Rejected", error);
        res.status(404).send("NOT_FOUND");
      });
  } else {
    await res.status(400).send("No ids provided");
  }
});

module.exports = router;
