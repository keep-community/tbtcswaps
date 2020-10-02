Heroku buildpack that:
1. Builds contract ABI
2. Resolves symlinks
3. Moves /node to the root folder

This is all a workaround around heroku's build system. The reason why this is not done on CI, which would make everything much simpler, is that doing so would increase the difficulty of running a node for prospective liquidity providers and that's something we have chosen to prioritize.

Credit: Forked from https://github.com/timanovsky/subdir-heroku-buildpack
