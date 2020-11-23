module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['plugin:@typescript-eslint/recommended'],
    rules: {
        semi: "off",
        "camelcase": "off",
        "@typescript-eslint/camelcase": 'off'
    }
}