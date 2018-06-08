module.exports = {
    parserOptions: {
        sourceType: 'module'
    },
    // https://github.com/sivan/javascript-style-guide/blob/master/es5/README.md
    extends: 'airbnb/legacy',

    "plugins": [
        "import"
    ],

    "rules": {
        // 缩进设置为4个空格
        "indent": ["error", 4],
        "quotes": "off",
        "dot-notation": "off",
        "no-undef": "off",
        "no-bitwise": "off",
        "max-len": ["error", 200],
        "global-require": "off",
        "space-before-function-paren": "off",
        "no-underscore-dangle": "off",
        "vars-on-top": "off",
        "guard-for-in": "off",
        "no-restricted-syntax": "off",
        "quote-props": "off",
        "no-plusplus": "off",
        "no-param-reassign": "off",
        "func-names": "off",
        "radix": "off",
        "no-extra-bind": "off",
        "no-prototype-builtins": "off",
        "no-continue": "off",
        "no-trailing-spaces": "off"
    },
    "globals": {
        "cc": true
    }
}
