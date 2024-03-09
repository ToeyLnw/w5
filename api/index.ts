import express from "express";

export const router = express.Router();

// router.get('/', (req, res)=>{
//     res.send('Get in index.ts');
// });

//query
router.get("/", (req, res) => {
if (req.query.id) {
    res.send("Get in trip.ts Query id: " + req.query.id);
} else {
    res.send("Get in trip.ts");
}
});

// Path
// router.get("/:id", (req, res) => {
//     res.send("Get in trip.ts id: " + req.params.id);
//   });

