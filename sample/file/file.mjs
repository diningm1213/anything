import { readdirSync, statSync, rename } from "fs";
import { refDicList } from "./ref-dic-list.mjs";

const dir = "./srt";

const fileSortByMTime = () => {
  const list = readdirSync(dir).map((file) => ({
    name: file,
    mtime: statSync(`${dir}/${file}`).mtime,
  }));

  list.sort((a, b) => b.mtime - a.mtime);
};

const fileRename = () => {
  list.forEach((file, i) => {
    rename(`${dir}/${file.name}`, `${dir}/${refDicList[i]}.srt`, (err) => {
      if (err) throw err;
    });
  });
};
