const fs = require('fs') 
const { extname, basename } = require('path') 
const { promisify } = require('util')
const readingTime = require('reading-time')
const yamlFront = require('yaml-front-matter')
const helpers = require('./helpers');

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const stats = promisify(fs.stat)

;
(async () => {
  const template = await readFile('./template/index.html', 'utf8')
  const formatter = new Intl.DateTimeFormat('en', {
    month: 'short'
  })
  // read the entire posts directory and parse markdown
  let posts = await readdir('./posts')
  posts = posts.filter(post => extname(post) === '.md')
  
  for (let i = 0; i < posts.length; i++) {
    const string = await readFile(`./posts/${posts[i]}`, 'utf8')
    const {
      birthtime
    } = await stats(`./posts/${posts[i]}`)
    const parsed = yamlFront.loadFront(string)
    parsed.time = new Date(birthtime)
    parsed.month = formatter.format(parsed.time)
    parsed.year = parsed.time.getFullYear()
    parsed.readingTime = readingTime(parsed.__content).text
    parsed.rendered = helpers.renderAndInsertDate(parsed)
    parsed.file = basename(posts[i], '.md')
    posts[i] = parsed
  }

  // create index file
  // get a string of the first 15 posts and create previews
  const previewString = posts.slice(0, 14).map(helpers.postPreview).join('\n')
  await helpers.prepareSite('docs/index.html', template, previewString)

  // create about page
  const aboutString = await readFile('template/about.html', 'utf8')
  await helpers.prepareSite('docs/about/index.html', template, aboutString)

  // create projects page
  const projectsString = await readFile('template/projects.html', 'utf8')
  await helpers.prepareSite('docs/projects/index.html', template, projectsString)

  // create posts directory
  for (var i = 0; i < posts.length; i++) {
    await helpers.prepareSite(`docs/posts/${posts[i].file}.html`,
      template, posts[i].rendered)
  }
})()