
# Documenting and Commenting:
Use moderate (level) documenting. Do not hesitate to document classes and their public methods. (their purpose, usage, type ...etc).

See [JavaScript Documentation Standards](https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/) from wordpress.
# Logging:
use `loogger` constant in `logger.js` in both [react-app](./src/react-app/) browser codes and [main](./src/main/) nodejs codes.

Default log-level is `Debug`. Do not change it unless compiling for distribution. 

Logging can only have an insignificant effect to performance. Do not print continuous/endless logs (eg: in long loops). Do not try to call resource intensive code while logging, especially at and above `info` level (info, warn, error) logging.

`info` and above level (info, warn, error) logs can also appear on production, so be extra cautious about your choice of words.

# Naming and Styling:
For naming, hierarchy and styling; refer to: [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html).
