import React from 'react';
import { Constants, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

export function heartStateUpdate(options = {}) {
  if(options["data"]["like"] === undefined) {
    options["data"]["like"] = 1;
    // alert("user : " + global.currentUser["id"] + ", " + data["id"])
    db.transaction(
      tx => {
        tx.executeSql('INSERT INTO content_likes (user_id, content_id, is_like) values (?, ?, ?)', [global.currentUser["id"], options["data"]["id"], options["data"]["like"]]);
        tx.executeSql('SELECT * FROM content_likes WHERE user_id = ?', [global.currentUser["id"]], (_, { rows }) => {
          alert(JSON.stringify(rows["_array"]))
          global.contents["likes"] = rows
        });
      },
    );
  }
  else {
    if(options["data"]["like"] === 1) {
      options["data"]["like"] = 0;
    }
    else {
      options["data"]["like"] = 1;
    }

    db.transaction(
      tx => {
        tx.executeSql('UPDATE content_likes SET is_like = ? WHERE user_id = ? AND content_id = ?', [options["data"]["like"], global.currentUser["id"], options["data"]["id"]]);

        tx.executeSql('SELECT * FROM content_likes WHERE user_id = ?', [global.currentUser["id"]], (_, { rows }) => {
          alert(JSON.stringify(rows["_array"]))
          global.contents["likes"] = rows
        });
      },
    );
  }

  return options["data"];
}
