addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
async function handleRequest(request) {
  if (request.url.substring(request.url.lastIndexOf('/')) == "/links") {
    return new Response(JSON.stringify(links), {
        headers: { 'content-type': 'application/json' },
    });
}
else{
    return getStaticHTML();
}
}

const links = [
  {"name": "Captain America", "url":"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.marvel.com%2Fcharacters%2Fcaptain-america-steve-rogers&psig=AOvVaw3pDNsATAbdNXyogZHnnBAS&ust=1603867424014000&source=images&cd=vfe&ved=0CAMQjB1qFwoTCIDn7_yV1OwCFQAAAAAdAAAAABAK"},
  {"name": "Iron Man", "url":"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.marvel.com%2Fcharacters%2Firon-man-tony-stark&psig=AOvVaw3Nl-27OCZcUGl7mNt0k2io&ust=1603867521648000&source=images&cd=vfe&ved=0CAMQjB1qFwoTCLD8xKKW1OwCFQAAAAAdAAAAABAD"}, 
  {"name": "Thor", "url":"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.marvel.com%2Fcharacters%2Fthor-thor-odinson&psig=AOvVaw2JZ3MD605ETSI1TxgHf-Es&ust=1603867575269000&source=images&cd=vfe&ved=0CAMQjB1qFwoTCJjtp8qW1OwCFQAAAAAdAAAAABAD"}
];

class LinksTransformer{
  constructor(links)
  {
    this.links = links
  }
  async element(id)
  {
        if(id)
        {
          let htmlText = "";
           this.links.forEach(link => {
             htmlText += "<a href='";
             htmlText += link.url;
             htmlText += "'>";
             htmlText += link.name;
             htmlText += "</a>";
           });
           id.setInnerContent(htmlText, { html: true });
        }
  }
}

class TitleTransformer{
  async element(id)
  {
    if(id)
    {
      if(id.tagName === 'title')
        id.setInnerContent('Dhyey Pankaj Mehta');
    }
  }
}


class BodyTransformer{
  async element(id)
  {
    if(id)
    {
      if(id.tagName === 'body')
        id.setAttribute('class', 'bg-red-700');
    }
  }
}

class ProfileTransformer{
  async element(id)
  {
    if(id)
    {
      if (id.tagName === "div") {
        id.removeAttribute("style");
    } else if (id.tagName === "img") {
        id.setAttribute("src", "https://avatars2.githubusercontent.com/u/21981517?s=400&u=4fd6bba2590d15afe536b3f333b39d2b77343549&v=4://avatars0.githubusercontent.com/u/65627251?s=400&u=7136f5e180dbdbada15fd713b01b2998c577f522&v=4");
    } if (id.tagName === "h1") {
        id.setInnerContent("Dhyey Mehta");   }
    }
  }
}

class SocialIconsTransformer {

  async element(id) {
      if (id) {
          id.removeAttribute("style");
          let htmlText = '\n';
              htmlText += '<a href="https://www.linkedin.com/in/dhyey-mehta">';
              htmlText += '\n<img style="filter:invert(100%);" src="https://simpleicons.org/icons/linkedin.svg" alt="LinkedIn">';
              htmlText += '</a>\n'

              htmlText += '<a href="https://www.github.com/dhyey97">';
              htmlText += '\n<img style="filter:invert(100%);" src="https://simpleicons.org/icons/github.svg" alt="Github">';
              htmlText += '</a>\n'
          id.setInnerContent(htmlText, { html: true });
      }
  }
}



async function getStaticHTML()
{
  let HTMLPage = await fetch('https://static-links-page.signalnerve.workers.dev')
        .then((response) => {
            if (response.status == 200) {
                return response;
            } else new Response('Something went wrong!', { status: 500 });
        })
        HTMLPage =  linkUpdater.transform(HTMLPage);
        HTMLPage = titleUpdater.transform(HTMLPage);
        HTMLPage = bodyUpdater.transform(HTMLPage);
        HTMLPage = profileUpdater.transform(HTMLPage);
        HTMLPage = profileImageUpdater.transform(HTMLPage);
        HTMLPage = profileTitleUpdater.transform(HTMLPage);
        HTMLPage = socialIconsUpdater.transform(HTMLPage);

        return HTMLPage;
}

const linkUpdater = new HTMLRewriter().on('div#links', new LinksTransformer(links));

const titleUpdater = new HTMLRewriter().on('title', new TitleTransformer()); 

const bodyUpdater = new HTMLRewriter().on('body', new BodyTransformer());

const profileUpdater = new HTMLRewriter().on('div#profile', new ProfileTransformer());

const profileImageUpdater = new HTMLRewriter().on('img#avatar', new ProfileTransformer());

const profileTitleUpdater = new HTMLRewriter().on('h1#name', new ProfileTransformer());

const socialIconsUpdater = new HTMLRewriter().on('div#social', new SocialIconsTransformer());

