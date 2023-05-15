const request = require("request")
const cheerio = require("cheerio")
const fs = require("fs")
const path = require("path")
const xlsx = require("xlsx")

// const url = "https://www.espncricinfo.com/series/indian-premier-league-2023-1345038/gujarat-titans-vs-chennai-super-kings-1st-match-1359475/full-scorecard"

const getScorecard = (url) => {
    request(url, (error, response, html) => {
        if (error) {
            console.log(error)
        }
        else {
            getMatchDetails(html)
        }
    })
}

const getMatchDetails = (html) => {
    const $ = cheerio.load(html)
    const dateData = $(".ds-text-tight-m.ds-font-regular.ds-text-typo-mid3")
    let details = $(dateData[0]).text().split(",")
    const venue = details[1].trim()
    const date = `${details[2].trim()} ${details[3].trim()}`

    details = $(".ds-text-tight-m.ds-font-regular.ds-truncate")
    const result = $(details).text().trim()

    details = $(".ci-team-score.ds-flex.ds-justify-between.ds-items-center.ds-text-typo.ds-mb-2")

    let winningTeamIndex, loosingTeamIndex

    if ($(details[0]).hasClass("ds-opacity-50")) {
        winningTeamIndex = 1
        loosingTeamIndex = 0
    }

    const winnerTeam = $($(details[winningTeamIndex]).find(".ds-text-tight-l.ds-font-bold.ds-text-typo.ds-block.ds-truncate")).text().trim()
    const loosingTeam = $($(details[loosingTeamIndex]).find(".ds-text-tight-l.ds-font-bold.ds-text-typo.ds-block.ds-truncate")).text().trim()

    if (winnerTeam != undefined) {

        console.log(`${venue} || ${date} || ${result} || ${loosingTeam} || ${winnerTeam}`)

        const battingDataArray = $(".ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-border.ds-border-line.ds-mb-4").find(".ci-scorecard-table")

        for (let i = 0; i < battingDataArray.length; i++) {
            const data = $(battingDataArray[i]).find("tr")
            for (let j = 0; j < data.length; j++) {
                const batsmenData = $(data[j]).find("td")

                if (batsmenData.length == 8) {

                    const playerName = $(batsmenData[0]).text().trim()
                    const runs = $(batsmenData[2]).text().trim()
                    const balls = $(batsmenData[3]).text().trim()
                    const _4s = $(batsmenData[5]).text().trim()
                    const _6s = $(batsmenData[6]).text().trim()
                    const strikeRate = $(batsmenData[7]).text().trim()
                    console.log(playerName, runs, balls, _4s, _6s, strikeRate)
                    tojson(playerName, runs, balls, _4s, _6s, strikeRate, venue, date, result, loosingTeam, winnerTeam)
                }
            }
        }
    }
}

const make_IPL_team_folder = (pathOfFile) => {
    if (fs.existsSync(pathOfFile) == false) {
        fs.mkdirSync(pathOfFile)
    }
}

function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new()
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return []
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

const tojson = (playerName, runs, balls, _4s, _6s, strikeRate, venue, date, result, loosingTeam, winnerTeam) => {
    const teamPath = path.join(__dirname, "IPL2023", winnerTeam+" vs "+loosingTeam+" stats")
    make_IPL_team_folder(teamPath)
    const filePath = path.join(teamPath, playerName + ".xlsx")
    let content = excelReader(filePath, playerName)

    let playerObject = {
        playerName, 
        runs, 
        balls, 
        _4s, 
        _6s, 
        strikeRate, 
        venue, 
        date, 
        result, 
        loosingTeam, 
        winnerTeam
    }

    content.push(playerObject)
    excelWriter(filePath,content,playerName)
}

module.exports = {
    getScorecard: getScorecard
}