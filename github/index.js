const githubUrlPattern = /^https:\/\/github.com\/([^\/]+)\/([^\/]+)(\/tree\/([^\/]+))?/;

module.exports = function (context, req) {
  const referer = req.headers.Referer;

  if (!referer) {
    context.log('No "Referer" in header');

    return context.done(null, {
      status: 404,
      body: 'Please add this link to README.md in your GitHub'
    });
  }

  context.log(`Got "Referer" in header: ${ referer }`);

  const match = githubUrlPattern.exec(referer);

  if (!match) {
    context.log('Not a GitHub referer');

    return context.done(null, {
      status: 404,
      body: 'You can only put this link in a GitHub repository'
    });
  }

  return context.done(null, {
    status: 200,
    body: 'Hello, World!'
  });
};