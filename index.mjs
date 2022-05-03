import puppeteer from 'puppeteer'
import fs from 'fs'
import http from 'http'
import path from 'path'
import { formatTeamName } from './src/utils/index.mjs'
import schedule from 'node-schedule'

const rule = new schedule.RecurrenceRule()
rule.hour = [1, 3, 5, 7, 9, 11]
rule.minute = 0

const port = 8085

const start = async () => {
    // const host = 'http://www.didiaokan2018.com'
    const host = 'http://jrszb111.com'
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(host);
    await page.screenshot({ path: 'example.png' });

    const today = await page.$$('#checked-qb > div.todayMatch.match .listBox')
    const todayDate = await page.$eval('#checked-qb > div.todayMatch.match > p', el => el.innerText)
    const arr = []

    for (let i = 0; i < today.length; i++) {
        const matchType = await today[i].$eval('.matchType', el => el.innerHTML)
        if (matchType === 'NBA') {
            const map = {}
            map.timer = await today[i].$eval('.timer', el => el.innerHTML)
            map.liveHref = await today[i].$eval('.download a', el => `${window.location.protocol}//${window.location.host}${el.getAttribute('href')}`)
            map.team1 = await today[i].$eval('.team > p:nth-child(1)', el => el.innerText)
            map.team2 = await today[i].$eval('.team > p:nth-child(3)', el => el.innerText)
            arr.push(map)
        }
    }

    console.log(todayDate, arr)

    fs.writeFileSync('./nbaLiveData', JSON.stringify(arr), 'utf-8')

    await browser.close();
}

const job = schedule.scheduleJob(rule, function () {
    start()
})

start()
const server = http.createServer(async (req, res) => {
    res.setHeader("Content-type", "text/plain;charset=utf-8");

    if (req.url.startsWith('/getNbaLiveData')) {
        const checkError = () => {
            return new Promise((resolve, reject) => {
                try {
                    fs.existsSync(path.resolve('./', 'nbaLiveData')) ? resolve(false) : resolve(true)
                } catch (error) {
                    reject(error)
                }
            })
        }

        const readData = () => {
            return new Promise((resolve, reject) => {
                try {
                    const content = fs.readFileSync(path.resolve('./', 'nbaLiveData'), 'utf-8')
                    if (content.startsWith('[') && content.endsWith(']')) {
                        resolve(JSON.parse(content))
                    } else {
                        resolve([])
                    }
                } catch (error) {
                    reject(error)
                }

            })
        }

        const error = await checkError()
        let content = ''

        if (!error) {
            const data = await readData()
            if (Array.isArray(data) && data.length > 0) {
                data.map((item, index) => {
                    content += `${formatTeamName(item.team1)} vs ${formatTeamName(item.team2)}   ${item.timer} --->       ${item.liveHref}${index === data.length - 1 ? '' : '$'}`
                })
            }
        }
        content.length > 0 ? res.end(JSON.stringify(content)) : res.end('SSry, No Data!')
    }
})

server.listen(port, () => {
    console.log(`service is running on port ${port}`);
});

