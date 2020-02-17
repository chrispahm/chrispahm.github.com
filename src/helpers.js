const fs = require('fs') 
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const hljs = require('highlight.js')
const md = require('markdown-it')({
    typographer: true,
    highlight: (str, lang) => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch (__) {}
      }
      return ''
    }
  })
  .use(require('markdown-it-footnote'))
  
// overwrite footnote creation rule to be less ugly
md.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString()
  if (tokens[idx].meta.subId > 0) {
    n += ':' + tokens[idx].meta.subId
  }
  return n
}

module.exports = {
  postPreview(post) {
    return `<a href="${post.url || 'posts/' + post.file + '.html'}" class="post-preview">
        <h3 class="post-preview-header">${post.title}<h3 class="post-preview-link">↪</h3></h3>
        <div class="post-preview-body">
          <p>
          ${post.preview}
          <info datetime="">
            ${post.month} ${post.year} ${post.readingTime ? '— ' + post.readingTime : ''}
          </info>
          </p>
        </div>
      </a>`
  },
  renderAndInsertDate(post) {
    const html = md.render(post.__content)
    // add date, and estimated reading time
    const snippet = `<info datetime="">
      ${post.time.toLocaleString('en-EN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })} ${post.readingTime ? '— ' + post.readingTime : ''}
    </info>`
    let rendered = html.split('</h1>')[0] + '</h1>' + snippet + html.split('</h1>')[1]
    // add .link class to all <a> tags
    // dirty hack to detect external hyperlinks starting with 'h' instead of 
    // '#' for anchors. Might impose issues if html code block contains 
    // an <a> tag
    rendered = rendered.split(/<a\ href="h/g)
    return rendered.join('<a class="link" href="h')
  },
  async prepareSite(name, template, content) {
    const first = template.split('<!--')[0]
    const second = template.split('-->')[1]
    await writeFile(name, `${first}\n${content}\n${second}`, 'utf8')
  }
}