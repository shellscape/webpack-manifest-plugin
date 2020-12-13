## Frequently Asked Questions

- [What does _evergreen_ mean?](#what-does-evergreen-mean)
- [What are "vote" issues?](#what-are-vote-issues)

### What does _evergreen_ mean?

The concept behind an _evergreen_ project is derived from https://www.w3.org/2001/tag/doc/evergreen-web/. As such, this plugin only actively supports the [Active LTS](https://github.com/nodejs/Release#release-schedule) version of Node.js. As quoted from the W3C document, this decision was made:

> 1. Intentionally: to simplify their implementation, reduce resource requirements or meet environmental constraints

Additionally, this decision was made to leverage speed, stability, and platform enhancements (namely in `http`) in the latest Active LTS Node version(s).

Some users will not be able to leverage this plugin either because they cannot upgrade, because they won't upgrade, or because another dependency prevents an upgrade. The author and maintainers of this plugin understand that, and feel that the benefits of supporting only the Active LTS version of Node.js outweigh the detriments.

_**Please Note:** This is not currently a topic for debate or discussion on this repository. Issues which raise the topic will be closed, but will remain unlocked._

### What are "vote" issues?

"Vote" issues give the community and user base the opportunity to voice their opinion about the usefulness of a proposed feature or modification request that the maintainers have chosen not to implement. Maintainers typically have good reason for not accepting such requests, but in the event that enough users deem something useful, it's prudent to take another look. That's where voting comes into play. Vote thresholds for a particular issue are determined by using a number that is roughly 10% of the NPM downloads for the given month that a request is made. If a feature isn't deemed acceptable or widely useful initially, it should meet the criteria of being useful to at least 10% of the user base. Thresholds are never raised, but they can be lowered.
