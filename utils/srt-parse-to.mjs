import srtToJSON from "srt-parse-to";
import fs from "fs";

export const parseScript = (name, file) => {
  const srtJSON = srtToJSON.toJSON(file.toString());
  let time = "";
  let content = "";
  srtJSON.map((item) => {
    const start = item.start;
    const end = item.end;
    const startMinute = String(start.minute).padStart(2, "0");
    const startSecond = String(start.second).padStart(2, "0");
    const endMinute = String(end.minute).padStart(2, "0");
    const endSecond = String(end.second).padStart(2, "0");

    const startTime = `${startMinute}:${startSecond}`;
    const endTime = `${endMinute}:${endSecond}`;

    time += `${startTime} ~ ${endTime}\n`;
    content += `${item.line}\n`;
  });

  const scripts = `# ${name}

{% tabs %}
{% tab title="content" %}
{% code lineNumbers="true" %}

\`\`\`plaintext
${content}
\`\`\`

{% endcode %}
{% endtab %}

{% tab title="time" %}
{% code lineNumbers="true" %}

\`\`\`plaintext
${time}
\`\`\`

{% endcode %}
{% endtab %}
{% endtabs %}
`;

  return Promise.resolve(scripts);
};

const file = fs.readFileSync("../assets/srt/CH06_01. 문법-식별자.srt");
parseScript("CH06_01. 문법-식별자", file);
