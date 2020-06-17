const fs = require('fs')
const chalk = require("chalk");

async function run(page, promp) {

  const baseURL = 'https://www.linkedin.com/jobs/search/?'

  const query = { location: encodeURIComponent(promp.location), keywords: encodeURIComponent(promp.keyword) }
  await page.goto(baseURL + Object.entries(query).map(el => el[0] + '=' + el[1]).join('&'),
    { waitUntil: 'load'});

  const logStream = fs.createWriteStream('out/' + promp.filename, { flags: 'a' });

  const iter = promp.iterations < 1 ? Infinity : promp.iterations
  let jobInfo;
  for (let i = 1; i <= iter; i++) {
    const liSelector = `#main-content > div > section > ul > li:nth-child(${i})`
    const btnSelector = "#main-content > div > section > button"
    const jobContentSelector = '#main-content > section'

    try {

      try {
        // wait for job selector
        await page.waitForSelector(liSelector)
      } catch (error) {
        // if selector timeout linkdlin may generate a button for load more jobs
        await page.waitForSelector(btnSelector)
        // click btn to load more jobs
        await page.eval(btnSelector, e => e.click())

      }

      await page.tap(liSelector)

      await page.waitFor(500) // TODO: use .waitForNavigation 
      jobInfo = await page.$eval(jobContentSelector, e => e.innerText);
    } catch (error) {
      console.log(error)
      logStream.close()
      return true
    }

    logStream.write(jobInfo.replace(/\r/g, ''))
    logStream.write("\n\n ******************************************************************* \n\n")

    process.stdout.write(chalk.blueBright("Jobs Scrapped: ") + chalk.cyan(i) + "\r");
  }
}

exports.run = run