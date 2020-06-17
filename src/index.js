const puppeteer = require('puppeteer');
const chalk = require("chalk");
const boxen = require("boxen")
const prompts = require('prompts');
const linkedin = require('./linkedin');



(async () => {

  process.stdout.write(boxen(chalk.greenBright("Jobs Scraping CLI"), {padding: 1, borderColor: 'gray', }));
  process.stdout.write('\n');
  const debPromp = {
  website: 'linkedin',
  keyword: 'react',
  filename: 'log',
  location: 'london',
}
  const promp = await prompts([
    {
      type: 'select',
      name: 'website',
      message: 'Pick a website to scrape',
      choices: [
        { title: 'Linkdlin', value: 'linkedin' },
        { title: 'Angelist', value: 'angelist', disabled: true },
      ],
      initial: 0
    },
    {
      type: 'text',
      name: 'keyword',
      message: 'Jobs keywords?',
    },
    {
      type: 'text',
      name: 'location',
      message: 'Jobs location?',
    },
    {
      type: 'text',
      name: 'filename',
      initial: 'log.txt',
      message: 'File name?',
    },
    {
      type: 'number',
      name: 'iterations',
      initial: 0,
      message: 'Max number of jobs?',
      hint: 'Zero iterate thru all jobs'
    }
  ]
  )

  const browser = await puppeteer.launch({ defaultViewport: { width: 900, height: 800 }, headless: true, slowMo: 0 },);
  const page = await browser.newPage();

  await linkedin.run(page, promp)

  process.stdout.write(chalk.greenBright(`\nFinished. \nFile: ${process.cwd() + "/out/" + promp.filename} `));

  await browser.close();

})()
