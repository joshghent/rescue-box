require("dotenv").config();
const request = require("request-promise");
const Octokit = require("@octokit/rest");
const moment = require('moment');
const changeCase = require('change-case')

const {
  GIST_ID: gistId,
  GH_TOKEN: githubToken,
  RESCUETIME_API_KEY: rescueTimeKey
} = process.env;

const octokit = new Octokit({ auth: `token ${githubToken}` });

async function main() {
  const stats = await request({
    uri: `https://www.rescuetime.com/anapi/daily_summary_feed?key=${rescueTimeKey}`,
    json: true
  })
  await updateGist(stats[0]);
}

async function updateGist(stats) {
  let gist;
  try {
    gist = await octokit.gists.get({ gist_id: gistId });
  } catch (error) {
    console.error(`Unable to get gist\n${error}`);
  }

  const lines = [];
  const { productivity_pulse, date, total_duration_formatted } = stats;
  const statsToRender = ["all_productive", "all_distracting", "neutral"];

  lines.push([`⏰ Stats for ${moment(date).format('MMMM Do YYYY')}`])

  const line = [
    "Productivity Pulse".padEnd(19),
    String(total_duration_formatted).padEnd(10),
    generateBarChart(productivity_pulse, 10),
    String(productivity_pulse.toFixed(0)).padStart(3) + "%"
  ];

  lines.push(line.join(" "));


  for (var i = 0; i < statsToRender.length; i++) {
    const stat = stats[`${statsToRender[i]}_percentage`];
    const statTime = stats[`${statsToRender[i]}_duration_formatted`];

    const line = [
      changeCase.titleCase(statsToRender[i]).padEnd(19),
      String(statTime).padEnd(10),
      generateBarChart(stat, 10),
      String(stat.toFixed(0)).padStart(3) + "%"
    ];

    lines.push(line.join(" "));
  }

  try {
    // Get original filename to update that same file
    const filename = Object.keys(gist.data.files)[0];
    await octokit.gists.update({
      gist_id: gistId,
      files: {
        [filename]: {
          filename: `⏰ Daily Productivity Stats - ${date}`,
          content: lines.join("\n")
        }
      }
    });
  } catch (error) {
    console.error(`Unable to update gist\n${error}`);
  }
}

function generateBarChart(percent, size) {
  const syms = "░▏▎▍▌▋▊▉█";

  const frac = (size * 8 * percent) / 100;
  const barsFull = Math.floor(frac / 8);
  const semi = frac % 8;
  const barsEmpty = size - barsFull - 1;

  return [
    syms.substring(8, 9).repeat(barsFull),
    syms.substring(semi, semi + 1),
    syms.substring(0, 1).repeat(barsEmpty)
  ].join("");
}

(async () => {
  await main();
})();
