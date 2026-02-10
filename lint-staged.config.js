export default {
    '**/*.{js,ts,vue}': (filenames) => {
        const commands = []

        // Filter only source code files, exclude config & script
        const sourceFiles = filenames.filter(f =>
            !f.includes('lint-staged.config.js') &&
            !f.includes('security-check.js')
        )

        if (sourceFiles.length > 0) {
            commands.push(`node ./scripts/security-check.js ${sourceFiles.join(' ')}`)
        }

        return commands
    },
    // Prettier ignored
    // '**/*.{json,md,css,scss,yml,yaml}': () => [],
}
