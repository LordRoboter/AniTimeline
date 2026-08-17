import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://graphql.anilist.co',
  documents: './src/**/*.gql',
  generates: {
    './graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node'
      ]
    }
  }
}

export default config