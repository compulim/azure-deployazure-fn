const githubUrlPattern = /^https:\/\/github.com\/([^\/]+)\/([^\/]+)(\/tree\/([^\/]+))?/;

module.exports = function (context, req) {
  const referer = req.headers.referer;

  if (!referer) {
    context.log('No "Referer" in header');

    context.res = {
      status: 400,
      body: 'Please add this link to README.md in your GitHub'
    };

    return context.done();
  }

  context.log(`Got "Referer" in header: ${ referer }`);

  const match = githubUrlPattern.exec(referer);

  if (!match) {
    context.log('Not a GitHub referer');

    context.res = {
      status: 400,
      body: 'You can only put this link in a GitHub repository'
    };

    return context.done();
  }

  const [, account, repository,, ref] = match;

  context.log(`GitHub account: ${ account }`);
  context.log(`Repository: ${ repository }`);
  context.log(`Ref: ${ ref }`);

  const urlToJSON = `https://raw.githubusercontent.com/${ account }/${ repository }/tree/${ ref || 'master' }/azuredeploy.json`;

  context.log(`Template URL: ${ urlToJSON }`);

  context.res = {
    status: 302,
    headers: {
      location: `https://portal.azure.com/#create/Microsoft.Template/uri/${ encodeURI(urlToJSON) }`
    }
  };

  context.done();
};
