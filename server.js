const app = require("./app");

const mongoose = require("mongoose");

const Db = process.env.DATABASE_URL;

// DATABASE connection string 
mongoose
  .connect(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DATABASE IS CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Serve is running on ${port}`);
});
