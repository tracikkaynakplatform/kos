

# Naming and Styling:
For naming, hierarchy and styling; refer to: [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html). Remember that (from the book "Code Complete"), less documentation is needed when the naming and hierarchy is more self-explanatory.


# Documenting and Commenting:
Use moderate (level) documenting. Do not hesitate to document classes and their public methods. (their purpose, usage, type ...etc).

See [JavaScript Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/) from wordpress.

You can only use comments for your own use, mostly temporarily, not to inform others. We have documentation, not comments, for those use cases.<br>
eg: `//TODO: this should be in its own class.`

# Logging:
use `loogger` constant in `logger.js` in both [react-app](./src/react-app/) browser codes and [main](./src/main/) nodejs codes.

Default log-level is `Debug`. Do not change it unless compiling for distribution. 

Logging can only have an insignificant effect to performance. Do not print continuous/endless logs (eg: in long loops). Do not try to call resource intensive code while logging, especially at and above `info` level (info, warn, error) logging.

`info` and above level (info, warn, error) logs can also appear on production, so be extra cautious about your choice of words.

# Examples:
see [platform.js](./src/main/services/base/platform.js) [client-executable.js](./src/main/services/base/client-executable.js) and for updated/current example contribution.

# Tests:
We use [jest](https://jestjs.io/) for unit testing. Please refer to the [test](./src/test/) for sample test files. It is vital to make test files for all core functionality, like utility (and business) classes/files. Others (wrappers, ui, service, ...) may need some other forms of testing (integration, ui, ...) which may not have a proper setup, yet.

