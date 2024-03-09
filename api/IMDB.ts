import express from "express";
import { conn } from "../dbconnect";
import { PersonPortRequest } from "../model/ps-get-res";
import { MoviePortRequest } from "../model/mv-get-res";
import mysql from "mysql";
export const router = express.Router();

router.get("/getPerson", (req, res) => {
  conn.query("SELECT * FROM `Wperson`", (err, result) => {
    if (err) throw err;
    res.status(201).send(result);
  });
  // res.send("hi from IMDB.ts");
})

router.get("/getMovie", (req, res) => {
  conn.query("SELECT * FROM `Wmovie`", (err, result) => {
    if (err) throw err;
    res.status(201).send(result);
  });
  // res.send("hi from IMDB.ts");
})

router.post("/addPerson", (req, res) => {
  const ps: PersonPortRequest = req.body;
  console.log("body: " + req.body);

  let sql = "INSERT INTO `Wperson`(name,age) VALUES (?,?)";
  sql = mysql.format(sql, [
    ps.name,
    ps.age
  ]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ affected_rows: result.affectedRows, last_ID: result.insertID });
  })
});


router.post("/addMovie", (req, res) => {
  const mv: MoviePortRequest = req.body;
  console.log("body: " + req.body);

  let sql = "INSERT INTO `Wmovie`(Title,Poster,imdbRating,Plot) VALUES (?,?,?,?)";
  sql = mysql.format(sql, [
    mv.Title,
    mv.Poster,
    mv.imdbRating,
    mv.Plot
  ]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_rows: result.affectedRows, last_ID: result.insertID });
  })
});

router.get("/stars", (req, res) => {
  const UID = req.query.pid;
  const MID = req.query.mid;

  let sql = "INSERT INTO `Wstars`(`UID`, `MID`) VALUES (?,?)";
  sql = mysql.format(sql, [UID, MID]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_rows: result.affectedRows, last_UID: result.insertID })
  })
});

router.get("/creators", (req, res) => {
  const UID = req.query.pid;
  const MID = req.query.mid;
  let sql = "INSERT INTO `Wcreators`(`UID`, `MID`) VALUES (?,?)";
  sql = mysql.format(sql, [UID, MID,]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_rows: result.affectedRows, last_UID: result.insertID })
  })
});

router.get("/", (req, res) => {
  const search = "%"+req.query.s+"%";
  let sql = "SELECT Wmovie.* , "
  + "GROUP_CONCAT(DISTINCT CONCAT('ID: ',Stars.UID,', name: ', Stars.name) SEPARATOR'| ') AS stars,"
  + "GROUP_CONCAT(DISTINCT CONCAT('ID: ',Creators.UID,', name: ', Creators.name) SEPARATOR'| ') AS creators "
  + "FROM Wmovie "
  + "LEFT JOIN Wstars ON Wmovie.MID = Wstars.MID " 
  + "LEFT JOIN Wperson AS Stars ON Wstars.UID = Stars.UID "
  + "LEFT JOIN Wcreators ON Wmovie.MID = Wcreators.MID "
  + "LEFT JOIN Wperson AS Creators ON Wcreators.UID = Creators.UID "
  + "WHERE Wmovie.Title LIKE ?"
  + "GROUP BY Wmovie.MID";

  
  conn.query(sql, [search], (err,result)=>{
    if (err) throw err;
    res.status(200).send(result);
  })
})

router.delete("/starsDel", (req, res) => {
  const UID = req.query.uid;
  const MID = req.query.mid;

  let sql = "DELETE FROM `Wstars` WHERE `UID` = ? AND `MID` = ?"
  sql = mysql.format(sql, [UID, MID]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ affected_row: result.affectedRows });
  });
});

router.delete("/creatorsDel", (req, res) => {
  const UID = req.query.uid;
  const MID = req.query.mid;
  // console.log("MID = "+MID+": UID = "+UID);
  
  let sql = "DELETE FROM `Wcreators` WHERE `UID` = ? AND `MID` = ?"
  // DELETE FROM `Wcreators` WHERE `UID` = 6 AND `MID` = 2
  sql = mysql.format(sql, [UID, MID]);
  // sql = mysql.format(sql, [UID, MID]);

  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ affected_row: result.affectedRows });
  });
});

router.delete("/psDel", (req, res) => {
  const UID = req.query.uid;

  let sql = "DELETE FROM `Wperson` WHERE `UID` = ?"
  sql = mysql.format(sql, [UID]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ affected_row: result.affectedRows });
  });
});

router.delete("/movDel", (req, res) => {
  const MID = req.query.mid;

  let sql = "DELETE FROM `Wmovie` WHERE `MID` = ?"
  sql = mysql.format(sql, [MID]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ affected_row: result.affectedRows });
  });
});