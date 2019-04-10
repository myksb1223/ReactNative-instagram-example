import React from 'react';
import { Constants, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

export function heartStateUpdate(options = {}) {
  if(options["data"]["like"] === undefined) {
    options["data"]["like"] = 1;
    // alert("user : " + global.currentUser["id"] + ", " + data["id"])
    db.transaction(
      tx => {
        tx.executeSql('INSERT INTO content_likes (user_id, content_id, is_like) values (?, ?, ?)', [options["user"]["id"], options["data"]["id"], options["data"]["like"]]);
        tx.executeSql('SELECT * FROM content_likes WHERE user_id = ?', [options["user"]["id"]], (_, { rows }) => {
          // alert(JSON.stringify(rows["_array"]))
          global.contents["likes"] = rows["_array"]
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
        tx.executeSql('UPDATE content_likes SET is_like = ? WHERE user_id = ? AND content_id = ?', [options["data"]["like"], options["user"]["id"], options["data"]["id"]]);

        tx.executeSql('SELECT * FROM content_likes WHERE user_id = ?', [options["user"]["id"]], (_, { rows }) => {
          // alert(JSON.stringify(rows["_array"]))
          global.contents["likes"] = rows["_array"]
        });
      },
    );
  }

  return options["data"];
}

export function insertComments(options = {}) {
  db.transaction(
    tx => {
      tx.executeSql('INSERT INTO comments (user_id, content_id, content) values (?, ?, ?)', [global.currentUser["id"], options["data"]["id"], options["text"]]);
      tx.executeSql('SELECT * FROM comments ORDER BY id DESC LIMIT 20', [], (_, { rows }) => {
        // alert(JSON.stringify(rows["_array"]))
        // options["caller"].read()
      });
    },
  );
}

export function readSelectedUser(options = {}) {
  return new Promise(function (resolve, reject) {
    db.transaction(
      tx => {
        tx.executeSql('SELECT * FROM users WHERE id = ?', [options["id"]], (_, { rows }) => {
          // alert(JSON.stringify(rows["_array"]))
          resolve(rows["_array"][0])
          // options["caller"].read()
        });
      },
    );
  });

}
