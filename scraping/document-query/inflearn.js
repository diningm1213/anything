const searchParams = new URLSearchParams(location.search);
const courseSlug = searchParams.get("courseSlug");
const unitId = searchParams.get("unitId");

const UNIT_API_PATH = "https://www.inflearn.com/api/v2/unit";
const getUnitApiPath = (unitId, courseSlug) =>
  `${UNIT_API_PATH}/${unitId}?courseSlug=${courseSlug}`;

const SCRIPT_API_PATH = "https://www.inflearn.com/subtitles";
const getScriptApiPath = (oid) => `${SCRIPT_API_PATH}/${oid}/json`;

const getUnit = async (unitId, courseSlug) => {
  const res = await fetch(getUnitApiPath(unitId, courseSlug));
  const unit = await res.json();
  // console.log("getUnit", unit);
  return unit.data;
};

const getScript = async (oid) => {
  const res = await fetch(getScriptApiPath(oid));
  const script = await res.json();
  // console.log("getScript", script);
  return script;
};

const getScriptByUnit = async (unitId, courseSlug) => {
  const unit = await getUnit(unitId, courseSlug);
  if (!unit.hasVideo) {
    return null;
  }
  const script = await getScript(unit.video.subtitles[0].oid);
  // console.log("getScriptByUnit", script);
  return script;
};

const parseTime = (time) => {
  let sec = Math.floor(time / 1000);
  const min = Math.floor(sec / 60);
  sec = sec - min * 60;

  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const parseScript = (script) => {
  return script
    .map(
      ({ start = 0, end = 0, text = "" }) =>
        `${parseTime(start)} ~ ${parseTime(end)} - ${text}`
    )
    .join("\n");
};

const saveScriptByUnit = async (unitId, courseSlug) => {
  const script = await getScriptByUnit(unitId, courseSlug);
  if (!script) {
    return;
  }
  const parsedScript = parseScript(script);
  console.log(parsedScript);
};

saveScriptByUnit(unitId, courseSlug);
