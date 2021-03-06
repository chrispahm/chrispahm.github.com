const fs = require('fs') 
const { extname, basename } = require('path') 
const { promisify } = require('util')
const readingTime = require('reading-time')
const yamlFront = require('yaml-front-matter')
const helpers = require('./helpers')

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const stats = promisify(fs.stat)

;
(async () => {
  const template = await readFile('./src/template/index.html', 'utf8')
  const formatter = new Intl.DateTimeFormat('en', {
    month: 'short'
  })
  // read the entire posts directory and filter for markdown files
  let posts = await readdir('./src/posts')
  posts = posts.filter(post => extname(post) === '.md')
  
  for (let i = 0; i < posts.length; i++) {
    // read file content, parse yaml front-matter and markdown content
    // and store info in posts array
    const string = await readFile(`./src/posts/${posts[i]}`, 'utf8')
    const {
      birthtime
    } = await stats(`./src/posts/${posts[i]}`)
    const parsed = yamlFront.loadFront(string)
    parsed.date = new Date(parsed.date)
    parsed.month = formatter.format(parsed.date)
    parsed.year = parsed.date.getFullYear()
    parsed.readingTime = readingTime(parsed.__content).text
    parsed.content = helpers.renderAndInsertDate(parsed)
    parsed.file = basename(posts[i], '.md')
    posts[i] = parsed
  }

  // sort the posts by date
  posts = posts.sort((a,b) => {
    return new Date(b.date) - new Date(a.date)
  })
  // create the landing page (index.html)
  // get a string of the first 15 posts and create previews
  const previewString = posts.slice(0, 14).map(helpers.postPreview).join('\n')
  await helpers.prepareSite('index.html', template, previewString)

  // create about page
  const aboutString = await readFile('./src/template/about.html', 'utf8')
  await helpers.prepareSite('about/index.html', template, aboutString)

  // create projects page
  const projectsString = await readFile('./src/template/projects.html', 'utf8')
  await helpers.prepareSite('projects/index.html', template, projectsString)
  
  // create legal disclosure page
  const legalString = await readFile('./src/template/impressum.html', 'utf8')
  await helpers.prepareSite('impressum/index.html', template, legalString)

  // create posts directory
  for (var i = 0; i < posts.length; i++) {
    await helpers.prepareSite(`posts/${posts[i].file}.html`,
      template, posts[i].content)
  }
  
  // create xml and atom feeds for the latest 15 posts
  helpers.createFeed(posts.slice(0, 14))
})()