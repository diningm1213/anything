const srt = require("srt-parse-to");
const fs = require("fs");

const file = fs.readFileSync("./srt/03687647.srt");
const srtJSON = srt.toJSON(file.toString());

srtJSON.map((item) => {
  const start = item.start;
  const end = item.end;
  const startMinute = String(start.minute).padStart(2, "0");
  const startSecond = String(start.second).padStart(2, "0");
  const endMinute = String(end.minute).padStart(2, "0");
  const endSecond = String(end.second).padStart(2, "0");

  const startTime = `${startMinute}:${startSecond}`;
  const endTime = `${endMinute}:${endSecond}`;

  console.log(`${startTime} ~ ${endTime} - ${item.line}`);
});
