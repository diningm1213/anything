// TODO: inflearn 강의 스크립트를 가져오는 스크립트
// selenium으로 변경해야 한다.. ㅠㅠ
// https://www.inflearn.com/course/functional-es6/dashboard

const courseName = "functional-es6";
const courseData = require(`./${courseName}.json`);
const { log } = require("console");
const fs = require("fs");
const path = require("path");
/**
 * https://www.inflearn.com/api/v2/unit/{unitId}?courseSlug={courseSlug}
 * ex) https://www.inflearn.com/api/v2/unit/16568?courseSlug=functional-es6
 */
const DELAY = 3000;
const UNIT_API_PATH = "https://www.inflearn.com/api/v2/unit";
const getUnitApiPath = (unitId, courseSlug) =>
  `${UNIT_API_PATH}/${unitId}?courseSlug=${courseSlug}`;

/**
 * https://www.inflearn.com/subtitles/{subtitles.oid}/json
 * ex) https://www.inflearn.com/subtitles/656af24b009d9f526a06e4d2/json
 */
const SCRIPT_API_PATH =
  "https://www.inflearn.com/subtitles/656af24b009d9f526a06e4d2/json";
const getScriptApiPath = (oid) => `${SCRIPT_API_PATH}/${oid}/json`;

const getUnit = async (unitId, courseSlug) => {
  const res = await fetch(getUnitApiPath(unitId, courseSlug));
  const unit = await res.json();
  console.log("getUnit", unit);
  return unit.data;
};

const getScript = async (oid) => {
  const res = await fetch(getScriptApiPath(oid));
  const script = await res.json();
  console.log("getScript", script);
  return script;
};

const getScriptByUnit = async (unitId, courseSlug) => {
  const unit = await getUnit(unitId, courseSlug);
  if (!unit.hasVideo) {
    return null;
  }
  const script = await getScript(unit.video.subtitles.oid);
  log("getScriptByUnit", script);
  return script;
};

const parseTime = (time) => {
  const sec = Math.floor(time / 1000);
  const min = Math.floor(sec / 60);

  return `${min}:${sec - min * 60}`;
};

const parseScript = (script) => {
  return script
    .map(
      ({ start = 0, end = 0, text = "" }) =>
        `${parseTime(start)} ${parseTime(end)} ${text}`
    )
    .join("\n");
};

const saveScriptByUnit = async (unitId, courseSlug) => {
  const script = await getScriptByUnit(unitId, courseSlug);
  if (!script) {
    return;
  }
  const parsedScript = parseScript(script);
  console.log("parsedScript", parsedScript);

  const folderPath = path.join(__dirname, courseName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const filePath = path.join(folderPath, `${courseSlug}_${unitId}.txt`);
  fs.writeFileSync(filePath, parsedScript);
  console.log(`saved ${filePath}`);
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const main = async () => {
  const { courseSlug = "", unitIds = [] } = courseData;

  for (let i = 0; i < unitIds.length; i++) {
    const unitId = unitIds[i];
    const randomDelay = Math.random() * DELAY;
    saveScriptByUnit(unitId, courseSlug);

    await sleep(randomDelay);
  }
};

main();
