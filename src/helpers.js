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

const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // add 'link' class to each hyperlink, and taget _blank so that
  // hyperlinks are opened in a new tab
  tokens[idx].attrPush(['class', 'link'])
  tokens[idx].attrPush(['target', '_blank'])

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self)
};

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
    const snippet = `<info datetime="${post.time.toISOString()}">
      ${post.time.toLocaleString('en-EN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })} ${post.readingTime ? '— ' + post.readingTime : ''}
    </info>`
     return html.split('</h1>')[0] + '</h1>' + snippet + html.split('</h1>')[1]
  },
  async prepareSite(name, template, content) {
    const first = template.split('<!--')[0]
    const second = template.split('-->')[1]
    await writeFile(name, `${first}\n${content}\n${second}`, 'utf8')
  }
}