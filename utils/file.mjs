import fs from "fs";
// import { refDicList } from "../assets/ref-dic-list.mjs";
import path from "path";
import { parseScript } from "./srt-parse-to.mjs";

const dir = "./srt";

const fileSortByMTime = (dir) => {
  const list = fs.readdirSync(dir).map((file) => ({
    name: file,
    mtime: fs.statSync(`${dir}/${file}`).mtime,
  }));

  list.sort((a, b) => b.mtime - a.mtime);
};

const fileListRename = (list, newNameList) => {
  list.forEach((file, i) => {
    fs.rename(`${dir}/${file.name}`, `${dir}/${newNameList[i]}.srt`, (err) => {
      if (err) throw err;
    });
  });
};

const parseFileAndChangeExtension = (oldDir, newDir, parser, newExt = "") => {
  const list = fs.readdirSync(oldDir);
  list.forEach(async (file) => {
    const oldFilePath = `${oldDir}/${file}`;
    const newFilePath = `${newDir}/${
      newExt ? changeExtension(file.substring(0, 8), newExt) : file
    }`;

    const oldFile = fs.readFileSync(oldFilePath);
    const newFile = await parser(changeExtension(file, newExt), oldFile);
    fs.writeFileSync(newFilePath, newFile);
  });
};

const getBaseName = (file) => {
  return path.basename(file, path.extname(file));
};

const changeExtension = (file, newExtension) => {
  return getBaseName(file) + newExtension;
};

// parseFileAndChangeExtension("./srt", "./md", parseScript, ".md");
