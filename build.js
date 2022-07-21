const { tokens } = require('style-dictionary');
const StyleDictionaryPackage = require('style-dictionary');
const StyleDictionary = require("style-dictionary");

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED

StyleDictionary.registerTransform({
    name: 'shadow/spreadShadow',
    type: 'value',
    matcher: function (token) {
        return token.type === 'boxShadow';
    },
    transformer: (token) => {
        const shadow = token.value;
        return `${shadow.x} ${shadow.y} ${shadow.blur} ${shadow.spread} ${shadow.color}`;
        console.log('\n==============================================');
    }
});

StyleDictionary.registerTransform({
    name: 'any/rem',
    type: 'value',
    matcher: function (token) {
        return ['borderRadius', 'spacing', 'borderWidth', 'fontSizes', 'fontSize','lineHeight','lineHeights','paragraphSpacing'].includes(token.type || token.attributes.item);
    },
    transformer: (token) => {
        return `${token.value}px`;
    }
});


function getStyleDictionaryConfig(brand, platform) {
    return {
        "source": [
            `transformer-output/${brand}.json`,
        ],
        "platforms": {
            "scss": {
                "transformGroup": "scss",
                "transforms": ['shadow/spreadShadow', "attribute/cti", "name/cti/kebab", "color/hex", "any/rem"],
                "buildPath": "build/scss/",
                "files": [{
                    "destination": `${brand}-variables.scss`,
                    "format": "scss/variables"
                }]
            },
            "css": {
                "transformGroup": "css",
                //"prefix":"brk", 
                "transforms": ['shadow/spreadShadow', "attribute/cti", "name/cti/kebab", "color/hex","any/rem"],
                "buildPath": "build/css/",
                "files": [{
                    "destination": `${brand}-variables.css`,
                    "format": "css/variables"
                }]
            },
            "ios": {
                "transformGroup": "ios",
                "buildPath": `build/ios/${brand}/`,
                "files": [{
                    "destination": "tokens.h",
                    "format": "ios/macros"
                }]
            }
        }
    };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFEREN BRANDS AND PLATFORMS

['options', 'decisions-lq','decisions-moj','decisions-jel'].map(function (brand) {
    ['scss', 'css', 'ios'].map(function (platform) {

        console.log('\n==============================================');
        console.log(`\nProcessing: [${platform}] [${brand}]`);

        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(brand, platform));

        StyleDictionary.buildPlatform(platform);

        console.log('\nEnd processing');

    })
})

console.log('\n==============================================');
console.log('\nBuild completed!');
